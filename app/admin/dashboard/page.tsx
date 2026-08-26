"use client";

import {
  Users,
  UserPlus,
  Briefcase,
  Archive,
  ClipboardList,
  Sparkles,
  DollarSign,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

/* ---------------------------------------------------------------
   Mock platform-wide stats — replace with real aggregate queries
   once the backend exists. These are sitewide numbers (all
   companies, all users), not scoped to one employer.
---------------------------------------------------------------- */

const STATS = {
  totalUsers: 1284,
  newUsersThisWeek: 47,
  totalJobs: 96,
  activeJobs: 71,
  expiredJobs: 25,
  totalApplications: 3402,
  aiCallsThisMonth: 8912,
  aiCostThisMonth: "$142.30",
};

const MOST_VIEWED_JOBS = [
  { title: "Senior Frontend Developer", company: "Acme Inc", views: 1240, applications: 24 },
  { title: "Backend Engineer", company: "Fjord Labs", views: 980, applications: 31 },
  { title: "DevOps Engineer", company: "Fjord Labs", views: 812, applications: 15 },
  { title: "Product Designer", company: "Northwind", views: 640, applications: 18 },
];

const RECENT_SIGNUPS = [
  { name: "A. Rivera", role: "Job seeker", joinedDaysAgo: 0 },
  { name: "Acme Inc", role: "Employer", joinedDaysAgo: 1 },
  { name: "J. Kim", role: "Job seeker", joinedDaysAgo: 1 },
  { name: "M. Chen", role: "Job seeker", joinedDaysAgo: 2 },
  { name: "Northwind", role: "Employer", joinedDaysAgo: 3 },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Minimal admin top bar ---------------- */}
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

          <div className="space-y-10">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Platform overview</h1>
              <p className="mt-1 text-sm text-muted">Sitewide numbers across every user and company.</p>
            </div>

            {/* Users */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Users</p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Total users", value: STATS.totalUsers, icon: Users },
                  { label: "New this week", value: `+${STATS.newUsersThisWeek}`, icon: UserPlus },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border p-4">
                    <stat.icon className="h-4 w-4 text-brand" />
                    <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Jobs</p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Total jobs", value: STATS.totalJobs, icon: Briefcase },
                  { label: "Active", value: STATS.activeJobs, icon: Briefcase },
                  { label: "Expired", value: STATS.expiredJobs, icon: Archive },
                  { label: "Total applications", value: STATS.totalApplications.toLocaleString(), icon: ClipboardList },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border p-4">
                    <stat.icon className="h-4 w-4 text-brand" />
                    <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI usage */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">AI usage (this month)</p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "AI calls", value: STATS.aiCallsThisMonth.toLocaleString(), icon: Sparkles },
                  { label: "Estimated cost", value: STATS.aiCostThisMonth, icon: DollarSign },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border p-4">
                    <stat.icon className="h-4 w-4 text-brand" />
                    <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
              <a href="/admin/ai-usage" className="mt-3 inline-block text-xs font-medium text-brand hover:underline">
                View full AI usage breakdown →
              </a>
            </div>

            {/* Most viewed jobs + recent signups */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-ink">Most viewed jobs</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                        <th className="px-4 py-3 font-medium">Job</th>
                        <th className="px-4 py-3 font-medium"><Eye className="h-3 w-3" /></th>
                        <th className="px-4 py-3 font-medium">Applications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOST_VIEWED_JOBS.map((job) => (
                        <tr key={job.title} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <p className="font-medium text-ink">{job.title}</p>
                            <p className="text-xs text-muted">{job.company}</p>
                          </td>
                          <td className="px-4 py-3 text-ink">{job.views.toLocaleString()}</td>
                          <td className="px-4 py-3 text-ink">{job.applications}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-ink">Recent signups</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_SIGNUPS.map((s, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${s.role === "Employer" ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                              {s.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted">{s.joinedDaysAgo === 0 ? "Today" : `${s.joinedDaysAgo}d ago`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}