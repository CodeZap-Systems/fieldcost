import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDemoCompany() {
  try {
    console.log('🔍 Checking Demo Company Status...\n');

    // 1. Get Demo Company
    const { data: demoCompanies, error: demoError } = await supabase
      .from('company_profiles')
      .select('id, name, is_demo, user_id')
      .eq('is_demo', true);

    if (demoError) {
      console.error('❌ Error fetching demo company:', demoError.message);
      return;
    }

    console.log('📋 Demo Companies:', demoCompanies.length);
    demoCompanies.forEach(c => {
      console.log(`   • ${c.name} (ID: ${c.id}, is_demo: ${c.is_demo})`);
    });

    if (demoCompanies.length === 0) {
      console.log('\n❌ No Demo Company found!');
      return;
    }

    const demoCompanyId = demoCompanies[0].id;
    console.log(`\n✅ Using Demo Company ID: ${demoCompanyId}\n`);

    // 2. Count items in demo company
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id, name, company_id')
      .eq('company_id', demoCompanyId);

    if (itemsError) {
      console.error('❌ Error fetching items:', itemsError.message);
    } else {
      console.log(`📦 Items in Demo Company: ${items?.length || 0}`);
      items?.forEach(item => {
        console.log(`   • ${item.name} (company_id: ${item.company_id})`);
      });
    }

    // 3. Count projects in demo company
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('id, name, company_id')
      .eq('company_id', demoCompanyId);

    if (projError) {
      console.error('❌ Error fetching projects:', projError.message);
    } else {
      console.log(`\n🏢 Projects in Demo Company: ${projects?.length || 0}`);
      projects?.forEach(proj => {
        console.log(`   • ${proj.name}`);
      });
    }

    // 4. Check items table total
    const { data: allItems, error: allError } = await supabase
      .from('items')
      .select('id, company_id');

    if (!allError) {
      console.log(`\n📊 Total items in database: ${allItems?.length || 0}`);
      const byCompany = {};
      allItems?.forEach(item => {
        byCompany[item.company_id] = (byCompany[item.company_id] || 0) + 1;
      });
      console.log('   Items by company:');
      Object.entries(byCompany).forEach(([compId, count]) => {
        console.log(`     • Company ${compId}: ${count} items`);
      });
    }

    // 5. Check all companies
    const { data: allCompanies } = await supabase
      .from('company_profiles')
      .select('id, name, is_demo');

    console.log(`\n👥 All Companies in Database:`);
    allCompanies?.forEach(c => {
      console.log(`   • ${c.name} (ID: ${c.id}, is_demo: ${c.is_demo})`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkDemoCompany();
