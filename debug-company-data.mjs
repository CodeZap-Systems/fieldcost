import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mczpbfnuzsjnpsfntzpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jenBiZm51enNqbnBzZm50enBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxMzk4ODgsImV4cCI6MTczODY3NTg4OH0.p5Qv9y1dZqnQ_r-s6RrK5J9pI4IxWrVLU-uDDlV2qk4"
);

// Check all users and their companies
console.log("=== DEBUGGING COMPANY DATA ===\n");

// Get all users
const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
if (usersError) {
  console.error("Error fetching users:", usersError);
} else {
  console.log("Users in system:");
  users.users.forEach(user => {
    console.log(`  - ${user.email} (ID: ${user.id})`);
  });
}

// Get all companies
const { data: allCompanies, error: companiesError } = await supabase
  .from("company_profiles")
  .select("id, name, user_id, is_demo, created_at")
  .order("id", { ascending: true });

if (companiesError) {
  console.error("Error fetching companies:", companiesError);
} else {
  console.log("\n\nAll companies in database:");
  allCompanies.forEach(c => {
    console.log(`  ID=${c.id}, name="${c.name}", is_demo=${c.is_demo}, user_id=${c.user_id}`);
  });
}

// Specifically check dingani590@gmail.com
console.log("\n\n=== CHECKING dingani590@gmail.com ===");
const { data: dingani590User } = await supabase.auth.admin.listUsers();
const user590 = dingani590User?.users.find(u => u.email === "dingani590@gmail.com");

if (user590) {
  console.log(`User ID: ${user590.id}`);
  console.log(`Email: ${user590.email}`);
  
  // Get their companies
  const { data: user590Companies } = await supabase
    .from("company_profiles")
    .select("id, name, user_id, is_demo, created_at")
    .eq("user_id", user590.id)
    .order("id", { ascending: true });
  
  console.log("\nOwned companies:");
  if (user590Companies?.length) {
    user590Companies.forEach(c => {
      console.log(`  - ID=${c.id}, name="${c.name}", is_demo=${c.is_demo}`);
    });
  } else {
    console.log("  (None found!)");
  }

  // Also get demo companies they can access
  const { data: demoCompanies } = await supabase
    .from("company_profiles")
    .select("id, name, user_id, is_demo")
    .eq("is_demo", true);
  
  console.log("\nDemo companies available:");
  if (demoCompanies?.length) {
    demoCompanies.forEach(c => {
      console.log(`  - ID=${c.id}, name="${c.name}", owned by user=${c.user_id}`);
    });
  }
} else {
  console.log("User not found!");
}

// Also check the other users
console.log("\n\n=== CHECKING dingani@codezap.co.za ===");
const userCodeZap = dingani590User?.users.find(u => u.email === "dingani@codezap.co.za");
if (userCodeZap) {
  console.log(`User ID: ${userCodeZap.id}`);
  const { data: codeZapCompanies } = await supabase
    .from("company_profiles")
    .select("id, name, user_id, is_demo")
    .eq("user_id", userCodeZap.id)
    .order("id", { ascending: true });
  
  console.log("Owned companies:");
  if (codeZapCompanies?.length) {
    codeZapCompanies.forEach(c => {
      console.log(`  - ID=${c.id}, name="${c.name}", is_demo=${c.is_demo}`);
    });
  } else {
    console.log("  (None found!)");
  }
}
