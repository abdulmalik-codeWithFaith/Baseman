"use client";
import {
  ChevronRight,
} from "lucide-react";
export default function Footer(){
    return(
        <footer className="bg-ink">
            <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
                {/* Brand column */}
                <div className="md:col-span-2">
                <a href="/" className="flex items-center gap-2.5">
                    <img src="/base.png" alt="logo" className="w-50"/>
                </a>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                    Know your fit before you apply or post. AI-powered hiring for job
                    seekers and employers.
                </p>
                {/* <div className="mt-6 flex items-center gap-3">
                    <a href="https://twitter.com" aria-label="Baseman on Twitter" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                    </a>
                    <a href="https://linkedin.com" aria-label="Baseman on LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                    </a>
                    <a href="https://github.com" aria-label="Baseman on GitHub" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                    </a>
                </div> */}
                </div>

                {/* Product */}
                <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Product</p>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="/jobs" className="text-white/60 transition-colors hover:text-white">Browse jobs</a></li>
                    <li><a href="#how-it-works" className="text-white/60 transition-colors hover:text-white">How it works</a></li>
                    <li><a href="/employers" className="text-white/60 transition-colors hover:text-white">For employers</a></li>
                    <li><a href="/pricing" className="text-white/60 transition-colors hover:text-white">Pricing</a></li>
                </ul>
                </div>

                {/* Company */}
                <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Company</p>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="/about" className="text-white/60 transition-colors hover:text-white">About</a></li>
                    <li><a href="/careers" className="text-white/60 transition-colors hover:text-white">Careers</a></li>
                    <li><a href="/contact" className="text-white/60 transition-colors hover:text-white">Contact</a></li>
                </ul>
                </div>

                {/* Legal */}
                <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Legal</p>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="/privacy" className="text-white/60 transition-colors hover:text-white">Privacy</a></li>
                    <li><a href="/terms" className="text-white/60 transition-colors hover:text-white">Terms</a></li>
                </ul>
                </div>
            </div>

            <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
                <p>© {new Date().getFullYear()} Baseman. All rights reserved.</p>
                <p>Made for people on both sides of the hire.</p>
            </div>
            </div>
      </footer>
    )
}