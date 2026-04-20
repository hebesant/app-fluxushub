import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InstanceForm } from "../types";

type WhatsAppCreateCardProps = {
  form: InstanceForm;
  formError: string;
  isSubmitting: boolean;
  onChange: (field: keyof InstanceForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function WhatsAppCreateCard({
  form,
  formError,
  isSubmitting,
  onChange,
  onSubmit,
}: WhatsAppCreateCardProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary-500 text-white">
            <MessageCircle className="size-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Nova instancia</h3>
            <p className="text-sm text-neutral-400">
              Crie a conexao e gere o QR Code no card abaixo.
            </p>
          </div>
        </div>

        <form
          className="grid gap-3 lg:min-w-[520px] lg:grid-cols-[1fr_auto]"
          onSubmit={onSubmit}
        >
          <label className="block min-w-0">
            <Label>Nome</Label>
            <Input
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="WhatsApp Loja"
              required
              className="mt-2 h-11"
            />
          </label>

          <Button
            disabled={isSubmitting}
            className="mt-7 h-11 rounded-lg bg-primary-500 px-5 text-white hover:bg-primary-400"
          >
            <Plus className="size-4" />
            {isSubmitting ? "Criando..." : "Criar instancia"}
          </Button>
        </form>
      </div>

      {formError ? (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {formError}
        </p>
      ) : null}
    </Card>
  );
}
