"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to a real endpoint that sends the reset email.
    setSent(true);
  };

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

          <AnimatePresence mode="wait">
            {!sent ? (
              /* ---------------- Request reset ---------------- */
              <motion.div
                key="request"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <a href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to log in
                </a>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Reset your password</h1>
                <p className="mt-2 text-sm text-muted">
                  Enter the email on your account and we'll send you a link to reset it.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-ink">Email</label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-lg border border-border py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>

                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                    Send reset link <Send className="h-3.5 w-3.5" />
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted">
                  Remembered it after all?{" "}
                  <a href="/login" className="font-medium text-brand hover:underline">Log in</a>
                </p>
              </motion.div>
            ) : (
              /* ---------------- Confirmation ---------------- */
              <motion.div
                key="sent"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">Check your email</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  If an account exists for <span className="font-medium text-ink">{email}</span>, a
                  password reset link is on its way. It can take a minute or two to arrive.
                </p>

                <button
                  onClick={() => setSent(false)}
                  className="mt-6 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-ink hover:bg-brand-light transition-colors"
                >
                  Try a different email
                </button>

                <p className="mt-6 text-sm text-muted">
                  Didn't get it?{" "}
                  <button onClick={() => setSent(true)} className="font-medium text-brand hover:underline">
                    Resend the link
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}