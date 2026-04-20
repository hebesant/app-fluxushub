"use client";

import {
  ContactRound,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { FluxusLogo } from "@/components/brand/FluxusLogo";
import { navigationItems, settingsNavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  contacts: ContactRound,
  campaigns: Megaphone,
  whatsapp: MessageCircle,
  settings: Settings,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[232px] border-r border-white/10 bg-neutral-950/72 px-3 py-3 backdrop-blur-2xl backdrop-saturate-150 light:border-slate-200 light:bg-white/82 lg:block">
      <div className="flex h-full flex-col">
        <div className="rounded-lg border border-white/10 bg-white/8 px-3 py-3 light:border-slate-200 light:bg-white">
          <FluxusLogo
            variant="wordmark"
            tone="auto"
            imageClassName="h-7 w-auto"
          />
          <p className="mt-1 text-xs text-neutral-400">Campaign OS</p>
        </div>

        <nav className="mt-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary-500 text-white shadow-[0_0_30px_rgba(1,73,247,0.32)] light:text-white light:hover:bg-primary-600 light:hover:text-white"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-950"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="mt-auto space-y-1 pb-3">
          <SidebarLink
            href={settingsNavigationItem.href}
            icon={iconMap[settingsNavigationItem.icon]}
            isActive={pathname === settingsNavigationItem.href}
            label={settingsNavigationItem.label}
          />
        </nav>

      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  isActive,
  label,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition",
        isActive
          ? "bg-primary-500 text-white shadow-[0_0_30px_rgba(1,73,247,0.32)] light:text-white light:hover:bg-primary-600 light:hover:text-white"
          : "text-neutral-300 hover:bg-white/10 hover:text-white light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-950"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
