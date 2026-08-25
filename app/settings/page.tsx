"use client";

import { useState } from "react";
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
} from "lucide-react";
import NavBar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

type Tab = "profile" | "resume" | "account";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  /* ---------------- Profile state ---------------- */
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Next.js"]);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills((s) => [...s, value]);
    setSkillInput("");
  };
  const removeSkill = (skill: string) => setSkills((s) => s.filter((x) => x !== skill));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ---------------- Resume state ---------------- */
  const [resumeName, setResumeName] = useState("jordan_lee_resume.pdf");
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeName(file.name);
  };

  /* ---------------- Danger zone state ---------------- */
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <DashboardSidebar />

          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
            <p className="mt-1 text-sm text-muted">Manage your profile, resume, and account.</p>

            {/* Tabs */}
            <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border p-1">
              {([
                { key: "profile", label: "Profile" },
                { key: "resume", label: "Resume" },
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
              {/* ---------------- Profile tab ---------------- */}
              {tab === "profile" && (
                <motion.form
                  key="profile"
                  onSubmit={handleSave}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8 space-y-6"
                >
                  {/* Photo */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-light text-lg font-semibold text-brand">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile photo" className="h-full w-full object-cover" />
                        ) : (
                          "J"
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-brand text-white ring-2 ring-white">
                        <Camera className="h-3 w-3" />
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Profile photo</p>
                      <p className="text-xs text-muted">JPG or PNG, up to 5MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-ink">Full name</label>
                      <input defaultValue="Jordan Lee" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">Professional title</label>
                      <input placeholder="e.g. Frontend Developer" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-ink">Location</label>
                      <input placeholder="e.g. Austin, TX" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-ink">Bio</label>
                      <textarea rows={3} placeholder="A couple sentences about your background and what you're looking for." className="mt-1.5 w-full resize-none rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="text-xs font-medium text-ink">Skills</label>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
                      {skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2.5 py-1 text-xs font-medium text-brand">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          placeholder="Add a skill…"
                          className="w-28 bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none"
                        />
                        <button type="button" onClick={addSkill} aria-label="Add skill" className="text-muted hover:text-brand">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-ink">LinkedIn</label>
                      <input placeholder="linkedin.com/in/…" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">GitHub</label>
                      <input placeholder="github.com/…" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-ink">Portfolio URL</label>
                      <input placeholder="yoursite.com" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-ink">Preferred job type</label>
                      <select className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink">Preferred location</label>
                      <select className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand">
                        <option>Remote</option>
                        <option>Hybrid</option>
                        <option>On-site</option>
                        <option>No preference</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                      Save changes
                    </button>
                    <AnimatePresence>
                      {saved && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-success"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}

              {/* ---------------- Resume tab ---------------- */}
              {tab === "resume" && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{resumeName}</p>
                        <p className="text-xs text-muted">Used for AI matching and resume tailoring</p>
                      </div>
                    </div>
                    <label className="cursor-pointer rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors">
                      Replace
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                    </label>
                  </div>

                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center hover:bg-brand-light/30 transition-colors">
                    <Upload className="h-5 w-5 text-muted" />
                    <p className="text-sm font-medium text-ink">Upload a new resume</p>
                    <p className="text-xs text-muted">PDF or Word, up to 10MB</p>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                  </label>

                  <div className="rounded-lg bg-brand-light p-3 text-xs leading-relaxed text-ink">
                    Baseman only reorganizes and clarifies what's already on your resume for a
                    given job — it never adds experience, skills, or achievements you didn't provide.
                  </div>
                </motion.div>
              )}

              {/* ---------------- Account tab ---------------- */}
              {tab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8 space-y-8"
                >
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Email</h2>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input defaultValue="jordan@example.com" type="email" className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand" />
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

                  {/* Danger zone */}
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
                      <button
                        onClick={() => setConfirmingDelete(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2 text-xs font-medium text-error hover:bg-error/5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete account
                      </button>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-medium text-ink">
                          Type <span className="font-mono">DELETE</span> to confirm.
                        </p>
                        <input
                          value={deleteText}
                          onChange={(e) => setDeleteText(e.target.value)}
                          placeholder="DELETE"
                          className="w-full max-w-xs rounded-lg border border-error/30 px-3.5 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-error"
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={deleteText !== "DELETE"}
                            className="rounded-lg bg-error px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Permanently delete
                          </button>
                          <button
                            onClick={() => {
                              setConfirmingDelete(false);
                              setDeleteText("");
                            }}
                            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-ink hover:bg-brand-light transition-colors"
                          >
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