"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Ban, RotateCcw } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { ADMIN_USERS as INITIAL_USERS, type UserRole } from "@/lib/admin-users";

type FilterKey = "All" | UserRole | "Suspended";
const FILTERS: FilterKey[] = ["All", "Job seeker", "Employer", "Suspended"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [query, setQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      All: users.length,
      "Job seeker": users.filter((u) => u.role === "Job seeker").length,
      Employer: users.filter((u) => u.role === "Employer").length,
      Suspended: users.filter((u) => u.status === "Suspended").length,
    };
  }, [users]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Suspended" ? u.status === "Suspended" : u.role === filter);
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [users, filter, query]);

  const toggleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
    );
    setConfirmingId(null);
  };

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

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Users</h1>
            <p className="mt-1 text-sm text-muted">Every account on Baseman — job seekers and employers.</p>

            {/* Search */}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-2">
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email…"
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
                  {f} <span className="opacity-70">({counts[f] ?? 0})</span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-brand-light/30 text-xs text-muted">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Activity</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Last active</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {results.map((user) => (
                      <motion.tr
                        key={user.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${user.role === "Employer" ? "bg-brand-light text-brand" : "border border-border text-muted"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink">{user.activityLabel}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">{user.lastActiveDaysAgo === 0 ? "Today" : `${user.lastActiveDaysAgo}d ago`}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {confirmingId === user.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleSuspend(user.id)}
                                  className={`rounded-md px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 ${
                                    user.status === "Active" ? "bg-error" : "bg-brand"
                                  }`}
                                >
                                  Confirm
                                </button>
                                <button onClick={() => setConfirmingId(null)} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                                  Cancel
                                </button>
                              </div>
                            ) : user.status === "Active" ? (
                              <button
                                onClick={() => setConfirmingId(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted hover:bg-error/5 hover:text-error transition-colors"
                              >
                                <Ban className="h-3 w-3" /> Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirmingId(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink hover:bg-brand-light transition-colors"
                              >
                                <RotateCcw className="h-3 w-3" /> Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {results.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-sm font-medium text-ink">No users match this filter</p>
                  <p className="mt-1 text-sm text-muted">Try a different search or filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}