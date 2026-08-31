"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileEdit,
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Info,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";

interface StructuredJob {
  title: string;
  location: string;
  remote: "Remote" | "Hybrid" | "On-site";
  employment: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: "Entry" | "Mid" | "Senior";
  salary: string;
  skills: string[];
  description: string;
  applicationUrl: string;
}

const EMPTY_JOB: StructuredJob = {
  title: "",
  location: "",
  remote: "Remote",
  employment: "Full-time",
  experience: "Mid",
  salary: "",
  skills: [],
  description: "",
  applicationUrl: "",
};

// UI label <-> Prisma enum value, both directions
const remoteToEnum: Record<StructuredJob["remote"], string> = { Remote: "REMOTE", Hybrid: "HYBRID", "On-site": "ONSITE" };
const remoteFromEnum: Record<string, StructuredJob["remote"]> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
const employmentToEnum: Record<StructuredJob["employment"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
};
const employmentFromEnum: Record<string, StructuredJob["employment"]> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
const experienceToEnum: Record<StructuredJob["experience"], string> = { Entry: "ENTRY", Mid: "MID", Senior: "SENIOR" };
const experienceFromEnum: Record<string, StructuredJob["experience"]> = { ENTRY: "Entry", MID: "Mid", SENIOR: "Senior" };

type Method = "ai" | "manual" | null;

function PostJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const draftId = searchParams.get("draft");
  const targetId = editId || draftId;

  const [method, setMethod] = useState<Method>(null);
  const [pastedText, setPastedText] = useState("");
  const [importState, setImportState] = useState<"idle" | "importing" | "imported">("idle");
  const [importError, setImportError] = useState<string | null>(null);
  const [job, setJob] = useState<StructuredJob>(EMPTY_JOB);
  const [skillInput, setSkillInput] = useState("");
  const [autoReject, setAutoReject] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [loadedTitle, setLoadedTitle] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load existing listing data when arriving via ?edit= or ?draft=
  useEffect(() => {
    if (!targetId) return;
    fetch(`/api/jobs/${targetId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setJob({
          title: data.title,
          location: data.location,
          remote: remoteFromEnum[data.remote] ?? "Remote",
          employment: employmentFromEnum[data.employment] ?? "Full-time",
          experience: experienceFromEnum[data.experience] ?? "Mid",
          salary: data.salary ?? "",
          skills: data.skills,
          description: data.description,
          applicationUrl: data.applicationUrl ?? "",
        });
        setAutoReject(data.autoReject);
        setThreshold(data.matchThreshold);
        setLoadedTitle(data.title);
        setMethod("manual"); // skip the method-choice screen, go straight to the form
      });
  }, [targetId]);

  const showForm = method === "manual" || (method === "ai" && importState === "imported");
  const isEditing = !!editId;
  const isContinuingDraft = !!draftId;

  const removeSkill = (skill: string) => setJob((j) => ({ ...j, skills: j.skills.filter((s) => s !== skill) }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !job.skills.includes(value)) setJob((j) => ({ ...j, skills: [...j.skills, value] }));
    setSkillInput("");
  };

  const handleImport = async () => {
    setImportState("importing");
    setImportError(null);
    try {
      const res = await fetch("/api/ai/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pastedText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setImportError(data.error || "Couldn't parse this job description.");
        setImportState("idle");
        return;
      }

      setJob({
        title: data.title,
        location: data.location,
        remote: remoteFromEnum[data.remote] ?? "Remote",
        employment: employmentFromEnum[data.employment] ?? "Full-time",
        experience: experienceFromEnum[data.experience] ?? "Mid",
        salary: data.salary ?? "",
        skills: data.skills ?? [],
        description: data.description ?? "",
        applicationUrl: "",
      });
      setImportState("imported");
    } catch {
      setImportError("Something went wrong. Try again, or fill it in manually instead.");
      setImportState("idle");
    }
  };

  const resetMethod = () => {
    setMethod(null);
    setImportState("idle");
    setPastedText("");
    setJob(EMPTY_JOB);
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      title: job.title,
      description: job.description,
      responsibilities: [], // TODO: no field collects these yet — see note below
      requirements: [], // TODO: same
      skills: job.skills,
      location: job.location,
      remote: remoteToEnum[job.remote],
      employment: employmentToEnum[job.employment],
      experience: experienceToEnum[job.experience],
      salary: job.salary || null,
      applicationUrl: job.applicationUrl || null,
      status: "ACTIVE",
      autoReject,
      matchThreshold: threshold,
    };

    try {
      const res = await fetch(editId ? `/api/jobs/${editId}` : "/api/jobs", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to publish this job.");
        setSubmitting(false);
        return;
      }

      router.push("/employers/listings");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">B</span>
            <span className="text-lg font-semibold tracking-tight text-ink">Baseman</span>
          </a>
          <a href="/employers/listings" className="text-sm font-medium text-muted hover:text-ink transition-colors">Save & exit</a>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {loadedTitle && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-brand-light px-4 py-2.5 text-sm text-brand">
            <Info className="h-4 w-4 shrink-0" />
            {isEditing ? `Editing "${loadedTitle}"` : `Continuing draft — "${loadedTitle}"`}
          </div>
        )}

        <AnimatePresence mode="wait">
          {method === null && (
            <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Post a job</h1>
              <p className="mt-2 text-sm text-muted">How would you like to create this listing?</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button onClick={() => setMethod("ai")} className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-brand hover:bg-brand-light/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Paste with AI</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">Paste a job description from anywhere and let Baseman structure it for you.</p>
                  </div>
                </button>

                <button onClick={() => setMethod("manual")} className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-brand hover:bg-brand-light/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <FileEdit className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Fill in manually</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">Prefer to type it yourself? Fill out the listing fields directly.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {method === "ai" && importState !== "imported" && (
            <motion.div key="ai-paste" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button onClick={resetMethod} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Change method
              </button>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink md:text-3xl">Paste job description</h1>
              <p className="mt-2 text-sm text-muted">Paste the full text — Baseman will pull out the details.</p>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full job description from anywhere — a doc, an old posting, an email…"
                rows={7}
                className="mt-5 w-full resize-none rounded-xl border border-border p-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {importError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {importError}
                </div>
              )}
              <button onClick={handleImport} disabled={!pastedText.trim() || importState === "importing"} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40">
                {importState === "importing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Structuring with AI…</>) : (<><Sparkles className="h-4 w-4" /> Import with AI</>)}
              </button>
              {/* Real AI call now — /api/ai/parse-job via OpenRouter */}
            </motion.div>
          )}

          {showForm && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {!targetId && (
                <button onClick={resetMethod} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Change method
                </button>
              )}

              <div className="mt-4 flex items-center gap-2">
                {method === "ai" && <CheckCircle2 className="h-4 w-4 text-success" />}
                <p className="text-sm font-semibold text-ink">
                  {isEditing ? "Edit job details" : isContinuingDraft ? "Finish your draft" : method === "ai" ? "Structured — review before publishing" : "Job details"}
                </p>
              </div>

              {submitError && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {submitError}
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-ink">Job title</label>
                  <input value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} placeholder="e.g. Senior Backend Engineer" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink">Location</label>
                  <input value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} placeholder="e.g. Austin, TX" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink">Remote type</label>
                  <select
                    value={job.remote}
                    onChange={(e) => setJob({ ...job, remote: e.target.value as StructuredJob["remote"] })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink">Employment type</label>
                  <select
                    value={job.employment}
                    onChange={(e) => setJob({ ...job, employment: e.target.value as StructuredJob["employment"] })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink">Experience level</label>
                  <select
                    value={job.experience}
                    onChange={(e) => setJob({ ...job, experience: e.target.value as StructuredJob["experience"] })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option>Entry</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink">Salary</label>
                  <input value={job.salary} onChange={(e) => setJob({ ...job, salary: e.target.value })} placeholder="e.g. $150k–$180k" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-ink">Skills</label>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
                    {job.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2.5 py-1 text-xs font-medium text-brand">
                        {skill}
                        <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill…" className="w-28 bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none" />
                      <button onClick={addSkill} aria-label="Add skill" className="text-muted hover:text-brand"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-ink">Description</label>
                  <textarea value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} placeholder="What does this role actually involve?" rows={4} className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  <p className="mt-1.5 text-xs text-muted">
                    Detailed responsibilities and requirements aren't collected in this form yet — this description is all that's stored for now.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-ink">Application URL <span className="font-normal text-muted">(optional)</span></label>
                  <input
                    value={job.applicationUrl}
                    onChange={(e) => setJob({ ...job, applicationUrl: e.target.value })}
                    type="url"
                    placeholder="https://yourcompany.com/careers/this-role"
                    className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  <p className="mt-1.5 text-xs text-muted">
                    If you already have an application page elsewhere, paste it here — applicants will be sent there instead
                    of applying purely within Baseman. Leave blank to handle applications directly on Baseman.
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-xl border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                      <SlidersHorizontal className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Automatically decline low-match applicants</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">Applicants scoring below your threshold are marked as not selected automatically, so they don't sit in your queue indefinitely.</p>
                    </div>
                  </div>
                  <button onClick={() => setAutoReject((v) => !v)} role="switch" aria-checked={autoReject} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${autoReject ? "bg-brand" : "bg-border"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoReject ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {autoReject && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="mt-5 border-t border-border pt-5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-ink">Minimum match to stay under consideration</label>
                          <span className="rounded-md bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">{threshold}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={5} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-3 w-full accent-brand" />
                        <div className="mt-1 flex justify-between text-[11px] text-muted"><span>0%</span><span>50%</span><span>100%</span></div>
                        <div className="mt-4 flex gap-2.5 rounded-lg bg-brand-light p-3">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                          <p className="text-xs leading-relaxed text-ink">
                            Applicants below {threshold}% are notified automatically that they weren't selected — no one is left waiting on a listing they'll never hear back on. You can still view every applicant regardless of this setting.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handlePublish}
                disabled={submitting || !job.title || !job.location}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>{isEditing ? "Save changes" : "Publish job"} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={null}>
      <PostJobForm />
    </Suspense>
  );
}