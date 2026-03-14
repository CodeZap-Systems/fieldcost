import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mukaeylwmzztycajibhy.supabase.co';
const serviceRoleKey = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

// Demo company and user IDs
const DEMO_COMPANY_ID = 8;
const LIVE_COMPANY_IDS = [13, 14];

// Demo user IDs (you'll need to replace these with actual user IDs from your Supabase auth)
const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111'; // Replace with actual demo user ID
const LIVE_USER_IDS = [
  '22222222-2222-2222-2222-222222222222', // Replace with actual live user IDs
  '33333333-3333-3333-3333-333333333333'
];

async function createDemoQuotes() {
  console.log('📝 Creating demo quotes...\n');

  const quotes = [
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 1,
      quote_number: `Q-${Date.now()}-001`,
      status: 'draft',
      amount: 15000.00,
      currency: 'USD',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Bathroom Renovation Project',
      notes: 'Demo quote for bathroom remodel project. Includes labor and materials.'
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 2,
      quote_number: `Q-${Date.now()}-002`,
      status: 'sent',
      amount: 45000.00,
      currency: 'USD',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Kitchen Extension',
      notes: 'Demo quote for kitchen extension. Quote sent to customer.'
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 1,
      quote_number: `Q-${Date.now()}-003`,
      status: 'accepted',
      amount: 8500.00,
      currency: 'USD',
      valid_until: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Deck Construction',
      notes: 'Demo quote for deck. Customer accepted this quote.'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quotes)
      .select();

    if (error) {
      console.log('⚠️  Tables may not exist yet. Use Supabase SQL editor to create them first.');
      console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');
      console.log('📋 Demo quote data (SQL format):');
      quotes.forEach((q, i) => {
        console.log(`
INSERT INTO quotes (user_id, company_id, customer_id, quote_number, status, amount, currency, valid_until, reference, notes)
VALUES ('${q.user_id}', ${q.company_id}, ${q.customer_id}, '${q.quote_number}', '${q.status}', ${q.amount}, '${q.currency}', '${q.valid_until}', '${q.reference}', '${q.notes}');`);
      });
      return false;
    }

    console.log(`✅ Created ${data?.length || quotes.length} demo quotes\n`);
    return true;
  } catch (err) {
    console.log(`❌ Error creating demo quotes: ${err.message}`);
    return false;
  }
}

async function createDemoQuoteLineItems() {
  console.log('📝 Creating demo quote line items...\n');

  // Get the quotes we just created
  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('id, quote_number')
    .eq('company_id', DEMO_COMPANY_ID)
    .limit(3);

  if (quotesError || !quotes || quotes.length === 0) {
    console.log('⚠️  Could not fetch quotes. Skipping line items.');
    return false;
  }

  const lineItems = [];

  // Add line items for each quote
  quotes.forEach((quote, qIdx) => {
    if (qIdx === 0) {
      // First quote: bathroom renovation
      lineItems.push({
        quote_id: quote.id,
        description: 'Bathroom tiles and fixtures',
        quantity: 50,
        unit_price: 150.00,
        line_total: 7500.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Labor (30 hours)',
        quantity: 30,
        unit_price: 50.00,
        line_total: 1500.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Plumbing work',
        quantity: 1,
        unit_price: 6000.00,
        line_total: 6000.00
      });
    } else if (qIdx === 1) {
      // Second quote: kitchen extension
      lineItems.push({
        quote_id: quote.id,
        description: 'Kitchen cabinets and countertop',
        quantity: 1,
        unit_price: 20000.00,
        line_total: 20000.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Electrical work',
        quantity: 40,
        unit_price: 50.00,
        line_total: 2000.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Labor (60 hours)',
        quantity: 60,
        unit_price: 50.00,
        line_total: 3000.00
      });
    } else {
      // Third quote: deck construction
      lineItems.push({
        quote_id: quote.id,
        description: 'Deck materials (pressure treated lumber)',
        quantity: 100,
        unit_price: 50.00,
        line_total: 5000.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Labor (20 hours)',
        quantity: 20,
        unit_price: 50.00,
        line_total: 1000.00
      });
      lineItems.push({
        quote_id: quote.id,
        description: 'Hardware and fasteners',
        quantity: 1,
        unit_price: 500.00,
        line_total: 500.00
      });
    }
  });

  try {
    const { data, error } = await supabase
      .from('quote_line_items')
      .insert(lineItems)
      .select();

    if (error) {
      console.log(`⚠️  Could not create line items: ${error.message}`);
      return false;
    }

    console.log(`✅ Created ${data?.length || lineItems.length} demo quote line items\n`);
    return true;
  } catch (err) {
    console.log(`❌ Error creating quote line items: ${err.message}`);
    return false;
  }
}

async function createDemoOrders() {
  console.log('📝 Creating demo purchase orders...\n');

  const orders = [
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: `PO-${Date.now()}-001`,
      vendor_name: 'ABC Building Supplies',
      status: 'draft',
      amount: 12500.00,
      currency: 'USD',
      delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Materials for Bathroom Project',
      notes: 'Draft PO for bathroom renovation materials.'
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: `PO-${Date.now()}-002`,
      vendor_name: 'XYZ Electrical Supplies',
      status: 'confirmed',
      amount: 8500.00,
      currency: 'USD',
      delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Electrical materials for Kitchen',
      notes: 'Confirmed PO sent to vendor.'
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: `PO-${Date.now()}-003`,
      vendor_name: 'BuildCo Lumber',
      status: 'delivered',
      amount: 5500.00,
      currency: 'USD',
      delivery_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: 'Deck lumber delivered',
      notes: 'PO delivered and received.'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(orders)
      .select();

    if (error) {
      console.log('⚠️  Tables may not exist yet.\n');
      console.log('📋 Demo order data (SQL format):');
      orders.forEach((o, i) => {
        console.log(`
INSERT INTO orders (user_id, company_id, po_number, vendor_name, status, amount, currency, delivery_date, reference, notes)
VALUES ('${o.user_id}', ${o.company_id}, '${o.po_number}', '${o.vendor_name}', '${o.status}', ${o.amount}, '${o.currency}', '${o.delivery_date}', '${o.reference}', '${o.notes}');`);
      });
      return false;
    }

    console.log(`✅ Created ${data?.length || orders.length} demo orders\n`);
    return true;
  } catch (err) {
    console.log(`❌ Error creating demo orders: ${err.message}`);
    return false;
  }
}

async function createDemoOrderLineItems() {
  console.log('📝 Creating demo order line items...\n');

  // Get the orders we just created
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, po_number')
    .eq('company_id', DEMO_COMPANY_ID)
    .limit(3);

  if (ordersError || !orders || orders.length === 0) {
    console.log('⚠️  Could not fetch orders. Skipping line items.');
    return false;
  }

  const lineItems = [];

  // Add line items for each order
  orders.forEach((order, oIdx) => {
    if (oIdx === 0) {
      // First order: bathroom supplies
      lineItems.push({
        order_id: order.id,
        description: 'Ceramic tiles (sq m)',
        quantity: 50,
        unit_price: 120.00,
        line_total: 6000.00,
        received_quantity: 0
      });
      lineItems.push({
        order_id: order.id,
        description: 'Bathroom fixtures set',
        quantity: 3,
        unit_price: 1500.00,
        line_total: 4500.00,
        received_quantity: 0
      });
      lineItems.push({
        order_id: order.id,
        description: 'Grout and adhesive',
        quantity: 10,
        unit_price: 50.00,
        line_total: 500.00,
        received_quantity: 0
      });
    } else if (oIdx === 1) {
      // Second order: electrical
      lineItems.push({
        order_id: order.id,
        description: 'Cable (meters)',
        quantity: 200,
        unit_price: 15.00,
        line_total: 3000.00,
        received_quantity: 200
      });
      lineItems.push({
        order_id: order.id,
        description: 'Switchboards and outlets',
        quantity: 20,
        unit_price: 150.00,
        line_total: 3000.00,
        received_quantity: 20
      });
      lineItems.push({
        order_id: order.id,
        description: 'Installation hardware',
        quantity: 1,
        unit_price: 2500.00,
        line_total: 2500.00,
        received_quantity: 1
      });
    } else {
      // Third order: lumber (fully delivered)
      lineItems.push({
        order_id: order.id,
        description: 'Pressure treated lumber (board feet)',
        quantity: 100,
        unit_price: 40.00,
        line_total: 4000.00,
        received_quantity: 100
      });
      lineItems.push({
        order_id: order.id,
        description: 'Decking stain and sealer',
        quantity: 10,
        unit_price: 50.00,
        line_total: 500.00,
        received_quantity: 10
      });
      lineItems.push({
        order_id: order.id,
        description: 'Hardware and fasteners',
        quantity: 1,
        unit_price: 1000.00,
        line_total: 1000.00,
        received_quantity: 1
      });
    }
  });

  try {
    const { data, error } = await supabase
      .from('order_line_items')
      .insert(lineItems)
      .select();

    if (error) {
      console.log(`⚠️  Could not create line items: ${error.message}`);
      return false;
    }

    console.log(`✅ Created ${data?.length || lineItems.length} demo order line items\n`);
    return true;
  } catch (err) {
    console.log(`❌ Error creating order line items: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🔄 Seeding demo data for Quotes and Orders\n');
  console.log('📍 Target: Demo Company (ID: ' + DEMO_COMPANY_ID + ')\n');

  // Get an actual demo user ID from the system
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (!error && users && users.length > 0) {
      console.log(`📝 Found ${users.length} users in system`);
      const demoUser = users.find(u => u.user_metadata?.role === 'demo') || users[0];
      console.log(`   Using user: ${demoUser.email} (${demoUser.id})\n`);
      
      // Note: In production, you'd update the script with the actual user ID
      // For now, we'll proceed with demo data creation
    }
  } catch (err) {
    console.log('⚠️  Could not fetch user info\n');
  }

  const results = [];
  results.push(await createDemoQuotes());
  results.push(await createDemoQuoteLineItems());
  results.push(await createDemoOrders());
  results.push(await createDemoOrderLineItems());

  const succeeded = results.filter(r => r).length;
  console.log(`\n📊 Summary: ${succeeded}/${results.length} operations completed`);

  if (succeeded === results.length) {
    console.log('✅ Demo data seeding completed successfully!');
  } else {
    console.log('\n⚠️  Some operations failed. Check if tables exist in Supabase.');
    console.log('   Execute the migration SQL first:');
    console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
