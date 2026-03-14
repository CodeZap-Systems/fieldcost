import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

const testUsers = [
  { email: 'dingani@codezap.co.za', userId: 'f61d0933-741d-401a-ae91-d117c04e7094' },
  { email: 'dingani590@gmail.com', userId: '3dedce78-9b43-4f75-8664-d75b6fb94a92' }
];

console.log('=== COMPREHENSIVE DEBUG FOR BOTH USERS ===\n');

for (const testUser of testUsers) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DIAGNOSING: ${testUser.email} (ID: ${testUser.userId})`);
  console.log('='.repeat(60));

  // 1. Check if user exists in auth
  console.log('\n1. Checking auth user...');
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const authUser = users.find(u => u.email === testUser.email);
  
  if (!authUser) {
    console.log('   ❌ User NOT found in auth system!');
  } else {
    console.log(`   ✅ Found in auth. ID: ${authUser.id}`);
    console.log(`   - Email verified: ${authUser.email_confirmed_at ? 'YES' : 'NO'}`);
    console.log(`   - Created at: ${authUser.created_at}`);
    console.log(`   - Last sign in: ${authUser.last_sign_in_at || 'Never'}`);
    console.log(`   - User metadata:`, authUser.user_metadata);
    console.log(`   - App metadata:`, authUser.app_metadata);
  }

  // 2. Check company profiles
  console.log('\n2. Checking company profiles...');
  const { data: companies, error: compError } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', testUser.userId);

  if (compError) {
    console.log(`   ❌ Error querying companies: ${compError.message}`);
  } else if (!companies || companies.length === 0) {
    console.log('   ❌ NO COMPANIES FOUND for this user!');
  } else {
    console.log(`   ✅ Found ${companies.length} company/companies:`);
    companies.forEach((c, i) => {
      console.log(`      ${i+1}. ID=${c.id}, Name="${c.name}", is_demo=${c.is_demo}`);
    });
  }

  // 3. Check if user has any data in tables
  console.log('\n3. Checking data in user tables...');
  const tables = ['customers', 'projects', 'items', 'tasks', 'invoices', 'budgets'];
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', testUser.userId);
    
    if (error) {
      console.log(`   ${table}: ❌ Error - ${error.message}`);
    } else {
      console.log(`   ${table}: ${count || 0} records`);
    }
  }

  // 4. Check registration status
  console.log('\n4. Checking registration status...');
  const { data: regData } = await supabase
    .from('registrations')
    .select('*')
    .eq('email', testUser.email)
    .limit(1);
  
  if (!regData || regData.length === 0) {
    console.log('   ⚠️  No registration record found in database');
  } else {
    const reg = regData[0];
    console.log(`   ✅ Registration record found:`);
    console.log(`      - Status: ${reg.status}`);
    console.log(`      - Company: ${reg.company_name}`);
    console.log(`      - Created: ${reg.created_at}`);
    console.log(`      - Confirmed: ${reg.confirmed_at || 'NOT CONFIRMED'}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('END OF DIAGNOSTIC');
console.log('='.repeat(60));
