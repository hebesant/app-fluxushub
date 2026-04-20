import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ContactsHeaderProps = {
  onImport: () => void;
  onCreate: () => void;
};

export function ContactsHeader({ onImport, onCreate }: ContactsHeaderProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-300">Contatos</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Base de contatos
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-300">
            Organize os primeiros clientes antes de testar disparos pelo WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={onImport}
            className="h-9"
          >
            <Upload className="size-4" />
            Importar contatos
          </Button>
          <Button
            onClick={onCreate}
            className="bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="size-4" />
            Novo contato
          </Button>
        </div>
      </div>
    </Card>
  );
}
