import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

// Simulate what the /api/company endpoint returns
const userId = 'f61d0933-741d-401a-ae91-d117c04e7094'; // dingani@codezap.co.za

console.log(`\nChecking /api/company result for user ${userId}:\n`);

// Get companies like the endpoint does
const { data, error } = await supabase
  .from('company_profiles')
  .select('*')
  .eq('user_id', userId)
  .order('updated_at', { ascending: false });

if (error) {
  console.log('Error:', error);
} else {
  console.log('User companies:', data);
  
  // Now filter to non-demo only (like the endpoint does for non-demo users)
  const ownedCompanies = data.filter(c => !c.is_demo);
  console.log('\nFiltered owned companies:', ownedCompanies);
  console.log('First in list:', ownedCompanies[0]?.name, '(ID:', ownedCompanies[0]?.id + ')');
}
