import { useState } from "react";
import {
  formatApiError,
  getAccessToken,
  type Workspace,
} from "@/lib/api";
import { createContact } from "../api/contactsApi";
import type { ContactForm, ImportContactsResult } from "../types";

type UseContactImportActionsParams = {
  activeWorkspace?: Workspace;
  loadData: () => Promise<void>;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useContactImportActions({
  activeWorkspace,
  loadData,
  showToast,
}: UseContactImportActionsParams) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  function openImportModal() {
    setIsImportModalOpen(true);
  }

  function closeImportModal() {
    setIsImportModalOpen(false);
  }

  async function importContacts(rows: ContactForm[]): Promise<ImportContactsResult> {
    const token = getAccessToken();

    if (!token || !activeWorkspace) {
      showToast("error", "Workspace nao encontrado para este usuario.");
      return { imported: 0, failed: rows.length, errors: [] };
    }

    const result: ImportContactsResult = {
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (const [index, row] of rows.entries()) {
      try {
        await createContact(token, row, activeWorkspace.id);
        result.imported += 1;
      } catch (requestError) {
        result.failed += 1;
        result.errors.push(
          `Linha ${index + 2} (${row.name}): ${formatApiError(requestError)}`
        );
      }
    }

    await loadData();
    return result;
  }

  async function handleImportContacts(rows: ContactForm[]) {
    setIsImporting(true);

    try {
      const result = await importContacts(rows);

      if (result.imported) {
        closeImportModal();
      }

      if (result.failed) {
        showToast(
          "error",
          `${result.imported} importado${result.imported === 1 ? "" : "s"}, ${
            result.failed
          } com erro. ${result.errors[0] ?? ""}`
        );
      } else {
        showToast(
          "success",
          `${result.imported} contato${result.imported === 1 ? "" : "s"} importado${
            result.imported === 1 ? "" : "s"
          }.`
        );
      }
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsImporting(false);
    }
  }

  return {
    isImportModalOpen,
    isImporting,
    openImportModal,
    closeImportModal,
    handleImportContacts,
  };
}
