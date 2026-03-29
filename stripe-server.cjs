const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.STRIPE_SERVER_PORT || 3001;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Falta STRIPE_SECRET_KEY en variables de entorno');
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Faltan variables de Supabase en variables de entorno');
}

const stripe = Stripe(STRIPE_SECRET_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

app.use(cors());
app.use(express.json());

// Endpoint seguro para crear sesión de pago
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, userEmail } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    // Validar y mapear los productos
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe espera centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5177?success=true',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:5177?canceled=true',
      customer_email: userEmail || undefined,
      metadata: {
        userEmail: userEmail || '',
        cartItems: JSON.stringify(cartItems)
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    res.status(500).json({ error: 'Error creando sesión de pago' });
  }
});

// Webhook para recibir confirmaciones de pago de Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento de pago exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userEmail, cartItems } = session.metadata;
    
    try {
      // Buscar usuario por email en Supabase
      const { data: users, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError || !users) {
        console.error('Usuario no encontrado en Supabase:', userEmail);
        return res.status(200).send('Usuario no encontrado');
      }

      const userId = users.id;
      const parsedCartItems = JSON.parse(cartItems);
      const totalAmount = session.amount_total / 100; // Convertir de centavos

      // Guardar compra en Supabase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          configuration_name: `Compra ${new Date().toLocaleDateString()}`,
          total_price: totalAmount,
          items_count: parsedCartItems.length,
          status: 'completed',
          stripe_session_id: session.id
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error guardando compra:', purchaseError);
        return res.status(500).send('Error guardando compra');
      }

      // Guardar items de la compra
      for (const item of parsedCartItems) {
        await supabase
          .from('purchase_items')
          .insert({
            purchase_id: purchase.id,
            item_name: item.name,
            item_price: item.price,
            quantity: item.quantity,
            configuration_data: item.configuration || {}
          });
      }

      console.log('Compra guardada exitosamente:', purchase.id);
    } catch (error) {
      console.error('Error procesando webhook:', error);
    }
  }

  res.status(200).send('Webhook procesado');
});

app.listen(PORT, () => {
  console.log(`Stripe server listening on port ${PORT}`);
}); 