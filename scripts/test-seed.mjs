#!/usr/bin/env node

/**
 * Test Data Seeder for FieldCost
 * Populates test database with realistic test data for automated testing
 * 
 * Usage: npm run test:seed
 * Environment: NODE_ENV=test DATABASE_URL=postgresql://...
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test data generators
const generateUserId = () => Math.random().toString(36).substring(2, 15);
const generateCompanyId = () => Math.random().toString(36).substring(2, 15);
const generateProjectId = () => Math.random().toString(36).substring(2, 15);
const generateTimestamp = () => new Date().toISOString();

// Test users
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

// Test companies
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

// Test projects
const generateProjects = (companyId) => [
  {
    name: 'QA Test Project - Phase 1',
    description: 'Test project for QA automation',
    companyId,
    status: 'active',
    budget: 50000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    name: 'QA Test Project - Phase 2',
    description: 'Test project phase 2',
    companyId,
    status: 'planning',
    budget: 75000,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
];

// Test invoices
const generateInvoices = (projectId) => [
  {
    projectId,
    invoiceNumber: `QA-INV-${Date.now()}-001`,
    status: 'draft',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        description: 'Labor - Day 1',
        quantity: 8,
        unitPrice: 150,
        amount: 1200,
      },
      {
        description: 'Materials - Steel',
        quantity: 100,
        unitPrice: 50,
        amount: 5000,
      },
    ],
  },
  {
    projectId,
    invoiceNumber: `QA-INV-${Date.now()}-002`,
    status: 'sent',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        description: 'Equipment Rental',
        quantity: 5,
        unitPrice: 500,
        amount: 2500,
      },
    ],
  },
];

// Test tasks
const generateTasks = (projectId) => [
  {
    projectId,
    title: 'QA Foundation Setup',
    description: 'Set up foundation for test project',
    status: 'todo',
    priority: 'high',
    assignedTo: null,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    projectId,
    title: 'QA Structural Work',
    description: 'Complete structural testing',
    status: 'in_progress',
    priority: 'high',
    assignedTo: null,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    projectId,
    title: 'QA Finishing',
    description: 'Final touches and QA inspection',
    status: 'todo',
    priority: 'medium',
    assignedTo: null,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
];

// Test customers
const generateCustomers = (companyId) => [
  {
    companyId,
    name: 'QA Test Customer A',
    email: 'customer-a@qatest.com',
    phone: '+27 (0)11 123 4567',
    address: '789 Customer Street, Cape Town',
  },
  {
    companyId,
    name: 'QA Test Customer B',
    email: 'customer-b@qatest.com',
    phone: '+27 (0)21 987 6543',
    address: '321 Business Road, Durban',
  },
];

// Test inventory items
const generateInventoryItems = (companyId) => [
  {
    companyId,
    name: 'Steel Beam - 10m',
    sku: 'QA-STEEL-10M-001',
    category: 'materials',
    quantity: 50,
    lowStockThreshold: 10,
    unitCost: 500,
    sellingPrice: 600,
  },
  {
    companyId,
    name: 'Concrete Mix - Bag',
    sku: 'QA-CONCRETE-BAG-001',
    category: 'materials',
    quantity: 200,
    lowStockThreshold: 50,
    unitCost: 60,
    sellingPrice: 75,
  },
  {
    companyId,
    name: 'Safety Helmet - Orange',
    sku: 'QA-HELMET-ORG-001',
    category: 'safety',
    quantity: 15,
    lowStockThreshold: 5,
    unitCost: 120,
    sellingPrice: 150,
  },
];

/**
 * Clear all test data
 */
async function clearTestData() {
  console.log('🗑️  Clearing existing test data...');
  
  try {
    // Delete in order of dependencies
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
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', ''); // Delete all rows

      if (error && error.code !== 'PGRST116') {
        console.warn(`⚠️  Warning clearing ${table}:`, error.message);
      }
    }

    console.log('✅ Test data cleared');
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  }
}

/**
 * Seed users
 */
async function seedUsers() {
  console.log('👥 Seeding test users...');

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        console.warn(`⚠️  User ${user.email} already exists`);
        continue;
      }

      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }
}

/**
 * Seed companies
 */
async function seedCompanies() {
  console.log('🏢 Seeding test companies...');

  const companies = [];

  for (const company of testCompanies) {
    try {
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
        console.error(`❌ Error creating company ${company.name}:`, error.message);
        continue;
      }

      companies.push(data[0]);
      console.log(`✅ Created company: ${company.name} (ID: ${data[0].id})`);
    } catch (error) {
      console.error(`❌ Error creating company ${company.name}:`, error.message);
    }
  }

  return companies;
}

/**
 * Seed projects
 */
async function seedProjects(companies) {
  console.log('📋 Seeding test projects...');

  const projects = [];

  for (const company of companies) {
    const projectData = generateProjects(company.id);

    for (const project of projectData) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([
            {
              ...project,
              createdAt: generateTimestamp(),
            },
          ])
          .select();

        if (error) {
          console.error(`❌ Error creating project ${project.name}:`, error.message);
          continue;
        }

        projects.push(data[0]);
        console.log(`✅ Created project: ${project.name}`);
      } catch (error) {
        console.error(`❌ Error creating project ${project.name}:`, error.message);
      }
    }
  }

  return projects;
}

/**
 * Seed invoices
 */
async function seedInvoices(projects) {
  console.log('💰 Seeding test invoices...');

  for (const project of projects) {
    const invoiceData = generateInvoices(project.id);

    for (const invoice of invoiceData) {
      try {
        const calculateTotals = (items) => {
          const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
          const tax = subtotal * 0.15; // 15% VAT
          const total = subtotal + tax;
          return { subtotal, tax, total };
        };

        const totals = calculateTotals(invoice.items);

        const { data, error } = await supabase
          .from('invoices')
          .insert([
            {
              projectId: invoice.projectId,
              invoiceNumber: invoice.invoiceNumber,
              status: invoice.status,
              dueDate: invoice.dueDate,
              subtotal: totals.subtotal,
              tax: totals.tax,
              total: totals.total,
              createdAt: generateTimestamp(),
            },
          ])
          .select();

        if (error) {
          console.error(`❌ Error creating invoice ${invoice.invoiceNumber}:`, error.message);
          continue;
        }

        const invoiceId = data[0].id;

        // Insert invoice items
        for (const item of invoice.items) {
          const { error: itemError } = await supabase
            .from('invoice_items')
            .insert([
              {
                invoiceId,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
              },
            ]);

          if (itemError) {
            console.error(`❌ Error creating invoice item:`, itemError.message);
          }
        }

        console.log(`✅ Created invoice: ${invoice.invoiceNumber}`);
      } catch (error) {
        console.error(`❌ Error creating invoice ${invoice.invoiceNumber}:`, error.message);
      }
    }
  }
}

/**
 * Seed tasks
 */
async function seedTasks(projects) {
  console.log('✓ Seeding test tasks...');

  for (const project of projects) {
    const taskData = generateTasks(project.id);

    for (const task of taskData) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([
            {
              ...task,
              createdAt: generateTimestamp(),
            },
          ])
          .select();

        if (error) {
          console.error(`❌ Error creating task ${task.title}:`, error.message);
          continue;
        }

        console.log(`✅ Created task: ${task.title}`);
      } catch (error) {
        console.error(`❌ Error creating task ${task.title}:`, error.message);
      }
    }
  }
}

/**
 * Seed customers
 */
async function seedCustomers(companies) {
  console.log('👤 Seeding test customers...');

  for (const company of companies) {
    const customerData = generateCustomers(company.id);

    for (const customer of customerData) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([
            {
              ...customer,
              createdAt: generateTimestamp(),
            },
          ])
          .select();

        if (error) {
          console.error(`❌ Error creating customer ${customer.name}:`, error.message);
          continue;
        }

        console.log(`✅ Created customer: ${customer.name}`);
      } catch (error) {
        console.error(`❌ Error creating customer ${customer.name}:`, error.message);
      }
    }
  }
}

/**
 * Seed inventory items
 */
async function seedInventory(companies) {
  console.log('📦 Seeding test inventory...');

  for (const company of companies) {
    const inventoryData = generateInventoryItems(company.id);

    for (const item of inventoryData) {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .insert([
            {
              ...item,
              createdAt: generateTimestamp(),
            },
          ])
          .select();

        if (error) {
          console.error(`❌ Error creating inventory item ${item.name}:`, error.message);
          continue;
        }

        console.log(`✅ Created inventory item: ${item.name}`);
      } catch (error) {
        console.error(`❌ Error creating inventory item ${item.name}:`, error.message);
      }
    }
  }
}

/**
 * Main seed function
 */
async function main() {
  console.log('\n🌱 FieldCost Test Data Seeder\n');
  console.log('═'.repeat(50));

  try {
    // Optionally clear existing data
    if (process.argv.includes('--clear')) {
      await clearTestData();
    }

    // Seed data in order of dependencies
    await seedUsers();
    const companies = await seedCompanies();
    const projects = await seedProjects(companies);
    
    await Promise.all([
      seedInvoices(projects),
      seedTasks(projects),
      seedCustomers(companies),
      seedInventory(companies),
    ]);

    console.log('\n' + '═'.repeat(50));
    console.log('\n✅ Test data seeding complete!\n');
    console.log('Test Credentials:');
    console.log('  Admin:      qa_admin@fieldcost.com / TestPassword123!');
    console.log('  PM:         qa_pm@fieldcost.com / TestPassword123!');
    console.log('  Field:      qa_field@fieldcost.com / TestPassword123!');
    console.log('  Accountant: qa_accountant@fieldcost.com / TestPassword123!\n');
    console.log('Ready for testing! Run: npm test\n');
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run seeder
main();
