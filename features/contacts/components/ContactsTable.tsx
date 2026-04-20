import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from "@/lib/api";

type ContactsTableProps = {
  contacts: Contact[];
  isLoading: boolean;
  selectedContactIds: number[];
  allVisibleContactsSelected: boolean;
  busyContactId: number | null;
  onToggleVisibleSelection: () => void;
  onToggleContactSelection: (contactId: number) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

export function ContactsTable({
  contacts,
  isLoading,
  selectedContactIds,
  allVisibleContactsSelected,
  busyContactId,
  onToggleVisibleSelection,
  onToggleContactSelection,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  if (isLoading) {
    return (
      <p className="p-4 text-sm text-neutral-300">
        Carregando contatos...
      </p>
    );
  }

  if (!contacts.length) {
    return (
      <p className="p-4 text-sm text-neutral-300">
        Nenhum contato encontrado.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[920px]">
        <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground dark:bg-white/5">
          <TableRow>
            <TableHead className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allVisibleContactsSelected}
                onChange={onToggleVisibleSelection}
                aria-label="Selecionar contatos da pagina"
                className="size-4 rounded border-border accent-primary-500"
              />
            </TableHead>
            <TableHead className="px-4 py-3">Nome</TableHead>
            <TableHead className="px-4 py-3">WhatsApp</TableHead>
            <TableHead className="px-4 py-3">E-mail</TableHead>
            <TableHead className="px-4 py-3">Lista</TableHead>
            <TableHead className="px-4 py-3">Tags</TableHead>
            <TableHead className="px-4 py-3 text-right">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="bg-card transition hover:bg-muted/60 dark:bg-neutral-950/30 dark:hover:bg-white/5"
            >
              <TableCell className="w-10 px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(contact.id)}
                  onChange={() => onToggleContactSelection(contact.id)}
                  aria-label={`Selecionar ${contact.name}`}
                  className="size-4 rounded border-border accent-primary-500"
                />
              </TableCell>
              <TableCell className="px-4 py-4">
                <button
                  type="button"
                  onClick={() => onEdit(contact)}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted font-semibold text-foreground dark:border-white/10 dark:bg-white/8 dark:text-white">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground dark:text-white">
                      {contact.name}
                    </span>
                    {contact.notes ? (
                      <span className="block max-w-60 truncate text-xs text-neutral-500">
                        {contact.notes}
                      </span>
                    ) : null}
                  </span>
                </button>
              </TableCell>
              <TableCell className="px-4 py-4 text-muted-foreground">{contact.phone}</TableCell>
              <TableCell className="px-4 py-4 text-muted-foreground">
                {contact.email || "Sem e-mail"}
              </TableCell>
              <TableCell className="px-4 py-4 text-muted-foreground">
                {contact.list_name || "Sem lista"}
              </TableCell>
              <TableCell className="px-4 py-4">
                <div className="flex max-w-56 flex-wrap gap-2">
                  {contact.tags.length ? (
                    contact.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-primary-300/40 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-neutral-500">Sem tags</span>
                  )}
                  {contact.tags.length > 3 ? (
                    <Badge variant="outline">
                      +{contact.tags.length - 3}
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="px-4 py-4">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={busyContactId === contact.id}
                        className="h-9 w-9 px-0"
                        aria-label={`Acoes de ${contact.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => onEdit(contact)}>
                        <Edit3 className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(contact)}
                      >
                        <Trash2 className="size-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
