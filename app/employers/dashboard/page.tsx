"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Sparkles,
  UserX,
  ArrowRight,
  Clock,
  PlusCircle,
} from "lucide-react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components//EmployerSidebar";

/* ---------------------------------------------------------------
   Mock employer data — replace with real queries (by employer
   account id) once the backend exists.
---------------------------------------------------------------- */

interface Listing {
  id: string;
  title: string;
  applicants: number;
  avgMatch: number;
  autoReject: boolean;
  threshold: number;
  postedDaysAgo: number;
}

const LISTINGS: Listing[] = [
  { id: "1", title: "Senior Frontend Developer", applicants: 24, avgMatch: 68, autoReject: true, threshold: 50, postedDaysAgo: 2 },
  { id: "3", title: "Backend Engineer", applicants: 31, avgMatch: 74, autoReject: true, threshold: 60, postedDaysAgo: 1 },
  { id: "7", title: "Engineering Manager", applicants: 9, avgMatch: 58, autoReject: false, threshold: 50, postedDaysAgo: 5 },
  { id: "9", title: "DevOps Engineer", applicants: 15, avgMatch: 71, autoReject: true, threshold: 50, postedDaysAgo: 1 },
];

interface RawApplicant {
  name: string;
  jobId: string;
  match: number;
  appliedDaysAgo: number;
}

const RAW_APPLICANTS: RawApplicant[] = [
  { name: "A. Rivera", jobId: "1", match: 86, appliedDaysAgo: 1 },
  { name: "J. Kim", jobId: "1", match: 42, appliedDaysAgo: 1 },
  { name: "M. Chen", jobId: "3", match: 91, appliedDaysAgo: 1 },
  { name: "S. Patel", jobId: "3", match: 55, appliedDaysAgo: 2 },
  { name: "T. Nguyen", jobId: "9", match: 38, appliedDaysAgo: 1 },
  { name: "R. Cole", jobId: "9", match: 78, appliedDaysAgo: 2 },
  { name: "D. Okafor", jobId: "7", match: 47, appliedDaysAgo: 3 },
  { name: "L. Fischer", jobId: "3", match: 68, appliedDaysAgo: 3 },
];

function statusFor(applicant: RawApplicant, listing: Listing | undefined) {
  if (!listing) return { label: "Under review", tone: "brand" as const };
  if (listing.autoReject && applicant.match < listing.threshold) {
    return { label: "Auto-declined", tone: "muted" as const };
  }
  if (applicant.match >= 80) return { label: "Shortlisted", tone: "success" as const };
  return { label: "Under review", tone: "brand" as const };
}

function toneClasses(tone: "success" | "muted" | "brand") {
  if (tone === "success") return { bg: "bg-success/10", text: "text-success" };
  if (tone === "muted") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function EmployerDashboardPage() {
  const applicants = useMemo(
    () =>
      RAW_APPLICANTS.map((a) => {
        const listing = LISTINGS.find((l) => l.id === a.jobId);
        return { ...a, listing, status: statusFor(a, listing) };
      }),
    []
  );

  const totalApplicants = LISTINGS.reduce((sum, l) => sum + l.applicants, 0);
  const autoDeclinedCount = applicants.filter((a) => a.status.label === "Auto-declined").length;
  const avgMatchAcrossListings = Math.round(LISTINGS.reduce((sum, l) => sum + l.avgMatch, 0) / LISTINGS.length);

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <EmployerSidebar />

          <div className="space-y-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">Hiring dashboard</h1>
                <p className="mt-1 text-sm text-muted">Your open roles and who's applying.</p>
              </div>
              <a href="/employers/post" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                <PlusCircle className="h-4 w-4" /> Post a job
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Active listings", value: LISTINGS.length, icon: Briefcase },
                { label: "Total applicants", value: totalApplicants, icon: Users },
                { label: "Avg. match score", value: `${avgMatchAcrossListings}%`, icon: Sparkles },
                { label: "Auto-declined", value: autoDeclinedCount, icon: UserX },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-4">
                  <stat.icon className="h-4 w-4 text-brand" />
                  <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Active listings */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Active listings</h2>
                <a href="/employers/listings" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                  View all <ArrowRight className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-4 space-y-3">
                {LISTINGS.map((listing) => (
                  <a
                    key={listing.id}
                    href={`/employers/listings/${listing.id}`}
                    className="group flex flex-col gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{listing.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {listing.applicants} applicants</span>
                        <span>Avg. match {listing.avgMatch}%</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {listing.postedDaysAgo}d ago</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${listing.autoReject ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                      {listing.autoReject ? `Auto-reject below ${listing.threshold}%` : "Auto-reject off"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent applicants */}
            <div>
              <h2 className="text-lg font-semibold text-ink">Recent applicants</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                      <th className="px-4 py-3 font-medium">Applicant</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Match</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((a, i) => {
                      const mTone = matchTone(a.match);
                      const sTone = toneClasses(a.status.tone);
                      return (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                          <td className="px-4 py-3 text-muted">{a.listing?.title ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{a.match}%</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{a.status.label}</span>
                          </td>
                          <td className="px-4 py-3 text-muted">{a.appliedDaysAgo}d ago</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}