import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";

export type DashboardMetricTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type DashboardMetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
  badge: string;
  tone: DashboardMetricTone;
  isLoading: boolean;
};

export function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  detail,
  badge,
  tone,
  isLoading,
}: DashboardMetricCardProps) {
  const displayBadge = isLoading ? "Carregando" : badge;
  const displayDetail = isLoading ? "Sincronizando dados..." : detail;
  const displayTone = isLoading ? "neutral" : tone;

  return (
    <article className="rounded-lg border border-border bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-500 text-white">
          <Icon className="size-4" />
        </div>
        <Badge variant="outline" className={toneClasses[displayTone]}>
          {displayBadge}
        </Badge>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground dark:text-white">
        {isLoading ? "-" : value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{displayDetail}</p>
    </article>
  );
}

const toneClasses: Record<DashboardMetricTone, string> = {
  success:
    "border-emerald-300/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100",
  warning:
    "border-amber-300/60 bg-amber-500/15 text-amber-700 dark:text-amber-100",
  danger: "border-red-300/60 bg-red-500/15 text-red-700 dark:text-red-100",
  info: "border-sky-300/60 bg-sky-500/15 text-sky-700 dark:text-sky-100",
  neutral:
    "border-border bg-muted text-muted-foreground dark:border-white/10 dark:bg-white/8",
};
