import { SageOneApiClient } from "./lib/sageOneApiClient.ts";

async function testSageIntegration() {
  console.log("🔐 Testing Sage One API Integration...\n");

  const apiToken = "8C399659-628C-4EB2-A5D1-B76637E2B7F8";
  const username = "dev@codezap.co.za";
  const password = "Dingb@tDing4783";
  const apiUrl = "https://resellers.accounting.sageone.co.za/api/2.0.0";

  try {
    //Initialize client
    const client = new SageOneApiClient(username, password, apiToken, apiUrl);

    // Test authentication
    console.log("1️⃣  Testing Authentication...");
    const authSuccess = await client.authenticate();
    if (!authSuccess) {
      console.error("❌ Authentication failed!");
      return;
    }
    console.log("✅ Authentication successful!\n");

    // Get current company
    console.log("2️⃣  Fetching Current Company...");
    const company = await client.getCurrentCompany();
    if (company.success) {
      console.log("✅ Company:", company.data);
      console.log();
    } else {
      console.error("❌ Failed to get company:", company.error);
    }

    // Get customers
    console.log("3️⃣  Fetching Customers/Contacts...");
    const customers = await client.getContacts();
    if (customers.success) {
      console.log(`✅ Found ${customers.data?.length || 0} customers`);
      if (customers.data && customers.data.length > 0) {
        console.log("Sample:", customers.data[0]);
      }
      console.log();
    } else {
      console.error("❌ Failed to get customers:", customers.error);
    }

    // Get items
    console.log("4️⃣  Fetching Items/Stock...");
    const items = await client.getItems();
    if (items.success) {
      console.log(`✅ Found ${items.data?.length || 0} items`);
      if (items.data && items.data.length > 0) {
        console.log("Sample:", items.data[0]);
      }
      console.log();
    } else {
      console.error("❌ Failed to get items:", items.error);
    }

    console.log("✅ All Sage API integration tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSageIntegration();
