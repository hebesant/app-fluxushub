import type { Campaign, CampaignRecipient, WhatsAppInstance } from "@/lib/api";

export const campaignVariableButtons = [
  { label: "Nome", value: "{{name}}" },
  { label: "Primeiro nome", value: "{{first_name}}" },
  { label: "Telefone", value: "{{phone}}" },
];

export const campaignStatusLabels: Record<Campaign["status"], string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  ready: "Pronta",
  sending: "Enviando",
  sent: "Enviada",
  failed: "Falhou",
  canceled: "Cancelada",
};

export const campaignStatusClasses: Record<Campaign["status"], string> = {
  draft:
    "border-slate-300/70 bg-slate-500/10 text-slate-700 dark:border-white/10 dark:bg-white/8 dark:text-neutral-200",
  scheduled:
    "border-violet-300/60 bg-violet-500/15 text-violet-700 dark:text-violet-100",
  ready: "border-blue-300/50 bg-blue-500/15 text-blue-700 dark:text-blue-100",
  sending:
    "border-amber-300/60 bg-amber-500/15 text-amber-700 dark:text-amber-100",
  sent: "border-emerald-300/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100",
  failed: "border-red-300/60 bg-red-500/15 text-red-700 dark:text-red-100",
  canceled:
    "border-slate-300/70 bg-slate-500/10 text-slate-700 dark:border-neutral-300/20 dark:bg-neutral-500/15 dark:text-neutral-300",
};

export const whatsappInstanceStatusLabels: Record<
  WhatsAppInstance["status"],
  string
> = {
  disconnected: "desconectada",
  connecting: "conectando",
  connected: "conectada",
  error: "erro",
};

export const campaignRecipientStatusLabels: Record<
  CampaignRecipient["status"],
  string
> = {
  pending: "Pendente",
  sent: "Enviado",
  failed: "Falhou",
  skipped: "Ignorado",
};

export const campaignRecipientStatusClasses: Record<
  CampaignRecipient["status"],
  string
> = {
  pending:
    "border-amber-300/60 bg-amber-500/15 text-amber-700 dark:text-amber-100",
  sent: "border-emerald-300/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100",
  failed: "border-red-300/60 bg-red-500/15 text-red-700 dark:text-red-100",
  skipped:
    "border-slate-300/70 bg-slate-500/10 text-slate-700 dark:border-neutral-300/20 dark:bg-neutral-500/15 dark:text-neutral-300",
};
