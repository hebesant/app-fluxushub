import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { DashboardChecklistItem } from "../types";

type DashboardChecklistCardProps = {
  items: DashboardChecklistItem[];
  isLoading: boolean;
};

export function DashboardChecklistCard({
  items,
  isLoading,
}: DashboardChecklistCardProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-white">
            Checklist operacional
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            O essencial antes de disparar.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/40">
            <p className="text-sm font-medium text-foreground dark:text-white">
              Carregando checklist...
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Buscando conexoes, contatos e campanhas da sua base.
            </p>
          </div>
        ) : null}

        {!isLoading ? items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/45 p-3 transition hover:bg-muted/70 dark:border-white/10 dark:bg-neutral-950/40 dark:hover:bg-white/8"
          >
            <span
              className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${
                item.isDone
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground dark:bg-white/10"
              }`}
            >
              <CheckCircle2 className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium text-foreground dark:text-white">
                {item.label}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {item.detail}
              </span>
            </span>
          </Link>
        )) : null}
      </div>
    </Card>
  );
}
