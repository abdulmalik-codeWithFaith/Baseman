"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";

type RemoteType = "REMOTE" | "HYBRID" | "ONSITE";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
type ExperienceLevel = "ENTRY" | "MID" | "SENIOR";

interface ApiJob {
  id: string;
  title: string;
  location: string;
  remote: RemoteType;
  employment: EmploymentType;
  experience: ExperienceLevel;
  salary: string | null;
  skills: string[];
  createdAt: string;
  company: { name: string; logoUrl: string | null };
}

const REMOTE_OPTIONS = ["All", "Remote", "Hybrid", "On-site"] as const;
const EMPLOYMENT_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const EXPERIENCE_OPTIONS = ["Entry", "Mid", "Senior"] as const;

const remoteLabel: Record<RemoteType, string> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
const employmentLabel: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
const experienceLabel: Record<ExperienceLevel, string> = { ENTRY: "Entry", MID: "Mid", SENIOR: "Senior" };

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days}d ago`;
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-ink">
      <span
        onClick={onChange}
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? "border-brand bg-brand" : "border-border bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
            <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span onClick={onChange}>{label}</span>
    </label>
  );
}

function FilterPanel({
  remote,
  setRemote,
  employment,
  toggleEmployment,
  experience,
  toggleExperience,
  onClear,
  activeCount,
}: {
  remote: string;
  setRemote: (r: string) => void;
  employment: string[];
  toggleEmployment: (e: string) => void;
  experience: string[];
  toggleExperience: (e: string) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Filters</p>
        {activeCount > 0 && (
          <button onClick={onClear} className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink transition-colors">
            <X className="h-3 w-3" /> Clear ({activeCount})
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Location</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {REMOTE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setRemote(opt)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                remote === opt ? "bg-brand text-white" : "border border-border text-ink hover:bg-brand-light"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Employment type</p>
        <div className="mt-2">
          {EMPLOYMENT_OPTIONS.map((opt) => (
            <CheckboxRow key={opt} label={opt} checked={employment.includes(opt)} onChange={() => toggleEmployment(opt)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Experience level</p>
        <div className="mt-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <CheckboxRow key={opt} label={opt} checked={experience.includes(opt)} onChange={() => toggleExperience(opt)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [remote, setRemote] = useState<string>("All");
  const [employment, setEmployment] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const toggleEmployment = (e: string) =>
    setEmployment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  const toggleExperience = (e: string) =>
    setExperience((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  const clearFilters = () => {
    setRemote("All");
    setEmployment([]);
    setExperience([]);
  };
  const activeCount = (remote !== "All" ? 1 : 0) + employment.length + experience.length;

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (remote !== "All") params.set("remote", remote);
    employment.forEach((e) => params.append("employment", e));
    experience.forEach((e) => params.append("experience", e));

    setLoading(true);
    setError(null);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load jobs.");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch(() => setError("Couldn't load jobs right now. Try refreshing."))
      .finally(() => setLoading(false));
  }, [debouncedQuery, remote, employment, experience]);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">B</span>
            <span className="text-lg font-semibold tracking-tight text-ink">Baseman</span>
          </a>
          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="/jobs" className="font-medium text-ink">Jobs</a>
            <a href="/#how-it-works" className="text-muted hover:text-ink transition-colors">How it works</a>
            <a href="/employers" className="text-muted hover:text-ink transition-colors">For employers</a>
            <a href="/pricing" className="text-muted hover:text-ink transition-colors">Pricing</a>
            <a href="/about" className="text-muted hover:text-ink transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-ink hover:text-brand transition-colors">Log in</a>
            <a href="/signup" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Sign up</a>
          </div>
        </nav>
      </header>

      <section className="border-b border-border bg-brand-light/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">Browse jobs</h1>
          <p className="mt-2 text-muted">Search, filter, and see your match score before you apply.</p>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-white p-2 shadow-sm">
            <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by title, company, or skill…"
              className="w-full bg-transparent px-1 py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <FilterPanel
              remote={remote}
              setRemote={setRemote}
              employment={employment}
              toggleEmployment={toggleEmployment}
              experience={experience}
              toggleExperience={toggleExperience}
              onClear={clearFilters}
              activeCount={activeCount}
            />
          </aside>

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {loading ? "Loading…" : (
                  <><span className="font-medium text-ink">{jobs.length}</span> job{jobs.length === 1 ? "" : "s"} found</>
                )}
              </p>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink md:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>

            {loading && (
              <div className="mt-10 flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
              </div>
            )}

            {error && !loading && (
              <div className="mt-6 rounded-xl border border-dashed border-error/30 bg-error/5 p-6 text-center text-sm text-error">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="mt-5 space-y-3">
                <AnimatePresence mode="popLayout">
                  {jobs.map((job) => (
                    <motion.a
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group flex flex-col gap-4 rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                          {job.company.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{job.title}</p>
                          <p className="mt-0.5 text-xs text-muted">{job.company.name}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                            <span>{employmentLabel[job.employment]}</span>
                            <span>{remoteLabel[job.remote]}</span>
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {daysAgo(job.createdAt)}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {job.skills.map((skill) => (
                              <span key={skill} className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-ink">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                        {job.salary && <p className="text-sm font-medium text-ink">{job.salary}</p>}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
                          Check match <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </AnimatePresence>

                {jobs.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-medium text-ink">No jobs match your filters</p>
                    <p className="mt-1 text-sm text-muted">Try widening your search or clearing a filter.</p>
                    <button onClick={clearFilters} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 z-40 bg-ink/40 md:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeOut" }} className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-white p-6 shadow-xl md:hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Filters</p>
                <button onClick={() => setMobileFiltersOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-ink transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6">
                <FilterPanel
                  remote={remote}
                  setRemote={setRemote}
                  employment={employment}
                  toggleEmployment={toggleEmployment}
                  experience={experience}
                  toggleExperience={toggleExperience}
                  onClear={clearFilters}
                  activeCount={activeCount}
                />
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} className="mt-8 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                Show {jobs.length} job{jobs.length === 1 ? "" : "s"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}