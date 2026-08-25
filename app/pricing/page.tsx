"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ArrowRight, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---------------------------------------------------------------
   PLACEHOLDER pricing — set real numbers before launch.
   Figures below are illustrative only.
---------------------------------------------------------------- */

const seekerPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start applying smarter.",
    features: [
      { label: "Browse and search all jobs", included: true },
      { label: "Basic AI match score", included: true },
      { label: "Apply and track applications", included: true },
      { label: "3 resume optimizations / month", included: true },
      { label: "Interview practice", included: false },
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/ month",
    description: "For an active search where every application counts.",
    features: [
      { label: "Everything in Free", included: true },
      { label: "Unlimited resume optimizations", included: true },
      { label: "Full match breakdown — strengths & gaps", included: true },
      { label: "Unlimited interview practice", included: true },
      { label: "Application insights", included: true },
    ],
    cta: "Start Premium",
    highlighted: true,
  },
];

const employerPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Post your first roles and see how matching works.",
    features: [
      { label: "Up to 2 active job listings", included: true },
      { label: "AI job importer (paste → structured listing)", included: true },
      { label: "Applicant match scoring", included: true },
      { label: "Basic dashboard", included: true },
      { label: "Team accounts", included: false },
    ],
    cta: "Post a job free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For teams hiring for more than one role at a time.",
    features: [
      { label: "Everything in Free", included: true },
      { label: "Unlimited active job listings", included: true },
      { label: "Full applicant ranking & insights", included: true },
      { label: "Priority support", included: true },
      { label: "Team accounts", included: true },
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "Custom",
    period: "",
    description: "For larger hiring teams with specific needs.",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Custom seats & permissions", included: true },
      { label: "Dedicated onboarding", included: true },
      { label: "Custom contract & invoicing", included: true },
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. Both job-seeker and employer plans are month-to-month with no lock-in — cancel from your account settings whenever you'd like." },
  { q: "What happens if I go over the Free plan limits?", a: "You'll be prompted to upgrade before anything is interrupted. Job seekers keep full access to browsing and applying either way; employers keep existing listings live." },
  { q: "Is there a discount for annual billing?", a: "Not yet at launch, but it's something we're planning to offer — check back or reach out and we'll let you know when it's available." },
  { q: "Do you offer student or nonprofit pricing?", a: "Not currently, but reach out — we're open to it as we grow." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function PricingPage() {
  const [audience, setAudience] = useState<"seeker" | "employer">("seeker");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const plans = audience === "seeker" ? seekerPlans : employerPlans;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-16 text-center md:pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Simple pricing for both sides of the hire.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            Free to start whether you're applying or hiring. Upgrade when you need more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 inline-flex items-center gap-1 rounded-lg border border-border p-1"
        >
          {(["seeker", "employer"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setAudience(key)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                audience === key ? "bg-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              {key === "seeker" ? "For job seekers" : "For employers"}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ---------------- Plans ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-5 ${plans.length === 3 ? "md:grid-cols-3" : "mx-auto max-w-3xl md:grid-cols-2"}`}
          >
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted ? "border-brand shadow-[0_20px_48px_-16px_rgba(19,69,68,0.25)]" : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[11px] font-medium text-white">
                    Most popular
                  </span>
                )}

                <p className="text-sm font-semibold text-ink">{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-ink">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-border" />
                      )}
                      <span className={f.included ? "text-ink" : "text-muted"}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.name === "Business" ? "/contact" : "/signup"}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-brand text-white hover:bg-brand/90"
                      : "border border-border text-ink hover:bg-brand-light"
                  }`}
                >
                  {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-ink"
          >
            Pricing questions, answered.
          </motion.h2>

          <div className="mt-8 divide-y divide-border rounded-xl border border-border">
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white">Start free. Upgrade when it earns it.</h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">No credit card required to get started on either side.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand hover:bg-white/90 transition-colors">
                Find Jobs <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/employers" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
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