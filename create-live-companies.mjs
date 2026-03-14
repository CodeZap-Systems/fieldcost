import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mukaeylwmzztycajibhy.supabase.co',
  'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
);

const usersToCreate = [
  {
    email: 'dingani@codezap.co.za',
    userId: 'f61d0933-741d-401a-ae91-d117c04e7094',
    companyName: 'CodeZap Live Company'
  },
  {
    email: 'dingani590@gmail.com',
    userId: '3dedce78-9b43-4f75-8664-d75b6fb94a92',
    companyName: 'Dingani Live Company 590'
  }
];

console.log('Creating live companies for users...\n');

for (const user of usersToCreate) {
  console.log(`Creating company for ${user.email}...`);
  
  const { data, error } = await supabase
    .from('company_profiles')
    .insert([{
      name: user.companyName,
      user_id: user.userId,
      is_demo: false,
      email: user.email
    }])
    .select();
  
  if (error) {
    console.error(`❌ Error: ${error.message}`);
  } else {
    console.log(`✅ Created company: ${data[0].name} (ID: ${data[0].id})`);
  }
}

console.log('\n✅ All live companies created!');
