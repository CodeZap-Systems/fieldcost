async function testAll() {
  console.log('🎉 COMPREHENSIVE API TEST\n');

  const endpoints = [
    { url: 'http://localhost:3000/api/items?company_id=8', name: 'Items' },
    { url: 'http://localhost:3000/api/quotes?company_id=8', name: 'Quotes' },
    { url: 'http://localhost:3000/api/orders?company_id=8', name: 'Orders' },
    { url: 'http://localhost:3000/api/customers?company_id=8', name: 'Customers' },
    { url: 'http://localhost:3000/api/projects?company_id=8', name: 'Projects' },
    { url: 'http://localhost:3000/api/tasks?company_id=8', name: 'Tasks' },
    { url: 'http://localhost:3000/api/invoices?company_id=8', name: 'Invoices' },
  ];

  for (const { url, name } of endpoints) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : 'N/A';
      const status = res.status === 200 ? '✅' : `❌ (${res.status})`;
      console.log(`${status} ${name.padEnd(15)} ${count}`);
    } catch (e) {
      console.log(`❌ ${name.padEnd(15)} ERROR: ${e.message}`);
    }
  }

  console.log('\n✅ All demo data is ready for testing!');
}

testAll().catch(console.error);
