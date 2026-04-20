import type { Campaign } from "@/lib/api";
import type {
  DashboardChecklistItem,
  DashboardPrimaryAction,
} from "../types";

export function dashboardTitle({
  workspaceName,
  connectedInstancesCount,
  contactsCount,
}: {
  workspaceName: string;
  connectedInstancesCount: number;
  contactsCount: number;
}) {
  if (!connectedInstancesCount) {
    return `${workspaceName} precisa conectar um WhatsApp.`;
  }

  if (!contactsCount) {
    return `${workspaceName} ja tem WhatsApp. Agora faltam contatos.`;
  }

  return `${workspaceName} pronta para campanhas.`;
}

export function getPrimaryAction({
  connectedInstancesCount,
  contactsCount,
}: {
  connectedInstancesCount: number;
  contactsCount: number;
}): DashboardPrimaryAction {
  if (!connectedInstancesCount) {
    return { href: "/whatsapp", label: "Conectar WhatsApp" };
  }

  if (!contactsCount) {
    return { href: "/contacts", label: "Importar contatos" };
  }

  return { href: "/campaigns", label: "Criar campanha" };
}

export function buildDashboardChecklist({
  connectedInstancesCount,
  contactsCount,
  campaignsCount,
}: {
  connectedInstancesCount: number;
  contactsCount: number;
  campaignsCount: number;
}): DashboardChecklistItem[] {
  return [
    {
      label: "WhatsApp conectado",
      detail: connectedInstancesCount
        ? `${connectedInstancesCount} instancia${
            connectedInstancesCount === 1 ? "" : "s"
          } conectada${connectedInstancesCount === 1 ? "" : "s"}`
        : "Conecte uma instancia por QR Code.",
      isDone: connectedInstancesCount > 0,
      href: "/whatsapp",
    },
    {
      label: "Contatos importados",
      detail: contactsCount
        ? `${contactsCount} contato${contactsCount === 1 ? "" : "s"} ativo${
            contactsCount === 1 ? "" : "s"
          }`
        : "Importe ou cadastre os primeiros contatos.",
      isDone: contactsCount > 0,
      href: "/contacts",
    },
    {
      label: "Primeira campanha",
      detail: campaignsCount
        ? `${campaignsCount} campanha${
            campaignsCount === 1 ? "" : "s"
          } recente${campaignsCount === 1 ? "" : "s"}`
        : "Crie um rascunho para validar mensagem e alvo.",
      isDone: campaignsCount > 0,
      href: "/campaigns",
    },
  ];
}

export function getSendingCampaign(campaigns: Campaign[]) {
  return campaigns.find((campaign) => campaign.status === "sending") ?? null;
}

export function getFailedCampaigns(campaigns: Campaign[]) {
  return campaigns.filter((campaign) => campaign.status === "failed");
}

