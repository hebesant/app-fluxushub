import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ListField } from "./ListField";

type ImportContactsPrepareStepProps = {
  availableLists: string[];
  importList: string;
  fileInputKey: number;
  onImportListChange: (value: string) => void;
  onFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ImportContactsPrepareStep({
  availableLists,
  importList,
  fileInputKey,
  onImportListChange,
  onFileSelected,
}: ImportContactsPrepareStepProps) {
  return (
    <>
      <div className="mt-5 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="size-4 text-primary-500" />
          Colunas do CSV
        </div>
        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>
            <strong className="text-foreground dark:text-white">name</strong> ou
            nome: obrigatória
          </p>
          <p>
            <strong className="text-foreground dark:text-white">phone</strong>,
            telefone ou whatsapp: obrigatória
          </p>
          <p>
            <strong className="text-foreground dark:text-white">email</strong>:
            opcional
          </p>
          <p>
            <strong className="text-foreground dark:text-white">list</strong>,
            lista ou list_name: opcional
          </p>
          <p>
            <strong className="text-foreground dark:text-white">tags</strong>:
            opcional, separadas por vírgula
          </p>
          <p>
            <strong className="text-foreground dark:text-white">notes</strong> ou
            observacoes: opcional
          </p>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Telefones podem vir como 5511999999999, +55 (11) 99999-9999 ou
          11999999999.
        </p>
      </div>

      <div className="mt-5">
        <ListField
          label="Lista para todos os contatos"
          value={importList}
          availableLists={availableLists}
          onChange={onImportListChange}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Se preenchido, essa lista será aplicada a todos os contatos importados.
        </p>
      </div>

      <label className="mt-4 block rounded-lg border border-dashed border-border bg-muted/45 p-5 text-sm text-muted-foreground dark:border-white/15 dark:bg-white/5 dark:text-neutral-300">
        <span className="font-medium text-foreground dark:text-white">
          Selecionar CSV
        </span>
        <Input
          key={fileInputKey}
          type="file"
          accept=".csv,text/csv"
          onChange={onFileSelected}
          className="mt-3 h-auto py-2"
        />
      </label>
    </>
  );
}
