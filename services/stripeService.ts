/// <reference types="vite/client" />
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!STRIPE_PUBLISHABLE_KEY) return Promise.resolve(null);
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Call backend to create Stripe session
export async function createStripeCheckoutSession(cartItems: unknown[], userEmail: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated — cannot create checkout session');
  const response = await fetch(`${BACKEND_BASE_URL}/api/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? ''}`
    },
    body: JSON.stringify({ cartItems, userEmail })
  });
  if (!response.ok) throw new Error('Error creating payment session');
  const data = await response.json();
  return data.sessionId;
}

// Redirect user to Stripe checkout
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe not initialized');
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
} 
