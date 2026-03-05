# FieldCost MVP

A Construction & Mining Project Costing SaaS for South Africa.

## Tech Stack
- Next.js 14
- Supabase
- Tailwind CSS
- React Hook Form
- Zustand
- date-fns
- Lucide React
- @hello-pangea/dnd

## Folder Structure
```
fieldcost/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── customers/page.tsx
│   │   ├── items/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── invoices/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
```

## Setup
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Start the dev server: `npm run dev`
4. Run the fully automated demo seeding script (requires `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`):
	```bash
	npm run demo:seed
	```
	This creates the deterministic demo auth users (if missing), clears their old rows, and repopulates customers, projects, budgets, items, tasks, and invoices so the dashboard is immediately rich with data.
5. (Manual alternative) If you prefer hitting the endpoints yourself while `npm run dev` is running:
	```bash
	curl -X POST http://localhost:3000/api/demo/users
	curl -X POST http://localhost:3000/api/demo/seed
	```
6. (Optional) To seed directly inside Supabase without the Node script, run `supabase/demo-seed.sql` in the SQL editor or via `psql` **after** the demo auth users exist. The SQL file now checks for those users and raises a descriptive error if they are missing instead of failing mid-way.

## Full Supabase Flow (company → projects → tasks)
Follow this once-off checklist to unlock the end-to-end flow (register → setup company → add customers/projects/tasks → invoice).

1. **Create a Supabase project** and copy the keys into `.env.local`:
	```
	NEXT_PUBLIC_SUPABASE_URL=...
	NEXT_PUBLIC_SUPABASE_ANON_KEY=...
	SUPABASE_SERVICE_ROLE_KEY=...
	# Optional but keeps demo data deterministic
	NEXT_PUBLIC_DEMO_USER_ID=11111111-1111-1111-1111-111111111111
	NEXT_PUBLIC_DEMO_ADMIN_USER_ID=11111111-1111-1111-1111-111111111111
	NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID=22222222-2222-2222-2222-222222222222
	```
2. **Provision the database schema** by pasting `schema.sql` into the Supabase SQL editor (or run it via `psql`). This creates all tables, row-level security, and backfills missing columns such as task descriptions/photos.
3. **Upgrade legacy workspaces** (if applicable) by running `supabase/demo-seed.sql`. It adds any new columns (invoice metadata, task photos, etc.) without touching live data.
4. **Seed demo rows** locally with `npm run demo:seed`. The script ensures deterministic demo auth users exist, purges old rows for those IDs, and inserts customers, projects, budgets, crew, tasks, invoices, and line items.
5. **Start the Next.js app** with `npm run dev`, visit `http://localhost:3000/auth/register`, create an account, then log in. Supabase auth handles sessions automatically.
6. **Complete the company profile** at `/dashboard/setup-company`. A service-role key is required so the API can write to `company_profiles` and auto-create the public Supabase storage buckets (`branding` for logos, `photos` for task evidence).
7. **Work through the operational dashboards:**
	- Customers → add a contact so invoices have a recipient.
	- Projects → capture real work; optional budgets call `/api/budgets` in-line.
	- Crew → store names + hourly rates before assigning tasks or starting timers.
	- Tasks → create work, attach photos, assign crew/projects, and push to invoices.
	- Invoices → open `/dashboard/invoices`, link tasks/customers, export CSV/PDF.

After these steps you can create a company, operate on real data, and invoice without any additional feature flags.

## Deployment
- Vercel (recommended)


## Customization
- Authentication and registration pages are scaffolded under `app/auth`.
- Dashboard features (customers, items, tasks, invoices) are under `app/dashboard`.
- Supabase is integrated for authentication and persistent data storage. Configure your Supabase credentials in `.env.local`.

## License
MIT
