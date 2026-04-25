-- Add stripe_session_id to purchases for idempotent webhook handling
-- and post-purchase traceability (so the frontend can confirm a specific
-- payment via session_id from the Stripe success_url).

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_stripe_session_id
  ON purchases(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
