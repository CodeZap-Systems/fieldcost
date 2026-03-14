import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkItemsUserIds() {
  try {
    console.log('🔍 Checking Items user_id and company_id...\n');

    // Get all items with their user_id and company_id
    const { data: items, error } = await supabase
      .from('items')
      .select('id, name, user_id, company_id');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`📦 Total items: ${items?.length || 0}\n`);
    items?.forEach(item => {
      console.log(`   ID: ${item.id}`);
      console.log(`   Name: ${item.name}`);
      console.log(`   user_id: ${item.user_id || '❌ NULL'}`);
      console.log(`   company_id: ${item.company_id}`);
      console.log('   ---');
    });

    // Get demo company info
    const { data: demoCompanies } = await supabase
      .from('company_profiles')
      .select('id, name, user_id, is_demo')
      .eq('is_demo', true);

    console.log('\n👥 Demo Company:');
    demoCompanies?.forEach(c => {
      console.log(`   ID: ${c.id}`);
      console.log(`   Name: ${c.name}`);
      console.log(`   user_id: ${c.user_id}`);
      console.log(`   is_demo: ${c.is_demo}`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkItemsUserIds();
