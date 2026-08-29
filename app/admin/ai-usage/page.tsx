"use client";

import { Sparkles, DollarSign, TrendingUp, Zap, Info } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { AI_OPERATIONS, DAILY_CALLS, totalCalls, totalCost } from "@/lib/admin-ai-usage";

export default function AdminAiUsagePage() {
  const calls = totalCalls();
  const cost = totalCost();
  const avgCostPerCall = cost / calls;
  const callsToday = DAILY_CALLS[DAILY_CALLS.length - 1];
  const maxDaily = Math.max(...DAILY_CALLS);

  const sortedOps = [...AI_OPERATIONS].sort((a, b) => b.calls * b.avgCostPerCall - a.calls * a.avgCostPerCall);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">B</span>
            <span className="text-lg font-semibold tracking-tight text-ink">Baseman</span>
            <span className="rounded-md bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand">Admin</span>
          </div>
          <a href="/" className="text-sm font-medium text-muted hover:text-ink transition-colors">View live site</a>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <AdminSidebar />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">AI Usage</h1>
            <p className="mt-1 text-sm text-muted">Calls and estimated cost across every AI-powered feature.</p>

            <div className="mt-4 flex gap-2.5 rounded-lg bg-brand-light p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <p className="text-xs leading-relaxed text-ink">
                Cost figures are estimates based on placeholder per-call rates in{" "}
                <code className="rounded bg-white px-1 py-0.5 text-[11px]">lib/admin-ai-usage.ts</code> — swap in your
                real provider pricing before treating these as actual billing numbers.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total calls (30d)", value: calls.toLocaleString(), icon: Sparkles },
                { label: "Est. cost (30d)", value: `$${cost.toFixed(2)}`, icon: DollarSign },
                { label: "Avg. cost / call", value: `$${avgCostPerCall.toFixed(4)}`, icon: TrendingUp },
                { label: "Calls today", value: callsToday.toLocaleString(), icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-4">
                  <stat.icon className="h-4 w-4 text-brand" />
                  <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Daily calls chart */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-ink">Calls over the last 14 days</h2>
              <div className="mt-4 flex h-40 items-end gap-2 rounded-xl border border-border p-4">
                {DAILY_CALLS.map((value, i) => (
                  <div key={i} className="group relative flex-1">
                    <div
                      className="w-full rounded-t-sm bg-brand transition-colors group-hover:bg-brand/80"
                      style={{ height: `${(value / maxDaily) * 100}%` }}
                    />
                    <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {value} calls
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by operation */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-ink">By operation</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                      <th className="px-4 py-3 font-medium">Operation</th>
                      <th className="px-4 py-3 font-medium">Calls</th>
                      <th className="px-4 py-3 font-medium">Avg. cost / call</th>
                      <th className="px-4 py-3 font-medium">Est. total cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOps.map((op) => {
                      const opCost = op.calls * op.avgCostPerCall;
                      return (
                        <tr key={op.name} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-ink">{op.name}</td>
                          <td className="px-4 py-3 text-ink">{op.calls.toLocaleString()}</td>
                          <td className="px-4 py-3 text-muted">${op.avgCostPerCall.toFixed(4)}</td>
                          <td className="px-4 py-3 font-medium text-ink">${opCost.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}