"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Clock, PlusCircle, MoreVertical, Pencil, Loader2 } from "lucide-react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components/EmployerSidebar";

type ListingStatus = "ACTIVE" | "CLOSED" | "DRAFT" | "EXPIRED";

interface ApiListing {
  id: string;
  title: string;
  employment: string;
  location: string;
  status: ListingStatus;
  autoReject: boolean;
  matchThreshold: number;
  createdAt: string;
  _count: { applications: number };
}

const FILTERS: ("All" | ListingStatus)[] = ["All", "ACTIVE", "DRAFT", "CLOSED", "EXPIRED"];
const statusDisplayLabel: Record<ListingStatus, string> = { ACTIVE: "Active", CLOSED: "Closed", DRAFT: "Draft", EXPIRED: "Expired" };
const employmentLabel: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

function statusTone(status: ListingStatus) {
  if (status === "ACTIVE") return { bg: "bg-success/10", text: "text-success" };
  if (status === "DRAFT") return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-border", text: "text-muted" }; // Closed / Expired
}

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days}d ago`;
}

export default function EmployerListingsPage() {
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | ListingStatus>("All");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchListings = () => {
    setLoading(true);
    setError(null);
    fetch("/api/employer/jobs")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setListings)
      .catch(() => setError("Couldn't load your listings. Try refreshing."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: listings.length };
    FILTERS.slice(1).forEach((s) => (c[s] = listings.filter((l) => l.status === s).length));
    return c;
  }, [listings]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesFilter = filter === "All" || l.status === filter;
      const matchesQuery = !q || l.title.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [listings, filter, query]);

  const toggleStatus = async (listing: ApiListing) => {
    setOpenMenuId(null);
    if (listing.status === "DRAFT") return; // drafts get published via the post flow, not toggled here

    const nextStatus = listing.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
    // Optimistic update
    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: nextStatus } : l)));

    const res = await fetch(`/api/jobs/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      // Revert on failure
      setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: listing.status } : l)));
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <EmployerSidebar />

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">My Listings</h1>
                <p className="mt-1 text-sm text-muted">Every role you've posted, active or not.</p>
              </div>
              <a href="/employers/post" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                <PlusCircle className="h-4 w-4" /> Post a job
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your listings…"
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
                  {f === "All" ? "All" : statusDisplayLabel[f]} <span className="opacity-70">({counts[f] ?? 0})</span>
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
                  {results.map((listing) => {
                    const tone = statusTone(listing.status);
                    return (
                      <motion.div
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="relative flex flex-col gap-4 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <a href={listing.status === "DRAFT" ? `/employers/post?draft=${listing.id}` : `/employers/listings/${listing.id}`} className="group flex-1">
                          <div className="flex items-center gap-2.5">
                            <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{listing.title}</p>
                            <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${tone.bg} ${tone.text}`}>{statusDisplayLabel[listing.status]}</span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span>{employmentLabel[listing.employment] ?? listing.employment}</span>
                            <span>{listing.location}</span>
                            {listing.status !== "DRAFT" && (
                              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {listing._count.applications} applicants</span>
                            )}
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {listing.status === "DRAFT" ? "Not published yet" : `Posted ${daysAgo(listing.createdAt)}`}</span>
                          </div>
                          {listing.status !== "DRAFT" && (
                            <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${listing.autoReject ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                              {listing.autoReject ? `Auto-reject below ${listing.matchThreshold}%` : "Auto-reject off"}
                            </span>
                          )}
                        </a>

                        <div className="relative shrink-0 self-start sm:self-center">
                          <button onClick={() => setOpenMenuId(openMenuId === listing.id ? null : listing.id)} aria-label="Listing actions" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-ink transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          <AnimatePresence>
                            {openMenuId === listing.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
                                  <a href={`/employers/post?edit=${listing.id}`} className="flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-brand-light transition-colors">
                                    <Pencil className="h-3.5 w-3.5" /> Edit listing
                                  </a>
                                  {listing.status !== "DRAFT" && (
                                    <button onClick={() => toggleStatus(listing)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-ink hover:bg-brand-light transition-colors">
                                      {listing.status === "ACTIVE" ? "Close listing" : "Reopen listing"}
                                    </button>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {results.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-medium text-ink">No listings here</p>
                    <p className="mt-1 text-sm text-muted">{query || filter !== "All" ? "Try a different search or filter." : "Post your first job to get started."}</p>
                    <a href="/employers/post" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Post a job</a>
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