/**
 * ADMIN CMS - Analytics & Reporting Page
 * 
 * View subscription metrics, revenue trends, and customer analytics
 */

"use client";

import React, { useState, useEffect } from "react";

interface AnalyticsData {
  mrr: number;
  arr: number;
  churn_rate: number;
  subscription_growth: Array<{ month: string; subscriptions: number }>;
  revenue_trend: Array<{ month: string; mrr: number; arr: number }>;
  customer_breakdown: Array<{ tier: string; count: number; mrr: number }>;
  cohort_retention: Record<string, number>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("12m"); // 12 months

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  async function fetchAnalytics() {
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await res.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center text-gray-400">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
            <p className="text-gray-400">
              Subscription metrics and business insights
            </p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Monthly Recurring Revenue</p>
            <p className="text-3xl font-bold text-green-400">
              R{analytics.mrr.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Recurring monthly revenue</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Annual Run Rate</p>
            <p className="text-3xl font-bold text-blue-400">
              R{analytics.arr.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">12-month projection</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Churn Rate</p>
            <p className="text-3xl font-bold">
              {analytics.churn_rate.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-2">Monthly churn</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Customer LTV</p>
            <p className="text-3xl font-bold text-purple-400">
              R{analytics.arr && analytics.churn_rate > 0
                ? Math.round((analytics.arr / analytics.churn_rate) * 100) / 100
                : 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Lifetime value estimate</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subscription Growth */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Subscription Growth</h2>
            <div className="bg-gray-900 rounded p-4 h-40">
              <div className="flex items-end justify-around h-full">
                {analytics.subscription_growth.slice(-6).map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-blue-600 rounded-t"
                      style={{
                        height: `${
                          (data.subscriptions /
                            Math.max(
                              ...analytics.subscription_growth.map(
                                (d) => d.subscriptions
                              )
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                    <p className="text-xs text-gray-400 mt-2">
                      {data.month.substring(5)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Breakdown by Tier */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Customers by Tier</h2>
            <div className="space-y-3">
              {analytics.customer_breakdown.map((tier) => (
                <div key={tier.tier}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{tier.tier}</span>
                    <span>{tier.count} customers</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded h-2">
                    <div
                      className="bg-green-600 h-full rounded"
                      style={{
                        width: `${
                          (tier.mrr /
                            analytics.customer_breakdown.reduce(
                              (sum, t) => sum + t.mrr,
                              0
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    R{tier.mrr.toLocaleString()} MRR
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <div className="bg-gray-900 rounded p-4">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">MRR</th>
                  <th className="text-right py-2">ARR</th>
                  <th className="text-right py-2">Growth %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {analytics.revenue_trend.map((data, idx) => {
                  const prevMrr = idx > 0 ? analytics.revenue_trend[idx - 1].mrr : data.mrr;
                  const growth = ((data.mrr - prevMrr) / prevMrr) * 100;

                  return (
                    <tr key={idx}>
                      <td className="py-3">{data.month}</td>
                      <td className="text-right">R{data.mrr.toLocaleString()}</td>
                      <td className="text-right">R{data.arr.toLocaleString()}</td>
                      <td className={`text-right ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cohort Retention */}
        {Object.keys(analytics.cohort_retention).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Cohort Retention</h2>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left py-2 px-2">Cohort</th>
                    <th className="text-right py-2 px-2">Retention %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Object.entries(analytics.cohort_retention).map(
                    ([cohort, retention]) => (
                      <tr key={cohort}>
                        <td className="py-3 px-2">{cohort}</td>
                        <td className="text-right py-3 px-2">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 bg-gray-700 rounded h-2">
                              <div
                                className="bg-green-600 h-full rounded"
                                style={{ width: `${retention}%` }}
                              ></div>
                            </div>
                            <span className="text-green-400 w-12 text-right">
                              {retention.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
