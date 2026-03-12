import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(__dirname, '.env.local');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  lines.forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && !process.env[key]) {
      process.env[key] = rest.join('=');
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createDemoUsers() {
  console.log('🔧 Creating demo users with proper UUID format...\n');

  // Mapping of demo user names to their consistent UUIDs
  const demoUsers = [
    { name: 'demo', uuid: 'e66081a8-af72-5722-8cce-e3a996196ad2', email: 'demo@fieldcost.local' },
    { name: 'demo-live-test', uuid: '55a13a79-7825-5e24-bd4b-11babbc6288c', email: 'demo-live-test@fieldcost.local' },
    { name: 'demo-admin', uuid: 'e2ba61b5-99c6-51f2-868b-32a20082bd86', email: 'demo-admin@fieldcost.local' },
    { name: 'demo-diagnostic-user', uuid: '53c8c879-8f4f-5b96-b23f-93e50f2ac41c', email: 'demo-diagnostic-user@fieldcost.local' },
  ];

  for (let i = 0; i < demoUsers.length; i++) {
    const user = demoUsers[i];
    try {
      console.log(`${i + 1}. Creating ${user.name} (${user.uuid})...`);
      
      const { data: existingUser, error: getError } = await supabase.auth.admin.getUserById(user.uuid);
      
      if (existingUser) {
        console.log(`   ✅ User already exists: ${user.uuid}`);
      } else if (getError?.code === 'NotFoundError' || getError?.message?.includes('not found')) {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          id: user.uuid,
          email: user.email,
          password: 'demo123456',
          email_confirm: true,
        });
        
        if (createError) {
          console.log(`   ⚠️  Create error: ${createError.message}`);
        } else {
          console.log(`   ✅ Created: ${newUser.id} (${newUser.email})`);
        }
      } else {
        console.log(`   ⚠️  Error checking user: ${getError?.message}`);
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`);
    }
  }

  // Verify users exist
  console.log('\n📋 Verifying users...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.log(`   ❌ List error: ${error.message}`);
    } else {
      const demoUsers = users.users.filter(u => u.email?.includes('demo') || u.email?.includes('fieldcost'));
      console.log(`   Found ${demoUsers.length} demo/test users:`);
      demoUsers.forEach(u => {
        console.log(`     - ${u.id} (${u.email})`);
      });
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
  }

  console.log('\n✅ Demo user creation complete');
}

createDemoUsers().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
