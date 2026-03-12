#!/usr/bin/env node
import https from 'https';

async function fetchDiagnostics(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://fieldcost.vercel.app${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data.substring(0, 500)
          });
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

async function main() {
  console.log('🔍 Starting Supabase diagnostic tests...\n');
  
  try {
    console.log('Test 1: Supabase Diagnostic Endpoint');
    const supabaseDiag = await fetchDiagnostics('/api/debug/supabase-diagnostic');
    console.log(`Status: ${supabaseDiag.status}`);
    console.log('Summary:', supabaseDiag.body.summary || 'N/A');
    console.log('---');
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  console.log('\n');
  
  try {
    console.log('Test 2: Live Company Mode Diagnostic');
    const liveDiag = await fetchDiagnostics('/api/debug/livecompany-test');
    console.log(`Status: ${liveDiag.status}`);
    if (liveDiag.body.summary) {
      console.log('Summary:', liveDiag.body.summary);
      console.log('Results:');
      liveDiag.body.results?.forEach(r => {
        console.log(`  - ${r.testName}: ${r.status} (${r.details})`);
        if (r.error) console.log(`    Error: ${r.error}`);
      });
    } else {
      console.log('Response:', JSON.stringify(liveDiag.body).substring(0, 500));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();

