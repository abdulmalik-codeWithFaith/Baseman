"use client";

import { useMemo, useState } from "react";
import { Search, X, Eye, ClipboardList } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { ADMIN_APPLICATIONS, type ApplicationStatus } from "@/lib/admin-applications";

const FILTERS: ("All" | ApplicationStatus)[] = ["All", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"];

function statusTone(status: ApplicationStatus) {
  if (status === "Interview" || status === "Offer") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Rejected" || status === "Withdrawn") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" }; // Applied
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<"All" | ApplicationStatus>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: ADMIN_APPLICATIONS.length };
    FILTERS.slice(1).forEach((s) => (c[s] = ADMIN_APPLICATIONS.filter((a) => a.status === s).length));
    return c;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADMIN_APPLICATIONS.filter((a) => {
      const matchesFilter = filter === "All" || a.status === filter;
      const matchesQuery =
        !q ||
        a.applicantName.toLowerCase().includes(q) ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

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
            <h1 className="text-2xl font-bold tracking-tight text-ink">Applications</h1>
            <p className="mt-1 text-sm text-muted">Every application across every job seeker and company — for monitoring, not editing.</p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[
                { label: "Total", value: counts["All"] ?? 0 },
                { label: "Applied", value: counts["Applied"] ?? 0 },
                { label: "Interview", value: counts["Interview"] ?? 0 },
                { label: "Offer", value: counts["Offer"] ?? 0 },
                { label: "Rejected", value: counts["Rejected"] ?? 0 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-4">
                  <ClipboardList className="h-4 w-4 text-brand" />
                  <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by applicant, job, or company…"
                className="w-full bg-transparent px-1 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f ? "bg-brand text-white" : "border border-border text-muted hover:text-ink"
                  }`}
                >
                  {f} <span className="opacity-70">({counts[f] ?? 0})</span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                    <th className="px-4 py-3 font-medium">Applicant</th>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Match</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Applied</th>
                    <th className="px-4 py-3 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((app) => {
                    const mTone = matchTone(app.match);
                    const sTone = statusTone(app.status);
                    return (
                      <tr key={app.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-ink">{app.applicantName}</td>
                        <td className="px-4 py-3">
                          <p className="text-ink">{app.jobTitle}</p>
                          <p className="text-xs text-muted">{app.company}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{app.match}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-3 text-muted">{app.appliedDaysAgo === 0 ? "Today" : `${app.appliedDaysAgo}d ago`}</td>
                        <td className="px-4 py-3 text-right">
                          <a href={`/jobs/${app.jobId}`} aria-label="View job listing" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {results.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-sm font-medium text-ink">No applications match this filter</p>
                  <p className="mt-1 text-sm text-muted">Try a different search or filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}