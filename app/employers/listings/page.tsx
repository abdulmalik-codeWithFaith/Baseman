"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Clock, PlusCircle, MoreVertical, Pencil } from "lucide-react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components/EmployerSidebar";
import { LISTINGS as INITIAL_LISTINGS, type ListingStatus } from "@/lib/employer-listings";

const FILTERS: ("All" | ListingStatus)[] = ["All", "Active", "Draft", "Closed"];

function statusTone(status: ListingStatus) {
  if (status === "Active") return { bg: "bg-success/10", text: "text-success" };
  if (status === "Draft") return { bg: "bg-warning/10", text: "text-warning" };
  return { bg: "bg-border", text: "text-muted" }; // Closed
}

export default function EmployerListingsPage() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [filter, setFilter] = useState<"All" | ListingStatus>("All");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const toggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        if (l.status === "Active") return { ...l, status: "Closed" };
        if (l.status === "Closed") return { ...l, status: "Active" };
        return l; // Drafts get published via the post flow, not toggled here
      })
    );
    setOpenMenuId(null);
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

            {/* Search */}
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

            {/* Filter tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f ? "bg-brand text-white" : "border border-border text-muted hover:text-ink"
                  }`}
                >
                  {f} <span className="opacity-70">({counts[f]})</span>
                </button>
              ))}
            </div>

            {/* Listings */}
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
                      <a href={listing.status === "Draft" ? `/employers/post?draft=${listing.id}` : `/employers/listings/${listing.id}`} className="group flex-1">
                        <div className="flex items-center gap-2.5">
                          <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{listing.title}</p>
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${tone.bg} ${tone.text}`}>{listing.status}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                          <span>{listing.employment}</span>
                          <span>{listing.location}</span>
                          {listing.status !== "Draft" && (
                            <>
                              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {listing.applicants} applicants</span>
                              <span>Avg. match {listing.avgMatch}%</span>
                            </>
                          )}
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {listing.status === "Draft" ? "Not published yet" : `Posted ${listing.postedDaysAgo}d ago`}</span>
                        </div>
                        {listing.status !== "Draft" && (
                          <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${listing.autoReject ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                            {listing.autoReject ? `Auto-reject below ${listing.threshold}%` : "Auto-reject off"}
                          </span>
                        )}
                      </a>

                      {/* Row actions */}
                      <div className="relative shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === listing.id ? null : listing.id)}
                          aria-label="Listing actions"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-ink transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        <AnimatePresence>
                          {openMenuId === listing.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-lg"
                              >
                                <a href={`/employers/post?edit=${listing.id}`} className="flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-brand-light transition-colors">
                                  <Pencil className="h-3.5 w-3.5" /> Edit listing
                                </a>
                                {listing.status !== "Draft" && (
                                  <button onClick={() => toggleStatus(listing.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-ink hover:bg-brand-light transition-colors">
                                    {listing.status === "Active" ? "Close listing" : "Reopen listing"}
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
                  <p className="mt-1 text-sm text-muted">
                    {query || filter !== "All" ? "Try a different search or filter." : "Post your first job to get started."}
                  </p>
                  <a href="/employers/post" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Post a job
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}