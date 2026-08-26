"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Globe,
  ArrowRight,
} from "lucide-react";
import type { Job } from "@/lib/jobs";
import NavBar from "@/components/Navbar";

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success", bar: "bg-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning", bar: "bg-warning" };
  return { bg: "bg-brand-light", text: "text-brand", bar: "bg-brand" };
}

export default function JobDetailClient({
  job,
  similarJobs,
}: {
  job: Job;
  similarJobs: Job[];
}) {
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const tone = job.match !== undefined ? matchTone(job.match) : null;

  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Nav ---------------- */}
      <NavBar/>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <a href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to jobs
        </a>

        {/* ---------------- Header ---------------- */}
        <div className="mt-5 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-light text-lg font-semibold text-brand">
              {job.company.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{job.title}</h1>
              <p className="mt-1 text-sm text-muted">{job.company}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                <span>{job.employment}</span>
                <span>{job.remote}</span>
                <span>{job.experience} level</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo}d ago`}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setSaved((s) => !s)}
              aria-label="Save job"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                saved ? "border-brand bg-brand-light text-brand" : "border-border text-muted hover:text-ink"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => setApplied(true)}
              disabled={applied}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                applied ? "bg-success/10 text-success" : "bg-brand text-white hover:bg-brand/90"
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </>
              ) : (
                "Apply now"
              )}
            </button>
          </div>
        </div>

        {/* ---------------- Body ---------------- */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-ink">About the role</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{job.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink">Responsibilities</h2>
              <ul className="mt-3 space-y-2.5">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink">Requirements</h2>
              <ul className="mt-3 space-y-2.5">
                {job.requirements.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

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
            {/* AI Match card */}
            <div className="overflow-hidden rounded-xl border border-border">
              {job.match !== undefined && tone ? (
                <>
                  <div className="bg-brand p-5 text-white">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/60">AI Match</p>
                    <p className="mt-1 text-4xl font-bold">{job.match}%</p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${job.match}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    {job.strengths && job.strengths.length > 0 && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">Strong matches</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {job.strengths.map((s) => (
                            <span key={s} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                              <CheckCircle2 className="h-3 w-3" /> {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.gaps && job.gaps.length > 0 && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">Gaps</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {job.gaps.map((g) => (
                            <span key={g} className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                              <AlertCircle className="h-3 w-3" /> {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors">
                      Optimize my resume
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-5 text-center">
                  <p className="text-sm font-medium text-ink">See your match score</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Complete your profile to see how well you fit this role.
                  </p>
                  <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Check my match <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Company card */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">About {job.company}</p>
              <div className="mt-3 space-y-2.5 text-sm text-ink">
                <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted" /> {job.companyIndustry}</p>
                <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted" /> {job.companySize}</p>
                <a href={job.companyWebsite} className="flex items-center gap-2 text-brand hover:underline">
                  <Globe className="h-3.5 w-3.5" /> Company website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Similar jobs ---------------- */}
        {similarJobs.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-lg font-semibold text-ink">Similar jobs</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {similarJobs.map((j) => (
                <a key={j.id} href={`/jobs/${j.id}`} className="group rounded-xl border border-border p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-xs font-semibold text-brand">
                    {j.company.charAt(0)}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink group-hover:text-brand transition-colors">{j.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{j.company} · {j.location}</p>
                  <p className="mt-2 text-xs font-medium text-ink">{j.salary}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}