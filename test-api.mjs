async function testApi() {
  console.log('🧪 Testing API endpoints with error details...\n');

  // Test /api/items
  try {
    const res = await fetch('http://localhost:3000/api/items?company_id=8');
    const data = await res.json();
    console.log(`✅ GET /api/items: ${res.status}`);
    console.log(`   Count: ${Array.isArray(data) ? data.length : 'N/A'}\n`);
  } catch (e) {
    console.log(`❌ /api/items error:`, e.message);
  }

  // Test /api/quotes
  try {
    const res = await fetch('http://localhost:3000/api/quotes?company_id=8');
    const text = await res.text();
    console.log(`❌ GET /api/quotes: ${res.status}`);
    console.log(`   Response: ${text.substring(0, 200)}\n`);
  } catch (e) {
    console.log(`❌ /api/quotes error:`, e.message);
  }

  // Test /api/orders
  try {
    const res = await fetch('http://localhost:3000/api/orders?company_id=8');
    const text = await res.text();
    console.log(`❌ GET /api/orders: ${res.status}`);
    console.log(`   Response: ${text.substring(0, 200)}\n`);
  } catch (e) {
    console.log(`❌ /api/orders error:`, e.message);
  }

  // Also try with Authorization header using service role key
  console.log('\n🔐 Testing with Authorization header...\n');
  
  try {
    const res = await fetch('http://localhost:3000/api/quotes?company_id=8', {
      headers: {
        'Authorization': 'Bearer sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI'
      }
    });
    const data = await res.json();
    console.log(`GET /api/quotes with auth: ${res.status}`);
    console.log(`   ${Array.isArray(data) ? `Count: ${data.length}` : data.error || JSON.stringify(data).substring(0, 100)}\n`);
  } catch (e) {
    console.log(`❌ /api/quotes error:`, e.message);
  }
}

testApi().catch(console.error);
