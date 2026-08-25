"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Target,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Users,
  FileText,
  ClipboardList,
  Eye,
  ShieldCheck,
  ChevronDown,
  Award,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  // Github,
  // Linkedin,
  // Twitter,
} from "lucide-react";
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";

/* ---------------------------------------------------------------
   Content
---------------------------------------------------------------- */

const seekerSteps = [
  { icon: Search, label: "Find", title: "Find jobs that fit", description: "Filter by role, skill, and location. No noise, no jobs you're wildly unqualified for." },
  { icon: Target, label: "Match", title: "See your real match score", description: "AI compares your profile against the job's requirements and shows exactly where you stand." },
  { icon: Sparkles, label: "Improve", title: "Tailor your resume", description: "Your existing experience, reorganized and clarified for the role — nothing invented." },
  { icon: Send, label: "Apply", title: "Apply with confidence", description: "Submit knowing your resume speaks directly to what they're looking for." },
  { icon: MessageSquare, label: "Prepare", title: "Practice the interview", description: "Run through questions built from the actual job, and get feedback before the real thing." },
  { icon: Award, label: "Succeed", title: "Walk in ready", description: "Go into the final round knowing exactly where you're strong — and where to focus." },
];

const employerSteps = [
  { icon: FileText, label: "Paste", title: "Paste any job description", description: "Copy a job post from anywhere. No manual forms, no re-typing requirements field by field." },
  { icon: Sparkles, label: "Structure", title: "AI extracts the details", description: "Title, requirements, skills, salary, and location get organized automatically." },
  { icon: Eye, label: "Review", title: "Check it before it's live", description: "Edit anything the AI got wrong or that needs a human touch. You stay in control." },
  { icon: Send, label: "Publish", title: "Go live in one click", description: "Your listing appears in the marketplace immediately, fully searchable." },
  { icon: Users, label: "Track", title: "See applicants as they come in", description: "Every applicant arrives with a match score, so you know who to look at first." },
  { icon: UserCheck, label: "Hire", title: "Make the hire", description: "Move your top match from applicant to team member, without leaving the dashboard." },
];

const features = [
  { icon: Target, title: "AI match score", description: "See exactly how you stack up against a job's real requirements — strengths and gaps, laid out clearly." },
  { icon: Sparkles, title: "Resume tailoring", description: "Your resume, reorganized and rewritten around this job. Nothing invented, nothing fabricated." },
  { icon: MessageSquare, title: "Interview practice", description: "Practice with questions generated from the actual job, not a generic bank." },
  { icon: ClipboardList, title: "Application tracker", description: "Every job you've applied to, its match score, and its status — one place, no spreadsheets." },
  { icon: FileText, title: "One-paste job posting", description: "Paste a job description and Baseman extracts title, requirements, skills, and salary automatically." },
  { icon: Users, title: "Applicant overview", description: "See who applied, how well they match, and where to focus — before opening a resume." },
];

const faqs = [
  { q: "Does the AI ever make up experience on my resume?", a: "No. Baseman only reorganizes, rewrites, and emphasizes what's already in your profile. It never adds skills, jobs, or achievements you didn't provide." },
  { q: "Is Baseman free for job seekers?", a: "Core features — browsing, match scoring, and applying — are free. Premium features like advanced resume optimization and interview practice may sit behind a paid plan as we grow." },
  { q: "How is my resume and personal data handled?", a: "Your data is stored securely and used only to power matching and application features for your account. We don't sell resume data to third parties." },
  { q: "What does an employer see about me?", a: "Employers see your application, resume, and match score for the job they posted — not your activity across the rest of the platform." },
  { q: "How is the match score calculated?", a: "The AI compares the job's stated requirements and skills against your profile and resume, then scores overlap and flags clear gaps." },
];

// PLACEHOLDER testimonials — swap for real customer quotes before launch.
const testimonials = [
  { name: "Sarah K.", role: "Frontend Engineer", quote: "I stopped applying blind. Seeing my match score before I applied completely changed how I spent my time." },
  { name: "Marcus T.", role: "Engineering Manager, hiring", quote: "We used to spend hours sorting resumes. Now applicants show up pre-scored against what we actually need." },
  { name: "Priya R.", role: "Product Designer", quote: "The resume tailoring didn't invent anything — it just made what I'd already done easier to see." },
  { name: "David O.", role: "Founder, early-stage startup", quote: "Pasting a job description and getting a live listing in seconds saved me a whole afternoon." },
  { name: "Elena M.", role: "Backend Engineer", quote: "Practicing with questions built from the actual job made the real interview feel familiar." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  const [audience, setAudience] = useState<"seeker" | "employer">("seeker");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const activeSteps = audience === "seeker" ? seekerSteps : employerSteps;

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const goToTestimonial = (next: number) => {
    setSlideDirection(next > testimonialIndex || (testimonialIndex === testimonials.length - 1 && next === 0) ? 1 : -1);
    setTestimonialIndex(next);
  };
  const nextTestimonial = () => goToTestimonial((testimonialIndex + 1) % testimonials.length);
  const prevTestimonial = () => goToTestimonial((testimonialIndex - 1 + testimonials.length) % testimonials.length);

  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Nav ---------------- */}
      <NavBar/>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
              AI-powered hiring, for both sides of the table
            </motion.span>

            <motion.h1 variants={fadeUp} custom={1} className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Find the role.
              <br />
              Know your shot.
              <br />
              <span className="text-brand">Walk in ready.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
              Baseman scores your fit before you apply, tailors your resume around
              each job, and gets you interview-ready. Hiring instead? Paste a job
              description and get a live listing with scored applicants in seconds.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                Find Jobs <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/employers" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-brand-light transition-colors">
                For Employers
              </a>
            </motion.div>
          </motion.div>

          {/* AI Match card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04),0_20px_48px_-16px_rgba(19,69,68,0.25)]"
          >
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-sm font-semibold text-brand">N</div>
                <div>
                  <p className="text-sm font-semibold text-ink">Senior Frontend Developer</p>
                  <p className="text-xs text-muted">Remote · Full-time</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "TypeScript", "Next.js"].map((skill) => (
                  <span key={skill} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-brand p-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">AI Match</p>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">Strong match</span>
              </div>
              <p className="mt-1 text-5xl font-bold">86%</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "86%" }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-white"
                />
              </div>
              <div className="mt-5 flex items-center gap-4 text-xs text-white/85">
                {["Skills", "Experience", "Projects"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {item}
                  </span>
                ))}
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
                src="https://images.pexels.com/photos/6285280/pexels-photo-6285280.jpeg?auto=compress&cs=tinysrgb&w=1000&h=750&dpr=1"
                alt="A job seeker feeling stuck after another unanswered application"
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
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Hiring is broken the same way on both sides.
              </h2>
              <div className="mt-8 space-y-8">
                {[
                  { icon: Search, title: "If you're job hunting", items: ["You send the same resume to dozens of jobs and hear back from almost none of them.", "You have no idea if you're actually a fit before you apply.", "Interview prep means Googling generic questions the night before."] },
                  { icon: Users, title: "If you're hiring", items: ["Every job post takes twenty minutes of manual form-filling.", "Your inbox fills with applicants who clearly didn't read the requirements.", "You're judging fit by gut feel, not by data."] },
                ].map((block) => (
                  <div key={block.title}>
                    <div className="flex items-center gap-2.5">
                      <block.icon className="h-4 w-4 text-brand" />
                      <h3 className="text-sm font-semibold text-ink">{block.title}</h3>
                    </div>
                    <ul className="mt-2.5 space-y-2 pl-6">
                      {block.items.map((item) => (
                        <li key={item} className="list-disc text-sm leading-relaxed text-muted marker:text-border">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Why Baseman (solid teal) ---------------- */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">One AI layer. Built for how hiring actually works.</h2>
          </motion.div>

          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              {[
                { icon: Target, title: "For job seekers", items: ["See your match score before you apply, not after you're rejected.", "Get your resume reorganized around this specific job — never fabricated.", "Practice interview questions built from the actual job description."] },
                { icon: Sparkles, title: "For employers", items: ["Paste any job description and get a structured, live listing in seconds.", "See applicants ranked by real match data, not just a stack of PDFs.", "Manage every listing from one dashboard, not a spreadsheet."] },
              ].map((block, i) => (
                <motion.div key={block.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.1 }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand">
                    <block.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{block.title}</h3>
                  <ul className="mt-2.5 space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-white/70">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.15 }} className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-dashed border-white/25 bg-white/5 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">Before</p>
                <div className="mt-4 space-y-3">
                  {[{ role: "Frontend Developer", status: "No response" }, { role: "Product Designer", status: "No response" }, { role: "Backend Engineer", status: "Rejected" }].map((row) => (
                    <div key={row.role} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm text-white/70">{row.role}</p>
                      <p className="mt-0.5 text-xs text-white/50">{row.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-lg">
                <p className="text-xs font-medium uppercase tracking-wide text-brand">With Baseman</p>
                <div className="mt-4 space-y-3">
                  {[{ role: "Frontend Developer", match: "86%", status: "Interview", tone: "success" }, { role: "Product Designer", match: "54%", status: "Needs work", tone: "warning" }, { role: "Backend Engineer", match: "91%", status: "Applied", tone: "success" }].map((row) => (
                    <div key={row.role} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-ink">{row.role}</p>
                        <p className={`mt-0.5 text-xs font-medium ${row.tone === "success" ? "text-success" : "text-warning"}`}>{row.status}</p>
                      </div>
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${row.tone === "success" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{row.match}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- How it works (toggle, 3-per-row) ---------------- */}
      <section id="how-it-works" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-ink">Six steps. One flow.</h2>
              <p className="mt-3 text-muted">No dead ends, no guesswork about what to do next.</p>
            </motion.div>
            <div className="inline-flex w-fit items-center gap-1 rounded-lg border border-border p-1">
              {(["seeker", "employer"] as const).map((key) => (
                <button key={key} onClick={() => setAudience(key)} className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${audience === key ? "bg-brand text-white" : "text-muted hover:text-ink"}`}>
                  {key === "seeker" ? "Job seekers" : "Employers"}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={audience} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {activeSteps.map((step, i) => (
                <motion.div key={step.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <step.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand">{String(i + 1).padStart(2, "0")} · {step.label}</p>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------- Employer spotlight (solid teal) ---------------- */}
      <section className="bg-brand">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold tracking-tight text-white">Hiring shouldn't mean drowning in resumes.</h2>
            <p className="mt-4 max-w-md text-white/70">
              Post once, and every applicant arrives already scored against your
              requirements. Spend your time on the candidates worth a real conversation.
            </p>
            <a href="/employers" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:underline">
              See how employer posting works <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: 0.1 }} className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/15">
            <img
              src="https://images.pexels.com/photos/7651804/pexels-photo-7651804.jpeg?auto=compress&cs=tinysrgb&w=1000&h=750&dpr=1"
              alt="A hiring team reviewing candidates together in the office"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Everything runs on the same AI layer.</h2>
            <p className="mt-3 text-muted">Matching, resume tailoring, interview prep, and job parsing all pull from one system.</p>
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

      {/* ---------------- Testimonials (carousel) ---------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-bold tracking-tight text-ink"
          >
            People are already using it differently.
          </motion.h2>

          <div className="relative mt-12">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={testimonialIndex}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection * -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl border border-border bg-white p-8 text-center sm:p-12"
                >
                  <Quote className="mx-auto h-7 w-7 text-brand" />
                  <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">
                    “{testimonials[testimonialIndex].quote}”
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand">
                      {testimonials[testimonialIndex].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-ink">{testimonials[testimonialIndex].name}</p>
                      <p className="text-xs text-muted">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / Next controls */}
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white p-2 text-muted transition-colors hover:text-ink sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white p-2 text-muted transition-colors hover:text-ink sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Mobile controls + dots */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button onClick={prevTestimonial} aria-label="Previous testimonial" className="flex items-center justify-center rounded-full border border-border p-2 text-muted hover:text-ink sm:hidden">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => goToTestimonial(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === testimonialIndex ? "w-6 bg-brand" : "w-1.5 bg-border"}`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} aria-label="Next testimonial" className="flex items-center justify-center rounded-full border border-border p-2 text-muted hover:text-ink sm:hidden">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
              <h3 className="text-sm font-semibold text-ink">Your data stays yours</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Baseman never fabricates experience on your resume, and never sells your resume
                or application data to third parties. You control what employers see.
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
            <h2 className="text-3xl font-bold tracking-tight text-white">Stop guessing. Start knowing.</h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">Whether you're applying or hiring, Baseman replaces the guesswork with a real answer.</p>
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

      {/* ---------------- Footer ---------------- */}
      <Footer/>
    </main>
  );
}