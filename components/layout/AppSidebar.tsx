import {
  BarChart3,
  ContactRound,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Workflow,
} from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  campaigns: MessageSquareText,
  contacts: ContactRound,
  automations: Workflow,
  reports: BarChart3,
  settings: Settings,
};

export function AppSidebar() {
  return (
    <aside className="hidden border-r border-white/10 bg-neutral-950/72 px-4 py-4 backdrop-blur-2xl backdrop-saturate-150 lg:block">
      <div className="flex h-full flex-col">
        <div className="rounded-lg border border-white/10 bg-white/8 px-4 py-4">
          <p className="text-lg font-semibold">FluxusHub</p>
          <p className="mt-1 text-xs text-neutral-400">Campaign OS</p>
        </div>

        <nav className="mt-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white",
                  item.active &&
                    "bg-primary-500 text-white shadow-[0_0_30px_rgba(1,73,247,0.32)]"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/8 p-4">
          <p className="text-sm font-semibold">Plano Growth</p>
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            72% do volume mensal usado. Revise a fila antes do proximo disparo.
          </p>
        </div>
      </div>
    </aside>
  );
}
