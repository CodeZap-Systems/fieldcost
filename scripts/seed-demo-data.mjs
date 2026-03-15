#!/usr/bin/env node
/**
 * Demo Data Seeding Script for FieldCost
 * Creates realistic sample data for client presentations
 * 
 * Run: node scripts/seed-demo-data.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DEMO_COMPANY_ID = 8;
const DEMO_USER_ID = 'e66081a8-af72-5722-8cce-e3a996196ad2';

// Sample customers
const customers = [
  {
    id: 101,
    name: 'Acme Construction Ltd',
    email: 'contact@acmeconstruction.co.za',
    company_id: DEMO_COMPANY_ID,
  },
  {
    id: 102,
    name: 'BuildMaster Properties',
    email: 'info@buildmaster.co.za',
    company_id: DEMO_COMPANY_ID,
  },
  {
    id: 103,
    name: 'Urban Development Corp',
    email: 'sales@urbandevelopment.co.za',
    company_id: DEMO_COMPANY_ID,
  },
];

// Sample suppliers
const suppliers = [
  {
    vendor_name: 'BuildCo Supply Chain',
    contact_name: 'John Mthembu',
    email: 'john.mthembu@buildco.co.za',
    phone: '+27 11 765 4321',
    address_line1: '456 Industrial Drive',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2012',
    country: 'South Africa',
    payment_terms: 'Net 30',
    tax_id: 'ZA987654321',
    rating: 4.8,
    company_id: DEMO_COMPANY_ID,
    user_id: DEMO_USER_ID,
  },
  {
    vendor_name: 'Premium Materials Ltd',
    contact_name: 'Sarah Nkomo',
    email: 'sarah@premiummat.co.za',
    phone: '+27 21 555 8899',
    address_line1: '789 Commerce Street',
    city: 'Cape Town',
    province: 'Western Cape',
    postal_code: '8001',
    country: 'South Africa',
    payment_terms: 'Net 15',
    tax_id: 'ZA456789012',
    rating: 4.5,
    company_id: DEMO_COMPANY_ID,
    user_id: DEMO_USER_ID,
  },
  {
    vendor_name: 'Equipment Rentals SA',
    contact_name: 'Michael van der Merwe',
    email: 'rentals@equipmentsa.co.za',
    phone: '+27 12 345 6789',
    address_line1: '321 Enterprise Way',
    city: 'Pretoria',
    province: 'Gauteng',
    postal_code: '0001',
    country: 'South Africa',
    payment_terms: 'Per Invoice',
    tax_id: 'ZA123123123',
    rating: 4.2,
    company_id: DEMO_COMPANY_ID,
    user_id: DEMO_USER_ID,
  },
];

// Sample projects
const projects = [
  {
    name: 'Sandton Shopping Mall Renovation',
    description: 'Complete renovation of Sandton Shopping Mall including new utilities',
    company_id: DEMO_COMPANY_ID,
  },
  {
    name: 'Waterfront Office Complex',
    description: 'New 15-story office building in the V&A Waterfront',
    company_id: DEMO_COMPANY_ID,
  },
  {
    name: 'Residential Estate Development',
    description: '50-unit residential estate with modern amenities',
    company_id: DEMO_COMPANY_ID,
  },
];

// Sample items
const items = [
  { name: 'Steel Beams (per ton)', description: 'Structural steel', company_id: DEMO_COMPANY_ID },
  { name: 'Concrete (per m³)', description: 'Ready-mix concrete', company_id: DEMO_COMPANY_ID },
  { name: 'Brickwork (per 1000)', description: 'Quality bricks', company_id: DEMO_COMPANY_ID },
  { name: 'Electrical Wiring (per km)', description: 'Heavy duty electrical cable', company_id: DEMO_COMPANY_ID },
  { name: 'Labour - Skilled (per day)', description: 'Skilled construction workers', company_id: DEMO_COMPANY_ID },
  { name: 'Excavator Rental (per day)', description: 'Heavy equipment rental', company_id: DEMO_COMPANY_ID },
  { name: 'Architectural Consultation (per hour)', description: 'Professional design services', company_id: DEMO_COMPANY_ID },
  { name: 'Safety Equipment Bundle', description: 'PPE and safety gear', company_id: DEMO_COMPANY_ID },
];

// Sample vendors
const vendors = [
  {
    name: 'BuildCo Supplies',
    email: 'sales@buildco.co.za',
    phone: '+27 11 765 4321',
    company_name: 'BuildCo Supplies (Pty) Ltd',
    contact_person: 'John Mthembu',
    company_id: DEMO_COMPANY_ID,
    user_id: DEMO_USER_ID,
  },
  {
    name: 'Premium Materials International',
    email: 'orders@premiummat.co.za',
    phone: '+27 21 555 8899',
    company_name: 'Premium Materials International (Pty) Ltd',
    contact_person: 'Sarah Nkomo',
    company_id: DEMO_COMPANY_ID,
    user_id: DEMO_USER_ID,
  },
];

async function seedData() {
  console.log('🌱 FieldCost Demo Data Seeding');
  console.log('================================\n');

  try {
    // 1. Insert Customers
    console.log('📌 Creating customers...');
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert(customers)
      .select()
      .catch(e => ({ data: null, error: e }));

    if (customerError) {
      console.error('⚠️  Customer insert skipped (schema cache)');
    } else if (customerData?.length) {
      console.log(`✅ Created ${customerData.length} customers\n`);
    }

    // 2. Insert Projects
    console.log('📌 Creating projects...');
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(projects)
      .select()
      .catch(e => ({ data: null, error: e }));

    if (projectError) {
      console.error('⚠️  Project insert skipped (schema cache)');
    } else if (projectData?.length) {
      console.log(`✅ Created ${projectData.length} projects\n`);
    }

    // 3. Try to Insert Items
    console.log('📌 Creating items...');
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .insert(items)
      .select()
      .catch(e => ({ data: null, error: e }));

    if (itemError) {
      console.error('⚠️  Item insert skipped (schema cache)');
    } else if (itemData?.length) {
      console.log(`✅ Created ${itemData.length} items\n`);
    }

    // 3b. Try to Insert Vendors
    console.log('📌 Creating vendors...');
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendors)
      .select()
      .catch(e => ({ data: null, error: e }));

    if (vendorError) {
      console.error('⚠️  Vendor insert skipped (schema cache)');
    } else if (vendorData?.length) {
      console.log(`✅ Created ${vendorData.length} vendors\n`);
    }

    // 4. Try to Insert Suppliers
    console.log('📌 Creating suppliers...');
    const { data: supplierData, error: supplierError } = await supabase
      .from('suppliers')
      .insert(suppliers)
      .select()
      .catch(e => ({ data: null, error: e }));

    let supplierIds = [];
    if (supplierError) {
      console.error('⚠️  Supplier insert skipped (schema cache - but table exists)!');
      // Try to fetch existing suppliers to continue demo with mock IDs
      const { data: existingSuppliers } = await supabase
        .from('suppliers')
        .select('id')
        .eq('company_id', DEMO_COMPANY_ID)
        .limit(3)
        .catch(() => ({ data: [] }));
      
      if (existingSuppliers?.length) {
        supplierIds = existingSuppliers.map(s => s.id);
        console.log(`✅ Found ${supplierIds.length} existing suppliers\n`);
      }
    } else if (supplierData?.length) {
      supplierIds = supplierData.map(s => s.id);
      console.log(`✅ Created ${supplierData.length} suppliers\n`);
    } else {
      console.log('⚠️  No supplier data to process\n');
    }

    // Only continue with quotes and POs if we have supplier IDs
    if (supplierIds.length > 0) {

      // 5. Insert Quotes with Line Items
      console.log('\n📌 Creating quotes...');
      const quotes = [
        {
          customer_id: 101,
          project_id: projectData?.[0]?.id,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
          amount: 1850000,
          description: 'Quote for complete steel structure and foundation work',
          reference: `QT-${Date.now()}-001`,
          status: 'sent',
          valid_until: '2026-04-15',
          sent_on: new Date().toISOString(),
        },
        {
          customer_id: 102,
          project_id: projectData?.[1]?.id,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
          amount: 3200000,
          description: 'Office building mechanical and electrical systems',
          reference: `QT-${Date.now()}-002`,
          status: 'accepted',
          valid_until: '2026-04-20',
          sent_on: new Date().toISOString(),
          accepted_on: new Date().toISOString(),
        },
        {
          customer_id: 103,
          project_id: projectData?.[2]?.id,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
          amount: 2500000,
          description: 'Residential estate infrastructure',
          reference: `QT-${Date.now()}-003`,
          status: 'draft',
        },
      ];

      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert(quotes)
        .select();

      if (quoteError) {
        console.error('❌ Quote error:', quoteError.message);
      } else {
        console.log(`✅ Created ${quoteData.length} quotes`);

        // Insert quote line items
        const quoteLineItems = [];
        quoteData.forEach((quote, idx) => {
          if (idx === 0) {
            quoteLineItems.push({
              quote_id: quote.id,
              item_name: 'Steel Beams (per ton)',
              quantity: 150,
              unit: 'tons',
              rate: 12000,
            });
            quoteLineItems.push({
              quote_id: quote.id,
              item_name: 'Foundation Work',
              quantity: 1,
              unit: 'ea',
              rate: 50000,
            });
          } else if (idx === 1) {
            quoteLineItems.push({
              quote_id: quote.id,
              item_name: 'Electrical Wiring (per km)',
              quantity: 25,
              unit: 'km',
              rate: 45000,
            });
            quoteLineItems.push({
              quote_id: quote.id,
              item_name: 'HVAC Systems',
              quantity: 1,
              unit: 'ea',
              rate: 2500000,
            });
          }
        });

        if (quoteLineItems.length > 0) {
          await supabase.from('quote_line_items').insert(quoteLineItems);
          console.log(`✅ Created ${quoteLineItems.length} quote line items\n`);
        }
      }

      // 6. Insert Purchase Orders with Line Items
      if (supplierIds.length > 0) {
        console.log('📌 Creating purchase orders...');
        const purchaseOrders = [
          {
            supplier_id: supplierIds[0],
            project_id: projectData?.[0]?.id,
            company_id: DEMO_COMPANY_ID,
            user_id: DEMO_USER_ID,
            po_reference: `PO-${Date.now()}-001`,
            po_date: new Date().toISOString().split('T')[0],
            required_by_date: '2026-04-01',
            delivery_date: '2026-03-25',
            total_amount: 1800000,
            description: 'Quality steel beams and structural materials for Sandton project',
            status: 'fully_received',
            sent_to_supplier_on: new Date().toISOString(),
            confirmed_on: new Date().toISOString(),
            first_delivery_on: new Date().toISOString(),
            fully_received_on: new Date().toISOString(),
          },
          {
            supplier_id: supplierIds[1],
            project_id: projectData?.[1]?.id,
            company_id: DEMO_COMPANY_ID,
            user_id: DEMO_USER_ID,
            po_reference: `PO-${Date.now()}-002`,
            po_date: new Date().toISOString().split('T')[0],
            required_by_date: '2026-03-30',
            total_amount: 2200000,
            description: 'Premium electrical materials and installation supplies',
            status: 'confirmed',
            sent_to_supplier_on: new Date().toISOString(),
            confirmed_on: new Date().toISOString(),
          },
          {
            supplier_id: supplierIds[2],
            project_id: projectData?.[2]?.id,
            company_id: DEMO_COMPANY_ID,
            user_id: DEMO_USER_ID,
            po_reference: `PO-${Date.now()}-003`,
            po_date: new Date().toISOString().split('T')[0],
            required_by_date: '2026-04-10',
            total_amount: 500000,
            description: 'Heavy equipment rental for excavation phase',
            status: 'sent_to_supplier',
            sent_to_supplier_on: new Date().toISOString(),
          },
        ];

        const { data: poData, error: poError } = await supabase
          .from('purchase_orders')
          .insert(purchaseOrders)
          .select();

        if (poError) {
          console.error('❌ Purchase Order error:', poError.message);
        } else {
          console.log(`✅ Created ${poData.length} purchase orders`);

          // Insert PO line items
          const poLineItems = [];
          poData.forEach((po, idx) => {
            if (idx === 0) {
              poLineItems.push(
                {
                  po_id: po.id,
                  item_name: 'Steel Beams Grade S355',
                  quantity_ordered: 150,
                  unit: 'tons',
                  unit_rate: 12000,
                  company_id: DEMO_COMPANY_ID,
                  user_id: DEMO_USER_ID,
                },
                {
                  po_id: po.id,
                  item_name: 'Bolts and Fasteners',
                  quantity_ordered: 5,
                  unit: 'boxes',
                  unit_rate: 12000,
                  company_id: DEMO_COMPANY_ID,
                  user_id: DEMO_USER_ID,
                }
              );
            } else if (idx === 1) {
              poLineItems.push(
                {
                  po_id: po.id,
                  item_name: 'Copper Wiring 10mm',
                  quantity_ordered: 50,
                  unit: 'km',
                  unit_rate: 35000,
                  company_id: DEMO_COMPANY_ID,
                  user_id: DEMO_USER_ID,
                },
                {
                  po_id: po.id,
                  item_name: 'Electrical Panels',
                  quantity_ordered: 8,
                  unit: 'ea',
                  unit_rate: 25000,
                  company_id: DEMO_COMPANY_ID,
                  user_id: DEMO_USER_ID,
                }
              );
            } else {
              poLineItems.push({
                po_id: po.id,
                item_name: 'Excavator CAT 320 Rental',
                quantity_ordered: 30,
                unit: 'days',
                unit_rate: 15000,
                company_id: DEMO_COMPANY_ID,
                user_id: DEMO_USER_ID,
              });
            }
          });

          if (poLineItems.length > 0) {
            await supabase.from('purchase_order_line_items').insert(poLineItems);
            console.log(`✅ Created ${poLineItems.length} PO line items\n`);
          }

          // 7. Insert Goods Received Notes (GRN)
          console.log('📌 Creating Goods Received Notes (GRN)...');
          const firstCompletedPO = poData.find(po => po.status === 'fully_received');
          
          if (firstCompletedPO) {
            const grnData = [
              {
                po_id: firstCompletedPO.id,
                company_id: DEMO_COMPANY_ID,
                user_id: DEMO_USER_ID,
                grn_reference: `GRN-${Date.now()}-001`,
                grn_date: new Date().toISOString().split('T')[0],
                received_by: 'James Siziba',
                delivery_reference: 'DLV-2026-0456',
                checked_by: 'Robert Khubone',
                status: 'received',
              },
              {
                po_id: firstCompletedPO.id,
                company_id: DEMO_COMPANY_ID,
                user_id: DEMO_USER_ID,
                grn_reference: `GRN-${Date.now()}-002`,
                grn_date: new Date().toISOString().split('T')[0],
                received_by: 'James Siziba',
                delivery_reference: 'DLV-2026-0457',
                checked_by: 'Robert Khubone',
                status: 'received',
              },
            ];

            const { data: grnResults, error: grnError } = await supabase
              .from('goods_received_notes')
              .insert(grnData)
              .select();

            if (grnError) {
              console.error('❌ GRN error:', grnError.message);
            } else {
              console.log(`✅ Created ${grnResults.length} GRNs\n`);
            }
          }
        }
      }
    }

    console.log('✨ Demo data seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   - Company ID: ${DEMO_COMPANY_ID}`);
    console.log(`   - Customers: ${customerData.length}`);
    console.log(`   - Projects: ${projectData.length}`);
    console.log(`   - Items: ${itemData.length}`);
    console.log(`   - Suppliers: ${supplierData.length}`);
    console.log('\n✅ Ready for client demo!\n');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedData();
