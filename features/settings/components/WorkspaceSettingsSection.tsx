"use client";

import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Workspace } from "@/lib/api";
import {
  getTimezoneOptions,
  InfoCard,
  SettingsPanel,
} from "./settingsShared";

export function WorkspaceSettingsSection({
  workspace,
  workspaceName,
  currentRoleLabel,
  selectedModeName,
  selectedTimezone,
  browserTimezone,
  isSavingTimezone,
  canManageWorkspace,
  onTimezoneChange,
  onSaveTimezone,
}: {
  workspace: Workspace | null;
  workspaceName: string;
  currentRoleLabel: string;
  selectedModeName: string;
  selectedTimezone: string;
  browserTimezone: string;
  isSavingTimezone: boolean;
  canManageWorkspace: boolean;
  onTimezoneChange: (value: string) => void;
  onSaveTimezone: () => void;
}) {
  const timezoneOptions = getTimezoneOptions(workspace?.timezone, browserTimezone);

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

        <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <Label>Timezone do workspace</Label>
              <Select
                value={selectedTimezone}
                onValueChange={onTimezoneChange}
                disabled={!canManageWorkspace}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione uma timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((timezoneOption) => (
                    <SelectItem key={timezoneOption} value={timezoneOption}>
                      {timezoneOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Agendamentos usam este fuso como referencia. Navegador atual:{" "}
                <span className="font-medium text-foreground dark:text-white">
                  {browserTimezone}
                </span>
                .
              </p>
            </div>
            <Button
              type="button"
              onClick={onSaveTimezone}
              disabled={!workspace || isSavingTimezone || !canManageWorkspace}
              className="h-10 bg-primary-500 text-white hover:bg-primary-400"
            >
              {isSavingTimezone ? "Salvando..." : "Salvar timezone"}
            </Button>
          </div>
          {!canManageWorkspace ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Apenas owners podem alterar a timezone do workspace.
            </p>
          ) : null}
        </div>
      </div>
    </SettingsPanel>
  );
}
