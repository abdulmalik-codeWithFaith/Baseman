"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Sparkles,
  UserX,
  UserCheck,
  Clock,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Pencil,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import NavBar from "@/components/Navbar";

type AppStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN" | "AUTO_DECLINED";

interface ApplicantData {
  id: string;
  status: AppStatus;
  match: number | null;
  strengths: string[];
  gaps: string[];
  resumeSnapshotUrl: string | null;
  createdAt: string | Date;
  user: {
    name: string;
    email: string;
    seekerProfile: { skills: string[]; resumeUrl: string | null; resumeFileName: string | null } | null;
  };
}

interface JobData {
  id: string;
  title: string;
  employment: string;
  location: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT" | "EXPIRED";
  autoReject: boolean;
  matchThreshold: number;
  createdAt: string | Date;
  applications: ApplicantData[];
}

const statusDisplay: Record<AppStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  AUTO_DECLINED: "Auto-declined",
};

function statusTone(status: AppStatus) {
  if (status === "INTERVIEW" || status === "OFFER") return { bg: "bg-success/10", text: "text-success" };
  if (status === "AUTO_DECLINED" || status === "REJECTED" || status === "WITHDRAWN") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" }; // Applied
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

const FILTERS: ("All" | AppStatus)[] = ["All", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "AUTO_DECLINED"];

export default function ListingDetailClient({ job: initialJob }: { job: JobData }) {
  const [job, setJob] = useState(initialJob);
  const [filter, setFilter] = useState<"All" | AppStatus>("All");
  const [showAutoDeclined, setShowAutoDeclined] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [autoReject, setAutoReject] = useState(job.autoReject);
  const [threshold, setThreshold] = useState(job.matchThreshold);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: job.applications.length };
    FILTERS.slice(1).forEach((s) => (c[s] = job.applications.filter((a) => a.status === s).length));
    return c;
  }, [job.applications]);

  const results = useMemo(() => {
    return job.applications.filter((a) => {
      if (!showAutoDeclined && a.status === "AUTO_DECLINED" && filter === "All") return false;
      return filter === "All" || a.status === filter;
    });
  }, [job.applications, filter, showAutoDeclined]);

  const selected = job.applications.find((a) => a.id === selectedId) ?? null;

  const anyScored = job.applications.some((a) => a.match !== null);

  const setApplicationStatus = async (id: string, status: "INTERVIEW" | "REJECTED" | "APPLIED") => {
    setActionLoading(id);
    setActionError(null);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setActionLoading(null);

    if (!res.ok) {
      setActionError(data.error || "Couldn't update this applicant.");
      return;
    }

    setJob((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  };

  const saveSettings = async (nextAutoReject: boolean, nextThreshold: number) => {
    setSavingSettings(true);
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoReject: nextAutoReject, matchThreshold: nextThreshold }),
    });
    setSavingSettings(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <a href="/employers/listings" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to listings
        </a>

        {/* Header */}
        <div className="mt-5 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{job.title}</h1>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${job.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-border text-muted"}`}>
                {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>{job.employment}</span>
              <span>{job.location}</span>
            </div>
          </div>
          <a href={`/employers/post?edit=${job.id}`} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
            <Pencil className="h-3.5 w-3.5" /> Edit listing
          </a>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Applicants", value: job.applications.length, icon: Users },
            { label: "Interviewing", value: counts["INTERVIEW"] ?? 0, icon: UserCheck },
            { label: "Scored so far", value: job.applications.filter((a) => a.match !== null).length, icon: Sparkles },
            { label: "Auto-declined", value: counts["AUTO_DECLINED"] ?? 0, icon: UserX },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border p-4">
              <stat.icon className="h-4 w-4 text-brand" />
              <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {!anyScored && job.applications.length > 0 && (
          <div className="mt-6 flex gap-2.5 rounded-lg bg-brand-light p-3 text-xs leading-relaxed text-ink">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            No applicants have a match score yet — AI matching isn't wired up. Auto-decline can't act until scores exist.
          </div>
        )}

        {/* Application settings */}
        <div className="mt-8 rounded-xl border border-border p-5">
          <button onClick={() => setSettingsOpen((v) => !v)} className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-ink">Application settings</p>
                <p className="text-xs text-muted">
                  {autoReject ? `Auto-declining applicants below ${threshold}% match` : "Auto-decline is off for this listing"}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-brand">{settingsOpen ? "Hide" : "Edit"}</span>
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="mt-5 border-t border-border pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink">Automatically decline low-match applicants</p>
                    <button
                      onClick={() => {
                        const next = !autoReject;
                        setAutoReject(next);
                        saveSettings(next, threshold);
                      }}
                      role="switch"
                      aria-checked={autoReject}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${autoReject ? "bg-brand" : "bg-border"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoReject ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                  {autoReject && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-ink">Minimum match threshold</label>
                        <span className="flex items-center gap-1.5 rounded-md bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">
                          {savingSettings && <Loader2 className="h-3 w-3 animate-spin" />} {threshold}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        onMouseUp={() => saveSettings(autoReject, threshold)}
                        onTouchEnd={() => saveSettings(autoReject, threshold)}
                        className="mt-3 w-full accent-brand"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Applicants */}
        <div className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-ink">Applicants</h2>
            <button onClick={() => setShowAutoDeclined((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
              {showAutoDeclined ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showAutoDeclined ? "Hide auto-declined" : `Show auto-declined (${counts["AUTO_DECLINED"] ?? 0})`}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-brand text-white" : "border border-border text-muted hover:text-ink"}`}>
                {f === "All" ? "All" : statusDisplay[f]} <span className="opacity-70">({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>

          {actionError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {actionError}
            </div>
          )}

          <div className="mt-5 space-y-3">
            <AnimatePresence mode="popLayout">
              {results.map((applicant) => {
                const mTone = applicant.match !== null ? matchTone(applicant.match) : null;
                const sTone = statusTone(applicant.status);
                const isFinal = applicant.status === "AUTO_DECLINED";
                const isLoading = actionLoading === applicant.id;

                return (
                  <motion.div
                    key={applicant.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedId(applicant.id)}
                    className="flex cursor-pointer flex-col gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand">
                        {applicant.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{applicant.user.name}</p>
                        <p className="text-xs text-muted">Applied {new Date(applicant.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {mTone ? (
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{applicant.match}% match</span>
                      ) : (
                        <span className="rounded-md bg-border px-2 py-1 text-xs font-medium text-muted">Not scored yet</span>
                      )}
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{statusDisplay[applicant.status]}</span>

                      {!isFinal && (
                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted" />
                          ) : (
                            <>
                              {applicant.status !== "INTERVIEW" && (
                                <button onClick={() => setApplicationStatus(applicant.id, "INTERVIEW")} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                                  Move to Interview
                                </button>
                              )}
                              {applicant.status !== "REJECTED" && (
                                <button onClick={() => setApplicationStatus(applicant.id, "REJECTED")} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted hover:bg-error/5 hover:text-error transition-colors">
                                  Reject
                                </button>
                              )}
                              {applicant.status !== "APPLIED" && (
                                <button onClick={() => setApplicationStatus(applicant.id, "APPLIED")} className="text-xs font-medium text-muted hover:text-ink transition-colors">
                                  Undo
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {results.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center">
                <p className="text-sm font-medium text-ink">No applicants match this filter</p>
                <p className="mt-1 text-sm text-muted">Try a different filter, or check "Show auto-declined."</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applicant slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="fixed inset-0 z-40 bg-ink/40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeOut" }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-border p-5">
                <p className="text-sm font-semibold text-ink">Applicant profile</p>
                <button onClick={() => setSelectedId(null)} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-ink transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-base font-semibold text-brand">
                    {selected.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{selected.user.name}</p>
                    <p className="text-xs text-muted">{selected.user.email}</p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-border">
                  {selected.match !== null ? (
                    <>
                      <div className="bg-brand p-5 text-white">
                        <p className="text-xs font-medium uppercase tracking-wide text-white/60">AI Match</p>
                        <p className="mt-1 text-4xl font-bold">{selected.match}%</p>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${selected.match}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="space-y-4 p-5">
                        {selected.strengths.length > 0 && (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted">Strong matches</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {selected.strengths.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"><CheckCircle2 className="h-3 w-3" /> {s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selected.gaps.length > 0 && (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted">Gaps</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {selected.gaps.map((g) => (
                                <span key={g} className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning"><AlertCircle className="h-3 w-3" /> {g}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-center text-sm text-muted">Not scored yet — AI matching isn't wired up.</div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.user.seekerProfile?.skills && selected.user.seekerProfile.skills.length > 0 ? (
                      selected.user.seekerProfile.skills.map((s) => (
                        <span key={s} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink">{s}</span>
                      ))
                    ) : (
                      <span className="text-xs text-muted">No skills listed yet.</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-xs font-medium text-ink">
                      {selected.user.seekerProfile?.resumeFileName ?? "No resume uploaded"}
                    </p>
                  </div>
                  {selected.user.seekerProfile?.resumeUrl && (
                    <a href={selected.user.seekerProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                      View
                    </a>
                  )}
                </div>

                {selected.status !== "AUTO_DECLINED" && (
                  <div className="mt-6 flex gap-2">
                    {selected.status !== "INTERVIEW" && (
                      <button onClick={() => setApplicationStatus(selected.id, "INTERVIEW")} className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Move to Interview</button>
                    )}
                    {selected.status !== "REJECTED" && (
                      <button onClick={() => setApplicationStatus(selected.id, "REJECTED")} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-ink hover:bg-error/5 hover:text-error transition-colors">Reject</button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}