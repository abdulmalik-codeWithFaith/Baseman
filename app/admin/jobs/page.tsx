"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Eye, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { ADMIN_JOBS as INITIAL_JOBS, type AdminJobStatus } from "@/lib/admin-jobs";

const FILTERS: ("All" | AdminJobStatus)[] = ["All", "Active", "Draft", "Closed", "Expired"];

function statusTone(status: AdminJobStatus) {
  if (status === "Active") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Draft") return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-border", text: "text-muted" }; // Closed / Expired
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [filter, setFilter] = useState<"All" | AdminJobStatus>("All");
  const [query, setQuery] = useState("");
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: jobs.length };
    FILTERS.slice(1).forEach((s) => (c[s] = jobs.filter((j) => j.status === s).length));
    return c;
  }, [jobs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesFilter = filter === "All" || j.status === filter;
      const matchesQuery = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [jobs, filter, query]);

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setConfirmingRemoveId(null);
  };

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

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">All Jobs</h1>
            <p className="mt-1 text-sm text-muted">Every listing across every company on Baseman.</p>

            {/* Search */}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title or company…"
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
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Applicants</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Posted</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {results.map((job) => {
                      const tone = statusTone(job.status);
                      return (
                        <motion.tr
                          key={job.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-ink">{job.title}</p>
                            <p className="text-xs text-muted">{job.company}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>{job.status}</span>
                          </td>
                          <td className="px-4 py-3 text-ink">{job.applicants}</td>
                          <td className="px-4 py-3 text-ink">{job.views.toLocaleString()}</td>
                          <td className="px-4 py-3 text-muted">{job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {job.status !== "Draft" && (
                                <a href={`/admin/jobs/${job.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors" aria-label="View job details">
                                  <Eye className="h-3.5 w-3.5" />
                                </a>
                              )}

                              {confirmingRemoveId === job.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => removeJob(job.id)} className="rounded-md bg-error px-2.5 py-1 text-xs font-medium text-white hover:opacity-90 transition-opacity">
                                    Confirm
                                  </button>
                                  <button onClick={() => setConfirmingRemoveId(null)} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmingRemoveId(job.id)}
                                  aria-label="Remove listing"
                                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-error/5 hover:text-error transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {results.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-sm font-medium text-ink">No jobs match this filter</p>
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