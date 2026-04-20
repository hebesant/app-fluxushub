import type { Dispatch, SetStateAction } from "react";
import type { Contact, Workspace } from "@/lib/api";
import { useContactBulkActions } from "./useContactBulkActions";
import { useContactCrudActions } from "./useContactCrudActions";
import { useContactImportActions } from "./useContactImportActions";

type UseContactActionsParams = {
  activeWorkspace?: Workspace;
  loadData: () => Promise<void>;
  selectedContactIds: number[];
  selectedContacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  removeContactIds: (contactIds: number[]) => void;
  clearSelection: () => void;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useContactActions({
  activeWorkspace,
  loadData,
  selectedContactIds,
  selectedContacts,
  setContacts,
  removeContactIds,
  clearSelection,
  showToast,
}: UseContactActionsParams) {
  const crudActions = useContactCrudActions({
    activeWorkspace,
    loadData,
    setContacts,
    removeContactIds,
    showToast,
  });

  const importActions = useContactImportActions({
    activeWorkspace,
    loadData,
    showToast,
  });

  const bulkActions = useContactBulkActions({
    activeWorkspace,
    loadData,
    selectedContactIds,
    selectedContacts,
    removeContactIds,
    clearSelection,
    showToast,
  });

  return {
    ...crudActions,
    ...importActions,
    ...bulkActions,
    isSubmitting: crudActions.isSubmitting || importActions.isImporting,
  };
}
