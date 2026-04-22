"use client";

import {
  Building2,
  Gauge,
  Rocket,
  Shield,
  Snail,
  Thermometer,
  UserRound,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { type Membership } from "@/lib/api";

export type SettingsTab = "workspace" | "team" | "sending" | "account";
export type SendMode = "slow" | "normal" | "fast";
export type MvpAssignableRole = Extract<Membership["role"], "member" | "owner">;

const fallbackTimezoneOptions = [
  "America/Sao_Paulo",
  "America/Recife",
  "America/Fortaleza",
  "America/Manaus",
  "America/Belem",
  "America/Cuiaba",
  "America/Porto_Velho",
  "America/Rio_Branco",
  "America/Noronha",
  "UTC",
];

export const settingsTabs: Array<{
  id: SettingsTab;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    id: "workspace",
    label: "Workspace",
    description: "Dados gerais da base.",
    icon: Building2,
  },
  {
    id: "team",
    label: "Equipe",
    description: "Membros, papeis e convites.",
    icon: Shield,
  },
  {
    id: "sending",
    label: "Envio",
    description: "Modo padrao de campanhas.",
    icon: Gauge,
  },
  {
    id: "account",
    label: "Conta",
    description: "Usuario conectado.",
    icon: UserRound,
  },
];

export const sendModeIconMap = {
  slow: Snail,
  normal: Thermometer,
  fast: Rocket,
};

export function getRoleLabel(role: Membership["role"]) {
  if (role === "owner") {
    return "Owner";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Member";
}

export function SettingsPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function InfoCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm font-medium text-foreground dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
    </div>
  );
}

export function getTimezoneOptions(currentTimezone?: string, browserTimezone?: string) {
  const supported =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf("timeZone")
      : fallbackTimezoneOptions;

  return Array.from(
    new Set(
      [currentTimezone, browserTimezone, ...supported].filter(
        (value): value is string => Boolean(value)
      )
    )
  ).sort((left, right) => left.localeCompare(right));
}
