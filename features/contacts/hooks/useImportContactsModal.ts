import { useState, type ChangeEvent } from "react";
import type { ContactForm, ImportErrorRow } from "../types";
import { buildImportErrorsCsv, parseContactsCsv } from "../utils/csv";

type UseImportContactsModalParams = {
  isBusy: boolean;
  onCancel: () => void;
  onImport: (rows: ContactForm[]) => Promise<void>;
};

export function useImportContactsModal({
  isBusy,
  onCancel,
  onImport,
}: UseImportContactsModalParams) {
  const [rows, setRows] = useState<ContactForm[]>([]);
  const [invalidRows, setInvalidRows] = useState<ImportErrorRow[]>([]);
  const [importList, setImportList] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [fileName, setFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const canContinue = step === 2 && rows.length > 0 && !isBusy;

  function resetSelectedFile() {
    setRows([]);
    setInvalidRows([]);
    setFileName("");
    setError("");
    setFileInputKey((current) => current + 1);
  }

  function updateImportList(value: string) {
    setImportList(value);
    setRows((current) =>
      current.map((row) => ({
        ...row,
        list_name: value || row.list_name,
      }))
    );
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setRows([]);
    setInvalidRows([]);
    setFileName(file.name);

    try {
      const content = await file.text();
      const parsed = parseContactsCsv(content, importList);

      if (!parsed.validRows.length && !parsed.invalidRows.length) {
        setError("Nenhum contato valido encontrado no arquivo.");
        setRows([]);
        setInvalidRows([]);
        return;
      }

      setRows(parsed.validRows);
      setInvalidRows(parsed.invalidRows);
      setStep(2);
    } catch (parseError) {
      setRows([]);
      setInvalidRows([]);
      setFileName("");
      setFileInputKey((current) => current + 1);
      setError(parseError instanceof Error ? parseError.message : "Arquivo invalido.");
    }
  }

  function handleDownloadErrors() {
    if (!invalidRows.length) {
      return;
    }

    const blob = new Blob([buildImportErrorsCsv(invalidRows)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "contatos-com-erros.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleBackOrCancel() {
    if (step === 2) {
      resetSelectedFile();
      setStep(1);
      return;
    }

    onCancel();
  }

  async function handleImport() {
    await onImport(rows);
  }

  return {
    rows,
    invalidRows,
    importList,
    error,
    step,
    fileName,
    fileInputKey,
    canContinue,
    updateImportList,
    handleFileSelected,
    handleDownloadErrors,
    handleBackOrCancel,
    handleImport,
  };
}
