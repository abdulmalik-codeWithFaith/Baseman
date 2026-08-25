
export default function NavBar(){
    return(
        <header className="border-b border-border bg-[#134544]">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2.5">
                <img src="/base.png" alt="logo" className="w-50"/>
            </a>
            <div className="hidden items-center gap-8 text-sm text-muted md:flex">
                <a href="/jobs" className="hover:text-white text-white/80">Jobs</a>
                <a href="#how-it-works" className="hover:text-white text-white/80">How it works</a>
                <a href="/employers" className="hover:text-white text-white/80">For employers</a>
                <a href="/pricing" className="hover:text-white text-white/80">Pricing</a>
                <a href="/about" className="hover:text-white text-white/80">About</a>
            </div>
            <div className="flex items-center gap-3">
                <a href="/login" className="text-sm font-medium text-black/60 hover:text-brand text-white">Log in</a>
                <a href="/signup" className="rounded-lg bg-brand px-4 py-2 text-sm bg-white font-medium text-[#134544]">Sign up</a>
            </div>
            </nav>
      </header>
    )
}