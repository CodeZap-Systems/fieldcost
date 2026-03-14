'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { persistActiveCompanyId, readActiveCompanyId } from '@/lib/companySwitcher';

interface Company {
  id: string;
  name: string;
}

/**
 * Tier 1 Dashboard (MVP)
 * Shows: Projects, Invoices, Customers, Tasks, Items
 * LIVE DATA - refreshes when company changes
 */
export function Tier1Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>('');
  const [stats, setStats] = useState({
    projects: 0,
    invoices: 0,
    customers: 0,
    tasks: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);

  // LOAD COMPANIES ON MOUNT
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        console.log('Loading companies...');
        const response = await fetch('/api/companies');
        if (response.ok) {
          const data = await response.json();
          console.log('Companies loaded:', data);
          
          let companiesList = Array.isArray(data) ? data : data.companies || [];
          
          // FILTER: Keep demo companies + user's own companies (exclude Test Company 2)
          companiesList = companiesList.filter(
            (c) => c.is_demo === true || !c.name?.includes("Test Company")
          );
          
          setCompanies(companiesList);
          
          // Determine which company to select
          let selectedId = null;
          // Check localStorage for previously selected company using correct key
          if (typeof window !== 'undefined') {
            const saved = readActiveCompanyId();
            if (saved && companiesList.some(c => String(c.id) === saved)) {
              selectedId = saved;
              console.log('Using saved company from localStorage:', selectedId);
            }
          }
          
          // If no saved company, prefer LIVE (non-demo) companies
          if (!selectedId) {
            const liveCompany = companiesList.find(c => c.is_demo !== true);
            if (liveCompany) {
              selectedId = liveCompany.id;
              console.log('Preferring Live Company:', selectedId);
            }
          }
          
          // Only if no live companies, use demo company
          if (!selectedId) {
            const demoCompany = companiesList.find(c => c.is_demo === true);
            if (demoCompany) {
              selectedId = demoCompany.id;
              console.log('No live companies, using Demo Company:', selectedId);
            }
          }
          
          // Fall back to first company
          if (!selectedId && companiesList.length > 0) {
            selectedId = companiesList[0].id;
            console.log('Falling back to first company:', selectedId);
          }
          
          if (selectedId) {
            setActiveCompanyId(selectedId);
          }
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };
    loadCompanies();
  }, []);

  // LOAD DATA WHEN COMPANY CHANGES
  useEffect(() => {
    if (!activeCompanyId) return;

    const loadData = async () => {
      setLoading(true);
      console.log('Loading data for company:', activeCompanyId);
      
      try {
        const [projectsRes, invoicesRes, customersRes, tasksRes, itemsRes] = await Promise.all([
          fetch(`/api/projects?company_id=${activeCompanyId}`),
          fetch(`/api/invoices?company_id=${activeCompanyId}`),
          fetch(`/api/customers?company_id=${activeCompanyId}`),
          fetch(`/api/tasks?company_id=${activeCompanyId}`),
          fetch(`/api/items?company_id=${activeCompanyId}`),
        ]);

        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const invoices = invoicesRes.ok ? await invoicesRes.json() : [];
        const customers = customersRes.ok ? await customersRes.json() : [];
        const tasks = tasksRes.ok ? await tasksRes.json() : [];
        const items = itemsRes.ok ? await itemsRes.json() : [];

        const newStats = {
          projects: Array.isArray(projects) ? projects.length : 0,
          invoices: Array.isArray(invoices) ? invoices.length : 0,
          customers: Array.isArray(customers) ? customers.length : 0,
          tasks: Array.isArray(tasks) ? tasks.length : 0,
          items: Array.isArray(items) ? items.length : 0,
        };
        
        console.log('Data loaded:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeCompanyId]);

  const handleCompanyChange = (newCompanyId: string) => {
    console.log('Company changed to:', newCompanyId);
    setActiveCompanyId(newCompanyId);
    // Persist to localStorage so sidebar stays in sync
    persistActiveCompanyId(newCompanyId);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* COMPANY SELECTOR - AT TOP */}
      {companies.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            📍 Select Company
          </label>
          <select
            value={activeCompanyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* DASHBOARD TITLE */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tier 1: MVP - Real-time business overview</p>
      </div>

      {/* DATA CARDS - 5 COLUMNS */}
      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {/* Projects Card */}
          <Link
            href="/dashboard/projects"
            className="bg-white rounded-lg border-2 border-blue-200 p-6 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-medium text-gray-600">Projects</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.projects}</p>
          </Link>

          {/* Invoices Card */}
          <Link
            href="/dashboard/invoices"
            className="bg-white rounded-lg border-2 border-green-200 p-6 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">💰</div>
            <p className="text-sm font-medium text-gray-600">Invoices</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.invoices}</p>
          </Link>

          {/* Customers Card */}
          <Link
            href="/dashboard/customers"
            className="bg-white rounded-lg border-2 border-purple-200 p-6 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">👥</div>
            <p className="text-sm font-medium text-gray-600">Customers</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.customers}</p>
          </Link>

          {/* Tasks Card */}
          <Link
            href="/dashboard/tasks"
            className="bg-white rounded-lg border-2 border-orange-200 p-6 hover:shadow-lg hover:border-orange-400 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">✓</div>
            <p className="text-sm font-medium text-gray-600">Tasks</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.tasks}</p>
          </Link>

          {/* Items Card */}
          <Link
            href="/dashboard/items"
            className="bg-white rounded-lg border-2 border-red-200 p-6 hover:shadow-lg hover:border-red-400 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm font-medium text-gray-600">Items</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.items}</p>
          </Link>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-5 gap-3">
          <Link href="/dashboard/projects/add" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center transition">
            + New Project
          </Link>
          <Link href="/dashboard/invoices/add" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium text-center transition">
            + New Invoice
          </Link>
          <Link href="/dashboard/customers/add" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium text-center transition">
            + New Customer
          </Link>
          <Link href="/dashboard/tasks/add" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium text-center transition">
            + New Task
          </Link>
          <Link href="/dashboard/items/add" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium text-center transition">
            + New Item
          </Link>
        </div>
      </div>

      {/* TIER SELECTOR */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-3">Switch dashboard tier:</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem('selectedTier', 'tier1');
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
          >
            Tier 1 (MVP)
          </button>
          <button
            onClick={() => {
              localStorage.setItem('selectedTier', 'tier2');
              window.location.reload();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Tier 2 (Growth)
          </button>
          <button
            onClick={() => {
              localStorage.setItem('selectedTier', 'tier3');
              window.location.reload();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Tier 3 (Enterprise)
          </button>
        </div>
      </div>
    </div>
  );
}
