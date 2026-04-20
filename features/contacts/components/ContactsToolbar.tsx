import {
  Filter,
  ListPlus,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BulkAction } from "../types";

type ContactsToolbarProps = {
  visibleCount: number;
  totalCount: number;
  search: string;
  selectedList: string;
  selectedTags: string[];
  availableLists: string[];
  availableTags: string[];
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onListChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onOpenBulkAction: (action: BulkAction) => void;
  onOpenBulkDelete: () => void;
  onRefresh: () => void;
};

export function ContactsToolbar({
  visibleCount,
  totalCount,
  search,
  selectedList,
  selectedTags,
  availableLists,
  availableTags,
  selectedCount,
  onSearchChange,
  onListChange,
  onToggleTag,
  onClearTags,
  onOpenBulkAction,
  onOpenBulkDelete,
  onRefresh,
}: ContactsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">Contatos</h3>
        <p className="mt-1 text-sm text-neutral-400">
          {visibleCount} de {totalCount} contato
          {totalCount === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="grid gap-3 lg:min-w-[720px] lg:grid-cols-[1fr_180px_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nome, telefone ou e-mail"
            className="h-11 pl-9"
          />
        </div>

        <Select
          value={selectedList || "all"}
          onValueChange={(value) => onListChange(value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Lista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as listas</SelectItem>
            {availableLists.map((listName) => (
              <SelectItem key={listName} value={listName}>
                {listName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11">
              <Filter className="size-4" />
              Tags
              {selectedTags.length ? (
                <span className="rounded-lg bg-primary-500 px-2 py-0.5 text-xs text-white">
                  {selectedTags.length}
                </span>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            {availableTags.length ? (
              availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => onToggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-neutral-400">
                Nenhuma tag cadastrada.
              </p>
            )}
            {selectedTags.length ? (
              <>
                <DropdownMenuSeparator />
                <button
                  type="button"
                  onClick={onClearTags}
                  className="flex min-h-9 w-full items-center rounded-lg px-3 py-2 text-left text-sm text-foreground outline-none transition hover:bg-muted hover:text-foreground dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Limpar filtros
                </button>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {selectedCount ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11">
                {selectedCount} selecionado
                {selectedCount === 1 ? "" : "s"}
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onOpenBulkAction("list")}>
                <ListPlus className="size-4" />
                Mover para lista
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onOpenBulkAction("add_tags")}>
                <Tags className="size-4" />
                Adicionar tags
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onOpenBulkAction("remove_tags")}>
                <Tags className="size-4" />
                Remover tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={onOpenBulkDelete}
              >
                <Trash2 className="size-4" />
                Excluir selecionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <Button variant="outline" onClick={onRefresh} className="h-11">
          <RefreshCcw className="size-4" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
