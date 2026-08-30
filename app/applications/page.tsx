"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN" | "AUTO_DECLINED";

interface ApiApplication {
  id: string;
  status: Status;
  match: number | null;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    company: { name: string };
  };
}

const FILTERS: ("All" | Status)[] = ["All", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];
const statusDisplay: Record<Status, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  AUTO_DECLINED: "Auto-declined",
};

function statusTone(status: Status) {
  if (status === "INTERVIEW" || status === "OFFER") return { bg: "bg-success/10", text: "text-success" };
  if (status === "REJECTED" || status === "WITHDRAWN" || status === "AUTO_DECLINED") return { bg: "bg-border", text: "text-muted" };
  return { bg: "bg-brand-light", text: "text-brand" }; // Applied
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [query, setQuery] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setApplications)
      .catch(() => setError("Couldn't load your applications. Try refreshing."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: applications.length };
    FILTERS.slice(1).forEach((s) => (c[s] = applications.filter((a) => a.status === s).length));
    return c;
  }, [applications]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const matchesFilter = filter === "All" || a.status === filter;
      const matchesQuery = !q || a.job.title.toLowerCase().includes(q) || a.job.company.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [applications, filter, query]);

  const withdraw = async (id: string) => {
    setWithdrawingId(id);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "WITHDRAWN" }),
    });
    setWithdrawingId(null);
    if (res.ok) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "WITHDRAWN" } : a)));
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <DashboardSidebar />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">My Applications</h1>
            <p className="mt-1 text-sm text-muted">Every job you've applied to, and where it stands.</p>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your applications…"
                className="w-full bg-transparent px-1 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted hover:bg-brand-light hover:text-ink transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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
                  {f === "All" ? "All" : statusDisplay[f]} <span className="opacity-70">({counts[f] ?? 0})</span>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-10 flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
              </div>
            )}

            {error && !loading && (
              <div className="mt-6 rounded-xl border border-dashed border-error/30 bg-error/5 p-6 text-center text-sm text-error">{error}</div>
            )}

            {!loading && !error && (
              <div className="mt-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {results.map((app) => {
                    const sTone = statusTone(app.status);
                    const mTone = app.match !== null ? matchTone(app.match) : null;
                    const canWithdraw = app.status === "APPLIED" || app.status === "INTERVIEW";
                    const isWithdrawing = withdrawingId === app.id;

                    return (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">
                            {app.job.company.name.charAt(0)}
                          </div>
                          <div>
                            <a href={`/jobs/${app.job.id}`} className="text-sm font-semibold text-ink hover:text-brand transition-colors">
                              {app.job.title}
                            </a>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                              {app.job.company.name} · <MapPin className="h-3 w-3" /> {app.job.location}
                            </p>
                            <p className="mt-1 text-xs text-muted">Applied {daysAgo(app.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                          <div className="flex items-center gap-2">
                            {mTone ? (
                              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${mTone.bg} ${mTone.text}`}>{app.match}% match</span>
                            ) : (
                              <span className="rounded-md bg-border px-2 py-1 text-xs font-medium text-muted">Not scored yet</span>
                            )}
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${sTone.bg} ${sTone.text}`}>{statusDisplay[app.status]}</span>
                          </div>
                          {canWithdraw && (
                            <button
                              onClick={() => withdraw(app.id)}
                              disabled={isWithdrawing}
                              className="text-xs font-medium text-muted hover:text-error transition-colors disabled:opacity-50"
                            >
                              {isWithdrawing ? "Withdrawing…" : "Withdraw"}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {results.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-medium text-ink">No applications here yet</p>
                    <p className="mt-1 text-sm text-muted">
                      {query || filter !== "All" ? "Try a different search or filter." : "Once you apply to a job, it'll show up here."}
                    </p>
                    <a href="/jobs" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                      Browse jobs
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}