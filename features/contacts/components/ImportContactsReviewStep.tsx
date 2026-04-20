import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContactForm, ImportErrorRow } from "../types";

type ImportContactsReviewStepProps = {
  fileName: string;
  rows: ContactForm[];
  invalidRows: ImportErrorRow[];
  onDownloadErrors: () => void;
};

export function ImportContactsReviewStep({
  fileName,
  rows,
  invalidRows,
  onDownloadErrors,
}: ImportContactsReviewStepProps) {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-medium">{fileName || "Arquivo CSV"}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <ImportStat label="Prontos" value={rows.length} tone="green" />
          <ImportStat label="Com erro" value={invalidRows.length} tone="red" />
          <ImportStat label="Total lido" value={rows.length + invalidRows.length} />
        </div>
        {invalidRows.length ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Revise o CSV com erros ou continue importando apenas os contatos válidos.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Tudo certo. Nenhuma linha com erro foi encontrada.
          </p>
        )}
      </div>

      {invalidRows.length ? (
        <div className="rounded-lg border border-red-300/40 bg-red-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-100">
                {invalidRows.length} linha{invalidRows.length === 1 ? "" : "s"} com
                erro
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Primeiro erro: linha {invalidRows[0].lineNumber} -{" "}
                {invalidRows[0].error}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadErrors}
              className="h-9"
            >
              <Download className="size-4" />
              Baixar CSV com erros
            </Button>
          </div>
        </div>
      ) : null}

      {rows.length ? (
        <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-foreground dark:text-neutral-200">
            Prévia dos contatos que serão importados.
          </p>
          <div className="mt-3 max-h-44 space-y-2 overflow-auto pr-1">
            {rows.slice(0, 5).map((row, index) => (
              <div
                key={`${row.phone}-${index}`}
                className="rounded-lg bg-background px-3 py-2 text-sm dark:bg-neutral-950/60"
              >
                <p className="font-medium text-foreground dark:text-white">
                  {row.name}
                </p>
                <p className="mt-1 text-neutral-400">
                  {row.phone} {row.list_name ? `- ${row.list_name}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImportStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-700 dark:text-emerald-100"
      : tone === "red"
        ? "text-red-700 dark:text-red-100"
        : "text-foreground dark:text-white";

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 dark:border-white/10 dark:bg-neutral-950/60">
      <p className={`text-lg font-semibold ${toneClass}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
