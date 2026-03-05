ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text default 'starter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text default 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payfast_token text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payfast_payment_id text;

CREATE TABLE IF NOT EXISTS payment_attempts (
  id uuid PRIMARY KEY,
  user_id uuid references profiles(id) on delete cascade,
  status text default 'pending',
  amount numeric(10,2) default 0,
  payfast_payment_id text,
  created_at timestamptz default now()
);

ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment attempts"
  ON payment_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment attempts"
  ON payment_attempts FOR ALL
  USING (true)
  WITH CHECK (true);
