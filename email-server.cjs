const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = 3001;

// Configurar CORS para permitir requests desde el frontend
app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5178'],
  credentials: true
}));

app.use(express.json());

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint para enviar emails
app.post('/send-email', async (req, res) => {
  try {
    console.log('📧 Recibiendo request para enviar email:', {
  to: req.body.to ? `${req.body.to.substring(0, 3)}***@${req.body.to.split('@')[1]}` : 'no email',
  subjectLength: req.body.subject ? req.body.subject.length : 0,
  hasFrom: !!req.body.from
});

    const result = await resend.emails.send({
      from: req.body.from || 'Superhero 3D Customizer <onboarding@resend.dev>',
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html,
    });

    if (result.error) {
      console.error('❌ Error de Resend:', result.error);
      return res.status(400).json({ success: false, error: result.error });
    }

    console.log('✅ Email enviado exitosamente:', result.data);
    res.json({ success: true, data: result.data });

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Email Server', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(port, () => {
  console.log('🚀 Servidor de Email iniciado en http://localhost:' + port);
  console.log('📋 Endpoints disponibles:');
  console.log('• GET  /health      - Estado del servidor');
  console.log('• POST /send-email  - Enviar email');
  console.log('');
  console.log('✉️  Listo para enviar emails con Resend API');
}); 