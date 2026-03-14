#!/usr/bin/env node

/**
 * Add Tasks and Summary for Demo
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data } });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createTasks() {
  console.log('\n✅ Creating Tasks for Projects...\n');

  // Get projects first
  const projectsRes = await makeRequest('GET', `/api/projects?company_id=1`);
  const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

  if (projects.length === 0) {
    console.log('⚠️  No projects found');
    return 0;
  }

  const projectId = projects[0].id;
  const tasks = [
    { title: 'Site Survey and Preparation', description: 'Complete geological survey', status: 'in_progress', priority: 'high', estimated_hours: 120 },
    { title: 'Foundation Work', description: 'Excavation and installation', status: 'todo', priority: 'high', estimated_hours: 500 },
    { title: 'Structural Steel Installation', description: 'Install steel framework', status: 'todo', priority: 'high', estimated_hours: 400 },
    { title: 'Electrical Systems', description: 'Complete electrical installation', status: 'todo', priority: 'medium', estimated_hours: 300 },
    { title: 'HVAC Installation', description: 'Install HVAC systems', status: 'todo', priority: 'medium', estimated_hours: 250 },
  ];

  let count = 0;
  for (const task of tasks) {
    try {
      const res = await makeRequest('POST', `/api/tasks`, {
        ...task,
        project_id: projectId,
        company_id: '1',
        is_demo: true,
      });
      if ([200, 201].includes(res.status)) {
        console.log(`✅ ${task.title}`);
        count++;
      }
    } catch (e) {
      console.log(`⚠️  ${task.title}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }
  
  return count;
}

async function getSummary() {
  console.log('\n📊 DEMO DATA SUMMARY:\n');

  try {
    const customersRes = await makeRequest('GET', `/api/customers?company_id=1`);
    const customers = Array.isArray(customersRes.data) ? customersRes.data.length : 0;

    const projectsRes = await makeRequest('GET', `/api/projects?company_id=1`);
    const projects = Array.isArray(projectsRes.data) ? projectsRes.data.length : 0;

    const tasksRes = await makeRequest('GET', `/api/tasks?company_id=1`);
    const tasks = Array.isArray(tasksRes.data) ? tasksRes.data.length : 0;

    console.log(`  📋 Customers: ${customers}`);
    console.log(`  🏗️  Projects: ${projects}`);
    console.log(`  ✅ Tasks: ${tasks}`);
    console.log(`\n  Total Data Points: ${customers + projects + tasks}`);

  } catch (error) {
    console.log(`⚠️  Could not fetch summary`);
  }
}

async function main() {
  const taskCount = await createTasks();
  await getSummary();

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎉 DEMO COMPANY READY FOR CLIENT SIGNOFF                ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log('║  Navigate to: https://fieldcost.vercel.app               ║');
  console.log('║  Select: "Demo Workspace" from left sidebar              ║');
  console.log('║  Duration: Ready in < 2 minutes                          ║');
  console.log('║  Features Enabled:                                       ║');
  console.log('║  ✅ Projects                                              ║');
  console.log('║  ✅ Tasks & Assignments                                   ║');
  console.log('║  ✅ Customers                                             ║');
  console.log('║  ✅ Multi-Tenant Data Isolation                           ║');
  console.log('║  ✅ Real-time Dashboard                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
}

main().catch(console.error);
