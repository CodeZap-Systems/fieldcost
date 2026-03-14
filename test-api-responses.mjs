/**
 * Test API responses for each user to see what companies are returned
 * Run this from browser console or Node after authenticating with each email
 */

// This shows what the API returns - check the server logs
console.log("Testing /api/companies endpoint...");

// When user logs in, the app calls GET /api/company and GET /api/companies
// Let's trace what each returns

const testAPICalls = async () => {
  console.log("\n=== Testing /api/company ===");
  try {
    const res1 = await fetch("/api/company");
    const data1 = await res1.json();
    console.log("GET /api/company response:", data1);
    console.log("Active company:", data1.company);
    console.log("All companies:", data1.companies);
  } catch (e) {
    console.error("Error calling /api/company:", e);
  }

  console.log("\n=== Testing /api/companies ===");
  try {
    const res2 = await fetch("/api/companies");
    const data2 = await res2.json();
    console.log("GET /api/companies response:", data2);
  } catch (e) {
    console.error("Error calling /api/companies:", e);
  }
};

// Run tests
testAPICalls();

console.log("\nCheck server logs for detailed output of what's returned");
