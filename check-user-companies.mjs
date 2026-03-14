import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

const emails = ['dingani@codezap.co.za', 'dingani739@gmail.com', 'dingani590@gmail.com'];

for (const email of emails) {
  console.log(`\n=== Checking ${email} ===`);
  
  // Get user
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log(`User not found`);
    continue;
  }
  
  console.log(`User ID: ${user.id}`);
  
  // Get companies for this user
  const { data: companies, error } = await supabase
    .from('company_profiles')
    .select('id, name, is_demo, user_id');
  
  if (error) {
    console.error('Error fetching companies:', error);
  } else {
    const userCompanies = companies.filter(c => c.user_id === user.id || c.is_demo);
    console.log(`Owned or demo companies: ${JSON.stringify(userCompanies, null, 2)}`);
  }
}
