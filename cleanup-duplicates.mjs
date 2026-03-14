import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupDuplicateData() {
  try {
    console.log('🧹 Cleaning up duplicate demo data...\n');

    // Get demo company
    const { data: demoCompanies } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('is_demo', true);

    if (!demoCompanies || demoCompanies.length === 0) {
      console.error('❌ Demo Company not found');
      return;
    }

    const demoCompanyId = demoCompanies[0].id;
    console.log(`Demo Company ID: ${demoCompanyId}\n`);

    // Get all items in demo company - keep only first 6
    const { data: items } = await supabase
      .from('items')
      .select('id, name')
      .eq('company_id', demoCompanyId)
      .order('id', { ascending: true });

    if (!items || items.length <= 6) {
      console.log('✅ No duplicates to clean (6 items or fewer)');
    } else {
      // Keep first 6, delete the rest
      const idsToDelete = items.slice(6).map(i => i.id);
      console.log(`📦 Found ${items.length} items. Deleting ${idsToDelete.length} duplicates...`);
      
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('❌ Error deleting items:', deleteError.message);
      } else {
        console.log(`✅ Deleted ${idsToDelete.length} duplicate items\n`);
      }
    }

    // Same for projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name')
      .eq('company_id', demoCompanyId)
      .order('id', { ascending: true });

    if (!projects || projects.length <= 5) {
      console.log('✅ No duplicate projects');
    } else {
      const idsToDelete = projects.slice(5).map(p => p.id);
      console.log(`🏢 Found ${projects.length} projects. Deleting ${idsToDelete.length} duplicates...`);
      
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('❌ Error deleting projects:', deleteError.message);
      } else {
        console.log(`✅ Deleted ${idsToDelete.length} duplicate projects\n`);
      }
    }

    // Verify final counts
    const { data: finalItems } = await supabase
      .from('items')
      .select('id, name')
      .eq('company_id', demoCompanyId);

    const { data: finalProjects } = await supabase
      .from('projects')
      .select('id, name')
      .eq('company_id', demoCompanyId);

    console.log('✅ Cleanup Complete!');
    console.log(`   📦 Items: ${finalItems?.length || 0}`);
    console.log(`   🏢 Projects: ${finalProjects?.length || 0}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

cleanupDuplicateData();
