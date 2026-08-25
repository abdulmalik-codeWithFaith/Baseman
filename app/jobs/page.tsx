"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

/* ---------------------------------------------------------------
   Mock data — replace with real API/DB query once the backend
   (Prisma + Postgres, per your stack) is wired up.
---------------------------------------------------------------- */

type RemoteType = "Remote" | "Hybrid" | "On-site";
type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
type ExperienceLevel = "Entry" | "Mid" | "Senior";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: RemoteType;
  employment: EmploymentType;
  experience: ExperienceLevel;
  salary: string;
  skills: string[];
  postedDaysAgo: number;
  match?: number; // omitted = user hasn't run match yet
}

const JOBS: Job[] = [
  { id: "1", title: "Senior Frontend Developer", company: "Acme Inc", location: "San Francisco, CA", remote: "Remote", employment: "Full-time", experience: "Senior", salary: "$140k–$170k", skills: ["React", "TypeScript", "Next.js"], postedDaysAgo: 2, match: 86 },
  { id: "2", title: "Product Designer", company: "Northwind", location: "New York, NY", remote: "Hybrid", employment: "Full-time", experience: "Mid", salary: "$110k–$130k", skills: ["Figma", "Design Systems"], postedDaysAgo: 4, match: 54 },
  { id: "3", title: "Backend Engineer", company: "Fjord Labs", location: "Austin, TX", remote: "Remote", employment: "Full-time", experience: "Senior", salary: "$150k–$180k", skills: ["Node.js", "PostgreSQL", "AWS"], postedDaysAgo: 1, match: 91 },
  { id: "4", title: "Frontend Intern", company: "Contoso", location: "Remote", remote: "Remote", employment: "Internship", experience: "Entry", salary: "$25/hr", skills: ["React", "CSS"], postedDaysAgo: 6 },
  { id: "5", title: "Full-Stack Engineer", company: "Globex", location: "Chicago, IL", remote: "Hybrid", employment: "Full-time", experience: "Mid", salary: "$120k–$145k", skills: ["Next.js", "Prisma", "PostgreSQL"], postedDaysAgo: 3, match: 72 },
  { id: "6", title: "Data Analyst (Contract)", company: "Initech", location: "Remote", remote: "Remote", employment: "Contract", experience: "Mid", salary: "$60/hr", skills: ["SQL", "Python", "Tableau"], postedDaysAgo: 8 },
  { id: "7", title: "Engineering Manager", company: "Acme Inc", location: "San Francisco, CA", remote: "On-site", employment: "Full-time", experience: "Senior", salary: "$180k–$210k", skills: ["Leadership", "React", "System Design"], postedDaysAgo: 5, match: 63 },
  { id: "8", title: "Junior Backend Developer", company: "Umbrella Corp", location: "Seattle, WA", remote: "Hybrid", employment: "Full-time", experience: "Entry", salary: "$85k–$100k", skills: ["Node.js", "Express"], postedDaysAgo: 2 },
  { id: "9", title: "DevOps Engineer", company: "Fjord Labs", location: "Remote", remote: "Remote", employment: "Full-time", experience: "Senior", salary: "$155k–$185k", skills: ["AWS", "Docker", "Kubernetes"], postedDaysAgo: 1, match: 78 },
  { id: "10", title: "Part-Time Designer", company: "Northwind", location: "New York, NY", remote: "Hybrid", employment: "Part-time", experience: "Mid", salary: "$50/hr", skills: ["Figma", "Branding"], postedDaysAgo: 9 },
];

const REMOTE_OPTIONS: ("All" | RemoteType)[] = ["All", "Remote", "Hybrid", "On-site"];
const EMPLOYMENT_OPTIONS: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ["Entry", "Mid", "Senior"];

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

/* ---------------------------------------------------------------
   Reusable filter checkbox row
---------------------------------------------------------------- */
function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
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

/* ---------------------------------------------------------------
   Filter panel content (shared between desktop sidebar + mobile drawer)
---------------------------------------------------------------- */
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
  remote: "All" | RemoteType;
  setRemote: (r: "All" | RemoteType) => void;
  employment: EmploymentType[];
  toggleEmployment: (e: EmploymentType) => void;
  experience: ExperienceLevel[];
  toggleExperience: (e: ExperienceLevel) => void;
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

/* ---------------------------------------------------------------
   Page
---------------------------------------------------------------- */

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<"All" | RemoteType>("All");
  const [employment, setEmployment] = useState<EmploymentType[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel[]>([]);
  const [sort, setSort] = useState<"newest" | "match">("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleEmployment = (e: EmploymentType) =>
    setEmployment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  const toggleExperience = (e: ExperienceLevel) =>
    setExperience((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  const clearFilters = () => {
    setRemote("All");
    setEmployment([]);
    setExperience([]);
  };
  const activeCount = (remote !== "All" ? 1 : 0) + employment.length + experience.length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = JOBS.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      const matchesRemote = remote === "All" || job.remote === remote;
      const matchesEmployment = employment.length === 0 || employment.includes(job.employment);
      const matchesExperience = experience.length === 0 || experience.includes(job.experience);
      return matchesQuery && matchesRemote && matchesEmployment && matchesExperience;
    });

    list = [...list].sort((a, b) =>
      sort === "newest" ? a.postedDaysAgo - b.postedDaysAgo : (b.match ?? -1) - (a.match ?? -1)
    );

    return list;
  }, [query, remote, employment, experience, sort]);

  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Nav ---------------- */}
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

      {/* ---------------- Page header + search ---------------- */}
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

      {/* ---------------- Body: sidebar + results ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Desktop sidebar */}
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

          {/* Results */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                <span className="font-medium text-ink">{results.length}</span> job{results.length === 1 ? "" : "s"} found
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink md:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters {activeCount > 0 && `(${activeCount})`}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "newest" | "match")}
                    className="appearance-none rounded-lg border border-border bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="newest">Newest</option>
                    <option value="match">Best match</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>

            {/* Job cards */}
            <div className="mt-5 space-y-3">
              <AnimatePresence mode="popLayout">
                {results.map((job) => {
                  const tone = job.match !== undefined ? matchTone(job.match) : null;
                  return (
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
                              <span key={skill} className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-ink">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                        <p className="text-sm font-medium text-ink">{job.salary}</p>
                        {tone ? (
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>
                            {job.match}% match
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
                            Check match <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </motion.a>
                  );
                })}
              </AnimatePresence>

              {results.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <p className="text-sm font-medium text-ink">No jobs match your filters</p>
                  <p className="mt-1 text-sm text-muted">Try widening your search or clearing a filter.</p>
                  <button onClick={clearFilters} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Mobile filter drawer ---------------- */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-white p-6 shadow-xl md:hidden"
            >
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
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
              >
                Show {results.length} job{results.length === 1 ? "" : "s"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}