# Setup Guide - Billing & Payment Integration

## Quick Setup (5 minutes)

### 1. Payment Provider Configuration

#### Option A: Paystack (Primary - International)

1. **Create Paystack Account**
   - Go to https://paystack.com
   - Sign up and verify email
   - Complete KYC

2. **Get API Keys**
   - Dashboard → Settings → API Keys & Webhooks
   - Copy `Public Key` and `Secret Key`

3. **Add to `.env.local`**
   ```bash
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   PAYSTACK_SECRET_KEY=sk_test_your_key_here
   ```

4. **Setup Webhook**
   - Paystack Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
   - Select events: `charge.success`, `charge.failed`

#### Option B: PayFast (South Africa)

1. **Create PayFast Account**
   - Go to https://www.payfast.co.za
   - Sign up as merchant
   - Complete verification

2. **Get Credentials**
   - Dashboard → Settings → API Integration
   - Copy Merchant ID and Key

3. **Add to `.env.local`**
   ```bash
   PAYFAST_MERCHANT_ID=your_merchant_id
   PAYFAST_MERCHANT_KEY=your_merchant_key
   PAYFAST_PASS_PHRASE=your_pass_phrase
   ```

4. **Setup Webhook**
   - PayFast Dashboard → Settings
   - Webhook URL: `https://your-domain.com/api/webhooks/payfast`

### 2. Database Schema Updates

The following tables must be created in Supabase:

#### `subscriptions` table
```sql
create table if not exists subscriptions (
  id serial primary key,
  user_id uuid references auth.users on delete cascade unique,
  plan_id text not null,
  status text default 'active', -- active, cancelled, past_due
  trial_until timestamp with time zone,
  trial_started_at timestamp with time zone,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  payment_provider text, -- paystack, payfast
  payment_reference text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### `documents` table
```sql
create table if not exists documents (
  id serial primary key,
  name text not null,
  file_url text not null,
  file_type text,
  document_type text default 'general',
  project_id integer references projects(id) on delete set null,
  company_id integer not null,
  uploaded_by uuid references auth.users,
  status text default 'pending_verification', -- pending_verification, verified, rejected
  verified_at timestamp with time zone,
  verified_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_documents_project_id on documents(project_id);
create index if not exists idx_documents_company_id on documents(company_id);
```

#### `notifications` table
```sql
create table if not exists notifications (
  id serial primary key,
  recipient_id uuid references auth.users on delete cascade,
  type text not null, -- task_assigned, invoice_overdue, quote_accepted
  title text not null,
  message text,
  related_entity_type text,
  related_entity_id integer,
  company_id integer not null,
  is_read boolean default false,
  metadata jsonb default '{}',
  created_by uuid references auth.users,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

create index if not exists idx_notifications_recipient on notifications(recipient_id);
create index if not exists idx_notifications_company on notifications(company_id);
create index if not exists idx_notifications_type on notifications(type);
```

#### `notification_preferences` table
```sql
create table if not exists notification_preferences (
  id serial primary key,
  user_id uuid references auth.users on delete cascade,
  company_id integer not null,
  preferences jsonb default '{
    "email_on_task_assignment": true,
    "email_on_invoice_due": true,
    "email_on_quote_accepted": true,
    "in_app_notifications": true,
    "browser_notifications": false
  }',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, company_id)
);
```

### 3. Create Webhook Handlers

#### Paystack Webhook (`/api/webhooks/paystack`)
```typescript
// app/api/webhooks/paystack/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body.event;
  
  if (event === 'charge.success') {
    // Activate subscription in database
    // Update user record
  } else if (event === 'charge.failed') {
    // Log failure
    // Send notification
  }
  
  return NextResponse.json({ status: 'ok' });
}
```

#### PayFast Webhook (`/api/webhooks/payfast`)
```typescript
// app/api/webhooks/payfast/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Verify signature first
  const verified = verifyPayFastSignature(body);
  
  if (verified && body.payment_status === 'COMPLETE') {
    // Activate subscription
  }
  
  return NextResponse.json({ status: 'ok' });
}
```

### 4. Update Environment File

Complete `.env.local` should have:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack (Primary)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx

# PayFast (Fallback)
PAYFAST_MERCHANT_ID=10000000
PAYFAST_MERCHANT_KEY=your_key
PAYFAST_PASS_PHRASE=your_phrase

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Test Everything

#### Test Paystack
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "action": "initiate-payment",
    "userId": "user-uuid",
    "email": "test@example.com",
    "planId": "professional",
    "provider": "paystack"
  }'
```

#### Test PayFast
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "action": "initiate-payment",
    "userId": "user-uuid",
    "email": "test@example.com",
    "planId": "professional",
    "provider": "payfast"
  }'
```

#### Test Trial
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "action": "start-trial",
    "userId": "user-uuid",
    "planId": "professional",
    "companyId": 8
  }'
```

### 6. Run Tests

```bash
# Run API tests
npm run test:api

# Run E2E tests
node tier2-automated-tests.mjs

# Run against client demo guide
open CLIENT_DEMO_GUIDE.md
```

---

## Troubleshooting

### Payment Not Processing
1. Check API keys in `.env.local`
2. Verify webhook is configured
3. Check browser console for errors
4. Verify test mode is enabled

### Notifications Not Sending
1. Ensure `notifications` table exists
2. Check user preferences are saved
3. Verify task assignment endpoint
4. Check database for notification records

### Documents Not Linking
1. Ensure `documents` table exists
2. Check project_id is valid
3. Verify company_id matches
4. Check file URL is accessible

### Preferences Not Persisting
1. Ensure `notification_preferences` table exists
2. Verify user_id is correct UUID
3. Check company_id matches
4. Clear browser localStorage and try again

---

## Production Deploy

### Before Going Live

1. **Update Environment Variables**
   - Use production API keys (remove `_test_`)
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_APP_URL` to production domain

2. **Update Webhook URLs**
   - Paystack: `https://yourdomain.com/api/webhooks/paystack`
   - PayFast: `https://yourdomain.com/api/webhooks/payfast`

3. **Enable Security**
   - Rate limit webhook endpoints
   - Verify signatures on all webhooks
   - Use HTTPS only
   - Add CORS headers

4. **Database**
   - Create indexes on notification tables
   - Backup subscriptions table
   - Enable row-level security (RLS)

5. **Monitoring**
   - Setup error tracking (Sentry)
   - Setup payment monitoring
   - Setup notification alerts
   - Monitor webhook delivery

6. **Testing**
   - Test complete payment flow
   - Test webhook delivery
   - Test notification delivery
   - Test preference persistence

---

## Configuration Complete! 🎉

All features are now configured and ready for testing. Start the dev server and follow the `COMPLETE_FEATURE_TEST_GUIDE.md` for comprehensive testing scenarios.
