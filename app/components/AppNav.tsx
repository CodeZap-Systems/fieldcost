"use client";
import React, { useState } from "react";
import Link from "next/link";

function SelectableCompanySwitcher({ companies, activeCompanyId, onSwitchCompany }) {
  return (
    <select value={activeCompanyId || ""} onChange={e => onSwitchCompany(e.target.value)}>
      {companies.map(c => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  );
}

export default function AppNav() {
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [companies, setCompanies] = useState([{ id: "1", name: "Demo Company" }]);
  const sections = [
    { label: "Dashboard", links: [{ href: "/dashboard", text: "Dashboard" }] },
    { label: "Items", links: [{ href: "/dashboard/items", text: "Items" }] },
    { label: "Support", links: [
      { href: "/dashboard/support", text: "Log a Support Ticket" },
      { href: "/dashboard/suggestions", text: "Suggestions" },
    ] },
  ];
  function handleCompanySelect(id) { setActiveCompanyId(id); }
  return (
    <nav className="w-64 bg-white border-r h-full flex flex-col" aria-label="Main navigation">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Link href="/" className="text-xl font-bold text-blue-700">YourBrand</Link>
        <SelectableCompanySwitcher companies={companies} activeCompanyId={activeCompanyId} onSwitchCompany={handleCompanySelect} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {sections.map(section => (
          <div key={section.label} className="mb-4">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.label}</div>
            <ul>
              {section.links.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
