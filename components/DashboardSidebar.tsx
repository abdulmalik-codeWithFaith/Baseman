"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Bookmark, Settings } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "My Applications", icon: ClipboardList },
  { href: "/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
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