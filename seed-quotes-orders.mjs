import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://mukaeylwmzztycajibhy.supabase.co",
  "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI"
);

const DEMO_USER_ID = "e66081a8-af72-5722-8cce-e3a996196ad2";
const DEMO_COMPANY_ID = 8;

/**
 * Generate a unique quote number
 */
function generateQuoteNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `Q-${timestamp}-${random}`;
}

/**
 * Generate a unique PO number
 */
function generatePONumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PO-${timestamp}-${random}`;
}

/**
 * Get future date offset by days
 */
function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Seed demo quotes
 */
async function seedQuotes() {
  console.log('📝 Seeding Demo Quotes...\n');

  const quotes = [
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 1,
      quote_number: generateQuoteNumber(),
      status: 'draft',
      amount: 15000,
      currency: 'USD',
      valid_until: getFutureDate(30),
      reference: 'Kitchen Renovation - ABC Construction',
      notes: 'Including labor and materials. Excludes permit fees.',
      line_items: [
        {
          description: 'Cabinetry and installation',
          quantity: 1,
          unit_price: 8000,
          line_total: 8000,
        },
        {
          description: 'Countertops and backsplash',
          quantity: 1,
          unit_price: 5000,
          line_total: 5000,
        },
        {
          description: 'Fixtures and hardware',
          quantity: 1,
          unit_price: 2000,
          line_total: 2000,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 2,
      quote_number: generateQuoteNumber(),
      status: 'sent',
      amount: 22500,
      currency: 'USD',
      valid_until: getFutureDate(30),
      reference: 'Office Renovation - XYZ Development',
      notes: 'Commercial project. 2-week delivery timeline.',
      line_items: [
        {
          description: 'Design and consultation',
          quantity: 20,
          unit_price: 150,
          line_total: 3000,
        },
        {
          description: 'Flooring installation',
          quantity: 1200,
          unit_price: 12,
          line_total: 14400,
        },
        {
          description: 'Painting and finishing',
          quantity: 1,
          unit_price: 5100,
          line_total: 5100,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 3,
      quote_number: generateQuoteNumber(),
      status: 'accepted',
      amount: 8500,
      currency: 'USD',
      valid_until: getFutureDate(14),
      reference: 'Bathroom Fixtures - BuildSupplies Inc',
      notes: 'Premium fixtures. Quick turnaround available.',
      line_items: [
        {
          description: 'Toilet and bidet set',
          quantity: 2,
          unit_price: 2000,
          line_total: 4000,
        },
        {
          description: 'Sink and faucet',
          quantity: 1,
          unit_price: 2500,
          line_total: 2500,
        },
        {
          description: 'Installation labor (8 hours)',
          quantity: 8,
          unit_price: 125,
          line_total: 1000,
        },
        {
          description: 'Shipping and handling',
          quantity: 1,
          unit_price: 500,
          line_total: 500,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      customer_id: 1,
      quote_number: generateQuoteNumber(),
      status: 'rejected',
      amount: 6200,
      currency: 'USD',
      valid_until: getFutureDate(7),
      reference: 'Roofing Quote - ABC Construction (Rejected)',
      notes: 'Customer chose alternative contractor.',
      line_items: [
        {
          description: 'Roof inspection and assessment',
          quantity: 1,
          unit_price: 500,
          line_total: 500,
        },
        {
          description: 'Roofing materials (asphalt shingles)',
          quantity: 1,
          unit_price: 4000,
          line_total: 4000,
        },
        {
          description: 'Labor (3 days)',
          quantity: 24,
          unit_price: 85,
          line_total: 2040,
        },
        {
          description: 'Disposal and cleanup',
          quantity: 1,
          unit_price: 300,
          line_total: 300,
        },
      ],
    },
  ];

  let successCount = 0;
  for (const quoteData of quotes) {
    const lineItems = quoteData.line_items;
    const { line_items, ...quoteInsert } = quoteData;

    try {
      const { data: createdQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert(quoteInsert)
        .select();

      if (quoteError) {
        console.error(`❌ Error creating quote: ${quoteError.message}`);
        continue;
      }

      if (!createdQuote || createdQuote.length === 0) {
        console.error(`❌ Quote created but no data returned`);
        continue;
      }

      const quoteId = createdQuote[0].id;

      // Insert line items
      const lineItemsInsert = lineItems.map(item => ({
        quote_id: quoteId,
        ...item,
      }));

      const { error: lineError } = await supabase
        .from('quote_line_items')
        .insert(lineItemsInsert);

      if (lineError) {
        console.error(`❌ Error creating line items for quote ${quoteId}: ${lineError.message}`);
        continue;
      }

      console.log(`✅ Created quote: ${quoteInsert.quote_number} (Status: ${quoteInsert.status}, Amount: $${quoteInsert.amount})`);
      successCount++;
    } catch (err) {
      console.error(`❌ Exception creating quote: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${successCount}/${quotes.length} quotes\n`);
  return successCount;
}

/**
 * Seed demo orders
 */
async function seedOrders() {
  console.log('📦 Seeding Demo Orders...\n');

  const orders = [
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: generatePONumber(),
      vendor_name: 'Premium Materials Supplier',
      customer_id: 1,
      status: 'draft',
      amount: 12500,
      currency: 'USD',
      delivery_date: getFutureDate(14),
      reference: 'INT-001',
      notes: 'Standard delivery. Pay on delivery available.',
      line_items: [
        {
          description: 'Lumber (2x4, 100 pieces)',
          quantity: 100,
          unit_price: 8,
          line_total: 800,
        },
        {
          description: 'Drywall sheets (4x8)',
          quantity: 50,
          unit_price: 15,
          line_total: 750,
        },
        {
          description: 'Electrical fixtures',
          quantity: 200,
          unit_price: 25,
          line_total: 5000,
        },
        {
          description: 'Paint (gallon)',
          quantity: 30,
          unit_price: 35,
          line_total: 1050,
        },
        {
          description: 'Hardware and fasteners',
          quantity: 1,
          unit_price: 4900,
          line_total: 4900,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: generatePONumber(),
      vendor_name: 'Industrial Equipment Co.',
      customer_id: 2,
      status: 'confirmed',
      amount: 45000,
      currency: 'USD',
      delivery_date: getFutureDate(21),
      reference: 'INT-002',
      notes: 'Scheduled delivery for April 1st. Assembly required.',
      line_items: [
        {
          description: 'Heavy machinery installation',
          quantity: 1,
          unit_price: 25000,
          line_total: 25000,
        },
        {
          description: 'Calibration and inspection',
          quantity: 8,
          unit_price: 500,
          line_total: 4000,
        },
        {
          description: 'Safety equipment and training',
          quantity: 1,
          unit_price: 3000,
          line_total: 3000,
        },
        {
          description: '1-year warranty extension',
          quantity: 1,
          unit_price: 13000,
          line_total: 13000,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: generatePONumber(),
      vendor_name: 'Office Automation Ltd.',
      customer_id: 3,
      status: 'delivered',
      amount: 8750,
      currency: 'USD',
      delivery_date: getFutureDate(7),
      reference: 'INT-003',
      notes: 'Delivery completed. All items inspected and verified.',
      line_items: [
        {
          description: 'Office chairs (10 units)',
          quantity: 10,
          unit_price: 450,
          line_total: 4500,
        },
        {
          description: 'Desks (5 units)',
          quantity: 5,
          unit_price: 650,
          line_total: 3250,
        },
        {
          description: 'Assembly service',
          quantity: 1,
          unit_price: 1000,
          line_total: 1000,
        },
      ],
    },
    {
      user_id: DEMO_USER_ID,
      company_id: DEMO_COMPANY_ID,
      po_number: generatePONumber(),
      vendor_name: 'Utility Services Provider',
      customer_id: 1,
      status: 'cancelled',
      amount: 3500,
      currency: 'USD',
      delivery_date: getFutureDate(5),
      reference: 'INT-004 (Cancelled)',
      notes: 'Order cancelled. Project scope changed.',
      line_items: [
        {
          description: 'Emergency power generator rental',
          quantity: 1,
          unit_price: 2500,
          line_total: 2500,
        },
        {
          description: 'Fuel and maintenance supplies',
          quantity: 1,
          unit_price: 500,
          line_total: 500,
        },
        {
          description: 'Backup battery system',
          quantity: 1,
          unit_price: 500,
          line_total: 500,
        },
      ],
    },
  ];

  let successCount = 0;
  for (const orderData of orders) {
    const lineItems = orderData.line_items;
    const { line_items, ...orderInsert } = orderData;

    try {
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select();

      if (orderError) {
        console.error(`❌ Error creating order: ${orderError.message}`);
        continue;
      }

      if (!createdOrder || createdOrder.length === 0) {
        console.error(`❌ Order created but no data returned`);
        continue;
      }

      const orderId = createdOrder[0].id;

      // Insert line items
      const lineItemsInsert = lineItems.map(item => ({
        order_id: orderId,
        ...item,
      }));

      const { error: lineError } = await supabase
        .from('order_line_items')
        .insert(lineItemsInsert);

      if (lineError) {
        console.error(`❌ Error creating line items for order ${orderId}: ${lineError.message}`);
        continue;
      }

      console.log(`✅ Created order: ${orderInsert.po_number} (Status: ${orderInsert.status}, Amount: $${orderInsert.amount})`);
      successCount++;
    } catch (err) {
      console.error(`❌ Exception creating order: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${successCount}/${orders.length} orders\n`);
  return successCount;
}

/**
 * Verify tables exist
 */
async function verifyTables() {
  console.log('🔍 Verifying tables exist...\n');

  const tables = ['quotes', 'quote_line_items', 'orders', 'order_line_items'];
  let allExist = true;

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`❌ Table '${table}' not found or error: ${error.message}`);
        allExist = false;
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (err) {
      console.error(`❌ Error checking table '${table}': ${err.message}`);
      allExist = false;
    }
  }

  if (!allExist) {
    console.warn('\n⚠️  Some tables are missing. Run the migration first:');
    console.warn('   Copy and execute this SQL in Supabase:\n');
    console.warn('   migrations/20260313_create_quotes_orders.sql');
    return false;
  }

  console.log('\n✅ All required tables exist\n');
  return true;
}

/**
 * Test API connectivity
 */
async function testAPIConnectivity() {
  console.log('🌐 Testing API connectivity...\n');

  try {
    // Test GET quotes
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('COUNT(*)')
      .limit(1);

    if (quotesError) {
      console.error(`❌ Cannot read quotes table: ${quotesError.message}`);
      return false;
    }

    // Test GET orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('COUNT(*)')
      .limit(1);

    if (ordersError) {
      console.error(`❌ Cannot read orders table: ${ordersError.message}`);
      return false;
    }

    console.log('✅ API connectivity confirmed\n');
    return true;
  } catch (err) {
    console.error(`❌ API test failed: ${err.message}\n`);
    return false;
  }
}

/**
 * Main execution - Direct Insert (No Verification)
 */
async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   🌱 SEED DEMO QUOTES AND ORDERS');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Seed quotes directly
    const quotesSeedResult = await seedQuotes();

    // Seed orders directly
    const ordersSeedResult = await seedOrders();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   ✅ SEEDING COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🎉 Demo data ready!\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
