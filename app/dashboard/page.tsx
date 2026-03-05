import React from "react";
import Link from "next/link";
import { DashboardWithBanner } from "./dashboard-client";

const summaryCards = [
  { label: "Active Projects", value: "3", description: "Limited MVP tier" },
  { label: "Open Tasks", value: "12", description: "Across all crews" },
  { label: "Outstanding Invoices", value: "R82 500", description: "Due in next 30 days" },
  { label: "Budget vs Actual", value: "92%", description: "On target" },
];

const recentActivity = [
  { title: "Invoice #FC-104 sent", detail: "R18 200 • emailed to Sakhile Projects" },
  { title: "Project photo uploaded", detail: "Jeppestown Roadworks" },
  { title: "Task completed", detail: "Pour concrete — Crew B" },
  { title: "New customer added", detail: "Ubuntu Housing Co-op" },
];

const workSchedule = [
  { task: "Concrete pour", project: "CBD Parkade", status: "09:00 - 11:30" },
  { task: "Site inspection", project: "Riverbend Estate", status: "13:00 - 14:00" },
  { task: "Crew briefing", project: "All sites", status: "16:00 - 16:30" },
];

const invoiceSnapshot = [
  { number: "FC-104", customer: "Sakhile Projects", amount: "R18 200", status: "Sent" },
  { number: "FC-103", customer: "Ubuntu Housing", amount: "R42 300", status: "Awaiting" },
  { number: "FC-102", customer: "Nthando Builds", amount: "R22 000", status: "Paid" },
];

export default function DashboardHome() {
  const dashboardContent = (
    <main className="bg-[#f7f5f2] min-h-screen p-6 md:p-10">
      <header className="mb-10">
        <p className="uppercase text-xs tracking-[0.3em] text-gray-500">FieldCost overview</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">Today&apos;s company pulse</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Quick snapshot of live projects, crews, billing and cashflow. Mirrors a clean financial workspace so you can stay on top of the
          numbers without digging through screens.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {summaryCards.map(card => (
          <article key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm uppercase tracking-wide text-gray-500">{card.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-3">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col">
          <header className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Work schedule</p>
              <h2 className="text-xl font-semibold text-gray-900">Crew lineup for today</h2>
            </div>
            <Link href="/dashboard/tasks" className="text-sm text-indigo-600 font-medium">
              View tasks
            </Link>
          </header>
          <ul className="space-y-3">
            {workSchedule.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{item.task}</p>
                  <p className="text-sm text-gray-500">{item.project}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent activity</p>
            <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
          </header>
          <ul className="space-y-4">
            {recentActivity.map((item, idx) => (
              <li key={idx} className="border-l-2 border-indigo-200 pl-4">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 mt-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <header className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Invoices</p>
              <h2 className="text-xl font-semibold text-gray-900">Cash coming in</h2>
            </div>
            <Link href="/dashboard/invoices" className="text-sm text-indigo-600 font-medium">
              Create invoice
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="text-left py-2">Number</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoiceSnapshot.map(invoice => (
                  <tr key={invoice.number} className="border-t border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{invoice.number}</td>
                    <td className="py-3 text-gray-600">{invoice.customer}</td>
                    <td className="py-3 font-semibold text-gray-900">{invoice.amount}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${invoice.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Project notes</p>
            <h2 className="text-xl font-semibold text-gray-900">Field updates</h2>
          </header>
          <div className="space-y-4 text-sm text-gray-600">
            <p>• Crew A completed formwork at CBD Parkade and is ready for inspection.</p>
            <p>• Suppliers delivered rebar for Jeppestown Roadworks at 07:15.</p>
            <p>• Demo customer account still active — switch to live account when ready.</p>
            <p>• Reminder: Tier 1 allows a maximum of six projects; archive older jobs once invoiced.</p>
          </div>
        </article>
      </section>
    </main>
  );

  return <DashboardWithBanner>{dashboardContent}</DashboardWithBanner>;
}
