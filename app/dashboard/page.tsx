"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  Settings,
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
  TrendingUp,
  CheckCircle2,
  Circle,
} from "lucide-react";
import NavBar from "@/components/Navbar";
import { JOBS } from "@/lib/jobs";

/* ---------------------------------------------------------------
   Mock user + application data — replace with real queries once
   auth and the database are wired up.
---------------------------------------------------------------- */

const MOCK_USER = { name: "Jordan Lee" };

const PROFILE_COMPLETION = 72;
const MISSING_PROFILE_ITEMS = [
  "Add a professional summary",
  "Add 1 more project",
  "Add a certification",
  "Add your portfolio URL",
];

const APPLICATIONS = [
  { jobId: "1", status: "Interview", appliedDaysAgo: 3 },
  { jobId: "3", status: "Applied", appliedDaysAgo: 1 },
  { jobId: "7", status: "Rejected", appliedDaysAgo: 9 },
  { jobId: "5", status: "Applied", appliedDaysAgo: 5 },
];

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/applications", label: "My Applications", icon: ClipboardList, active: false },
  { href: "/saved", label: "Saved Jobs", icon: Bookmark, active: false },
  { href: "/settings", label: "Settings", icon: Settings, active: false },
];

function statusTone(status: string) {
  if (status === "Interview") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Offer") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Rejected") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" }; // Applied
}

function matchTone(score: number) {
  if (score >= 75) return { bg: "bg-success/10", text: "text-success" };
  if (score >= 50) return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-brand-light", text: "text-brand" };
}

export default function DashboardPage() {
  const recommendedJobs = useMemo(
    () => JOBS.filter((j) => j.match !== undefined).sort((a, b) => (b.match ?? 0) - (a.match ?? 0)).slice(0, 3),
    []
  );

  const applications = useMemo(
    () =>
      APPLICATIONS.map((a) => ({ ...a, job: JOBS.find((j) => j.id === a.jobId) })).filter(
        (a) => a.job !== undefined
      ),
    []
  );

  const avgMatch = useMemo(() => {
    const scored = applications.map((a) => a.job?.match).filter((m): m is number => m !== undefined);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((sum, m) => sum + m, 0) / scored.length);
  }, [applications]);

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* ---------------- Sidebar ---------------- */}
          <aside className="hidden md:block">
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    link.active ? "bg-brand-light text-brand" : "text-muted hover:bg-brand-light/50 hover:text-ink"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ---------------- Main content ---------------- */}
          <div className="space-y-10">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back, {MOCK_USER.name.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-muted">Here's where things stand with your search.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Applications", value: applications.length, icon: ClipboardList },
                { label: "Interviews", value: applications.filter((a) => a.status === "Interview").length, icon: TrendingUp },
                { label: "Saved jobs", value: 5, icon: Bookmark },
                { label: "Avg. match score", value: `${avgMatch}%`, icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-4">
                  <stat.icon className="h-4 w-4 text-brand" />
                  <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile completion */}
            {PROFILE_COMPLETION < 100 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-xl border border-border bg-brand-light/40 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4.5 w-4.5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Your profile is {PROFILE_COMPLETION}% complete</p>
                      <p className="text-xs text-muted">A complete profile gives the AI more to work with for matching and resume tailoring.</p>
                    </div>
                  </div>
                  <a href="/settings" className="shrink-0 rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90 transition-colors">
                    Complete profile
                  </a>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${PROFILE_COMPLETION}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-brand"
                  />
                </div>
                <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
                  {MISSING_PROFILE_ITEMS.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted">
                      <Circle className="h-3 w-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommended jobs */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Recommended for you</h2>
                <a href="/jobs" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                  Browse all jobs <ArrowRight className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-4 space-y-3">
                {recommendedJobs.map((job) => {
                  const tone = matchTone(job.match!);
                  return (
                    <a key={job.id} href={`/jobs/${job.id}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{job.title}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                            {job.company} · <MapPin className="h-3 w-3" /> {job.location}
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>{job.match}% match</span>
                    </a>
                  );
                })}
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
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                      <th className="px-4 py-3 font-medium">Job</th>
                      <th className="px-4 py-3 font-medium">Match</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const tone = statusTone(app.status);
                      return (
                        <tr key={app.jobId} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <a href={`/jobs/${app.jobId}`} className="font-medium text-ink hover:text-brand transition-colors">
                              {app.job?.title}
                            </a>
                            <p className="text-xs text-muted">{app.job?.company}</p>
                          </td>
                          <td className="px-4 py-3 text-ink">{app.job?.match ?? "—"}%</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>{app.status}</span>
                          </td>
                          <td className="px-4 py-3 text-muted">{app.appliedDaysAgo}d ago</td>
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