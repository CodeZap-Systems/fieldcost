import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseKey = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirect() {
  console.log('🧪 Testing Supabase query directly...\n');

  // Test with service role key (should bypass RLS)
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('company_id', 8);
    
    if (error) {
      console.error('❌ Error:', error.message, error.code, error.details);
    } else {
      console.log('✅ Success! Found', data.length, 'quotes');
      if (data.length > 0) {
        console.log('First quote:', data[0]);
      }
    }
  } catch (e) {
    console.error('❌ Exception:', e.message);
  }

  // Test orders
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('company_id', 8);
    
    if (error) {
      console.error('❌ Orders error:', error.message);
    } else {
      console.log('✅ Orders found:', data.length);
    }
  } catch (e) {
    console.error('❌ Orders exception:', e.message);
  }
}

testDirect().catch(console.error);
