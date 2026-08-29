"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, Clock, Trash2, ExternalLink } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import type { AdminJob } from "@/lib/admin-jobs";
import type { Job } from "@/lib/jobs";
import type { AdminApplication } from "@/lib/admin-applications";

function statusTone(status: AdminJob["status"]) {
  if (status === "Active") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Draft") return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-border", text: "text-muted" }; // Closed / Expired
}

function statusToneApp(status: AdminApplication["status"]) {
  if (status === "Interview" || status === "Offer") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Rejected" || status === "Withdrawn") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function AdminJobDetailClient({
  adminJob,
  publicJob,
  applications,
}: {
  adminJob: AdminJob;
  publicJob?: Job;
  applications: AdminApplication[];
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [removed, setRemoved] = useState(false);
  const tone = statusTone(adminJob.status);

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
            <a href="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
            </a>

            {removed ? (
              <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
                <p className="text-sm font-medium text-ink">This listing has been removed</p>
                <p className="mt-1 text-sm text-muted">It's no longer visible on the public site.</p>
                <a href="/admin/jobs" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                  Back to all jobs
                </a>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mt-5 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{adminJob.title}</h1>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tone.bg} ${tone.text}`}>{adminJob.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{adminJob.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {adminJob.views.toLocaleString()} views</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {adminJob.applicants} applicants</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {adminJob.postedDaysAgo === 0 ? "today" : `${adminJob.postedDaysAgo}d ago`}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {adminJob.status !== "Draft" && (
                      <a href={`/jobs/${adminJob.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" /> View public listing
                      </a>
                    )}
                    {!confirmingRemove ? (
                      <button onClick={() => setConfirmingRemove(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 px-3.5 py-2 text-xs font-medium text-error hover:bg-error/5 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setRemoved(true)} className="rounded-lg bg-error px-3.5 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity">
                          Confirm removal
                        </button>
                        <button onClick={() => setConfirmingRemove(false)} className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job details (from public marketplace data) */}
                {publicJob ? (
                  <div className="mt-8 space-y-8">
                    <div>
                      <h2 className="text-sm font-semibold text-ink">About the role</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{publicJob.description}</p>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-ink">Requirements</h2>
                      <ul className="mt-2 space-y-2">
                        {publicJob.requirements.map((r) => (
                          <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-ink">Skills</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {publicJob.skills.map((s) => (
                          <span key={s} className="rounded-md border border-border px-3 py-1 text-xs font-medium text-ink">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <p><span className="text-muted">Salary </span><span className="font-medium text-ink">{publicJob.salary}</span></p>
                      <p><span className="text-muted">Location </span><span className="font-medium text-ink">{publicJob.location}</span></p>
                      <p><span className="text-muted">Type </span><span className="font-medium text-ink">{publicJob.employment}</span></p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-8 text-sm text-muted">No public listing content found for this job (may be a draft).</p>
                )}

                {/* Applicants for this job */}
                <div className="mt-10">
                  <h2 className="text-sm font-semibold text-ink">Applicants ({applications.length})</h2>
                  {applications.length > 0 ? (
                    <div className="mt-3 overflow-hidden rounded-xl border border-border">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                            <th className="px-4 py-3 font-medium">Applicant</th>
                            <th className="px-4 py-3 font-medium">Match</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Applied</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => {
                            const mTone = matchTone(app.match);
                            const sTone = statusToneApp(app.status);
                            return (
                              <tr key={app.id} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 font-medium text-ink">{app.applicantName}</td>
                                <td className="px-4 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{app.match}%</span></td>
                                <td className="px-4 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{app.status}</span></td>
                                <td className="px-4 py-3 text-muted">{app.appliedDaysAgo === 0 ? "Today" : `${app.appliedDaysAgo}d ago`}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No applicants yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}