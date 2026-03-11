/**
 * Sage One BCA API Integration Test
 * Tests real Sage API connectivity and invoice workflows
 *
 * Credentials:
 *   Email: dev@codezap.co.za
 *   Password: Dingb@tDing4783
 *   Sage URL: https://resellers.accounting.sageone.co.za/Landing/Default.aspx
 */

import https from 'https';

class SageApiTester {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseUrl = 'accounting.sageone.co.za';
    this.basePath = '/api/1.4.2';
    this.testResults = [];
  }

  /**
   * Make HTTPS request to Sage API
   */
  makeRequest(method, path, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: this.basePath + path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        const bodyStr = JSON.stringify(body);
        options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
      }

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: res.statusCode < 400, status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ success: res.statusCode < 400, status: res.statusCode, data, raw: true });
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (body && (method === 'POST' || method === 'PUT')) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Test 1: Authenticate with Sage API
   */
  async testAuthentication() {
    console.log('\n✓ TEST 1: AUTHENTICATION');
    console.log('-'.repeat(50));
    console.log(`Email: ${this.username}`);
    console.log(`URL: https://resellers.accounting.sageone.co.za/Landing/Default.aspx`);

    try {
      // Try standard Basic Auth first
      const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      console.log('Attempting Basic Auth...');
      let response = await this.makeRequest('GET', '/User', {
        'Authorization': `Basic ${credentials}`,
      });

      // If that fails with 403, try alternate endpoint
      if (response.status === 403) {
        console.log('   Trying alternate authentication endpoint...');
        response = await this.makeRequest('POST', '/oauth/token', {
          'Content-Type': 'application/x-www-form-urlencoded',
        }, {
          username: this.username,
          password: this.password,
          grant_type: 'password',
        });
      }

      if (response.success && (response.data?.AccessToken || response.data?.access_token)) {
        this.accessToken = response.data.AccessToken || response.data.access_token;
        const expiresIn = response.data.ExpiresIn || response.data.expires_in || 3600;
        this.tokenExpiry = new Date(Date.now() + (expiresIn - 60) * 1000);
        console.log('✅ Authentication successful');
        console.log(`   Token: ${this.accessToken.substring(0, 20)}...`);
        console.log(`   Expires In: ${expiresIn} seconds`);
        this.testResults.push({ test: 'Authentication', passed: true });
        return true;
      } else {
        console.log('❌ Authentication failed');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, response.data);
        console.log('\n   Troubleshooting:');
        console.log('   - Verify credentials are correct');
        console.log('   - Check if account needs activation');
        console.log('   - Verify API access is enabled on account');
        this.testResults.push({ test: 'Authentication', passed: false });
        return false;
      }
    } catch (error) {
      console.log('❌ Authentication error:', error.message);
      this.testResults.push({ test: 'Authentication', passed: false, error: error.message });
      return false;
    }
  }

  /**
   * Test 2: Get Companies
   */
  async testGetCompanies() {
    console.log('\n✓ TEST 2: GET COMPANIES');
    console.log('-'.repeat(50));

    if (!this.accessToken) {
      console.log('❌ No access token - skipping');
      this.testResults.push({ test: 'Get Companies', passed: false, error: 'No token' });
      return false;
    }

    try {
      const response = await this.makeRequest('GET', '/Company', {
        'Authorization': `Bearer ${this.accessToken}`,
      });

      if (response.success) {
        const companies = response.data?.Results || [];
        console.log(`✅ Retrieved ${companies.length} company(ies)`);
        companies.forEach((company, idx) => {
          console.log(`   [${idx + 1}] ${company.Name} (ID: ${company.ID})`);
          console.log(`       ${company.Address1 || ''} ${company.Address2 || ''}`);
        });
        this.testResults.push({ test: 'Get Companies', passed: true, count: companies.length });
        return companies.length > 0;
      } else {
        console.log('❌ Failed to retrieve companies');
        console.log(`   Status: ${response.status}`);
        this.testResults.push({ test: 'Get Companies', passed: false });
        return false;
      }
    } catch (error) {
      console.log('❌ Error retrieving companies:', error.message);
      this.testResults.push({ test: 'Get Companies', passed: false, error: error.message });
      return false;
    }
  }

  /**
   * Test 3: Get Contacts (Customers)
   */
  async testGetContacts() {
    console.log('\n✓ TEST 3: GET CONTACTS (CUSTOMERS)');
    console.log('-'.repeat(50));

    if (!this.accessToken) {
      console.log('❌ No access token - skipping');
      this.testResults.push({ test: 'Get Contacts', passed: false, error: 'No token' });
      return false;
    }

    try {
      const response = await this.makeRequest('GET', '/Contact', {
        'Authorization': `Bearer ${this.accessToken}`,
      });

      if (response.success) {
        const contacts = response.data?.Results || [];
        console.log(`✅ Retrieved ${contacts.length} contact(s)`);
        contacts.slice(0, 5).forEach((contact, idx) => {
          console.log(`   [${idx + 1}] ${contact.Name} (ID: ${contact.ID})`);
          console.log(`       Email: ${contact.Email || 'N/A'}`);
        });
        if (contacts.length > 5) {
          console.log(`   ... and ${contacts.length - 5} more`);
        }
        this.testResults.push({ test: 'Get Contacts', passed: true, count: contacts.length });
        return contacts.length > 0;
      } else {
        console.log('❌ Failed to retrieve contacts');
        console.log(`   Status: ${response.status}`);
        this.testResults.push({ test: 'Get Contacts', passed: false });
        return false;
      }
    } catch (error) {
      console.log('❌ Error retrieving contacts:', error.message);
      this.testResults.push({ test: 'Get Contacts', passed: false, error: error.message });
      return false;
    }
  }

  /**
   * Test 4: Create a Sample Invoice
   */
  async testCreateInvoice() {
    console.log('\n✓ TEST 4: CREATE SAMPLE INVOICE');
    console.log('-'.repeat(50));

    if (!this.accessToken) {
      console.log('❌ No access token - skipping');
      this.testResults.push({ test: 'Create Invoice', passed: false, error: 'No token' });
      return false;
    }

    try {
      // Create sample invoice payload
      const invoicePayload = {
        CustomerName: 'Test Customer - FieldCost',
        CustomerEmail: 'test@example.com',
        Description: 'Test invoice from FieldCost integration',
        InvoiceNumber: `FC-TEST-${Date.now()}`.substring(0, 16),
        Note: 'This is a test invoice',
        Terms: 'Net 30',
        Currency: 'ZAR',
        Tax: {
          ID: 1,
        },
        LineItems: [
          {
            Description: 'Professional Services',
            Quantity: 1.0,
            UnitAmount: 1000.0,
            TaxID: 1,
          },
          {
            Description: 'Materials & Equipment',
            Quantity: 2.0,
            UnitAmount: 500.0,
            TaxID: 1,
          },
        ],
      };

      console.log(`Creating invoice: ${invoicePayload.InvoiceNumber}`);
      console.log(`   Customer: ${invoicePayload.CustomerName}`);
      console.log(`   Line Items: ${invoicePayload.LineItems.length}`);

      const response = await this.makeRequest('POST', '/Invoice', {
        'Authorization': `Bearer ${this.accessToken}`,
      }, invoicePayload);

      if (response.success) {
        const invoiceId = response.data?.ID || response.data?.invoice_id;
        console.log(`✅ Invoice created successfully`);
        console.log(`   Invoice ID: ${invoiceId}`);
        console.log(`   Response:`, response.data);
        this.testResults.push({ test: 'Create Invoice', passed: true, invoiceId });
        return true;
      } else {
        console.log('❌ Failed to create invoice');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, response.data);
        this.testResults.push({ test: 'Create Invoice', passed: false });
        return false;
      }
    } catch (error) {
      console.log('❌ Error creating invoice:', error.message);
      this.testResults.push({ test: 'Create Invoice', passed: false, error: error.message });
      return false;
    }
  }

  /**
   * Test 5: Get Invoices
   */
  async testGetInvoices() {
    console.log('\n✓ TEST 5: GET INVOICES');
    console.log('-'.repeat(50));

    if (!this.accessToken) {
      console.log('❌ No access token - skipping');
      this.testResults.push({ test: 'Get Invoices', passed: false, error: 'No token' });
      return false;
    }

    try {
      const response = await this.makeRequest('GET', '/Invoice', {
        'Authorization': `Bearer ${this.accessToken}`,
      });

      if (response.success) {
        const invoices = response.data?.Results || [];
        console.log(`✅ Retrieved ${invoices.length} invoice(s)`);
        invoices.slice(0, 5).forEach((inv, idx) => {
          console.log(`   [${idx + 1}] Invoice #${inv.InvoiceNumber} | Amount: ${inv.Total || 'N/A'} | Status: ${inv.Status || 'Unknown'}`);
        });
        if (invoices.length > 5) {
          console.log(`   ... and ${invoices.length - 5} more`);
        }
        this.testResults.push({ test: 'Get Invoices', passed: true, count: invoices.length });
        return true;
      } else {
        console.log('❌ Failed to retrieve invoices');
        console.log(`   Status: ${response.status}`);
        this.testResults.push({ test: 'Get Invoices', passed: false });
        return false;
      }
    } catch (error) {
      console.log('❌ Error retrieving invoices:', error.message);
      this.testResults.push({ test: 'Get Invoices', passed: false, error: error.message });
      return false;
    }
  }

  /**
   * Print Summary Report
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));

    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);

    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.test}`);
      if (result.count !== undefined) {
        console.log(`   Found: ${result.count}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log('-'.repeat(50));
    console.log(`TOTAL: ${passed}/${total} tests passed (${percentage}%)`);
    console.log('='.repeat(50));

    return passed === total;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('\n' + '='.repeat(50));
    console.log('SAGE ONE BCA API INTEGRATION TEST SUITE');
    console.log('='.repeat(50));
    console.log(`Started: ${new Date().toLocaleString()}`);

    const auth = await this.testAuthentication();

    if (!auth) {
      console.log('\n⚠️  Authentication failed - cannot proceed with other tests');
      return this.printSummary();
    }

    await this.testGetCompanies();
    await this.testGetContacts();
    await this.testGetInvoices();
    await this.testCreateInvoice();

    console.log(`\nCompleted: ${new Date().toLocaleString()}`);
    return this.printSummary();
  }
}

// Main execution
async function main() {
  const tester = new SageApiTester('dev@codezap.co.za', 'Dingb@tDing4783');
  const allPassed = await tester.runAllTests();
  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
