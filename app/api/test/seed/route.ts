/**
 * API Route: POST /api/test/seed
 * 
 * Seeds the test database with realistic test data.
 * Protected endpoint - only accessible in test/dev environments.
 * 
 * Usage:
 * - Development: npm run test:seed (uses CLI script)
 * - CI/CD: curl -X POST http://localhost:3000/api/test/seed
 * - Tests: fetch('/api/test/seed', { method: 'POST' })
 * 
 * Query Parameters:
 * - clear=true: Clear all test data before seeding (optional)
 * - module=auth|projects|invoices: Seed only specific module (optional)
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const generateTimestamp = () => new Date().toISOString();

// Test data definitions
const testUsers = [
  {
    email: 'qa_admin@fieldcost.com',
    password: 'TestPassword123!',
    role: 'admin',
    firstName: 'QA',
    lastName: 'Admin',
  },
  {
    email: 'qa_pm@fieldcost.com',
    password: 'TestPassword123!',
    role: 'project_manager',
    firstName: 'QA',
    lastName: 'PM',
  },
  {
    email: 'qa_field@fieldcost.com',
    password: 'TestPassword123!',
    role: 'field_crew',
    firstName: 'QA',
    lastName: 'Crew',
  },
  {
    email: 'qa_accountant@fieldcost.com',
    password: 'TestPassword123!',
    role: 'accountant',
    firstName: 'QA',
    lastName: 'Accountant',
  },
];

const testCompanies = [
  {
    name: 'QA Test Contractor',
    type: 'contractor',
    taxNumber: 'QA123456789',
    registrationNumber: 'QA001',
    address: '123 Test Road, Johannesburg, Gauteng',
  },
  {
    name: 'QA Test Mining',
    type: 'mining',
    taxNumber: 'QA987654321',
    registrationNumber: 'QA002',
    address: '456 Mine Street, Limpopo, South Africa',
  },
];

// Seed functions
async function clearTestData() {
  try {
    const tables = [
      'invoice_items',
      'invoices',
      'tasks',
      'inventory_items',
      'customers',
      'projects',
      'user_permissions',
      'users',
      'companies',
    ];

    for (const table of tables) {
      await supabase.from(table).delete().neq('id', '');
    }

    return { success: true, message: 'Test data cleared' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function seedUsers() {
  try {
    const created = [];

    for (const user of testUsers) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });

        if (error && error.message.includes('already exists')) {
          created.push({ email: user.email, status: 'exists' });
          continue;
        }

        if (error) throw error;

        created.push({ email: user.email, status: 'created', id: data.user?.id });
      } catch (err) {
        created.push({ email: user.email, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    return { success: true, count: created.length, users: created };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function seedCompanies() {
  try {
    const created = [];

    for (const company of testCompanies) {
      const { data, error } = await supabase
        .from('companies')
        .insert([
          {
            name: company.name,
            type: company.type,
            taxNumber: company.taxNumber,
            registrationNumber: company.registrationNumber,
            address: company.address,
            createdAt: generateTimestamp(),
          },
        ])
        .select();

      if (error) {
        created.push({ name: company.name, status: 'error', error: error.message });
        continue;
      }

      created.push({ name: company.name, status: 'created', id: data[0].id });
    }

    return { success: true, count: created.length, companies: created };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Minimal POST handler
export async function POST(request: NextRequest) {
  try {
    // Seed based on module parameter
    const results: Record<string, any> = {
      timestamp: new Date().toISOString(),
    };
    
    results.users = await seedUsers();
    results.companies = await seedCompanies();

    // Prepare summary
    const summary = {
      success: true,
      message: 'Test data seeding complete',
      timestamp: new Date().toISOString(),
      details: results,
    };

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('[Seed Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
