import { Bold, ImageIcon, Italic, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { campaignVariableButtons } from "../constants";
import type { CampaignForm } from "../types";
import type { CampaignFormChangeHandler } from "./campaignFormTypes";

type CampaignContentStepProps = {
  form: CampaignForm;
  mediaPreviewUrl: string | null;
  mediaError: string;
  messageTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: CampaignFormChangeHandler;
  onInsertVariable: (value: string) => void;
  onApplyTextFormat: (prefix: "*" | "_", fallbackText: string) => void;
  onMediaFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: () => void;
};

export function CampaignContentStep({
  form,
  mediaPreviewUrl,
  mediaError,
  messageTextareaRef,
  onChange,
  onInsertVariable,
  onApplyTextFormat,
  onMediaFileChange,
  onRemoveMedia,
}: CampaignContentStepProps) {
  return (
    <div className="mt-5 space-y-4">
      <label className="block">
        <Label>Nome</Label>
        <Input
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Promocao VIP"
          className="mt-2 h-11"
        />
      </label>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Label>Mensagem</Label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onApplyTextFormat("*", "texto em negrito")}
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground transition hover:bg-muted/80 dark:border-white/10 dark:bg-white/8 dark:text-neutral-200 dark:hover:bg-white/15"
            >
              <Bold className="mr-1 inline size-3.5" />
              Negrito
            </button>
            <button
              type="button"
              onClick={() => onApplyTextFormat("_", "texto em italico")}
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground transition hover:bg-muted/80 dark:border-white/10 dark:bg-white/8 dark:text-neutral-200 dark:hover:bg-white/15"
            >
              <Italic className="mr-1 inline size-3.5" />
              Italico
            </button>
            {campaignVariableButtons.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onInsertVariable(item.value)}
                className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground transition hover:bg-muted/80 dark:border-white/10 dark:bg-white/8 dark:text-neutral-200 dark:hover:bg-white/15"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <Textarea
          ref={messageTextareaRef}
          value={form.message_template}
          onChange={(event) => onChange("message_template", event.target.value)}
          rows={6}
          className="mt-3 min-h-40"
        />
      </div>

      <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Label>Midia do disparo</Label>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Opcional. Use imagem ou video MP4 de ate 10 MB.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="relative h-10">
              <ImageIcon className="size-4" />
              Escolher midia
              <input
                key={form.media_file?.name || form.media_file_url || "empty-media"}
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4"
                onChange={onMediaFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Escolher midia do disparo"
              />
            </Button>
            {mediaPreviewUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={onRemoveMedia}
                className="h-10 text-red-700 hover:text-red-700 dark:text-red-100"
              >
                <X className="size-4" />
                Remover
              </Button>
            ) : null}
          </div>
        </div>

        {mediaPreviewUrl ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="overflow-hidden rounded-lg border border-border bg-background dark:border-white/10">
              {form.media_type === "video" ? (
                <video
                  src={mediaPreviewUrl}
                  className="aspect-video h-full w-full object-cover"
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- Preview uses local blob/backend URLs selected by the user.
                <img
                  src={mediaPreviewUrl}
                  alt="Preview da imagem do disparo"
                  className="aspect-video h-full w-full object-cover"
                />
              )}
            </div>
            <div className="text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground dark:text-white">
                {form.media_file?.name || "Midia salva no rascunho"}
              </p>
              <p>Formatos aceitos: PNG, JPG, JPEG, WEBP e MP4.</p>
            </div>
          </div>
        ) : null}

        {mediaError ? (
          <p className="mt-3 rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:text-red-100">
            {mediaError}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
          <Sparkles className="size-4 text-primary-700 dark:text-primary-100" />
          Variaveis disponiveis
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use {"{{name}}"}, {"{{first_name}}"} e {"{{phone}}"}.
        </p>
      </div>
    </div>
  );
}
