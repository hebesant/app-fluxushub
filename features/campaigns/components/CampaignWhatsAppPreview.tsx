import { CheckCheck, Paperclip } from "lucide-react";
import { FluxusLogo } from "@/components/brand/FluxusLogo";
import type { CampaignForm } from "../types";
import { renderWhatsAppText } from "./campaignFormUtils";

type CampaignWhatsAppPreviewProps = {
  message: string;
  mediaPreviewUrl: string | null;
  mediaType: CampaignForm["media_type"];
  targetLabel: string;
};

export function CampaignWhatsAppPreview({
  message,
  mediaPreviewUrl,
  mediaType,
  targetLabel,
}: CampaignWhatsAppPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm dark:border-white/10 dark:bg-neutral-950">
      <div className="flex items-center gap-3 border-b border-border bg-[#075e54] px-4 py-3 text-white dark:border-white/10 dark:bg-emerald-950">
        <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
          <FluxusLogo variant="mark" tone="light" imageClassName="h-5 w-auto" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Fluxus Hub</p>
          <p className="truncate text-xs text-white/75">{targetLabel}</p>
        </div>
      </div>

      <div className="min-h-72 bg-[#e5ddd5] p-4 dark:bg-neutral-900">
        <div className="mx-auto mb-3 w-fit rounded-lg bg-white/70 px-3 py-1 text-center text-[11px] text-neutral-600 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
          Hoje
        </div>

        <div className="mb-3 max-w-[74%] rounded-lg rounded-tl-sm bg-white px-3 py-2 text-sm leading-6 text-neutral-800 shadow-sm dark:bg-neutral-800 dark:text-neutral-100">
          <p>Oi, tudo bem?</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Esse é um exemplo de conversa.
          </p>
        </div>

        <div className="ml-auto max-w-[78%] rounded-lg rounded-tr-sm bg-[#dcf8c6] p-2.5 text-neutral-950 shadow-sm dark:bg-emerald-900 dark:text-emerald-50">
          {mediaPreviewUrl && mediaType === "video" ? (
            <div className="mb-2 overflow-hidden rounded-md bg-black/5 dark:bg-black/20">
              <video
                src={mediaPreviewUrl}
                className="max-h-52 w-full object-cover"
                controls
              />
            </div>
          ) : null}

          {mediaPreviewUrl && mediaType !== "video" ? (
            <div className="mb-2 overflow-hidden rounded-md bg-black/5 dark:bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element -- WhatsApp preview supports blob/backend media URLs. */}
              <img
                src={mediaPreviewUrl}
                alt="Imagem da campanha"
                className="max-h-52 w-full object-cover"
              />
            </div>
          ) : null}

          {!mediaPreviewUrl ? (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-dashed border-emerald-700/25 bg-white/30 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-100/20 dark:bg-white/10 dark:text-emerald-50">
              <Paperclip className="size-4" />
              Sem midia anexada
            </div>
          ) : null}
          <p className="whitespace-pre-wrap text-sm leading-6">
            {renderWhatsAppText(message)}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-neutral-500 dark:text-emerald-100/70">
            agora
            <CheckCheck className="size-3 text-sky-500" />
          </p>
        </div>
      </div>
    </div>
  );
}
