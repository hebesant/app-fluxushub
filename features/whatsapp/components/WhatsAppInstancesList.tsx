import { Edit3, QrCode, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WhatsAppInstance } from "@/lib/api";
import { whatsappStatusClasses, whatsappStatusLabels } from "../constants";

type WhatsAppInstancesListProps = {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  qrCodes: Record<number, string>;
  busyInstanceId: number | null;
  onConnect: (instance: WhatsAppInstance) => void;
  onDisconnect: (instance: WhatsAppInstance) => void;
  onEdit: (instance: WhatsAppInstance) => void;
  onDelete: (instance: WhatsAppInstance) => void;
};

export function WhatsAppInstancesList({
  instances,
  isLoading,
  qrCodes,
  busyInstanceId,
  onConnect,
  onDisconnect,
  onEdit,
  onDelete,
}: WhatsAppInstancesListProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Instancias</h3>
          <p className="mt-1 text-sm text-neutral-400">
            {instances.length} instancia{instances.length === 1 ? "" : "s"} cadastrada
            {instances.length === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {isLoading ? (
          <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground dark:border-white/10 dark:text-neutral-300">
            Carregando instancias...
          </p>
        ) : instances.length ? (
          instances.map((instance) => (
            <WhatsAppInstanceCard
              key={instance.id}
              instance={instance}
              qrCode={qrCodes[instance.id]}
              isBusy={busyInstanceId === instance.id}
              onConnect={() => onConnect(instance)}
              onDisconnect={() => onDisconnect(instance)}
              onEdit={() => onEdit(instance)}
              onDelete={() => onDelete(instance)}
            />
          ))
        ) : (
          <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground dark:border-white/10 dark:text-neutral-300">
            Nenhuma instancia ainda. Crie a primeira para preparar o QR Code.
          </p>
        )}
      </div>
    </Card>
  );
}

function WhatsAppInstanceCard({
  instance,
  qrCode,
  isBusy,
  onConnect,
  onDisconnect,
  onEdit,
  onDelete,
}: {
  instance: WhatsAppInstance;
  qrCode?: string;
  isBusy: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 dark:border-white/10 dark:bg-neutral-950/50">
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-lg font-semibold text-foreground dark:border-white/10 dark:bg-white/8 dark:text-white">
          {instance.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="font-semibold text-white">{instance.name}</h4>
            <Badge variant="outline" className={whatsappStatusClasses[instance.status]}>
              {whatsappStatusLabels[instance.status]}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-neutral-400">
            Numero: {instance.phone_number || "Aguardando conexao"}
          </p>
          <p className="mt-1 break-all text-xs text-neutral-500">
            {instance.provider_instance_id || instance.evolution_instance_id}
          </p>
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isBusy}
            className="mt-4 h-8"
          >
            <Edit3 className="size-4" />
            Editar nome
          </Button>
        </div>
      </div>

      <div className="mt-5 flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/45 p-5 text-center dark:border-white/15 dark:bg-white/5">
        {qrCode ? (
          <Image
            src={qrCode}
            alt={`QR Code de ${instance.name}`}
            width={256}
            height={256}
            unoptimized
            className="size-64 rounded-lg bg-white p-3"
          />
        ) : (
          <>
            <QrCode className="size-9 text-primary-200" />
            <p className="mt-3 text-sm font-medium text-foreground dark:text-white">
              QR Code
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral-400">
              Clique em conectar para gerar.
            </p>
          </>
        )}
        <div className="mt-4 grid w-full gap-2 sm:grid-cols-3">
          <Button
            onClick={onConnect}
            disabled={isBusy}
            className="h-9 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
          >
            Conectar
          </Button>
          <Button
            variant="outline"
            onClick={onDisconnect}
            disabled={isBusy}
            className="h-9"
          >
            Desconectar
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            disabled={isBusy}
            className="h-9 border-red-300/40 bg-red-500/10 text-red-700 hover:bg-red-500/15 dark:border-red-300/30 dark:text-red-100 dark:hover:bg-red-500/20"
          >
            <Trash2 className="size-4" />
            Excluir
          </Button>
        </div>
      </div>
    </article>
  );
}
