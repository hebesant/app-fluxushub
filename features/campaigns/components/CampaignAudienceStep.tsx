import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CampaignForm } from "../types";
import type { CampaignFormChangeHandler } from "./campaignFormTypes";

type CampaignAudienceStepProps = {
  form: CampaignForm;
  availableTags: string[];
  availableLists: string[];
  selectedTagIsValid: boolean;
  selectedListIsValid: boolean;
  onChange: CampaignFormChangeHandler;
  onTargetTypeChange: (value: CampaignForm["target_type"]) => void;
};

export function CampaignAudienceStep({
  form,
  availableTags,
  availableLists,
  selectedTagIsValid,
  selectedListIsValid,
  onChange,
  onTargetTypeChange,
}: CampaignAudienceStepProps) {
  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
        <Users className="mt-0.5 size-5 text-primary-700 dark:text-primary-100" />
        <div>
          <p className="font-medium text-foreground dark:text-white">
            Quem deve receber?
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Escolha um segmento por tag, uma lista ou toda a base ativa.
          </p>
        </div>
      </div>

      <label className="block">
        <Label>Alvo</Label>
        <Select
          value={form.target_type}
          onValueChange={(value) =>
            onTargetTypeChange(value as CampaignForm["target_type"])
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione o alvo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tag">Segmento por tag</SelectItem>
            <SelectItem value="list">Segmento por lista</SelectItem>
            <SelectItem value="all">Base inteira</SelectItem>
          </SelectContent>
        </Select>
      </label>

      {form.target_type === "tag" ? (
        <label className="block">
          <Label>Tag alvo</Label>
          <Select
            value={form.target_tag}
            onValueChange={(value) => onChange("target_tag", value)}
            disabled={!availableTags.length}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!availableTags.length ? (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-100">
              Crie ou importe contatos com tags antes de disparar para esse
              segmento.
            </p>
          ) : !selectedTagIsValid ? (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-100">
              Selecione uma tag para continuar.
            </p>
          ) : null}
        </label>
      ) : null}

      {form.target_type === "list" ? (
        <label className="block">
          <Label>Lista alvo</Label>
          <Select
            value={form.target_list}
            onValueChange={(value) => onChange("target_list", value)}
            disabled={!availableLists.length}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma lista" />
            </SelectTrigger>
            <SelectContent>
              {availableLists.map((list) => (
                <SelectItem key={list} value={list}>
                  {list}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!availableLists.length ? (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-100">
              Crie ou importe contatos em listas antes de disparar para essa
              lista.
            </p>
          ) : !selectedListIsValid ? (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-100">
              Selecione uma lista para continuar.
            </p>
          ) : null}
        </label>
      ) : null}

      {form.target_type === "all" ? (
        <div className="rounded-lg border border-amber-300/50 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800 dark:border-amber-300/25 dark:text-amber-100">
          Este disparo sera enviado para todos os contatos ativos. Confira a
          mensagem com cuidado antes de disparar.
        </div>
      ) : null}
    </div>
  );
}
