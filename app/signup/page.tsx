"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

type Role = "seeker" | "employer";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* ---------------- Left: image panel ---------------- */}
      <div className="relative hidden overflow-hidden bg-brand md:block">
        <img
          src="https://images.pexels.com/photos/2422286/pexels-photo-2422286.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1"
          alt="A job seeker reviewing opportunities with confidence"
          className="h-full w-full object-cover"
        />
        {/* Photo: Jopwell via Pexels — pexels.com/photo/2422286, free commercial license */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/20 to-transparent" />

        {/* Logo */}
        <a href="/" className="absolute left-8 top-8 flex items-center gap-2.5">
          <img src="/base.png" alt="logo" className="w-50"/>
        </a>

        {/* Tagline */}
        <div className="absolute bottom-28 left-8 right-8">
          <p className="max-w-xs text-2xl font-bold leading-tight tracking-tight text-white">
            Know your fit before you apply — or before you post.
          </p>
        </div>

        {/* Floating match card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-8 left-8 right-8 rounded-xl bg-white p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-ink">Senior Frontend Developer</p>
              <p className="text-[11px] text-muted">Acme Inc · Remote</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light">
              <span className="text-xs font-semibold text-brand">86%</span>
            </div>
          </div>
          <div className="mt-2.5 flex gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="h-3 w-3" /> Strong match
            </span>
          </div>
        </motion.div>
      </div>

      {/* ---------------- Right: form panel ---------------- */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo (image hidden below md) */}
          <a href="/" className="mb-8 flex items-center gap-2.5 md:hidden">
            <img src="/base.png" alt="logo" className="md:w-50 w-30"/>
          </a>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ---------------- Step 1: choose role ---------------- */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand">Step 1 of 2</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">How will you use Baseman?</h1>
                <p className="mt-2 text-sm text-muted">You can always do both later — this just sets up your first experience.</p>

                <div className="mt-6 space-y-3">
                  {[
                    { key: "seeker" as Role, icon: Search, title: "I'm looking for a job", description: "Browse roles, see your match score, apply with confidence." },
                    { key: "employer" as Role, icon: Users, title: "I'm hiring", description: "Post jobs and see applicants ranked by real match data." },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setRole(opt.key)}
                      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                        role === opt.key ? "border-brand bg-brand-light" : "border-border hover:bg-brand-light/50"
                      }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${role === opt.key ? "bg-brand text-white" : "bg-brand-light text-brand"}`}>
                        <opt.icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{opt.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-6 text-center text-sm text-muted">
                  Already have an account?{" "}
                  <a href="/login" className="font-medium text-brand hover:underline">Log in</a>
                </p>
              </motion.div>
            ) : (
              /* ---------------- Step 2: account details ---------------- */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Change role
                </button>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand">Step 2 of 2</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                  {role === "seeker" ? "Create your job seeker account" : "Create your employer account"}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {role === "seeker" ? "Start browsing and get your first match score." : "Start posting and see scored applicants roll in."}
                </p>

                <form className="mt-6 space-y-4">
                  {role === "employer" && (
                    <div>
                      <label className="text-xs font-medium text-ink">Company name</label>
                      <input type="text" placeholder="Acme Inc" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-ink">Full name</label>
                    <input type="text" placeholder="Jordan Lee" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink">Email</label>
                    <input type="email" placeholder="you@example.com" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink">Password</label>
                    <div className="relative mt-1.5">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        className="w-full rounded-lg border border-border px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full rounded-lg bg-brand py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Create account
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button className="w-full rounded-lg border border-border py-3 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
                  Continue with Google
                </button>

                <p className="mt-6 text-center text-xs leading-relaxed text-muted">
                  By creating an account, you agree to Baseman's{" "}
                  <a href="/terms" className="text-brand hover:underline">Terms</a> and{" "}
                  <a href="/privacy" className="text-brand hover:underline">Privacy Policy</a>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}