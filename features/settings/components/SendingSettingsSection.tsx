"use client";

import { Check, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { concreteSendModes } from "@/features/campaigns/components/campaignFormUtils";
import { type Workspace } from "@/lib/api";
import { SettingsPanel, type SendMode, sendModeIconMap } from "./settingsShared";

export function SendingSettingsSection({
  selectedSendMode,
  onSendModeChange,
  selectedModeName,
  isLoadingWorkspace,
  isSavingSendMode,
  workspace,
  onSave,
}: {
  selectedSendMode: SendMode;
  onSendModeChange: (mode: SendMode) => void;
  selectedModeName: string;
  isLoadingWorkspace: boolean;
  isSavingSendMode: boolean;
  workspace: Workspace | null;
  onSave: () => void;
}) {
  return (
    <SettingsPanel
      icon={Gauge}
      title="Envio"
      description="Escolha o modo padrao usado nas novas campanhas."
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {concreteSendModes.map((mode) => {
          const isSelected = selectedSendMode === mode.id;
          const Icon = sendModeIconMap[mode.id];

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSendModeChange(mode.id)}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-border bg-muted/45 hover:bg-muted/70 dark:border-white/10 dark:bg-neutral-950/40 dark:hover:bg-white/8"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary-700 dark:text-primary-100" />
                    <p className="font-semibold text-foreground dark:text-white">
                      {mode.name}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode.delay} entre mensagens
                  </p>
                </div>
                {isSelected ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                    <Check className="size-4" />
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {mode.detail}
              </p>

              {mode.id === "slow" ? (
                <Badge className="mt-3 bg-emerald-500 text-white">
                  Recomendado
                </Badge>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground dark:text-white">
            Modo selecionado: {selectedModeName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essa escolha fica salva no workspace e sera usada como padrao nas
            novas campanhas.
          </p>
        </div>
        <Button
          type="button"
          onClick={onSave}
          disabled={isLoadingWorkspace || isSavingSendMode || !workspace}
          className="h-10 bg-primary-500 text-white hover:bg-primary-400"
        >
          {isSavingSendMode ? "Salvando..." : "Salvar configuracao"}
        </Button>
      </div>
    </SettingsPanel>
  );
}
