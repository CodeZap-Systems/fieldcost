#!/usr/bin/env node
/**
 * Production Data Cleanup Script
 * Removes duplicate items, customers, projects, and invoices
 * 
 * CRITICAL: Run this only on DEVELOPMENT or STAGING first!
 * Usage: node scripts/cleanup-duplicates.mjs --production
 */

import { createClient } from '@supabase/supabase-js';
import process from 'process';

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const isProd = process.argv.includes('--production');
const isDryRun = process.argv.includes('--dry-run') || !isProd;

console.log(`
🧹 FieldCost Production Data Cleanup
====================================
Mode: ${isDryRun ? '🔍 DRY RUN (no changes)' : '⚡ PRODUCTION (destructive)'}
Timestamp: ${new Date().toISOString()}
`);

if (!isProd) {
  console.warn(`⚠️  DRY RUN MODE: No data will be deleted. Run with --production to execute.`);
}

async function cleanupDuplicates() {
  try {
    // 1. IDENTIFY DUPLICATE ITEMS
    console.log('\n📦 Analyzing duplicate items...');
    const { data: itemDuplicates, error: itemsError } = await supabase
      .rpc('get_duplicate_items');

    if (itemsError) {
      console.error('Could not get duplicate items:', itemsError.message);
      // Fallback: query directly
      const { data: items } = await supabase.from('items').select('id, name, company_id, created_at');
      const itemMap = new Map();
      const duplicateItemIds = [];
      
      items?.forEach(item => {
        const key = `${item.company_id}-${item.name.toLowerCase()}`;
        if (!itemMap.has(key)) {
          itemMap.set(key, item.id);
        } else {
          duplicateItemIds.push(item.id);
        }
      });

      if (duplicateItemIds.length > 0) {
        console.log(`Found ${duplicateItemIds.length} duplicate items to remove`);
        if (!isDryRun) {
          const { error } = await supabase
            .from('items')
            .delete()
            .in('id', duplicateItemIds);
          
          if (error) {
            console.error('❌ Error deleting duplicate items:', error.message);
          } else {
            console.log(`✅ Deleted ${duplicateItemIds.length} duplicate items`);
          }
        }
      } else {
        console.log('✅ No duplicate items found');
      }
    }

    // 2. IDENTIFY DUPLICATE CUSTOMERS
    console.log('\n👥 Analyzing duplicate customers...');
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name, email, company_id, created_at')
      .order('company_id')
      .order('created_at');

    const customerMap = new Map();
    const duplicateCustomerIds = [];

    customers?.forEach(customer => {
      const key = `${customer.company_id}-${customer.name.toLowerCase()}`;
      if (!customerMap.has(key)) {
        customerMap.set(key, customer.id);
      } else {
        duplicateCustomerIds.push(customer.id);
      }
    });

    if (duplicateCustomerIds.length > 0) {
      console.log(`Found ${duplicateCustomerIds.length} duplicate customers to remove`);
      if (!isDryRun) {
        const { error } = await supabase
          .from('customers')
          .delete()
          .in('id', duplicateCustomerIds);
        
        if (error) {
          console.error('❌ Error deleting duplicate customers:', error.message);
        } else {
          console.log(`✅ Deleted ${duplicateCustomerIds.length} duplicate customers`);
        }
      }
    } else {
      console.log('✅ No duplicate customers found');
    }

    // 3. IDENTIFY DUPLICATE PROJECTS
    console.log('\n🏗️  Analyzing duplicate projects...');
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, company_id, created_at')
      .order('company_id')
      .order('created_at');

    const projectMap = new Map();
    const duplicateProjectIds = [];

    projects?.forEach(project => {
      const key = `${project.company_id}-${project.name.toLowerCase()}`;
      if (!projectMap.has(key)) {
        projectMap.set(key, project.id);
      } else {
        duplicateProjectIds.push(project.id);
      }
    });

    if (duplicateProjectIds.length > 0) {
      console.log(`Found ${duplicateProjectIds.length} duplicate projects to remove`);
      if (!isDryRun) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .in('id', duplicateProjectIds);
        
        if (error) {
          console.error('❌ Error deleting duplicate projects:', error.message);
        } else {
          console.log(`✅ Deleted ${duplicateProjectIds.length} duplicate projects`);
        }
      }
    } else {
      console.log('✅ No duplicate projects found');
    }

    // 4. IDENTIFY DUPLICATE INVOICES
    console.log('\n📋 Analyzing duplicate invoices...');
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, invoice_number, customer_id, company_id, created_at')
      .order('company_id')
      .order('created_at');

    const invoiceMap = new Map();
    const duplicateInvoiceIds = [];

    invoices?.forEach(invoice => {
      const key = `${invoice.company_id}-${invoice.invoice_number || 'UNNUMBERED_' + invoice.customer_id}`;
      if (!invoiceMap.has(key)) {
        invoiceMap.set(key, invoice.id);
      } else {
        duplicateInvoiceIds.push(invoice.id);
      }
    });

    if (duplicateInvoiceIds.length > 0) {
      console.log(`Found ${duplicateInvoiceIds.length} duplicate invoices to remove`);
      if (!isDryRun) {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .in('id', duplicateInvoiceIds);
        
        if (error) {
          console.error('❌ Error deleting duplicate invoices:', error.message);
        } else {
          console.log(`✅ Deleted ${duplicateInvoiceIds.length} duplicate invoices`);
        }
      }
    } else {
      console.log('✅ No duplicate invoices found');
    }

    // SUMMARY
    console.log(`
🎯 CLEANUP SUMMARY
==================
Items: ${duplicateItemIds?.length || 0} duplicates
Customers: ${duplicateCustomerIds.length} duplicates
Projects: ${duplicateProjectIds.length} duplicates
Invoices: ${duplicateInvoiceIds.length} duplicates
Total: ${(duplicateItemIds?.length || 0) + duplicateCustomerIds.length + duplicateProjectIds.length + duplicateInvoiceIds.length} duplicates
${isDryRun ? '🔍 DRY RUN - No data was deleted' : '✅ CLEANUP COMPLETE'}
`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupDuplicates().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
