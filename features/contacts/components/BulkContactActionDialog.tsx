import { ListPlus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BulkAction } from "../types";
import { parseTags } from "../utils/contactPayload";

type BulkContactActionDialogProps = {
  action: BulkAction;
  selectedCount: number;
  availableLists: string[];
  availableTags: string[];
  listValue: string;
  customListValue: string;
  tagsValue: string;
  isBusy: boolean;
  onListValueChange: (value: string) => void;
  onCustomListValueChange: (value: string) => void;
  onTagsValueChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function BulkContactActionDialog({
  action,
  selectedCount,
  availableLists,
  availableTags,
  listValue,
  customListValue,
  tagsValue,
  isBusy,
  onListValueChange,
  onCustomListValueChange,
  onTagsValueChange,
  onCancel,
  onSubmit,
}: BulkContactActionDialogProps) {
  function toggleTagValue(tag: string) {
    const tags = parseTags(tagsValue);

    if (tags.includes(tag)) {
      onTagsValueChange(tags.filter((currentTag) => currentTag !== tag).join(", "));
      return;
    }

    onTagsValueChange([...tags, tag].join(", "));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
      >
        <ModalCloseButton onClick={onCancel} disabled={isBusy} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
            {action === "list" ? (
              <ListPlus className="size-5" />
            ) : (
              <Tags className="size-5" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {action === "list"
                ? "Mover para lista"
                : action === "add_tags"
                  ? "Adicionar tags"
                  : "Remover tags"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A ação será aplicada em {selectedCount} contato
              {selectedCount === 1 ? "" : "s"} selecionado
              {selectedCount === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        {action === "list" ? (
          <div className="mt-5 space-y-4">
            <label className="block">
              <Label>Lista</Label>
              <Select
                value={listValue || "__choose__"}
                onValueChange={(value) => {
                  onListValueChange(value);
                  onCustomListValueChange("");
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione uma lista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__choose__" disabled>
                    Selecione uma lista
                  </SelectItem>
                  <SelectItem value="__none__">Sem lista</SelectItem>
                  {availableLists.map((listName) => (
                    <SelectItem key={listName} value={listName}>
                      {listName}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">Criar nova lista</SelectItem>
                </SelectContent>
              </Select>
            </label>

            {listValue === "__new__" ? (
              <label className="block">
                <Label>Nova lista</Label>
                <Input
                  value={customListValue}
                  onChange={(event) => onCustomListValueChange(event.target.value)}
                  placeholder="livia"
                  className="mt-2 h-11"
                />
              </label>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {availableTags.length ? (
              <div>
                <Label>Tags existentes</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = parseTags(tagsValue).includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagValue(tag)}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                          isSelected
                            ? "border-primary-300/50 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                            : "border-border bg-background text-muted-foreground hover:text-foreground dark:border-white/10 dark:bg-neutral-950/50 dark:hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <label className="block">
              <Label>
                {action === "add_tags" ? "Tags para adicionar" : "Tags para remover"}
              </Label>
              <Input
                value={tagsValue}
                onChange={(event) => onTagsValueChange(event.target.value)}
                placeholder="vip, promocao"
                className="mt-2 h-11"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Separe múltiplas tags por vírgula.
              </p>
            </label>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isBusy}
            className="h-10"
          >
            Cancelar
          </Button>
          <Button
            disabled={isBusy}
            className="h-10 bg-primary-500 text-white hover:bg-primary-400"
          >
            {isBusy ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
