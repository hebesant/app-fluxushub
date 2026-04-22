"use client";

import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type UserContext } from "@/lib/api";
import { InfoCard, SettingsPanel } from "./settingsShared";

export function AccountSettingsSection({
  user,
  name,
  workspaceName,
  currentRoleLabel,
}: {
  user: UserContext | null;
  name: string;
  workspaceName: string;
  currentRoleLabel: string;
}) {
  return (
    <SettingsPanel
      icon={UserRound}
      title="Conta"
      description="Usuario conectado neste painel."
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-medium text-foreground dark:text-white">{name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Usuario autenticado com acesso ao workspace atual.
              </p>
            </div>
            <Badge variant="outline">{currentRoleLabel}</Badge>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <InfoCard
            label="Nome completo"
            value={name}
            helper="Identificacao exibida na area autenticada."
          />
          <InfoCard
            label="E-mail"
            value={user?.email ?? "-"}
            helper="Usado para login e recebimento de convites."
          />
          <InfoCard
            label="Username"
            value={user?.username ?? "-"}
            helper="Identificador interno da conta."
          />
          <InfoCard
            label="Workspace atual"
            value={workspaceName}
            helper="Base principal vinculada a esta sessao."
          />
        </div>
      </div>
    </SettingsPanel>
  );
}
