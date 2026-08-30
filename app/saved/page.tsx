"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Clock, Bookmark, Loader2 } from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

const remoteLabel: Record<string, string> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
const employmentLabel: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

interface SavedEntry {
  jobId: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    remote: string;
    employment: string;
    salary: string | null;
    skills: string[];
    createdAt: string;
    company: { name: string };
  };
}

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days}d ago`;
}

export default function SavedJobsPage() {
  const [saved, setSaved] = useState<SavedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/saved-jobs")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setSaved)
      .catch(() => setError("Couldn't load your saved jobs. Try refreshing."))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return saved;
    return saved.filter(
      (s) =>
        s.job.title.toLowerCase().includes(q) ||
        s.job.company.name.toLowerCase().includes(q) ||
        s.job.skills.some((skill) => skill.toLowerCase().includes(q))
    );
  }, [saved, query]);

  const unsave = async (jobId: string) => {
    setRemovingId(jobId);
    const res = await fetch(`/api/saved-jobs/${jobId}`, { method: "DELETE" });
    setRemovingId(null);
    if (res.ok) setSaved((prev) => prev.filter((s) => s.jobId !== jobId));
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <DashboardSidebar />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Saved Jobs</h1>
            <p className="mt-1 text-sm text-muted">Jobs you've bookmarked to come back to.</p>

            {!loading && saved.length > 0 && (
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

            {loading && (
              <div className="mt-10 flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
              </div>
            )}

            {error && !loading && (
              <div className="mt-6 rounded-xl border border-dashed border-error/30 bg-error/5 p-6 text-center text-sm text-error">{error}</div>
            )}

            {!loading && !error && (
              <div className="mt-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {results.map((entry) => {
                    const job = entry.job;
                    const isRemoving = removingId === job.id;
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
                            {job.company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{job.title}</p>
                            <p className="mt-0.5 text-xs text-muted">{job.company.name}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                              <span>{employmentLabel[job.employment] ?? job.employment}</span>
                              <span>{remoteLabel[job.remote] ?? job.remote}</span>
                              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {daysAgo(job.createdAt)}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {job.skills.map((skill) => (
                                <span key={skill} className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-ink">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </a>

                        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                          {job.salary && <p className="text-sm font-medium text-ink">{job.salary}</p>}
                          <button
                            onClick={() => unsave(job.id)}
                            disabled={isRemoving}
                            aria-label="Remove from saved"
                            className="flex items-center gap-1 text-xs font-medium text-muted hover:text-error transition-colors disabled:opacity-50"
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" /> {isRemoving ? "Removing…" : "Remove"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {saved.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <Bookmark className="mx-auto h-6 w-6 text-muted" />
                    <p className="mt-3 text-sm font-medium text-ink">No saved jobs yet</p>
                    <p className="mt-1 text-sm text-muted">Bookmark a job while browsing and it'll show up here.</p>
                    <a href="/jobs" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                      Browse jobs
                    </a>
                  </div>
                )}

                {saved.length > 0 && results.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-medium text-ink">No matches for &ldquo;{query}&rdquo;</p>
                    <p className="mt-1 text-sm text-muted">Try a different search term.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}