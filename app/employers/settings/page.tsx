"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components/EmployerSidebar";

type Tab = "company" | "account";

export default function EmployerSettingsPage() {
  const [tab, setTab] = useState<Tab>("company");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <EmployerSidebar />

          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
            <p className="mt-1 text-sm text-muted">Manage your company profile and account.</p>

            <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border p-1">
              {([
                { key: "company", label: "Company profile" },
                { key: "account", label: "Account" },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    tab === t.key ? "bg-brand text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ---------------- Company profile tab ---------------- */}
              {tab === "company" && (
                <motion.form
                  key="company"
                  onSubmit={handleSave}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-brand-light text-brand">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Company logo" className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-brand text-white ring-2 ring-white">
                        <Building2 className="h-3 w-3" />
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Company logo</p>
                      <p className="text-xs text-muted">Shown on your listings and public company page.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-ink">Company name</label>
                      <input defaultValue="Acme Inc" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">Industry</label>
                      <input placeholder="e.g. B2B SaaS" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">Company size</label>
                      <select className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                        <option>1–10 employees</option>
                        <option>10–20 employees</option>
                        <option>20–50 employees</option>
                        <option>50–200 employees</option>
                        <option>200–500 employees</option>
                        <option>500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">Website</label>
                      <input placeholder="acme.com" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-ink">Headquarters</label>
                      <input placeholder="e.g. San Francisco, CA" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-ink">About the company</label>
                      <textarea rows={4} placeholder="What does your company do, and what's it like to work there?" className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                      Save changes
                    </button>
                    <AnimatePresence>
                      {saved && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}

              {/* ---------------- Account tab ---------------- */}
              {tab === "account" && (
                <motion.div key="account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-8">
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Email</h2>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input defaultValue="hiring@acme.com" type="email" className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                      <button className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Update email</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-ink">Password</h2>
                    <div className="mt-3 space-y-3">
                      <input type="password" placeholder="Current password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      <input type="password" placeholder="New password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      <input type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      <button className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Update password</button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-error/30 p-5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-error" />
                      <h2 className="text-sm font-semibold text-error">Danger zone</h2>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      Deleting your account permanently removes your company profile, all job
                      listings, and applicant data tied to them. This can't be undone.
                    </p>

                    {!confirmingDelete ? (
                      <button onClick={() => setConfirmingDelete(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2 text-xs font-medium text-error hover:bg-error/5 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" /> Delete account
                      </button>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-medium text-ink">Type <span className="font-mono">DELETE</span> to confirm.</p>
                        <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="DELETE" className="w-full max-w-xs rounded-lg border border-error/30 px-3.5 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-error" />
                        <div className="flex gap-2">
                          <button disabled={deleteText !== "DELETE"} className="rounded-lg bg-error px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
                            Permanently delete
                          </button>
                          <button onClick={() => { setConfirmingDelete(false); setDeleteText(""); }} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}