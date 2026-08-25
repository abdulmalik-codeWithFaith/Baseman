"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Clock, Bookmark } from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { JOBS } from "@/lib/jobs";

/* ---------------------------------------------------------------
   Mock saved-job ids — replace with a real query (by logged-in
   user id) once the backend exists.
---------------------------------------------------------------- */
const INITIAL_SAVED_IDS = ["1", "3", "5", "9", "2"];

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function SavedJobsPage() {
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED_IDS);
  const [query, setQuery] = useState("");

  const savedJobs = useMemo(
    () => savedIds.map((id) => JOBS.find((j) => j.id === id)).filter((j): j is NonNullable<typeof j> => !!j),
    [savedIds]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return savedJobs;
    return savedJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [savedJobs, query]);

  const unsave = (id: string) => setSavedIds((prev) => prev.filter((s) => s !== id));

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <DashboardSidebar />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Saved Jobs</h1>
            <p className="mt-1 text-sm text-muted">Jobs you've bookmarked to come back to.</p>

            {savedJobs.length > 0 && (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
                <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your saved jobs…"
                  className="w-full bg-transparent px-1 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {results.map((job) => {
                  const tone = job.match !== undefined ? matchTone(job.match) : null;
                  return (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <a href={`/jobs/${job.id}`} className="group flex flex-1 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{job.title}</p>
                          <p className="mt-0.5 text-xs text-muted">{job.company}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                            <span>{job.employment}</span>
                            <span>{job.remote}</span>
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {job.skills.map((skill) => (
                              <span key={skill} className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-ink">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </a>

                      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                        <p className="text-sm font-medium text-ink">{job.salary}</p>
                        {tone && <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>{job.match}% match</span>}
                        <button
                          onClick={() => unsave(job.id)}
                          aria-label="Remove from saved"
                          className="flex items-center gap-1 text-xs font-medium text-muted hover:text-error transition-colors"
                        >
                          <Bookmark className="h-3.5 w-3.5 fill-current" /> Remove
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {savedJobs.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <Bookmark className="mx-auto h-6 w-6 text-muted" />
                  <p className="mt-3 text-sm font-medium text-ink">No saved jobs yet</p>
                  <p className="mt-1 text-sm text-muted">Bookmark a job while browsing and it'll show up here.</p>
                  <a href="/jobs" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Browse jobs
                  </a>
                </div>
              )}

              {savedJobs.length > 0 && results.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <p className="text-sm font-medium text-ink">No matches for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-sm text-muted">Try a different search term.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}