"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2, AlertTriangle, Trash2, Loader2, AlertCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import NavBar from "@/components/Navbar";
import EmployerSidebar from "@/components/EmployerSidebar";

type Tab = "company" | "account";

interface CompanyData {
  name: string;
  logoUrl: string;
  industry: string;
  size: string;
  website: string;
  headquarters: string;
  description: string;
}

const EMPTY_COMPANY: CompanyData = {
  name: "",
  logoUrl: "",
  industry: "",
  size: "1–10 employees",
  website: "",
  headquarters: "",
  description: "",
};

export default function EmployerSettingsPage() {
  const [tab, setTab] = useState<Tab>("company");
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState<CompanyData>(EMPTY_COMPANY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCompany({
            name: data.name ?? "",
            logoUrl: data.logoUrl ?? "",
            industry: data.industry ?? "",
            size: data.size ?? "1–10 employees",
            website: data.website ?? "",
            headquarters: data.headquarters ?? "",
            description: data.description ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/logo", { method: "POST", body: formData });
    const data = await res.json();
    setLogoUploading(false);

    if (!res.ok) {
      setLogoError(data.error || "Upload failed. Try again.");
      return;
    }

    setCompany((c) => ({ ...c, logoUrl: data.logoUrl }));
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setCompanyError(null);

    const res = await fetch("/api/company", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setCompanyError(data.error || "Couldn't save your company profile.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ---------------- Account tab — reuses the same endpoints as seeker settings ---------------- */
  const [email, setEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setEmail(data.email ?? ""))
      .catch(() => {});
  }, []);

  const updateEmail = async () => {
    setEmailSaving(true);
    setEmailError(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setEmailSaving(false);
    if (!res.ok) {
      setEmailError(data.error || "Couldn't update email.");
      return;
    }
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2500);
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const updatePassword = async () => {
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setPasswordSaving(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setPasswordSaving(false);
    if (!res.ok) {
      setPasswordError(data.error || "Couldn't update password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      setDeleting(false);
    }
  };

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
                <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? "bg-brand text-white" : "text-muted hover:text-ink"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="mt-10 flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {tab === "company" && (
                  <motion.form key="company" onSubmit={handleSaveCompany} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-brand-light text-brand">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt="Company logo" className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">Company logo</p>
                        <p className="text-xs text-muted">Shown on your listings and public company page.</p>
                        <label className="mt-2 inline-block cursor-pointer text-xs font-medium text-brand hover:underline">
                          {logoUploading ? "Uploading…" : company.logoUrl ? "Replace logo" : "Upload logo"}
                          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload} disabled={logoUploading} className="hidden" />
                        </label>
                        {logoError && <p className="mt-1 text-xs text-error">{logoError}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-ink">Company name</label>
                        <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} required className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink">Industry</label>
                        <input value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} placeholder="e.g. B2B SaaS" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink">Company size</label>
                        <select value={company.size} onChange={(e) => setCompany({ ...company, size: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
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
                        <input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} placeholder="acme.com" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-ink">Headquarters</label>
                        <input value={company.headquarters} onChange={(e) => setCompany({ ...company, headquarters: e.target.value })} placeholder="e.g. San Francisco, CA" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-ink">About the company</label>
                        <textarea value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} rows={4} placeholder="What does your company do, and what's it like to work there?" className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                    </div>

                    {companyError && (
                      <div className="flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {companyError}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:opacity-60">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
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

                {tab === "account" && (
                  <motion.div key="account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-8">
                    <div>
                      <h2 className="text-sm font-semibold text-ink">Email</h2>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        <button onClick={updateEmail} disabled={emailSaving} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:opacity-50">
                          {emailSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update email"}
                        </button>
                      </div>
                      {emailError && <p className="mt-2 text-xs text-error">{emailError}</p>}
                      {emailSaved && <p className="mt-2 text-xs text-success">Email updated.</p>}
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-ink">Password</h2>
                      <div className="mt-3 space-y-3">
                        <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                        {passwordError && <p className="text-xs text-error">{passwordError}</p>}
                        {passwordSaved && <p className="text-xs text-success">Password updated.</p>}
                        <button onClick={updatePassword} disabled={passwordSaving || !currentPassword || !newPassword} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:opacity-50">
                          {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
                        </button>
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
                            <button onClick={deleteAccount} disabled={deleteText !== "DELETE" || deleting} className="inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
                              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Permanently delete"}
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}