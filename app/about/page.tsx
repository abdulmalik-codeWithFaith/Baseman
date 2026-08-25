"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  Users2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---------------------------------------------------------------
   Values shown on the About page. Edit freely, but keep these
   grounded in things the product actually does — this page reads
   as a trust signal, so it shouldn't overpromise.
---------------------------------------------------------------- */

const values = [
  {
    icon: Scale,
    title: "Honesty by design",
    description:
      "The AI never invents experience, skills, or achievements on a resume. It reorganizes and clarifies what's already there — nothing more.",
  },
  {
    icon: Users2,
    title: "Fair to both sides",
    description:
      "Job seekers get a real answer before they apply. Employers get applicants who are actually worth their time. Neither side is the product.",
  },
  {
    icon: ShieldCheck,
    title: "You stay in control",
    description:
      "Every AI suggestion — resume edits, structured job listings — is something you review and approve, not something published automatically.",
  },
  {
    icon: Sparkles,
    title: "Built to be used, not browsed",
    description:
      "Every feature exists to answer one question: are you actually a fit? If it doesn't serve that, it doesn't ship.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center md:pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Hiring shouldn't feel like a guessing game.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Baseman exists because applying to jobs and hiring for them are both
            built on guesswork — resumes sent into silence, applicants judged by
            gut feel. We built an AI layer that replaces the guessing with a real
            answer, for whichever side of the hire you're on.
          </p>
        </motion.div>
      </section>

      {/* ---------------- Founder note (placeholder) ---------------- */}
      {/* TODO: replace with your real story — this is a structural placeholder, not filler to leave as-is. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-dashed border-border p-8"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Why we built this — TODO</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              [Replace this with your own story: what you were doing before Baseman,
              the moment the problem became obvious to you, and why you decided to
              build the fix yourself. A few honest paragraphs here will do more for
              trust than any stock founder bio.]
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand">
                {/* TODO: initial or headshot */}
                Y
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">[Your name] — TODO</p>
                <p className="text-xs text-muted">Founder, Baseman</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Values (solid teal) ---------------- */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white">What we won't compromise on.</h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <value.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Team (placeholder) ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-ink">Who's building this</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Baseman is early — right now that means a small, hands-on team
              shipping fast rather than a big org chart. As that changes, this
              is where the people behind it will show up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-ink">See it for yourself.</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">Whether you're applying or hiring, the fastest way to understand Baseman is to use it.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                Find Jobs <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/employers" className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
                For Employers
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}