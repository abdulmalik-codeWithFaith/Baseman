"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Plus,
  X,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

type Tab = "profile" | "resume" | "account";

interface ProfileData {
  title: string;
  location: string;
  bio: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  preferredJobType: string;
  preferredRemote: string;
  resumeUrl: string | null;
  resumeFileName: string | null;
}

const EMPTY_PROFILE: ProfileData = {
  title: "",
  location: "",
  bio: "",
  skills: [],
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  preferredJobType: "FULL_TIME",
  preferredRemote: "REMOTE",
  resumeUrl: null,
  resumeFileName: null,
};

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Load real profile data on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        if (data.profile) {
          setProfile({
            title: data.profile.title ?? "",
            location: data.profile.location ?? "",
            bio: data.profile.bio ?? "",
            skills: data.profile.skills ?? [],
            linkedinUrl: data.profile.linkedinUrl ?? "",
            githubUrl: data.profile.githubUrl ?? "",
            portfolioUrl: data.profile.portfolioUrl ?? "",
            preferredJobType: data.profile.preferredJobType ?? "FULL_TIME",
            preferredRemote: data.profile.preferredRemote ?? "REMOTE",
            resumeUrl: data.profile.resumeUrl ?? null,
            resumeFileName: data.profile.resumeFileName ?? null,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !profile.skills.includes(value)) setProfile((p) => ({ ...p, skills: [...p.skills, value] }));
    setSkillInput("");
  };
  const removeSkill = (skill: string) => setProfile((p) => ({ ...p, skills: p.skills.filter((x) => x !== skill) }));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileError(null);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ...profile }),
    });

    setSaving(false);
    if (!res.ok) {
      setProfileError("Couldn't save your profile. Try again.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ---------------- Account tab state ---------------- */
  const [newEmail, setNewEmail] = useState(email);
  useEffect(() => setNewEmail(email), [email]);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);

  const updateEmail = async () => {
    setEmailSaving(true);
    setEmailError(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });
    const data = await res.json();
    setEmailSaving(false);
    if (!res.ok) {
      setEmailError(data.error || "Couldn't update email.");
      return;
    }
    setEmail(newEmail);
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

  /* ---------------- Resume upload ---------------- */
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/resume", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingResume(false);

    if (!res.ok) {
      setResumeError(data.error || "Upload failed. Try again.");
      return;
    }

    setProfile((p) => ({ ...p, resumeUrl: data.resumeUrl, resumeFileName: data.resumeFileName }));
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
          <DashboardSidebar />

          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
            <p className="mt-1 text-sm text-muted">Manage your profile, resume, and account.</p>

            <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border p-1">
              {([
                { key: "profile", label: "Profile" },
                { key: "resume", label: "Resume" },
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
                {/* ---------------- Profile tab ---------------- */}
                {tab === "profile" && (
                  <motion.form key="profile" onSubmit={handleSaveProfile} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-light text-lg font-semibold text-brand">
                        {name.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">Profile photo</p>
                        <p className="text-xs text-muted">Photo upload needs file storage — not wired up yet.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-ink">Full name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink">Professional title</label>
                        <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} placeholder="e.g. Frontend Developer" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-ink">Location</label>
                        <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="e.g. Austin, TX" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-ink">Bio</label>
                        <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} placeholder="A couple sentences about your background and what you're looking for." className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-ink">Skills</label>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
                        {profile.skills.map((skill) => (
                          <span key={skill} className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2.5 py-1 text-xs font-medium text-brand">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}><X className="h-3 w-3" /></button>
                          </span>
                        ))}
                        <div className="flex items-center gap-1">
                          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill…" className="w-28 bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none" />
                          <button type="button" onClick={addSkill} aria-label="Add skill" className="text-muted hover:text-brand"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-ink">LinkedIn</label>
                        <input value={profile.linkedinUrl} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} placeholder="linkedin.com/in/…" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink">GitHub</label>
                        <input value={profile.githubUrl} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })} placeholder="github.com/…" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-ink">Portfolio URL</label>
                        <input value={profile.portfolioUrl} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} placeholder="yoursite.com" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-ink">Preferred job type</label>
                        <select value={profile.preferredJobType} onChange={(e) => setProfile({ ...profile, preferredJobType: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                          <option value="FULL_TIME">Full-time</option>
                          <option value="PART_TIME">Part-time</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="INTERNSHIP">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink">Preferred location</label>
                        <select value={profile.preferredRemote} onChange={(e) => setProfile({ ...profile, preferredRemote: e.target.value })} className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                          <option value="REMOTE">Remote</option>
                          <option value="HYBRID">Hybrid</option>
                          <option value="ONSITE">On-site</option>
                        </select>
                      </div>
                    </div>

                    {profileError && (
                      <div className="flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {profileError}
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

                {/* ---------------- Resume tab ---------------- */}
                {tab === "resume" && (
                  <motion.div key="resume" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-6">
                    {profile.resumeFileName ? (
                      <div className="flex items-center justify-between rounded-xl border border-border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                            <FileText className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{profile.resumeFileName}</p>
                            <p className="text-xs text-muted">Used for AI matching and resume tailoring</p>
                          </div>
                        </div>
                        <label className="cursor-pointer rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                          {uploadingResume ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Replace"}
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center hover:bg-brand-light/30 transition-colors">
                        {uploadingResume ? <Loader2 className="h-5 w-5 animate-spin text-brand" /> : <Upload className="h-5 w-5 text-muted" />}
                        <p className="text-sm font-medium text-ink">{uploadingResume ? "Uploading…" : "Upload your resume"}</p>
                        <p className="text-xs text-muted">PDF or Word, up to 10MB</p>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingResume} className="hidden" />
                      </label>
                    )}

                    {resumeError && (
                      <div className="flex items-start gap-2 rounded-lg bg-error/10 p-3 text-xs text-error">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {resumeError}
                      </div>
                    )}

                    <div className="rounded-lg bg-brand-light p-3 text-xs leading-relaxed text-ink">
                      Baseman only reorganizes and clarifies what's already on your resume for a
                      given job — it never adds experience, skills, or achievements you didn't provide.
                    </div>
                  </motion.div>
                )}

                {/* ---------------- Account tab ---------------- */}
                {tab === "account" && (
                  <motion.div key="account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mt-8 space-y-8">
                    <div>
                      <h2 className="text-sm font-semibold text-ink">Email</h2>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                        <button onClick={updateEmail} disabled={emailSaving || newEmail === email} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:opacity-50">
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
                        Deleting your account permanently removes your profile, resume, and
                        application history. This can't be undone.
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