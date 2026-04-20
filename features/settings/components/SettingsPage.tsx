"use client";

import {
  Building2,
  Check,
  Gauge,
  Rocket,
  Snail,
  Thermometer,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatApiError,
  getAccessToken,
  type Workspace,
} from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { concreteSendModes } from "@/features/campaigns/components/campaignFormUtils";
import {
  fetchWorkspaces,
  updateWorkspaceSettings,
} from "../api/settingsApi";

type SettingsTab = "workspace" | "sending" | "account";
type SendMode = "slow" | "normal" | "fast";

const tabs: Array<{
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

const sendModeIconMap = {
  slow: Snail,
  normal: Thermometer,
  fast: Rocket,
};

export function SettingsPage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("workspace");
  const [selectedSendMode, setSelectedSendMode] = useState<SendMode>("slow");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isSavingSendMode, setIsSavingSendMode] = useState(false);
  const workspaceName =
    workspace?.name ?? user?.memberships[0]?.workspace_name ?? "Workspace";
  const name = user?.full_name || user?.email || "Usuario";
  const selectedMode = concreteSendModes.find(
    (mode) => mode.id === selectedSendMode
  );

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setIsLoadingWorkspace(false);
      return;
    }

    fetchWorkspaces(token)
      .then((workspaces) => {
        const activeWorkspace = workspaces[0] ?? null;
        setWorkspace(activeWorkspace);
        setSelectedSendMode(activeWorkspace?.default_send_mode ?? "slow");
      })
      .catch((requestError) => {
        sonnerToast.error(formatApiError(requestError));
      })
      .finally(() => setIsLoadingWorkspace(false));
  }, []);

  async function saveSendMode() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSavingSendMode(true);

    try {
      const updatedWorkspace = await updateWorkspaceSettings(token, workspace.id, {
        default_send_mode: selectedSendMode,
      });
      setWorkspace(updatedWorkspace);
      setSelectedSendMode(updatedWorkspace.default_send_mode);
      sonnerToast.success("Configuracao salva.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsSavingSendMode(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">
          Configuracoes
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Ajustes do workspace e padroes de envio.
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-neutral-300">
          Central para organizar conta, workspace e comportamento padrao das
          campanhas. O modo de envio ainda podera ser ajustado por campanha.
        </p>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="self-start border-border/70 bg-card/92 p-3 backdrop-blur dark:border-white/10 dark:bg-white/8">
          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground dark:hover:border-white/10 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4" />
                    {tab.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5">
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {activeTab === "workspace" ? (
          <SettingsPanel
            icon={Building2}
            title="Workspace"
            description="Dados gerais da base atual."
          >
            <InfoRow label="Nome" value={workspaceName} />
            <InfoRow label="Status" value="Ativo" />
          </SettingsPanel>
        ) : null}

        {activeTab === "sending" ? (
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
                    onClick={() => setSelectedSendMode(mode.id)}
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
                  Modo selecionado: {selectedMode?.name ?? "Lento"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Essa escolha fica salva no workspace e sera usada como padrao
                  nas novas campanhas.
                </p>
              </div>
              <Button
                type="button"
                onClick={saveSendMode}
                disabled={isLoadingWorkspace || isSavingSendMode || !workspace}
                className="h-10 bg-primary-500 text-white hover:bg-primary-400"
              >
                {isSavingSendMode ? "Salvando..." : "Salvar configuracao"}
              </Button>
            </div>
          </SettingsPanel>
        ) : null}

        {activeTab === "account" ? (
          <SettingsPanel
            icon={UserRound}
            title="Conta"
            description="Usuario conectado neste painel."
          >
            <InfoRow label="Nome" value={name} />
            <InfoRow label="E-mail" value={user?.email ?? "-"} />
          </SettingsPanel>
        ) : null}
      </div>
    </div>
  );
}

function SettingsPanel({
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/45 px-3 py-2 dark:border-white/10 dark:bg-neutral-950/40">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium text-foreground dark:text-white">
        {value}
      </span>
    </div>
  );
}
