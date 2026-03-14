import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deepDive() {
  console.log('🔬 DEEP DIVE DIAGNOSTIC\n');

  // 1. Check companies
  const { data: companies } = await supabase
    .from('company_profiles')
    .select('id, name, is_demo, user_id')
    .order('is_demo', { ascending: false });

  console.log('📊 ALL COMPANIES:');
  companies?.forEach(c => {
    console.log(`  ID: ${c.id}, Name: ${c.name}, is_demo: ${c.is_demo}, user_id: ${c.user_id}`);
  });

  // 2. Check items
  const { data: allItems } = await supabase
    .from('items')
    .select('id, name, user_id, company_id')
    .order('company_id', { ascending: true });

  console.log('\n📦 ALL ITEMS IN DATABASE:');
  allItems?.forEach(item => {
    const company = companies?.find(c => c.id === item.company_id);
    console.log(`  ID: ${item.id}, Name: ${item.name}, company_id: ${item.company_id} (${company?.name}), user_id: ${item.user_id}`);
  });

  // 3. Check what gets returned for Demo Company (ID 8)
  const { data: demoItems, error: demoError } = await supabase
    .from('items')
    .select('id, name, user_id, company_id')
    .eq('company_id', 8);

  console.log('\n🎯 ITEMS FOR DEMO COMPANY (ID: 8):');
  if (demoError) {
    console.log(`  ❌ Error: ${demoError.message}`);
  } else {
    console.log(`  ✅ Found ${demoItems?.length || 0} items`);
    demoItems?.forEach(item => {
      console.log(`    • ${item.name} (user_id: ${item.user_id})`);
    });
  }

  // 4. Check what gets returned for Test Company 2 (ID 1)
  const { data: liveItems } = await supabase
    .from('items')
    .select('id, name, user_id, company_id')
    .eq('company_id', 1);

  console.log('\n👥 ITEMS FOR LIVE COMPANY (ID: 1 - Test Company 2):');
  console.log(`  ✅ Found ${liveItems?.length || 0} items`);
  liveItems?.forEach(item => {
    console.log(`    • ${item.name} (user_id: ${item.user_id})`);
  });

  // 5. Get Demo Company's user_id
  const { data: demoCompanyData } = await supabase
    .from('company_profiles')
    .select('id, user_id')
    .eq('is_demo', true)
    .single();

  console.log(`\n🔑 DEMO COMPANY USER_ID: ${demoCompanyData?.user_id}`);

  // 6. Check items by demo company's user_id
  if (demoCompanyData?.user_id) {
    const { data: itemsByUserId } = await supabase
      .from('items')
      .select('id, name, user_id, company_id')
      .eq('user_id', demoCompanyData.user_id);

    console.log(`\n📦 ITEMS WITH DEMO COMPANY'S USER_ID:)`);
    console.log(`  Found ${itemsByUserId?.length || 0} items with user_id = ${demoCompanyData.user_id}`);
    itemsByUserId?.forEach(item => {
      console.log(`    • ${item.name} (company_id: ${item.company_id})`);
    });
  }

  // 7. Raw SQL-like check for company_id filtering only
  console.log(`\n✅ ITEMS FILTERED ONLY BY COMPANY_ID=8 (No user_id check):`);
  const { data: demoOnlyCompanyId } = await supabase
    .from('items')
    .select('*')
    .eq('company_id', 8);
  console.log(`  Count: ${demoOnlyCompanyId?.length || 0}`);

}

deepDive().catch(err => console.error('Error:', err.message));
