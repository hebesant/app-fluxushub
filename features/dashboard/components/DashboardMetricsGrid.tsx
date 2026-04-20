import {
  Megaphone,
  QrCode,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import type { Campaign, WhatsAppInstance } from "@/lib/api";
import { DashboardMetricCard } from "./DashboardMetricCard";

type DashboardMetricsGridProps = {
  instances: WhatsAppInstance[];
  connectedInstancesCount: number;
  contactsCount: number;
  campaigns: Campaign[];
  failedCampaignsCount: number;
  hasSendingCampaign: boolean;
  isLoading: boolean;
};

export function DashboardMetricsGrid({
  instances,
  connectedInstancesCount,
  contactsCount,
  campaigns,
  failedCampaignsCount,
  hasSendingCampaign,
  isLoading,
}: DashboardMetricsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <DashboardMetricCard
        icon={QrCode}
        label="WhatsApp"
        value={`${connectedInstancesCount}/${instances.length || 1}`}
        detail={
          connectedInstancesCount
            ? "Pronto para campanhas"
            : "Aguardando conexao"
        }
        badge={connectedInstancesCount ? "Conectado" : "Pendente"}
        tone={connectedInstancesCount ? "success" : "warning"}
        isLoading={isLoading}
      />
      <DashboardMetricCard
        icon={UsersRound}
        label="Contatos ativos"
        value={String(contactsCount)}
        detail="Base disponivel para segmentacao"
        badge={contactsCount ? "Base criada" : "Vazia"}
        tone={contactsCount ? "success" : "neutral"}
        isLoading={isLoading}
      />
      <DashboardMetricCard
        icon={Megaphone}
        label="Campanhas recentes"
        value={String(campaigns.length)}
        detail="Ultimas campanhas armazenadas"
        badge={hasSendingCampaign ? "Enviando" : "Estavel"}
        tone={hasSendingCampaign ? "info" : "neutral"}
        isLoading={isLoading}
      />
      <DashboardMetricCard
        icon={TriangleAlert}
        label="Falhas recentes"
        value={String(failedCampaignsCount)}
        detail="Revise e reenvie falhas quando fizer sentido"
        badge={failedCampaignsCount ? "Atencao" : "Ok"}
        tone={failedCampaignsCount ? "danger" : "success"}
        isLoading={isLoading}
      />
    </section>
  );
}

