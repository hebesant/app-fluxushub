import { useState, type FormEvent } from "react";
import {
  formatApiError,
  getAccessToken,
  type Contact,
  type Workspace,
} from "@/lib/api";
import { deleteContact, updateContact } from "../api/contactsApi";
import type { BulkAction } from "../types";
import { contactToForm, parseTags } from "../utils/contactPayload";

type UseContactBulkActionsParams = {
  activeWorkspace?: Workspace;
  loadData: () => Promise<void>;
  selectedContactIds: number[];
  selectedContacts: Contact[];
  removeContactIds: (contactIds: number[]) => void;
  clearSelection: () => void;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useContactBulkActions({
  activeWorkspace,
  loadData,
  selectedContactIds,
  selectedContacts,
  removeContactIds,
  clearSelection,
  showToast,
}: UseContactBulkActionsParams) {
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [bulkListValue, setBulkListValue] = useState("");
  const [bulkCustomListValue, setBulkCustomListValue] = useState("");
  const [bulkTagsValue, setBulkTagsValue] = useState("");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  function openBulkDeleteDialog() {
    setIsBulkDeleteOpen(true);
  }

  function closeBulkDeleteDialog() {
    setIsBulkDeleteOpen(false);
  }

  function openBulkAction(action: BulkAction) {
    setBulkAction(action);
    setBulkListValue("");
    setBulkCustomListValue("");
    setBulkTagsValue("");
  }

  function closeBulkAction() {
    setBulkAction(null);
  }

  async function handleBulkDeleteConfirmed() {
    const token = getAccessToken();
    const idsToDelete = [...selectedContactIds];

    if (!token || !idsToDelete.length) {
      return;
    }

    setIsBulkDeleting(true);

    try {
      const errors: string[] = [];
      let deletedCount = 0;

      for (const contactId of idsToDelete) {
        try {
          await deleteContact(token, contactId);
          deletedCount += 1;
        } catch (requestError) {
          errors.push(`Contato ${contactId}: ${formatApiError(requestError)}`);
        }
      }

      removeContactIds(idsToDelete);
      closeBulkDeleteDialog();

      await loadData();

      if (errors.length) {
        showToast(
          "error",
          `${deletedCount} excluido${deletedCount === 1 ? "" : "s"}, ${
            errors.length
          } com erro. ${errors[0]}`
        );
      } else {
        showToast(
          "success",
          `${deletedCount} contato${deletedCount === 1 ? "" : "s"} excluido${
            deletedCount === 1 ? "" : "s"
          }.`
        );
      }
    } finally {
      setIsBulkDeleting(false);
    }
  }

  async function handleBulkActionConfirmed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !activeWorkspace || !bulkAction || !selectedContacts.length) {
      return;
    }

    const listName =
      bulkListValue === "__new__" ? bulkCustomListValue.trim() : bulkListValue;
    const tags = parseTags(bulkTagsValue);

    if (bulkAction === "list" && !listName && bulkListValue !== "__none__") {
      showToast("error", "Selecione uma lista ou informe uma nova.");
      return;
    }

    if ((bulkAction === "add_tags" || bulkAction === "remove_tags") && !tags.length) {
      showToast("error", "Informe pelo menos uma tag.");
      return;
    }

    setIsBulkUpdating(true);

    try {
      const errors: string[] = [];
      let updatedCount = 0;

      for (const contact of selectedContacts) {
        const nextForm = contactToForm(contact);

        if (bulkAction === "list") {
          nextForm.list_name = bulkListValue === "__none__" ? "" : listName;
        }

        if (bulkAction === "add_tags") {
          nextForm.tags = Array.from(new Set([...contact.tags, ...tags])).join(", ");
        }

        if (bulkAction === "remove_tags") {
          nextForm.tags = contact.tags
            .filter((tag) => !tags.includes(tag))
            .join(", ");
        }

        try {
          await updateContact(token, contact.id, nextForm, activeWorkspace.id);
          updatedCount += 1;
        } catch (requestError) {
          errors.push(`${contact.name}: ${formatApiError(requestError)}`);
        }
      }

      setBulkAction(null);
      setBulkListValue("");
      setBulkCustomListValue("");
      setBulkTagsValue("");
      clearSelection();

      await loadData();

      if (errors.length) {
        showToast(
          "error",
          `${updatedCount} atualizado${updatedCount === 1 ? "" : "s"}, ${
            errors.length
          } com erro. ${errors[0]}`
        );
      } else {
        showToast(
          "success",
          `${updatedCount} contato${updatedCount === 1 ? "" : "s"} atualizado${
            updatedCount === 1 ? "" : "s"
          }.`
        );
      }
    } finally {
      setIsBulkUpdating(false);
    }
  }

  return {
    isBulkDeleteOpen,
    bulkAction,
    bulkListValue,
    bulkCustomListValue,
    bulkTagsValue,
    isBulkDeleting,
    isBulkUpdating,
    setBulkListValue,
    setBulkCustomListValue,
    setBulkTagsValue,
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    openBulkAction,
    closeBulkAction,
    handleBulkDeleteConfirmed,
    handleBulkActionConfirmed,
  };
}
