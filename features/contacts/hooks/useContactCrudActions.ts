import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import {
  formatApiError,
  getAccessToken,
  type Contact,
  type Workspace,
} from "@/lib/api";
import { createContact, deleteContact, updateContact } from "../api/contactsApi";
import { type ContactForm, initialContactForm } from "../types";
import { contactToForm } from "../utils/contactPayload";

type UseContactCrudActionsParams = {
  activeWorkspace?: Workspace;
  loadData: () => Promise<void>;
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  removeContactIds: (contactIds: number[]) => void;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useContactCrudActions({
  activeWorkspace,
  loadData,
  setContacts,
  removeContactIds,
  showToast,
}: UseContactCrudActionsParams) {
  const [form, setForm] = useState(initialContactForm);
  const [formError, setFormError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState(initialContactForm);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [busyContactId, setBusyContactId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateEditField(field: keyof ContactForm, value: string) {
    setEditForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    setForm(initialContactForm);
    setFormError("");
  }

  function openEditModal(contact: Contact) {
    setEditTarget(contact);
    setEditForm(contactToForm(contact));
  }

  function closeEditModal() {
    setEditTarget(null);
    setEditForm(initialContactForm);
  }

  function openDeleteDialog(contact: Contact) {
    setDeleteTarget(contact);
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
  }

  async function handleCreateConfirmed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !activeWorkspace) {
      setFormError("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await createContact(token, form, activeWorkspace.id);

      setForm(initialContactForm);
      setIsCreateModalOpen(false);
      showToast("success", "Contato criado.");
      await loadData();
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditConfirmed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !editTarget || !activeWorkspace) {
      return;
    }

    setBusyContactId(editTarget.id);

    try {
      const updatedContact = await updateContact(
        token,
        editTarget.id,
        editForm,
        activeWorkspace.id
      );

      setContacts((current) =>
        current.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );
      closeEditModal();
      showToast("success", "Contato atualizado.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyContactId(null);
    }
  }

  async function handleDeleteConfirmed() {
    const token = getAccessToken();

    if (!token || !deleteTarget) {
      return;
    }

    setBusyContactId(deleteTarget.id);

    try {
      await deleteContact(token, deleteTarget.id);

      setContacts((current) =>
        current.filter((contact) => contact.id !== deleteTarget.id)
      );
      removeContactIds([deleteTarget.id]);
      closeDeleteDialog();
      showToast("success", "Contato excluido.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyContactId(null);
    }
  }

  return {
    form,
    formError,
    isCreateModalOpen,
    editTarget,
    editForm,
    deleteTarget,
    busyContactId,
    isSubmitting,
    updateField,
    updateEditField,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    handleCreateConfirmed,
    handleEditConfirmed,
    handleDeleteConfirmed,
  };
}
