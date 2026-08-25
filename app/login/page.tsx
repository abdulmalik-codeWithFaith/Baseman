"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
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

        <a href="/" className="absolute left-8 top-8 flex items-center gap-2.5">
           <img src="/base.png" alt="logo" className="md:w-50 w-30"/>
        </a>

        <div className="absolute bottom-28 left-8 right-8">
          <p className="max-w-xs text-2xl font-bold leading-tight tracking-tight text-white">
            Know your fit before you apply — or before you post.
          </p>
        </div>

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
          <a href="/" className="mb-8 flex items-center gap-2.5 md:hidden">
             <img src="/base.png" alt="logo" className="md:w-50 w-30"/>
          </a>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-muted">Log in to see your matches, applications, and listings.</p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-ink">Password</label>
                  <a href="/forgot-password" className="text-xs font-medium text-brand hover:underline">Forgot password?</a>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <label className="flex items-center gap-2 text-xs text-muted">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-brand" />
                Keep me logged in
              </label>

              <button type="submit" className="w-full rounded-lg bg-brand py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                Log in
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

            <p className="mt-6 text-center text-sm text-muted">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-brand hover:underline">Sign up</a>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}