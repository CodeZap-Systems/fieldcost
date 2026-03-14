import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

const users = [
  'f61d0933-741d-401a-ae91-d117c04e7094',
  '2909703a-f0cb-4713-97f6-094c035cbe8c',
  '3dedce78-9b43-4f75-8664-d75b6fb94a92'
];

console.log('=== Checking All Companies ===\n');

for (const userId of users) {
  const { data, error } = await supabase
    .from('company_profiles')
    .select('id, name, user_id, is_demo')
    .or(`user_id.eq.${userId},is_demo.eq.true`);
  
  if (error) {
    console.log(`User ${userId}: ERROR`);
  } else {
    console.log(`\nUser ${userId}:`);
    if (data && data.length > 0) {
      data.forEach(c => {
        const owner = c.user_id === userId ? '(OWNED)' : '(DEMO)';
        console.log(`  - ID ${c.id}: "${c.name}" is_demo=${c.is_demo} ${owner}`);
      });
    } else {
      console.log(`  (no companies)`);
    }
  }
}
