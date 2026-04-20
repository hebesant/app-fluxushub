import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { Textarea } from "@/components/ui/textarea";
import type { ContactForm } from "../types";
import { ListField } from "./ListField";
import { TagField } from "./TagField";

type ContactModalProps = {
  title: string;
  form: ContactForm;
  availableLists: string[];
  availableTags: string[];
  isBusy: boolean;
  submitLabel: string;
  error?: string;
  onCancel: () => void;
  onChange: (field: keyof ContactForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ContactModal({
  title,
  form,
  availableLists,
  availableTags,
  isBusy,
  submitLabel,
  error,
  onCancel,
  onChange,
  onSubmit,
}: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-2xl rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
      >
        <ModalCloseButton onClick={onCancel} disabled={isBusy} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
            <UserRound className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Atualize nome, telefone, tags e observacoes do contato.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <Label>Nome</Label>
            <Input
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              required
              className="mt-2 h-11"
            />
          </label>

          <label className="block">
            <Label>WhatsApp</Label>
            <Input
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              required
              className="mt-2 h-11"
            />
          </label>

          <label className="block">
            <Label>E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="mt-2 h-11"
            />
          </label>

          <ListField
            label="Lista"
            value={form.list_name}
            availableLists={availableLists}
            onChange={(value) => onChange("list_name", value)}
          />

          <TagField
            value={form.tags}
            availableTags={availableTags}
            onChange={(value) => onChange("tags", value)}
          />
        </div>

        <label className="mt-4 block">
          <Label>Observacoes</Label>
          <Textarea
            value={form.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            rows={4}
            className="mt-2 min-h-28"
          />
        </label>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:text-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10"
          >
            Cancelar
          </Button>
          <Button
            disabled={isBusy}
            className="h-10 bg-primary-500 text-white hover:bg-primary-400"
          >
            {isBusy ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
