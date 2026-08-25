"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  Briefcase,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

type Role = "seeker" | "employer";

/* ---------------------------------------------------------------
   TODO: replace these with real auth state, e.g.:
   const { data: session } = useSession();
   const isLoggedIn = !!session;
   const role = session?.user?.role as Role;
---------------------------------------------------------------- */
const MOCK_USER = {
  name: "Jordan Lee",
  email: "jordan@example.com",
};

const seekerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "My Applications", icon: ClipboardList },
  { href: "/saved", label: "Saved Jobs", icon: Bookmark },
];

const employerLinks = [
  { href: "/employers/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employers/listings", label: "My Listings", icon: Briefcase },
  { href: "/employers/post", label: "Post a Job", icon: PlusCircle },
];

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: replace with real auth state
  const [role, setRole] = useState<Role>("seeker"); // TODO: derive from user session
  const [menuOpen, setMenuOpen] = useState(false);

  const links = role === "seeker" ? seekerLinks : employerLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#134544]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/base.png" alt="logo" className="md:w-50 w-30" />
        </a>

        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="/jobs" className="hover:text-white text-white/80">Jobs</a>
          <a href="#how-it-works" className="hover:text-white text-white/80">How it works</a>
          <a href="/employers" className="hover:text-white text-white/80">For employers</a>
          <a href="/pricing" className="hover:text-white text-white/80">Pricing</a>
          <a href="/about" className="hover:text-white text-white/80">About</a>
        </div>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                {MOCK_USER.name.charAt(0)}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-white/70 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Click-outside overlay */}
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-xl"
                  >
                    <div className="border-b border-border p-4">
                      <p className="text-sm font-semibold text-ink">{MOCK_USER.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{MOCK_USER.email}</p>
                      <span className="mt-2 inline-flex items-center rounded-md bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand">
                        {role === "seeker" ? "Job seeker" : "Employer"}
                      </span>
                    </div>

                    <div className="p-1.5">
                      {links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light transition-colors"
                        >
                          <link.icon className="h-4 w-4 text-muted" />
                          {link.label}
                        </a>
                      ))}
                      <a
                        href={role === "seeker" ? "/settings" : "/employers/settings"}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted" />
                        Settings
                      </a>
                    </div>

                    <div className="border-t border-border p-1.5">
                      <button
                        onClick={() => {
                          setIsLoggedIn(false); // TODO: call real sign-out
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-error/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-black/60 hover:text-white/80 text-white">Log in</a>
            <a href="/signup" className="rounded-lg bg-brand px-4 py-2 text-sm bg-white font-medium text-[#134544]">Sign up</a>
          </div>
        )}
      </nav>
    </header>
  );
}