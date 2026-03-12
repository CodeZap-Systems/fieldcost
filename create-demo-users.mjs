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

  // Create demo-live-test user (for live company mode testing)
  try {
    console.log('1. Creating demo-live-test user...');
    
    // Use a deterministic UUID for demo-live-test
    const demoLiveTestId = '00000000-0000-0000-0000-000000000001';
    
    const { data: existingUser, error: getError } = await supabase.auth.admin.getUserById(demoLiveTestId);
    
    if (existingUser) {
      console.log(`   ✅ User already exists: ${demoLiveTestId}`);
    } else if (getError?.code === 'NotFoundError') {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: demoLiveTestId,
        email: 'demo-live-test@fieldcost.local',
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

  // Create demo user (for demo company mode testing)
  try {
    console.log('\n2. Creating demo user...');
    
    // Use a deterministic UUID for demo
    const demoId = '00000000-0000-0000-0000-000000000002';
    
    const { data: existingUser, error: getError } = await supabase.auth.admin.getUserById(demoId);
    
    if (existingUser) {
      console.log(`   ✅ User already exists: ${demoId}`);
    } else if (getError?.code === 'NotFoundError') {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: demoId,
        email: 'demo@fieldcost.local',
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
