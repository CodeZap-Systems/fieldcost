import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

console.log('=== Checking Data Isolation ===\n');

// Check items in each company
const companies = [
  { id: 8, name: 'Demo Company' },
  { id: 9, name: 'User 2 Company' },
  { id: 13, name: 'CodeZap Live Company' },
  { id: 14, name: 'Dingani Live Company 590' }
];

for (const company of companies) {
  const { data, error } = await supabase
    .from('items')
    .select('id, name, company_id')
    .eq('company_id', company.id);
  
  if (error) {
    console.log(`${company.name} (${company.id}): ERROR - ${error.message}`);
  } else {
    const count = data?.length || 0;
    console.log(`${company.name} (${company.id}): ${count} items`);
    if (count > 0) {
      console.log(`  Sample: ${data[0]?.name}`);
    }
  }
}
