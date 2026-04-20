import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import type { WhatsAppInstance } from "@/lib/api";

type DeleteWhatsAppInstanceDialogProps = {
  instance: WhatsAppInstance;
  isBusy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteWhatsAppInstanceDialog({
  instance,
  isBusy,
  onCancel,
  onConfirm,
}: DeleteWhatsAppInstanceDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <ModalCloseButton onClick={onCancel} disabled={isBusy} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-700 dark:text-red-100">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Excluir instancia</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A instancia {instance.name} sera desconectada na Evolution e removida
              do Fluxus Hub.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} className="h-10">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isBusy}
            className="h-10 bg-red-500 text-white hover:bg-red-400"
          >
            {isBusy ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
