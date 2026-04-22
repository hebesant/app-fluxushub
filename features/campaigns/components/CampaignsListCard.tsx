import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Campaign } from "@/lib/api";
import {
  campaignStatusClasses,
  campaignStatusLabels,
} from "../constants";
import type { CampaignStatusFilter, CampaignTargetFilter } from "../types";
import { campaignTargetLabel as campaignFormTargetLabel } from "./campaignFormUtils";
import { CampaignActionsMenu } from "./CampaignActionsMenu";

type CampaignsListCardProps = {
  campaigns: Campaign[];
  totalCampaigns: number;
  search: string;
  statusFilter: CampaignStatusFilter;
  targetFilter: CampaignTargetFilter;
  page: number;
  totalPages: number;
  isLoading: boolean;
  busyCampaignId: number | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: CampaignStatusFilter) => void;
  onTargetFilterChange: (value: CampaignTargetFilter) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onEdit: (campaign: Campaign) => void;
  onCancel: (campaign: Campaign) => void;
  onSend: (campaign: Campaign) => void;
  onRetryFailed: (campaign: Campaign) => void;
  onDetails: (campaign: Campaign) => void;
};

export function CampaignsListCard({
  campaigns,
  totalCampaigns,
  search,
  statusFilter,
  targetFilter,
  page,
  totalPages,
  isLoading,
  busyCampaignId,
  onSearchChange,
  onStatusFilterChange,
  onTargetFilterChange,
  onPreviousPage,
  onNextPage,
  onEdit,
  onCancel,
  onSend,
  onRetryFailed,
  onDetails,
}: CampaignsListCardProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Disparos</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {campaigns.length} de {totalCampaigns} disparo
              {totalCampaigns === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar disparo"
              className="h-11 pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as CampaignStatusFilter)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {Object.entries(campaignStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={targetFilter}
            onValueChange={(value) =>
              onTargetFilterChange(value as CampaignTargetFilter)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Alvo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos alvos</SelectItem>
              <SelectItem value="tag">Segmento por tag</SelectItem>
              <SelectItem value="list">Segmento por lista</SelectItem>
              <SelectItem value="contacts">Base inteira</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-border dark:border-white/10">
        {isLoading ? (
          <p className="p-4 text-sm text-neutral-300">Carregando disparos...</p>
        ) : campaigns.length ? (
          <div className="divide-y divide-white/10">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex w-full flex-col gap-4 bg-card px-4 py-4 text-left transition hover:bg-muted/60 dark:bg-neutral-950/30 dark:hover:bg-white/5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1 text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-white">
                      {campaign.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={campaignStatusClasses[campaign.status]}
                    >
                      {campaignStatusLabels[campaign.status]}
                    </Badge>
                  </span>
                  <span className="mt-2 block text-sm text-neutral-400">
                    {renderCampaignTargetLabel(campaign)}{" "}
                    - Instancia:{" "}
                    {campaign.whatsapp_instance_name || "Instancia excluida"}
                  </span>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <span className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-400 md:min-w-56">
                    <span className="rounded-lg bg-muted px-2 py-2 dark:bg-white/5">
                      <strong className="block text-sm text-white">
                        {campaign.recipients_count}
                      </strong>
                      Dest.
                    </span>
                    <span className="rounded-lg bg-muted px-2 py-2 dark:bg-white/5">
                      <strong className="block text-sm text-emerald-700 dark:text-emerald-100">
                        {campaign.sent_count}
                      </strong>
                      Enviados
                    </span>
                    <span className="rounded-lg bg-muted px-2 py-2 dark:bg-white/5">
                      <strong className="block text-sm text-red-700 dark:text-red-100">
                        {campaign.failed_count}
                      </strong>
                      Erros
                    </span>
                  </span>
                  <CampaignActionsMenu
                    campaign={campaign}
                    isBusy={busyCampaignId === campaign.id}
                    onEdit={() => onEdit(campaign)}
                    onCancel={() => onCancel(campaign)}
                    onSend={() => onSend(campaign)}
                    onRetryFailed={() => onRetryFailed(campaign)}
                    onDetails={() => onDetails(campaign)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-neutral-300">
            Nenhum disparo criado ainda.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          Pagina {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreviousPage}
            disabled={page <= 1 || isLoading}
            className="h-9"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={onNextPage}
            disabled={page >= totalPages || isLoading}
            className="h-9"
          >
            Proxima
          </Button>
        </div>
      </div>
    </Card>
  );
}

function renderCampaignTargetLabel(campaign: Campaign) {
  if (campaign.target_type === "all") {
    return "Base inteira";
  }

  if (campaign.target_type === "list") {
    return `Lista: ${campaign.target_list}`;
  }

  return `Segmento: ${campaignTargetLabelFromForm(campaign.target_tag)}`;
}

function campaignTargetLabelFromForm(targetTag: string) {
  return campaignFormTargetLabel({
    name: "",
    workspace: "",
    whatsapp_instance: "",
    target_type: "tag",
    target_tag: targetTag,
    target_list: "",
    message_template: "",
    send_mode: "slow",
    media_type: "none",
    media_file: null,
    media_file_url: null,
  });
}
