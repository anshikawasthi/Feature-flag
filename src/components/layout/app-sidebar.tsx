"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";
import { evaluationNavItems, nexusNavItems, type NavItem } from "./nav-data";

function NavGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-2.5 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary/10 text-foreground bg-accent"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-3 py-4">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="size-4" />
        </div>
        <div className="leading-none">
          <p className="text-sm font-semibold">Nexus Enterprise</p>
          <p className="text-[11px] text-muted-foreground">
            Feature Management Evaluation Portal
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <NavGroup
          title="Nexus Enterprise"
          items={nexusNavItems}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavGroup
          title="Evaluation Tools"
          items={evaluationNavItems}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
      <SidebarContent />
    </aside>
  );
}
