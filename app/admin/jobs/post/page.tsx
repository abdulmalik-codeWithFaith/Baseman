"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

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

const remoteToEnum: Record<StructuredJob["remote"], string> = { Remote: "REMOTE", Hybrid: "HYBRID", "On-site": "ONSITE" };
const remoteFromEnum: Record<string, StructuredJob["remote"]> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
const employmentToEnum: Record<StructuredJob["employment"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
};
const experienceToEnum: Record<StructuredJob["experience"], string> = { Entry: "ENTRY", Mid: "MID", Senior: "SENIOR" };

type Method = "ai" | "manual" | null;

export default function AdminPostJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    industry: "",
    size: "",
    website: "",
    headquarters: "",
    description: "",
  });

  const [method, setMethod] = useState<Method>(null);
  const [pastedText, setPastedText] = useState("");
  const [importState, setImportState] = useState<"idle" | "importing" | "imported">("idle");
  const [importError, setImportError] = useState<string | null>(null);
  const [job, setJob] = useState<StructuredJob>(EMPTY_JOB);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/companies")
      .then((res) => res.json())
      .then(setCompanies)
      .catch(() => {});
  }, []);

  const showForm = method === "manual" || (method === "ai" && importState === "imported");

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
        employment: (["Full-time", "Part-time", "Contract", "Internship"].find((e) => employmentToEnum[e as StructuredJob["employment"]] === data.employment) as StructuredJob["employment"]) ?? "Full-time",
        experience: (["Entry", "Mid", "Senior"].find((e) => experienceToEnum[e as StructuredJob["experience"]] === data.experience) as StructuredJob["experience"]) ?? "Mid",
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
      companyName,
      companyDetails: showCompanyDetails ? companyDetails : undefined,
      title: job.title,
      description: job.description,
      responsibilities: [],
      requirements: [],
      skills: job.skills,
      location: job.location,
      remote: remoteToEnum[job.remote],
      employment: employmentToEnum[job.employment],
      experience: experienceToEnum[job.experience],
      salary: job.salary || null,
      applicationUrl: job.applicationUrl || null,
      status: "ACTIVE",
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to publish this job.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/jobs");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

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

          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Post a job (as admin)</h1>
            <p className="mt-2 text-sm text-muted">Create a listing on behalf of any company on the platform.</p>

            {/* Company — type freely, suggestions from existing companies via datalist */}
            <div className="mt-6">
              <label className="text-xs font-medium text-ink">Company</label>
              <input
                list="existing-companies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Type a company name — new or existing"
                className="mt-1.5 w-full max-w-sm rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <datalist id="existing-companies">
                {companies.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              <p className="mt-1.5 text-xs text-muted">
                Matches an existing company by name if one exists, otherwise creates a new one.
              </p>

              {!showCompanyDetails ? (
                <button
                  onClick={() => setShowCompanyDetails(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add company details
                </button>
              ) : (
                <div className="mt-4 grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
                  <p className="text-xs text-muted sm:col-span-2">
                    Only used if this creates a <span className="font-medium text-ink">new</span> company — won't overwrite an existing one's saved profile.
                  </p>
                  <input value={companyDetails.industry} onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })} placeholder="Industry" className="rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  <input value={companyDetails.size} onChange={(e) => setCompanyDetails({ ...companyDetails, size: e.target.value })} placeholder="Company size" className="rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  <input value={companyDetails.website} onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })} placeholder="Website" className="rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  <input value={companyDetails.headquarters} onChange={(e) => setCompanyDetails({ ...companyDetails, headquarters: e.target.value })} placeholder="Headquarters" className="rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  <textarea value={companyDetails.description} onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })} placeholder="Short description" rows={2} className="resize-none rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand sm:col-span-2" />
                  <button onClick={() => setShowCompanyDetails(false)} className="text-left text-xs font-medium text-muted hover:text-ink sm:col-span-2">
                    Remove details
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-border pt-8">
                <AnimatePresence mode="wait">
                  {method === null && (
                    <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                      <p className="text-sm font-semibold text-ink">How would you like to create this listing?</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button onClick={() => setMethod("ai")} className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-brand hover:bg-brand-light/50">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand"><Sparkles className="h-4.5 w-4.5" /></div>
                          <div>
                            <p className="text-sm font-semibold text-ink">Paste with AI</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted">Paste a job description and let Baseman structure it.</p>
                          </div>
                        </button>
                        <button onClick={() => setMethod("manual")} className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-brand hover:bg-brand-light/50">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand"><FileEdit className="h-4.5 w-4.5" /></div>
                          <div>
                            <p className="text-sm font-semibold text-ink">Fill in manually</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted">Type the listing fields directly.</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {method === "ai" && importState !== "imported" && (
                    <motion.div key="ai-paste" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                      <button onClick={resetMethod} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Change method</button>
                      <textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)} placeholder="Paste the full job description…" rows={7} className="mt-4 w-full resize-none rounded-xl border border-border p-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      {importError && <div className="mt-3 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {importError}</div>}
                      <button onClick={handleImport} disabled={!pastedText.trim() || importState === "importing"} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40">
                        {importState === "importing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Structuring with AI…</>) : (<><Sparkles className="h-4 w-4" /> Import with AI</>)}
                      </button>
                    </motion.div>
                  )}

                  {showForm && (
                    <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                      <button onClick={resetMethod} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Change method</button>

                      {submitError && <div className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {submitError}</div>}

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium text-ink">Job title</label>
                          <input value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink">Location</label>
                          <input value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink">Remote type</label>
                          <select value={job.remote} onChange={(e) => setJob({ ...job, remote: e.target.value as StructuredJob["remote"] })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                            <option>Remote</option><option>Hybrid</option><option>On-site</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink">Employment type</label>
                          <select value={job.employment} onChange={(e) => setJob({ ...job, employment: e.target.value as StructuredJob["employment"] })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink">Experience level</label>
                          <select value={job.experience} onChange={(e) => setJob({ ...job, experience: e.target.value as StructuredJob["experience"] })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                            <option>Entry</option><option>Mid</option><option>Senior</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ink">Salary</label>
                          <input value={job.salary} onChange={(e) => setJob({ ...job, salary: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-ink">Skills</label>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
                            {job.skills.map((skill) => (
                              <span key={skill} className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2.5 py-1 text-xs font-medium text-brand">
                                {skill}<button onClick={() => removeSkill(skill)}><X className="h-3 w-3" /></button>
                              </span>
                            ))}
                            <div className="flex items-center gap-1">
                              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill…" className="w-28 bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none" />
                              <button onClick={addSkill} className="text-muted hover:text-brand"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-ink">Description</label>
                          <textarea value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} rows={4} className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-ink">Application URL <span className="font-normal text-muted">(optional)</span></label>
                          <input value={job.applicationUrl} onChange={(e) => setJob({ ...job, applicationUrl: e.target.value })} type="url" placeholder="https://company.com/careers/role" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                          <p className="mt-1.5 text-xs text-muted">If set, applicants are sent here when they click Apply, instead of applying purely within Baseman.</p>
                        </div>
                      </div>

                      <button onClick={handlePublish} disabled={submitting || !job.title || !job.location} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Publish job <ArrowRight className="h-4 w-4" /></>)}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}