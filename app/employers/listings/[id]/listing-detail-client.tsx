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
} from "lucide-react";
import NavBar from "@/components/Navbar";
import type { EmployerListing } from "@/lib/employer-listings";
import type { Applicant } from "@/lib/applicants";

type StatusLabel = "Shortlisted" | "Declined" | "Auto-declined" | "Under review";
type Tone = "success" | "muted" | "brand";

function computeStatus(applicant: Applicant, listing: EmployerListing): { label: StatusLabel; tone: Tone } {
  if (applicant.manualStatus === "Shortlisted") return { label: "Shortlisted", tone: "success" };
  if (applicant.manualStatus === "Declined") return { label: "Declined", tone: "muted" };
  if (listing.autoReject && applicant.match < listing.threshold) return { label: "Auto-declined", tone: "muted" };
  return { label: "Under review", tone: "brand" };
}

function toneClasses(tone: Tone) {
  if (tone === "success") return { bg: "bg-success/10", text: "text-success" };
  if (tone === "muted") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

const FILTERS: ("All" | StatusLabel)[] = ["All", "Shortlisted", "Under review", "Auto-declined", "Declined"];

export default function ListingDetailClient({
  listing,
  initialApplicants,
}: {
  listing: EmployerListing;
  initialApplicants: Applicant[];
}) {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [filter, setFilter] = useState<"All" | StatusLabel>("All");
  const [showAutoDeclined, setShowAutoDeclined] = useState(false);

  const [autoReject, setAutoReject] = useState(listing.autoReject);
  const [threshold, setThreshold] = useState(listing.threshold);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const withStatus = useMemo(() => {
    const effectiveListing = { ...listing, autoReject, threshold };
    return applicants.map((a) => ({ ...a, status: computeStatus(a, effectiveListing) }));
  }, [applicants, autoReject, threshold, listing]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: withStatus.length };
    FILTERS.slice(1).forEach((s) => (c[s] = withStatus.filter((a) => a.status.label === s).length));
    return c;
  }, [withStatus]);

  const results = useMemo(() => {
    return withStatus.filter((a) => {
      if (!showAutoDeclined && a.status.label === "Auto-declined" && filter === "All") return false;
      return filter === "All" || a.status.label === filter;
    });
  }, [withStatus, filter, showAutoDeclined]);

  const setManualStatus = (id: string, status: "Shortlisted" | "Declined" | null) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, manualStatus: status } : a)));
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
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{listing.title}</h1>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${listing.status === "Active" ? "bg-success/10 text-success" : "bg-border text-muted"}`}>
                {listing.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>{listing.employment}</span>
              <span>{listing.location}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {listing.postedDaysAgo}d ago</span>
            </div>
          </div>
          <a href={`/employers/post?edit=${listing.id}`} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
            <Pencil className="h-3.5 w-3.5" /> Edit listing
          </a>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Applicants", value: withStatus.length, icon: Users },
            { label: "Shortlisted", value: counts["Shortlisted"] ?? 0, icon: UserCheck },
            { label: "Avg. match", value: `${listing.avgMatch}%`, icon: Sparkles },
            { label: "Auto-declined", value: counts["Auto-declined"] ?? 0, icon: UserX },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border p-4">
              <stat.icon className="h-4 w-4 text-brand" />
              <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Application settings (editable auto-reject) */}
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
                      onClick={() => setAutoReject((v) => !v)}
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
                        <span className="rounded-md bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">{threshold}%</span>
                      </div>
                      <input type="range" min={0} max={100} step={5} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-3 w-full accent-brand" />
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
            <button
              onClick={() => setShowAutoDeclined((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"
            >
              {showAutoDeclined ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showAutoDeclined ? "Hide auto-declined" : `Show auto-declined (${counts["Auto-declined"] ?? 0})`}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-brand text-white" : "border border-border text-muted hover:text-ink"
                }`}
              >
                {f} <span className="opacity-70">({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <AnimatePresence mode="popLayout">
              {results.map((applicant) => {
                const mTone = matchTone(applicant.match);
                const sTone = toneClasses(applicant.status.tone);
                return (
                  <motion.div
                    key={applicant.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{applicant.name}</p>
                        <p className="text-xs text-muted">Applied {applicant.appliedDaysAgo}d ago</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{applicant.match}% match</span>
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{applicant.status.label}</span>

                      {applicant.status.label !== "Auto-declined" && (
                        <div className="flex gap-1.5">
                          {applicant.manualStatus !== "Shortlisted" && (
                            <button onClick={() => setManualStatus(applicant.id, "Shortlisted")} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                              Shortlist
                            </button>
                          )}
                          {applicant.manualStatus !== "Declined" && (
                            <button onClick={() => setManualStatus(applicant.id, "Declined")} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted hover:bg-error/5 hover:text-error transition-colors">
                              Decline
                            </button>
                          )}
                          {applicant.manualStatus && (
                            <button onClick={() => setManualStatus(applicant.id, null)} className="text-xs font-medium text-muted hover:text-ink transition-colors">
                              Undo
                            </button>
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
    </main>
  );
}