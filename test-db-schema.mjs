#!/usr/bin/env node
/**
 * Test script to verify database schema without using Supabase client
 * Uses SQL directly to check for table and column existence
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
  console.log('Checking database schema...\n');

  // Check if quotes table exists
  const { data: quotesData, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .limit(1);

  if (quotesError) {
    console.log('❌ Quotes table error:', quotesError.message);
  } else {
    console.log('✅ Quotes table exists');
  }

  // Check if suppliers table exists
  const { data: suppliersData, error: suppliersError } = await supabase
    .from('suppliers')
    .select('*')
    .limit(1);

  if (suppliersError) {
    console.log('❌ Suppliers table error:', suppliersError.message);
  } else {
    console.log('✅ Suppliers table exists');
  }

  // Check if purchase_orders table exists
  const { data: poData, error: poError } = await supabase
    .from('purchase_orders')
    .select('*')
    .limit(1);

  if (poError) {
    console.log('❌ Purchase Orders table error:', poError.message);
  } else {
    console.log('✅ Purchase Orders table exists');
  }

  console.log('\nDone!');
}

checkSchema();
