"use client";

import { Badge } from "@/components/ui/badge";
import { type Workspace } from "@/lib/api";
import { Building2 } from "lucide-react";
import { InfoCard, SettingsPanel } from "./settingsShared";

export function WorkspaceSettingsSection({
  workspace,
  workspaceName,
  currentRoleLabel,
  selectedModeName,
}: {
  workspace: Workspace | null;
  workspaceName: string;
  currentRoleLabel: string;
  selectedModeName: string;
}) {
  return (
    <SettingsPanel
      icon={Building2}
      title="Workspace"
      description="Dados gerais da base atual."
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-medium text-foreground dark:text-white">
                {workspaceName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Base principal usada para contatos, disparos e equipe.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={workspace?.is_active === false ? "destructive" : "default"}
              >
                {workspace?.is_active === false ? "Inativo" : "Ativo"}
              </Badge>
              <Badge variant="outline">{currentRoleLabel}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <InfoCard
            label="Slug"
            value={workspace?.slug || "-"}
            helper="Identificador interno do workspace."
          />
          <InfoCard
            label="Documento"
            value={workspace?.document || "-"}
            helper="Campo de identificacao comercial da base."
          />
          <InfoCard
            label="Modo padrao"
            value={selectedModeName}
            helper="Usado como padrao nas novas campanhas."
          />
          <InfoCard
            label="Criado em"
            value={
              workspace?.created_at
                ? new Date(workspace.created_at).toLocaleDateString("pt-BR")
                : "-"
            }
            helper="Data de criacao do workspace atual."
          />
        </div>
      </div>
    </SettingsPanel>
  );
}
