import type { WhatsAppInstance } from "@/lib/api";

export const whatsappStatusLabels: Record<WhatsAppInstance["status"], string> = {
  disconnected: "Desconectado",
  connecting: "Conectando",
  connected: "Conectado",
  error: "Erro",
};

export const whatsappStatusClasses: Record<WhatsAppInstance["status"], string> = {
  connected:
    "border-emerald-300/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100",
  connecting: "border-sky-300/60 bg-sky-500/15 text-sky-700 dark:text-sky-100",
  disconnected:
    "border-red-300/60 bg-red-500/15 text-red-700 dark:text-red-100",
  error: "border-red-300/50 bg-red-600/30 text-red-50",
};
