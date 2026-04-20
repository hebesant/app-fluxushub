import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type WhatsAppHeaderProps = {
  onRefresh: () => void;
};

export function WhatsAppHeader({ onRefresh }: WhatsAppHeaderProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-300">WhatsApp</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Gerencie suas instancias
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-300">
            Por enquanto criamos e organizamos a instancia. Na proxima fase, este
            painel chama a Evolution API e exibe o QR Code real.
          </p>
        </div>

        <Button variant="outline" onClick={onRefresh} className="h-9">
          <RefreshCcw className="size-4" />
          Atualizar
        </Button>
      </div>
    </Card>
  );
}
