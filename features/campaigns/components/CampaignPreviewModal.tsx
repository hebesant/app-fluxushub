"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import type { Campaign, CampaignPreview } from "@/lib/api";
import {
  campaignStatusClasses,
  campaignStatusLabels,
} from "../constants";
import {
  campaignTargetLabel as campaignFormTargetLabel,
  renderLocalPreview,
} from "./campaignFormUtils";
import { CampaignWhatsAppPreview } from "./CampaignWhatsAppPreview";

type CampaignPreviewModalProps = {
  selectedCampaign: Campaign | null;
  preview: CampaignPreview | null;
  isPreviewLoading: boolean;
  onClose: () => void;
};

export function CampaignPreviewModal({
  selectedCampaign,
  preview,
  isPreviewLoading,
  onClose,
}: CampaignPreviewModalProps) {
  if (!selectedCampaign) {
    return null;
  }

  const previewMessage =
    preview?.samples[0]?.message ??
    renderLocalPreview(selectedCampaign.message_template);
  const targetLabel =
    selectedCampaign.target_type === "all"
      ? "Base inteira"
      : selectedCampaign.target_type === "list"
        ? `Lista: ${selectedCampaign.target_list}`
        : `Segmento: ${campaignTargetLabelFromTags(selectedCampaign.target_tag)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <ModalCloseButton onClick={onClose} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
            <Eye className="size-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Preview da campanha</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Resumo do que foi enviado, para relembrar o conteudo e o segmento.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/35">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="truncate font-semibold text-foreground dark:text-white">
                  {selectedCampaign.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {targetLabel}
                </p>
              </div>
              <Badge
                variant="outline"
                className={campaignStatusClasses[selectedCampaign.status]}
              >
                {campaignStatusLabels[selectedCampaign.status]}
              </Badge>
            </div>
          </div>

          <CampaignWhatsAppPreview
            message={previewMessage}
            mediaPreviewUrl={selectedCampaign.media_file_url}
            mediaType={selectedCampaign.media_type}
            targetLabel={targetLabel}
          />

          {isPreviewLoading ? (
            <p className="rounded-lg border border-border bg-muted/45 p-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
              Carregando preview...
            </p>
          ) : preview ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <PreviewInfo
                label="Total previsto"
                value={String(preview.total_contacts)}
              />
              <PreviewInfo
                label="Variaveis"
                value={
                  preview.variables.length
                    ? preview.variables.map((item) => `{{${item}}}`).join(", ")
                    : "Nenhuma"
                }
              />
            </div>
          ) : null}

          {preview?.samples[0] ? (
            <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/50">
              <p className="text-sm text-muted-foreground">
                Exemplo usando <span className="font-medium text-foreground dark:text-white">{preview.samples[0].name}</span>.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PreviewInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground dark:text-white">
        {value}
      </p>
    </div>
  );
}

function campaignTargetLabelFromTags(targetTag: string) {
  return campaignFormTargetLabel({
    name: "",
    workspace: "",
    whatsapp_instance: "",
    target_type: "tag",
    target_tag: targetTag,
    target_list: "",
    message_template: "",
    send_mode: "slow",
    schedule_type: "now",
    scheduled_for_local: "",
    media_type: "none",
    media_file: null,
    media_file_url: null,
  });
}
