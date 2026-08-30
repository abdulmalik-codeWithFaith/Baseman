"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Sparkles,
  UserX,
  ArrowRight,
  Clock,
  PlusCircle,
  Loader2,
} from "lucide-react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components/EmployerSidebar";

const statusDisplay: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  AUTO_DECLINED: "Auto-declined",
};

function statusTone(status: string) {
  if (status === "INTERVIEW" || status === "OFFER") return { bg: "bg-success/10", text: "text-success" };
  if (status === "REJECTED" || status === "WITHDRAWN" || status === "AUTO_DECLINED") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days}d ago`;
}

interface DashboardData {
  activeListings: {
    id: string;
    title: string;
    applicants: number;
    avgMatch: number | null;
    autoReject: boolean;
    matchThreshold: number;
    createdAt: string;
  }[];
  totalApplicants: number;
  autoDeclinedCount: number;
  avgMatch: number | null;
  recentApplicants: {
    id: string;
    name: string;
    jobTitle: string;
    match: number | null;
    status: string;
    createdAt: string;
  }[];
}

export default function EmployerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employer/dashboard")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <main className="min-h-screen bg-white">
        <NavBar />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      </main>
    );
  }

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
                { label: "Active listings", value: data.activeListings.length, icon: Briefcase },
                { label: "Total applicants", value: data.totalApplicants, icon: Users },
                { label: "Avg. match score", value: data.avgMatch !== null ? `${data.avgMatch}%` : "—", icon: Sparkles },
                { label: "Auto-declined", value: data.autoDeclinedCount, icon: UserX },
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
                {data.activeListings.length === 0 && (
                  <p className="text-sm text-muted">No active listings yet. Post your first job to get started.</p>
                )}
                {data.activeListings.map((listing) => (
                  <a
                    key={listing.id}
                    href={`/employers/listings/${listing.id}`}
                    className="group flex flex-col gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{listing.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {listing.applicants} applicants</span>
                        <span>Avg. match {listing.avgMatch !== null ? `${listing.avgMatch}%` : "not scored yet"}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {daysAgo(listing.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${listing.autoReject ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                      {listing.autoReject ? `Auto-reject below ${listing.matchThreshold}%` : "Auto-reject off"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent applicants */}
            <div>
              <h2 className="text-lg font-semibold text-ink">Recent applicants</h2>
              {data.recentApplicants.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No applicants yet.</p>
              ) : (
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
                      {data.recentApplicants.map((a) => {
                        const sTone = statusTone(a.status);
                        return (
                          <tr key={a.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                            <td className="px-4 py-3 text-muted">{a.jobTitle}</td>
                            <td className="px-4 py-3">
                              {a.match !== null ? (
                                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${matchTone(a.match).bg} ${matchTone(a.match).text}`}>{a.match}%</span>
                              ) : (
                                <span className="rounded-md bg-border px-2 py-1 text-xs font-medium text-muted">Not scored</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{statusDisplay[a.status]}</span>
                            </td>
                            <td className="px-4 py-3 text-muted">{daysAgo(a.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}