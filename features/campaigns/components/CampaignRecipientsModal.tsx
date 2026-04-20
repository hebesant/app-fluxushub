import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import type { CampaignEvent, CampaignRecipient } from "@/lib/api";
import type { CampaignDetailCollection } from "../api/campaignsApi";
import {
  campaignRecipientStatusClasses,
  campaignRecipientStatusLabels,
} from "../constants";

type CampaignRecipientsModalProps = {
  recipientDetails: CampaignDetailCollection<CampaignRecipient>;
  eventDetails: CampaignDetailCollection<CampaignEvent>;
  onRecipientsPageChange: (page: number) => void;
  onEventsPageChange: (page: number) => void;
  onClose: () => void;
};

export function CampaignRecipientsModal({
  recipientDetails,
  eventDetails,
  onRecipientsPageChange,
  onEventsPageChange,
  onClose,
}: CampaignRecipientsModalProps) {
  const [activeTab, setActiveTab] = useState<"recipients" | "events">(
    "recipients"
  );
  const recipients = recipientDetails.items;
  const events = eventDetails.items;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <ModalCloseButton onClick={onClose} />

        <div className="flex items-start justify-between gap-4 pr-12">
          <div>
            <h3 className="text-lg font-semibold">Detalhes dos destinatarios</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Confira destinatarios e eventos registrados durante a campanha.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/45 p-1 dark:border-white/10 dark:bg-neutral-950/40">
          <TabButton
            isActive={activeTab === "recipients"}
            onClick={() => setActiveTab("recipients")}
          >
            Destinatarios
          </TabButton>
          <TabButton
            isActive={activeTab === "events"}
            onClick={() => setActiveTab("events")}
          >
            Eventos
          </TabButton>
        </div>

        <div className="mt-4 max-h-[62vh] space-y-2 overflow-auto pr-1">
          {activeTab === "recipients" ? (
            recipients.length ? (
              recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-white">
                        {recipient.contact_name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {recipient.phone}
                      </p>
                    </div>
                    <RecipientStatusBadge status={recipient.status} />
                  </div>
                  {recipient.error_message ? (
                    <p className="mt-2 text-xs leading-5 text-red-700 dark:text-red-100">
                      {recipient.error_message}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-border bg-muted/45 p-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
                Nenhum destinatario preparado ainda.
              </p>
            )
          ) : events.length ? (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border bg-muted/45 p-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <EventBadge eventType={event.event_type} />
                    <p className="mt-2 text-sm font-medium text-foreground dark:text-white">
                      {event.message}
                    </p>
                    {event.created_by_name ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Por {event.created_by_name}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatEventDate(event.created_at)}
                  </p>
                </div>
                {Object.keys(event.metadata ?? {}).length ? (
                  <p className="mt-2 break-words rounded-lg bg-background/70 px-2 py-1.5 text-xs text-muted-foreground dark:bg-neutral-950/60">
                    {formatMetadata(event.metadata)}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-border bg-muted/45 p-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
              Nenhum evento registrado ainda.
            </p>
          )}
        </div>

        <DetailsPagination
          collection={
            activeTab === "recipients" ? recipientDetails : eventDetails
          }
          label={activeTab === "recipients" ? "destinatarios" : "eventos"}
          onPageChange={
            activeTab === "recipients"
              ? onRecipientsPageChange
              : onEventsPageChange
          }
        />
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-background text-foreground shadow-sm dark:bg-white/10 dark:text-white"
          : "text-muted-foreground hover:text-foreground dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function EventBadge({ eventType }: { eventType: CampaignEvent["event_type"] }) {
  return (
    <Badge variant="outline" className={campaignEventClasses[eventType]}>
      {campaignEventLabels[eventType]}
    </Badge>
  );
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMetadata(metadata: Record<string, unknown>) {
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" | ");
}

const campaignEventLabels: Record<CampaignEvent["event_type"], string> = {
  prepared: "Preparada",
  queued: "Na fila",
  started: "Iniciada",
  recipient_sent: "Enviado",
  recipient_failed: "Falha",
  canceled: "Cancelada",
  finished: "Finalizada",
  failed: "Com falhas",
};

const campaignEventClasses: Record<CampaignEvent["event_type"], string> = {
  prepared:
    "border-sky-300/50 bg-sky-500/10 text-sky-700 dark:border-sky-300/30 dark:text-sky-100",
  queued:
    "border-blue-300/50 bg-blue-500/10 text-blue-700 dark:border-blue-300/30 dark:text-blue-100",
  started:
    "border-primary-300/50 bg-primary-500/10 text-primary-700 dark:border-primary-300/30 dark:text-primary-100",
  recipient_sent:
    "border-emerald-300/50 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/30 dark:text-emerald-100",
  recipient_failed:
    "border-red-300/50 bg-red-500/10 text-red-700 dark:border-red-300/30 dark:text-red-100",
  canceled:
    "border-zinc-300 bg-zinc-500/10 text-zinc-700 dark:border-zinc-500/50 dark:text-zinc-100",
  finished:
    "border-emerald-300/50 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/30 dark:text-emerald-100",
  failed:
    "border-red-300/50 bg-red-500/10 text-red-700 dark:border-red-300/30 dark:text-red-100",
};

function RecipientStatusBadge({
  status,
}: {
  status: CampaignRecipient["status"];
}) {
  return (
    <Badge variant="outline" className={campaignRecipientStatusClasses[status]}>
      {campaignRecipientStatusLabels[status]}
    </Badge>
  );
}

type DetailsPaginationCollection = Pick<
  CampaignDetailCollection<unknown>,
  "count" | "next" | "previous" | "page" | "pageSize"
>;

function DetailsPagination({
  collection,
  label,
  onPageChange,
}: {
  collection: DetailsPaginationCollection;
  label: string;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(collection.count / collection.pageSize));
  const start = collection.count
    ? (collection.page - 1) * collection.pageSize + 1
    : 0;
  const end = Math.min(collection.page * collection.pageSize, collection.count);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Mostrando {start}-{end} de {collection.count} {label}.
      </span>
      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!collection.previous}
            onClick={() => onPageChange(Math.max(1, collection.page - 1))}
          >
            Anterior
          </Button>
          <span className="text-xs">
            Pagina {collection.page} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!collection.next}
            onClick={() => onPageChange(collection.page + 1)}
          >
            Proxima
          </Button>
        </div>
      ) : null}
    </div>
  );
}
