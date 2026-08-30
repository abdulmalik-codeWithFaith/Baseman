"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Bookmark,
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
  Circle,
  Loader2,
} from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

const remoteLabel: Record<string, string> = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "On-site" };
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

interface DashboardData {
  name: string;
  profileCompletion: number;
  missingItems: string[];
  stats: { applications: number; interviews: number; savedJobs: number };
  recentApplications: {
    id: string;
    status: string;
    match: number | null;
    job: { id: string; title: string; company: { name: string } };
  }[];
  latestJobs: {
    id: string;
    title: string;
    location: string;
    remote: string;
    company: { name: string };
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
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
          <DashboardSidebar />
          <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back, {data.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-muted">Here's where things stand with your search.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Applications", value: data.stats.applications, icon: ClipboardList },
              { label: "Interviews", value: data.stats.interviews, icon: Sparkles },
              { label: "Saved jobs", value: data.stats.savedJobs, icon: Bookmark },
              { label: "Profile complete", value: `${data.profileCompletion}%`, icon: FileText },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border p-4">
                <stat.icon className="h-4 w-4 text-brand" />
                <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Profile completion */}
          {data.profileCompletion < 100 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-xl border border-border bg-brand-light/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4.5 w-4.5 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Your profile is {data.profileCompletion}% complete</p>
                    <p className="text-xs text-muted">A complete profile gives the AI more to work with once matching is live.</p>
                  </div>
                </div>
                <a href="/settings" className="shrink-0 rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90 transition-colors">
                  Complete profile
                </a>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.profileCompletion}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full bg-brand" />
              </div>
              {data.missingItems.length > 0 && (
                <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
                  {data.missingItems.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted">
                      <Circle className="h-3 w-3" /> {item}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Latest jobs — not an AI recommendation, just recent listings */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Latest jobs</h2>
              <a href="/jobs" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                Browse all jobs <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-4 space-y-3">
              {data.latestJobs.length === 0 && <p className="text-sm text-muted">No active listings yet.</p>}
              {data.latestJobs.map((job) => (
                <a key={job.id} href={`/jobs/${job.id}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                      {job.company.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{job.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                        {job.company.name} · <MapPin className="h-3 w-3" /> {job.location} · {remoteLabel[job.remote] ?? job.remote}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-brand">Check match →</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent applications */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Recent applications</h2>
              <a href="/applications" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            {data.recentApplications.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No applications yet — once you apply to a job, it'll show up here.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                      <th className="px-4 py-3 font-medium">Job</th>
                      <th className="px-4 py-3 font-medium">Match</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentApplications.map((app) => {
                      const tone = statusTone(app.status);
                      return (
                        <tr key={app.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <a href={`/jobs/${app.job.id}`} className="font-medium text-ink hover:text-brand transition-colors">{app.job.title}</a>
                            <p className="text-xs text-muted">{app.job.company.name}</p>
                          </td>
                          <td className="px-4 py-3 text-ink">{app.match !== null ? `${app.match}%` : "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>{statusDisplay[app.status]}</span>
                          </td>
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