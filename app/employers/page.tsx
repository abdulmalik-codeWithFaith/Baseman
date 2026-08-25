"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  Eye,
  Send,
  Users,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Building2,
  Quote,
} from "lucide-react";
import Footer from "@/components/Footer";

/* ---------------------------------------------------------------
   Content
---------------------------------------------------------------- */

const steps = [
  { icon: FileText, label: "Paste", title: "Paste any job description", description: "Copy a job post from anywhere. No manual forms, no re-typing requirements field by field." },
  { icon: Sparkles, label: "Structure", title: "AI extracts the details", description: "Title, requirements, skills, salary, and location get organized automatically." },
  { icon: Eye, label: "Review", title: "Check it before it's live", description: "Edit anything the AI got wrong or that needs a human touch. You stay in control." },
  { icon: Send, label: "Publish", title: "Go live in one click", description: "Your listing appears in the marketplace immediately, fully searchable." },
  { icon: Users, label: "Track", title: "See applicants as they come in", description: "Every applicant arrives with a match score, so you know who to look at first." },
  { icon: UserCheck, label: "Hire", title: "Make the hire", description: "Move your top match from applicant to team member, without leaving the dashboard." },
];

const features = [
  { icon: FileText, title: "One-paste job posting", description: "Paste a job description and Baseman extracts title, requirements, skills, and salary automatically." },
  { icon: Sparkles, title: "AI-structured listings", description: "No blank forms. Every listing starts pre-filled, and you review before it goes live." },
  { icon: Users, title: "Applicant match ranking", description: "Every applicant arrives scored against your requirements, so you know who to look at first." },
  { icon: ClipboardList, title: "One dashboard", description: "Manage every open role, applicant, and status from a single place, not a spreadsheet." },
  { icon: BarChart3, title: "Hiring insights", description: "See where applicants are strong or thin across your listings as you go." },
  { icon: Building2, title: "Company profile", description: "A public page for your open roles, so candidates see more than just a single listing." },
];

// PLACEHOLDER testimonials — swap for real customer quotes before launch.
const testimonials = [
  { name: "Marcus T.", role: "Engineering Manager", quote: "We used to spend hours sorting resumes. Now applicants show up pre-scored against what we actually need." },
  { name: "David O.", role: "Founder, early-stage startup", quote: "Pasting a job description and getting a live listing in seconds saved me a whole afternoon." },
  { name: "Aisha B.", role: "Head of Talent", quote: "The match ranking means I open resumes in the right order instead of just the order they arrived." },
];

const faqs = [
  { q: "How does the AI job importer work?", a: "Paste any job description you already have — from a doc, an old post, anywhere — and Baseman extracts the title, requirements, skills, salary, and location automatically. You review and edit before publishing." },
  { q: "How is applicant match calculated?", a: "The AI compares each applicant's profile and resume against your listing's stated requirements and skills, then scores overlap and flags gaps — the same scoring candidates see on their side." },
  { q: "Can more than one person on our team manage postings?", a: "Team member roles and shared dashboards are on the roadmap. Today, postings are managed from a single account." },
  { q: "Is there a limit on how many jobs we can post?", a: "The free plan covers a limited number of active listings at a time. Higher tiers remove that limit — see pricing for current details." },
  { q: "What happens to applicant data after a role is filled?", a: "Applicant data stays tied to your account and isn't shared with other employers. You can close or archive a listing at any time." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function EmployersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Nav ---------------- */}
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">B</span>
            <span className="text-lg font-semibold tracking-tight text-ink">Baseman</span>
          </a>
          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="/jobs" className="text-muted hover:text-ink transition-colors">Jobs</a>
            <a href="#how-it-works" className="text-muted hover:text-ink transition-colors">How it works</a>
            <a href="/employers" className="font-medium text-ink">For employers</a>
            <a href="/pricing" className="text-muted hover:text-ink transition-colors">Pricing</a>
            <a href="/about" className="text-muted hover:text-ink transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-ink hover:text-brand transition-colors">Log in</a>
            <a href="/employers/post" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">Post a job</a>
          </div>
        </nav>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
              Hiring, without the busywork
            </motion.span>

            <motion.h1 variants={fadeUp} custom={1} className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Post in seconds.
              <br />
              Hire from the
              <br />
              <span className="text-brand">top of the pile.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
              Paste a job description and Baseman turns it into a live, structured
              listing in seconds. Every applicant arrives already scored against
              what you actually need.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/employers/post" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                Post your first job <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
                See how it works
              </a>
            </motion.div>
          </motion.div>

          {/* AI Job Importer visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04),0_20px_48px_-16px_rgba(19,69,68,0.25)]"
          >
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Paste</p>
              <div className="mt-3 space-y-2 rounded-lg border border-dashed border-border p-4">
                <div className="h-2 w-4/5 rounded bg-border" />
                <div className="h-2 w-full rounded bg-border" />
                <div className="h-2 w-3/5 rounded bg-border" />
                <div className="h-2 w-full rounded bg-border" />
                <div className="h-2 w-2/3 rounded bg-border" />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-brand p-6 pt-4 text-white">
              <p className="text-xs font-medium uppercase tracking-wide text-white/60">Structured</p>
              <p className="mt-2 text-lg font-semibold">Senior Backend Engineer</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Node.js", "PostgreSQL", "AWS"].map((skill) => (
                  <span key={skill} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white">{skill}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-white/70">
                <span>Remote · Full-time</span>
                <span>$150k–$180k</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Problem ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="order-2 aspect-[4/3] overflow-hidden rounded-2xl bg-brand-light md:order-1"
            >
              <img
                src="https://images.pexels.com/photos/7651804/pexels-photo-7651804.jpeg?auto=compress&cs=tinysrgb&w=1000&h=750&dpr=1"
                alt="A hiring team reviewing candidates together"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold tracking-tight text-ink">Hiring shouldn't mean drowning in resumes.</h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Every job post takes twenty minutes of manual form-filling.",
                  "Your inbox fills with applicants who clearly didn't read the requirements.",
                  "You're judging fit by gut feel, not by data.",
                  "Nothing tells you who to open first.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- How it works (solid teal) ---------------- */}
      <section id="how-it-works" className="bg-brand">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">Six steps. One flow.</h2>
            <p className="mt-3 text-white/70">From a pasted job description to a hire, without leaving the dashboard.</p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div key={step.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.06 }} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <step.icon className="h-4.5 w-4.5" />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-white/60">{String(i + 1).padStart(2, "0")} · {step.label}</p>
                <h3 className="mt-1.5 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Applicant ranking (before/after) ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Open the right resume first.</h2>
            <p className="mt-3 text-muted">Applicants arrive ranked by match, not by whoever applied first.</p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }} className="rounded-xl border border-dashed border-border p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Without Baseman</p>
              <div className="mt-4 space-y-3">
                {["Applicant #1", "Applicant #2", "Applicant #3", "Applicant #4"].map((name) => (
                  <div key={name} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-muted">{name}</span>
                    <span className="text-xs text-muted">Applied — order received</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-brand">With Baseman</p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Jordan P.", match: "91%", tone: "success" },
                  { name: "Sam R.", match: "84%", tone: "success" },
                  { name: "Casey L.", match: "58%", tone: "warning" },
                  { name: "Morgan T.", match: "41%", tone: "warning" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-ink">{row.name}</span>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${row.tone === "success" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {row.match} match
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Everything you need to hire, nothing you don't.</h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-xl border border-border bg-white p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                  <feature.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing teaser ---------------- */}
      <section className="border-t border-border bg-brand-light/50">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold tracking-tight text-ink">Free to post. Upgrade when you're ready to scale.</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Start with a limited number of active listings at no cost. Higher tiers unlock
              unlimited postings and deeper applicant insights.
            </p>
            <a href="/pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">
              See full pricing <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="text-3xl font-bold tracking-tight text-ink">
            What hiring teams are saying.
          </motion.h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.08 }} className="rounded-xl border border-border bg-white p-6">
                <Quote className="h-5 w-5 text-brand" />
                <p className="mt-4 text-sm leading-relaxed text-ink">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Trust ---------------- */}
      <section className="border-t border-border bg-brand-light/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-white p-8 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Applicant data stays protected</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Candidate data is tied to your account and never shared with other employers
                or sold to third parties. You control every listing you publish.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="text-3xl font-bold tracking-tight text-ink">
            Questions, answered.
          </motion.h2>

          <div className="mt-8 divide-y divide-border rounded-xl border border-border">
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-sm font-medium text-ink">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA (solid teal) ---------------- */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold tracking-tight text-white">Your next hire is already applying somewhere.</h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">Post your first job free and see scored applicants roll in.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a href="/employers/post" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand hover:bg-white/90 transition-colors">
                Post your first job <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                See pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <Footer/>
    </main>
  );
}