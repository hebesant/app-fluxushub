import { Eye, ImageIcon, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Campaign, CampaignPreview, CampaignRecipient } from "@/lib/api";

type CampaignPreviewCardProps = {
  selectedCampaign: Campaign | null;
  preview: CampaignPreview | null;
  recipients: CampaignRecipient[];
  isPreviewLoading: boolean;
  isPreparing: boolean;
  isSending: boolean;
  onLoadPreview: (campaign: Campaign) => void;
  onOpenRecipients: () => void;
  onSend: (campaign: Campaign) => void;
};

export function CampaignPreviewCard({
  selectedCampaign,
  preview,
  recipients,
  isPreviewLoading,
  isPreparing,
  isSending,
  onLoadPreview,
  onOpenRecipients,
  onSend,
}: CampaignPreviewCardProps) {
  const canSendStatus = selectedCampaign
    ? ["draft", "failed", "ready"].includes(selectedCampaign.status)
    : false;

  return (
    <Card className="border-border/70 bg-card/92 p-4 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
          <Eye className="size-4" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Confira a mensagem e envie quando estiver tudo certo.
          </p>
        </div>
      </div>

      {selectedCampaign ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/35">
            <p className="truncate font-semibold text-white">
              {selectedCampaign.name}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {selectedCampaign.target_type === "all"
                ? "Base inteira"
                : `Segmento: ${selectedCampaign.target_tag}`}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/35">
            <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-foreground/80 dark:text-neutral-300">
              {selectedCampaign.message_template}
            </p>
          </div>

          {selectedCampaign.media_type === "image" ? (
            <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/35">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                <ImageIcon className="size-4 text-primary-700 dark:text-primary-100" />
                Imagem anexada
              </div>
              {selectedCampaign.media_file_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- Campaign media preview comes from the API/media storage URL.
                <img
                  src={selectedCampaign.media_file_url}
                  alt="Imagem da campanha"
                  className="max-h-48 w-full rounded-lg border border-border object-cover dark:border-white/10"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Imagem salva, mas sem URL de preview disponível.
                </p>
              )}
            </div>
          ) : null}

          {isPreviewLoading ? (
            <p className="text-sm text-neutral-300">Gerando preview...</p>
          ) : preview ? (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/45 p-2.5 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase text-neutral-500">Contatos</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {preview.total_contacts}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/45 p-2.5 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase text-neutral-500">Variaveis</p>
                  <p className="mt-1 truncate text-sm text-neutral-200">
                    {preview.variables.length
                      ? preview.variables.map((item) => `{{${item}}}`).join(", ")
                      : "Nenhuma"}
                  </p>
                </div>
              </div>

              {preview.samples[0] ? (
                <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/50">
                  <div className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 p-3 dark:border-emerald-300/20 dark:bg-emerald-500/15">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-emerald-900 dark:text-emerald-50">
                      {preview.samples[0].message}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Exemplo usando {preview.samples[0].name}.
                  </p>
                </div>
              ) : (
                <p className="rounded-lg border border-amber-300/50 bg-amber-500/10 p-3 text-sm text-amber-800 dark:border-amber-300/20 dark:text-amber-100">
                  Nenhum contato ativo encontrado para esse segmento.
                </p>
              )}

              {recipients.length ? (
                <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-neutral-950/40">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Resumo dos destinatarios
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Preparados para envio e contatos ignorados.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={onOpenRecipients}
                      className="h-9"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-4">
                    <RecipientCount
                      label="Pendentes"
                      value={countRecipients(recipients, "pending")}
                    />
                    <RecipientCount
                      label="Enviados"
                      value={countRecipients(recipients, "sent")}
                    />
                    <RecipientCount
                      label="Falhas"
                      value={countRecipients(recipients, "failed")}
                    />
                    <RecipientCount
                      label="Ignorados"
                      value={countRecipients(recipients, "skipped")}
                    />
                  </div>
                </div>
              ) : null}

              <Button
                onClick={() => onSend(selectedCampaign)}
                disabled={
                  isPreparing ||
                  isSending ||
                  !preview.total_contacts ||
                  !canSendStatus ||
                  (selectedCampaign.status === "ready" &&
                    !selectedCampaign.pending_count)
                }
                className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
              >
                <Send className="size-4" />
                {isPreparing
                  ? "Preparando disparo..."
                  : isSending
                    ? "Enviando..."
                    : "Enviar disparo"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => onLoadPreview(selectedCampaign)}
              className="w-full"
            >
              <Eye className="size-4" />
              Ver preview
            </Button>
          )}
        </div>
      ) : (
        <Alert className="mt-5">
          <AlertDescription>
            Selecione um disparo ou crie o primeiro para ver o preview.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

function RecipientCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/45 p-2 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function countRecipients(
  recipients: CampaignRecipient[],
  status: CampaignRecipient["status"]
) {
  return recipients.filter((recipient) => recipient.status === status).length;
}
