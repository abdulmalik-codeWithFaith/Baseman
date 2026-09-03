"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  Building2,
  Users,
  Globe,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import NavBar from "@/components/Navbar";

interface JobWithCompany {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  remote: string;
  employment: string;
  experience: string;
  salary: string | null;
  applicationUrl: string | null;
  createdAt: string | Date;
  company: {
    name: string;
    industry: string | null;
    size: string | null;
    website: string | null;
  };
}

const remoteLabel: Record<string, string> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
const employmentLabel: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
const experienceLabel: Record<string, string> = { ENTRY: "Entry", MID: "Mid", SENIOR: "Senior" };

// Narrower type for the similar-jobs list — that query only selects
// company.name, not the full company record, so it can't reuse JobWithCompany.
interface SimilarJob {
  id: string;
  title: string;
  location: string;
  salary: string | null;
  company: { name: string };
}

function daysAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "today" : `${days}d ago`;
}

export default function JobDetailClient({
  job,
  similarJobs,
  alreadyApplied,
  alreadySaved,
  isLoggedInSeeker,
}: {
  job: JobWithCompany;
  similarJobs: SimilarJob[];
  alreadyApplied: boolean;
  alreadySaved: boolean;
  isLoggedInSeeker: boolean;
}) {
  const router = useRouter();
  const [applied, setApplied] = useState(alreadyApplied);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [saved, setSaved] = useState(alreadySaved);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [matchResult, setMatchResult] = useState<{ match: number; strengths: string[]; gaps: string[] } | null>(null);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleCheckMatch = async () => {
    setCheckingMatch(true);
    setMatchError(null);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMatchError(data.error || "Couldn't compute your match.");
        setCheckingMatch(false);
        return;
      }

      setMatchResult(data);
    } catch {
      setMatchError("Something went wrong. Try again.");
    } finally {
      setCheckingMatch(false);
    }
  };

  const handleSave = async () => {
    if (!isLoggedInSeeker) {
      router.push(`/login?callbackUrl=/jobs/${job.id}`);
      return;
    }

    setSavingBookmark(true);
    const nextSaved = !saved;
    setSaved(nextSaved); // optimistic

    const res = await fetch(`/api/saved-jobs${nextSaved ? "" : `/${job.id}`}`, {
      method: nextSaved ? "POST" : "DELETE",
      headers: nextSaved ? { "Content-Type": "application/json" } : undefined,
      body: nextSaved ? JSON.stringify({ jobId: job.id }) : undefined,
    });

    setSavingBookmark(false);
    if (!res.ok) setSaved(!nextSaved); // revert on failure
  };

  const handleApply = async () => {
    if (!isLoggedInSeeker) {
      router.push(`/login?callbackUrl=/jobs/${job.id}`);
      return;
    }

    setApplying(true);
    setApplyError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();

      // 409 = already applied — not a real error, just means we can
      // proceed straight to the external link (if there is one) without
      // treating this as a failure.
      if (!res.ok && res.status !== 409) {
        setApplyError(data.error || "Couldn't submit your application.");
        setApplying(false);
        return;
      }

      setApplied(true);

      // If the employer set an external application link, send the
      // applicant there — Baseman still recorded the application above
      // so it shows up in their "My Applications" either way.
      if (job.applicationUrl) {
        window.open(job.applicationUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setApplyError("Something went wrong. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <a href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to jobs
        </a>

        {/* Header */}
        <div className="mt-5 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-light text-lg font-semibold text-brand">
              {job.company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{job.title}</h1>
              <p className="mt-1 text-sm text-muted">{job.company.name}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                <span>{employmentLabel[job.employment] ?? job.employment}</span>
                <span>{remoteLabel[job.remote] ?? job.remote}</span>
                <span>{experienceLabel[job.experience] ?? job.experience} level</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Posted {daysAgo(job.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={savingBookmark}
                aria-label="Save job"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                  saved ? "border-brand bg-brand-light text-brand" : "border-border text-muted hover:text-ink"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleApply}
                disabled={applied || applying}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                  applied ? "bg-success/10 text-success" : "bg-brand text-white hover:bg-brand/90"
                } disabled:cursor-not-allowed`}
              >
                {applying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : applied ? (
                  <><CheckCircle2 className="h-4 w-4" /> Applied</>
                ) : isLoggedInSeeker ? (
                  job.applicationUrl ? (
                    <><span>Apply on company site</span><ExternalLink className="h-3.5 w-3.5" /></>
                  ) : (
                    "Apply now"
                  )
                ) : (
                  "Log in to apply"
                )}
              </button>
            </div>
            {applyError && (
              <p className="flex items-center gap-1 text-xs text-error">
                <AlertCircle className="h-3 w-3" /> {applyError}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-ink">About the role</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{job.description}</p>
            </div>

            {job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-ink">Responsibilities</h2>
                <ul className="mt-3 space-y-2.5">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-ink">Requirements</h2>
                <ul className="mt-3 space-y-2.5">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-ink">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="rounded-md border border-border px-3 py-1 text-xs font-medium text-ink">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* AI Match — now a real call to /api/ai/match */}
            {matchResult ? (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="bg-brand p-5 text-white">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/60">AI Match</p>
                  <p className="mt-1 text-4xl font-bold">{matchResult.match}%</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${matchResult.match}%` }} />
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  {matchResult.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">Strong matches</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {matchResult.strengths.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"><CheckCircle2 className="h-3 w-3" /> {s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {matchResult.gaps.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">Gaps</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {matchResult.gaps.map((g) => (
                          <span key={g} className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning"><AlertCircle className="h-3 w-3" /> {g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border p-5 text-center">
                <p className="text-sm font-medium text-ink">See your match score</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {isLoggedInSeeker ? "AI compares your profile against this job's requirements." : "Log in to see how well you fit this role."}
                </p>
                {matchError && <p className="mt-2 text-xs text-error">{matchError}</p>}
                {isLoggedInSeeker ? (
                  <button
                    onClick={handleCheckMatch}
                    disabled={checkingMatch}
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:opacity-60"
                  >
                    {checkingMatch ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Check my match <ArrowRight className="h-3.5 w-3.5" /></>)}
                  </button>
                ) : (
                  <a href={`/login?callbackUrl=/jobs/${job.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Log in <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}

            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">About {job.company.name}</p>
              <div className="mt-3 space-y-2.5 text-sm text-ink">
                {job.company.industry && (
                  <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted" /> {job.company.industry}</p>
                )}
                {job.company.size && (
                  <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted" /> {job.company.size}</p>
                )}
                {job.company.website && (
                  <a href={job.company.website} className="flex items-center gap-2 text-brand hover:underline">
                    <Globe className="h-3.5 w-3.5" /> Company website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {similarJobs.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-lg font-semibold text-ink">Similar jobs</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {similarJobs.map((j) => (
                <a key={j.id} href={`/jobs/${j.id}`} className="group rounded-xl border border-border p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-xs font-semibold text-brand">
                    {j.company.name.charAt(0)}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink group-hover:text-brand transition-colors">{j.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{j.company.name} · {j.location}</p>
                  {j.salary && <p className="mt-2 text-xs font-medium text-ink">{j.salary}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}