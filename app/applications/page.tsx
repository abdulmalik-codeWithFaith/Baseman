"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin } from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { JOBS } from "@/lib/jobs";

/* ---------------------------------------------------------------
   Mock application data — replace with a real query (by logged-in
   user id) once the backend exists.
---------------------------------------------------------------- */

type Status = "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";

interface Application {
  jobId: string;
  status: Status;
  appliedDaysAgo: number;
}

const INITIAL_APPLICATIONS: Application[] = [
  { jobId: "1", status: "Interview", appliedDaysAgo: 3 },
  { jobId: "2", status: "Rejected", appliedDaysAgo: 10 },
  { jobId: "3", status: "Offer", appliedDaysAgo: 15 },
  { jobId: "4", status: "Applied", appliedDaysAgo: 12 },
  { jobId: "5", status: "Applied", appliedDaysAgo: 5 },
  { jobId: "6", status: "Applied", appliedDaysAgo: 2 },
  { jobId: "7", status: "Rejected", appliedDaysAgo: 9 },
  { jobId: "9", status: "Interview", appliedDaysAgo: 1 },
];

const FILTERS: ("All" | Status)[] = ["All", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"];

function statusTone(status: Status) {
  if (status === "Interview" || status === "Offer") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Rejected" || status === "Withdrawn") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" }; // Applied
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [query, setQuery] = useState("");

  const withJobs = useMemo(
    () => applications.map((a) => ({ ...a, job: JOBS.find((j) => j.id === a.jobId) })).filter((a) => a.job),
    [applications]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: withJobs.length };
    FILTERS.slice(1).forEach((s) => (c[s] = withJobs.filter((a) => a.status === s).length));
    return c;
  }, [withJobs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withJobs.filter((a) => {
      const matchesFilter = filter === "All" || a.status === filter;
      const matchesQuery = !q || a.job!.title.toLowerCase().includes(q) || a.job!.company.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [withJobs, filter, query]);

  const withdraw = (jobId: string) => {
    setApplications((prev) => prev.map((a) => (a.jobId === jobId ? { ...a, status: "Withdrawn" } : a)));
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <DashboardSidebar />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">My Applications</h1>
            <p className="mt-1 text-sm text-muted">Every job you've applied to, and where it stands.</p>

            {/* Search */}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your applications…"
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
                  {f} {counts[f] !== undefined && <span className="opacity-70">({counts[f]})</span>}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {results.map((app) => {
                  const job = app.job!;
                  const sTone = statusTone(app.status);
                  const mTone = job.match !== undefined ? matchTone(job.match) : null;
                  const canWithdraw = app.status === "Applied" || app.status === "Interview";

                  return (
                    <motion.div
                      key={app.jobId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <a href={`/jobs/${job.id}`} className="text-sm font-semibold text-ink hover:text-brand transition-colors">
                            {job.title}
                          </a>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                            {job.company} · <MapPin className="h-3 w-3" /> {job.location}
                          </p>
                          <p className="mt-1 text-xs text-muted">Applied {app.appliedDaysAgo}d ago</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                        <div className="flex items-center gap-2">
                          {mTone && (
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{job.match}% match</span>
                          )}
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{app.status}</span>
                        </div>
                        {canWithdraw && (
                          <button onClick={() => withdraw(app.jobId)} className="text-xs font-medium text-muted hover:text-error transition-colors">
                            Withdraw
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {results.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <p className="text-sm font-medium text-ink">No applications here yet</p>
                  <p className="mt-1 text-sm text-muted">
                    {query || filter !== "All" ? "Try a different search or filter." : "Once you apply to a job, it'll show up here."}
                  </p>
                  <a href="/jobs" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Browse jobs
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}