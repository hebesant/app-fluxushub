import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardPrimaryAction } from "../types";

type DashboardHeroProps = {
  title: string;
  primaryAction: DashboardPrimaryAction;
  error: string;
};

export function DashboardHero({
  title,
  primaryAction,
  error,
}: DashboardHeroProps) {
  return (
    <Card className="relative overflow-hidden border-border/70 bg-card/92 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/8 dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_70%_24%,rgba(1,73,247,0.26),transparent_38%)] light:bg-[radial-gradient(circle_at_70%_24%,rgba(1,73,247,0.12),transparent_38%)]" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300 light:text-primary-700">
            Visao geral
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Acompanhe conexoes, base de contatos e campanhas recentes em um
            unico lugar.
          </p>
        </div>

        <Button
          asChild
          className="h-11 rounded-lg bg-primary-500 px-5 text-white shadow-[0_0_36px_rgba(1,73,247,0.34)] hover:bg-primary-400"
        >
          <Link href={primaryAction.href}>
            {primaryAction.label}
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      {error ? (
        <p className="mt-5 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-100">
          {error}
        </p>
      ) : null}
    </Card>
  );
}

