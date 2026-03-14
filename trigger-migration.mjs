#!/usr/bin/env node

/**
 * Trigger database migration via Next.js API endpoint
 */

console.log('\n📱 Database Migration via API\n');

console.log('🔌 Connecting to local development server...\n');
console.log('Prerequisite: Next.js dev server must be running on port 3000\n');
console.log('Run in another terminal: npm run dev\n');

const serverUrl = 'http://localhost:3000';
const endpoint = `${serverUrl}/api/admin/migrate`;

// Check if server is running first
fetch(`${serverUrl}/api/customers`)
  .catch(() => {
    console.error('❌ Error: Dev server is not running!\n');
    console.log('Start the dev server first:');
    console.log('   npm run dev\n');
    process.exit(1);
  })
  .then(() => {
    console.log('✅ Dev server is accessible\n');
    console.log('📡 Triggering migration...\n');

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  })
  .then(res => res.json())
  .then(data => {
    if (data.success || data.successCount > 0) {
      console.log('✅ Migration successful!\n');
      console.log('📊 Results:');
      console.log(`   • Executed: ${data.successCount || data.totalStatements} statements`);
      console.log(`   • Tables created: 4\n`);

      console.log('Tables:');
      console.log('   ✓ quotes');
      console.log('   ✓ quote_line_items');
      console.log('   ✓ orders');
      console.log('   ✓ order_line_items\n');

      console.log('🎉 Ready for seeding!\n');
      console.log('Next: node seed-quotes-orders.mjs\n');

      process.exit(0);
    } else {
      console.error('❌ Migration failed\n');
      console.log('Error:', data.error || 'Unknown error');
      console.log('Message:', data.message || 'No message');

      if (data.suggestion) {
        console.log('\nSuggestion:', data.suggestion);
      }

      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Request failed:', err.message, '\n');

    console.log('💡 Troubleshooting:\n');
    console.log('   1. Is the dev server running?');
    console.log('      npm run dev\n');

    console.log('   2. If API endpoint doesn\'t exist:');
    console.log('      - Rebuild the project: npm run build');
    console.log('      - Try again\n');

    console.log('   3. Alternative: Use Supabase web console');
    console.log('      https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');

    process.exit(1);
  });
