import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CampaignsHeaderProps = {
  onRefresh: () => void;
  onCreate: () => void;
};

export function CampaignsHeader({ onRefresh, onCreate }: CampaignsHeaderProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-300">
            Campanhas
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Disparos por tag
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-300">
            Crie campanhas, escolha uma tag da base e personalize a mensagem com
            dados do contato.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={onRefresh} className="h-9">
            <RefreshCcw className="size-4" />
            Atualizar
          </Button>
          <Button
            onClick={onCreate}
            className="bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="size-4" />
            Nova campanha
          </Button>
        </div>
      </div>
    </Card>
  );
}
