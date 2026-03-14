import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseKey = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('🔍 Checking data in database...\n');

  // Check items
  const { data: items, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('company_id', 8);
  console.log('Items:', items?.length || 0, itemError ? `ERROR: ${itemError.message}` : 'OK');

  // Check projects
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('company_id', 8);
  console.log('Projects:', projects?.length || 0, projectError ? `ERROR: ${projectError.message}` : 'OK');

  // Check customers
  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('company_id', 8);
  console.log('Customers:', customers?.length || 0, customerError ? `ERROR: ${customerError.message}` : 'OK');

  // Check tasks
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('company_id', 8);
  console.log('Tasks:', tasks?.length || 0, taskError ? `ERROR: ${taskError.message}` : 'OK');

  // Check invoices
  const { data: invoices, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('company_id', 8);
  console.log('Invoices:', invoices?.length || 0, invoiceError ? `ERROR: ${invoiceError.message}` : 'OK');

  // Check quotes
  const { data: quotes, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('company_id', 8);
  console.log('Quotes:', quotes?.length || 0, quoteError ? `ERROR: ${quoteError.message}` : 'OK');

  // Check orders
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('company_id', 8);
  console.log('Orders:', orders?.length || 0, orderError ? `ERROR: ${orderError.message}` : 'OK');

  // Check company_profiles
  const { data: companies, error: companyError } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('id', 8);
  console.log('\nCompany 8 exists?', companies?.length > 0, companyError ? `ERROR: ${companyError.message}` : '');
  if (companies?.[0]) {
    console.log('Company:', companies[0].name);
  }
}

checkData().catch(console.error);
