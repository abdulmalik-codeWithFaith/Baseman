"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, ClipboardList, Sparkles, PlusCircle } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/jobs/post", label: "Post a Job", icon: PlusCircle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/ai-usage", label: "AI Usage", icon: Sparkles },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block">
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand-light text-brand" : "text-muted hover:bg-brand-light/50 hover:text-ink"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}