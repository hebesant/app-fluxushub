import { Rocket, Send, Snail, Thermometer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WhatsAppInstance } from "@/lib/api";
import { whatsappInstanceStatusLabels } from "../constants";
import type { CampaignForm } from "../types";
import type { CampaignFormChangeHandler } from "./campaignFormTypes";
import {
  campaignTargetLabel,
  concreteSendModes,
  mediaLabel,
  renderLocalPreview,
  scheduleLabel,
  sendModeLabel,
} from "./campaignFormUtils";
import { CampaignWhatsAppPreview } from "./CampaignWhatsAppPreview";

type CampaignReviewStepProps = {
  form: CampaignForm;
  instanceOptions: WhatsAppInstance[];
  instances: WhatsAppInstance[];
  mediaPreviewUrl: string | null;
  workspaceTimezone: string;
  onChange: CampaignFormChangeHandler;
};

export function CampaignReviewStep({
  form,
  instanceOptions,
  instances,
  mediaPreviewUrl,
  workspaceTimezone,
  onChange,
}: CampaignReviewStepProps) {
  const sendModeIconMap = {
    slow: Snail,
    normal: Thermometer,
    fast: Rocket,
  };

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
          <Send className="mt-0.5 size-5 text-primary-700 dark:text-primary-100" />
          <div>
            <p className="font-medium text-foreground dark:text-white">
              Revisao do rascunho
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Confira o preview ao lado e escolha se quer salvar ou enviar.
            </p>
          </div>
        </div>

        <label className="block">
          <Label>Instancia WhatsApp</Label>
          <Select
            value={form.whatsapp_instance}
            onValueChange={(value) => onChange("whatsapp_instance", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma instancia" />
            </SelectTrigger>
            <SelectContent>
              {instanceOptions.map((instance) => (
                <SelectItem key={instance.id} value={String(instance.id)}>
                  {instance.name} - {whatsappInstanceStatusLabels[instance.status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!instances.length ? (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-100">
              Conecte uma instancia de WhatsApp antes de criar disparos.
            </p>
          ) : null}
        </label>

        <div>
          <Label>Modo de envio</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {concreteSendModes.map((mode) => {
              const Icon = sendModeIconMap[mode.id];
              const isSelected = form.send_mode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onChange("send_mode", mode.id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-border bg-muted/45 hover:bg-muted/70 dark:border-white/10 dark:bg-neutral-950/40 dark:hover:bg-white/8"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                    <Icon className="size-4 text-primary-700 dark:text-primary-100" />
                    {mode.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {mode.delay} entre mensagens
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Lento e recomendado para comecar. O modo escolhido neste disparo
            sobrescreve o padrao.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <SummaryItem label="Publico">{campaignTargetLabel(form)}</SummaryItem>
          <SummaryItem label="Midia">{mediaLabel(form.media_type)}</SummaryItem>
          <SummaryItem label="Envio">
            {sendModeLabel(form.send_mode)}
          </SummaryItem>
          <SummaryItem label="Horario">
            {scheduleLabel(form, workspaceTimezone)}
          </SummaryItem>
        </div>

        <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
          <Label>Quando enviar</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                onChange("schedule_type", "now");
                onChange("scheduled_for_local", "");
              }}
              className={`rounded-lg border p-3 text-left transition ${
                form.schedule_type === "now"
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-border bg-background hover:bg-muted/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
              }`}
            >
              <p className="font-medium text-foreground dark:text-white">
                Enviar agora
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Salva o rascunho e coloca na fila imediatamente.
              </p>
            </button>
            <button
              type="button"
              onClick={() => onChange("schedule_type", "scheduled")}
              className={`rounded-lg border p-3 text-left transition ${
                form.schedule_type === "scheduled"
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-border bg-background hover:bg-muted/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
              }`}
            >
              <p className="font-medium text-foreground dark:text-white">
                Agendar disparo
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Usa a hora local do workspace para disparar depois.
              </p>
            </button>
          </div>

          {form.schedule_type === "scheduled" ? (
            <div className="mt-4 space-y-2">
              <Label htmlFor="scheduled_for_local">
                Data e hora do workspace
              </Label>
              <Input
                id="scheduled_for_local"
                type="datetime-local"
                value={form.scheduled_for_local}
                onChange={(event) =>
                  onChange("scheduled_for_local", event.target.value)
                }
              />
              <p className="text-xs leading-5 text-muted-foreground">
                O backend interpreta esse horario usando a timezone{" "}
                <span className="font-medium text-foreground dark:text-white">
                  {workspaceTimezone}
                </span>
                .
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <CampaignWhatsAppPreview
        message={renderLocalPreview(form.message_template)}
        mediaPreviewUrl={mediaPreviewUrl}
        mediaType={form.media_type}
        targetLabel={campaignTargetLabel(form)}
      />
    </div>
  );
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground dark:text-white">{children}</p>
    </div>
  );
}
