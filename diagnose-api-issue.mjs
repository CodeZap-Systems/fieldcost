import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

const testUsers = [
  { email: 'dingani@codezap.co.za', userId: 'f61d0933-741d-401a-ae91-d117c04e7094' },
  { email: 'dingani590@gmail.com', userId: '3dedce78-9b43-4f75-8664-d75b6fb94a92' }
];

console.log('=== TESTING API BEHAVIOR ===\n');

for (const testUser of testUsers) {
  console.log(`\nTesting: ${testUser.email}`);
  console.log('-'.repeat(60));
  
  // Test 1: What companies does the demo user have?
  const FALLBACK_USER_ID = '11111111-1111-1111-1111-111111111111';
  const { data: fallbackCompanies } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', FALLBACK_USER_ID);
    
  console.log(`\n1. Companies for FALLBACK_USER_ID (${FALLBACK_USER_ID}):`);
  console.log(`   Found: ${fallbackCompanies?.length || 0} companies`);
  if (fallbackCompanies?.length) {
    fallbackCompanies.forEach(c => console.log(`   - ${c.name} (ID=${c.id}, demo=${c.is_demo})`));
  }
  
  // Test 2: What companies does the REAL user have?
  const { data: realUserCompanies } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', testUser.userId);
    
  console.log(`\n2. Companies for REAL USER (${testUser.userId}):`);
  console.log(`   Found: ${realUserCompanies?.length || 0} companies`);
  if (realUserCompanies?.length) {
    realUserCompanies.forEach(c => console.log(`   - ${c.name} (ID=${c.id}, demo=${c.is_demo})`));
  }
  
  // Test 3: Call the actualAPI to see what it returns
  console.log(`\n3. What does /api/companies return (no user_id param)?`);
  try {
    const response = await fetch('http://localhost:3000/api/companies');
    const data = await response.json();
    console.log(`   Response status: ${response.status}`);
    console.log(`   Companies returned:`, data?.companies?.length || 0);
    if (data?.companies?.length) {
      data.companies.forEach(c => console.log(`   - ${c.name} (ID=${c.id}, user_id=${c.user_id})`));
    }
  } catch (e) {
    console.log(`   ⚠️  Server not running or error:`, e.message);
  }
  
  // Test 4: What if we pass the correct user_id?
  console.log(`\n4. What does /api/companies return (WITH user_id=${testUser.userId})?`);
  try {
    const response = await fetch(`http://localhost:3000/api/companies?user_id=${testUser.userId}`);
    const data = await response.json();
    console.log(`   Response status: ${response.status}`);
    console.log(`   Companies returned:`, data?.companies?.length || 0);
    if (data?.companies?.length) {
      data.companies.forEach(c => console.log(`   - ${c.name} (ID=${c.id}, user_id=${c.user_id})`));
    }
  } catch (e) {
    console.log(`   ⚠️  Server not running or error:`, e.message);
  }
}

console.log('\n' + '='.repeat(60));
console.log('CONCLUSION:');
console.log('='.repeat(60));
console.log('The API endpoint is using a FALLBACK user ID instead of the');
console.log('authenticated user\'s actual ID. This causes real users to see');
console.log('no companies and therefore no data.');
