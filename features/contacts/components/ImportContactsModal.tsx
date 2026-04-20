import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useImportContactsModal } from "../hooks/useImportContactsModal";
import type { ContactForm } from "../types";
import { ImportContactsPrepareStep } from "./ImportContactsPrepareStep";
import { ImportContactsReviewStep } from "./ImportContactsReviewStep";
import { ImportStepIndicator } from "./ImportStepIndicator";

type ImportContactsModalProps = {
  availableLists: string[];
  isBusy: boolean;
  onCancel: () => void;
  onImport: (rows: ContactForm[]) => Promise<void>;
};

export function ImportContactsModal({
  availableLists,
  isBusy,
  onCancel,
  onImport,
}: ImportContactsModalProps) {
  const importState = useImportContactsModal({ isBusy, onCancel, onImport });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <ModalCloseButton onClick={onCancel} disabled={isBusy} />

        <div className="flex items-start gap-3 pr-12">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
            <Upload className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Importar contatos</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Siga as etapas para validar o arquivo antes de adicionar os contatos na base.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <ImportStepIndicator
            number="1"
            title="Preparar arquivo"
            isActive={importState.step === 1}
            isDone={importState.step > 1}
          />
          <ImportStepIndicator
            number="2"
            title="Revisar e importar"
            isActive={importState.step === 2}
            isDone={false}
          />
        </div>

        {importState.step === 1 ? (
          <ImportContactsPrepareStep
            availableLists={availableLists}
            importList={importState.importList}
            fileInputKey={importState.fileInputKey}
            onImportListChange={importState.updateImportList}
            onFileSelected={importState.handleFileSelected}
          />
        ) : (
          <ImportContactsReviewStep
            fileName={importState.fileName}
            rows={importState.rows}
            invalidRows={importState.invalidRows}
            onDownloadErrors={importState.handleDownloadErrors}
          />
        )}

        {importState.error ? (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {importState.error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={importState.handleBackOrCancel}
            className="h-10"
          >
            {importState.step === 2 ? "Voltar" : "Cancelar"}
          </Button>
          <Button
            disabled={!importState.canContinue}
            onClick={importState.handleImport}
            className="h-10 bg-primary-500 text-white hover:bg-primary-400"
          >
            {isBusy
              ? "Importando..."
              : importState.invalidRows.length
                ? `Continuar com ${importState.rows.length} válido${
                    importState.rows.length === 1 ? "" : "s"
                  }`
                : "Importar contatos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
