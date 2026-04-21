import { Megaphone } from "lucide-react";

type CampaignFormHeaderProps = {
  isEditing: boolean;
};

export function CampaignFormHeader({ isEditing }: CampaignFormHeaderProps) {
  return (
    <div className="flex items-start gap-3 pr-12">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
        <Megaphone className="size-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          {isEditing ? "Editar rascunho" : "Novo disparo"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Monte a mensagem, escolha o publico e revise o envio.
        </p>
      </div>
    </div>
  );
}
