import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalCloseButton } from "@/components/ui/modal-close-button";

type EditWhatsAppInstanceDialogProps = {
  name: string;
  isBusy: boolean;
  onNameChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function EditWhatsAppInstanceDialog({
  name,
  isBusy,
  onNameChange,
  onCancel,
  onSubmit,
}: EditWhatsAppInstanceDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
      >
        <ModalCloseButton onClick={onCancel} disabled={isBusy} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
            <Edit3 className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">Editar nome</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Esse nome aparece apenas no Fluxus Hub para organizar suas conexoes.
            </p>
          </div>
        </div>

        <label className="mt-5 block">
          <Label>Nome</Label>
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
            className="mt-2 h-11"
          />
        </label>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} className="h-10">
            Cancelar
          </Button>
          <Button
            disabled={isBusy}
            className="h-10 bg-primary-500 text-white hover:bg-primary-400"
          >
            {isBusy ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
