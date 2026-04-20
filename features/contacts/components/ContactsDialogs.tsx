import type { useContactActions } from "../hooks/useContactActions";
import { BulkContactActionDialog } from "./BulkContactActionDialog";
import { BulkDeleteDialog } from "./BulkDeleteDialog";
import { ContactModal } from "./ContactModal";
import { DeleteContactDialog } from "./DeleteContactDialog";
import { ImportContactsModal } from "./ImportContactsModal";

type ContactActions = ReturnType<typeof useContactActions>;

type ContactsDialogsProps = {
  contactActions: ContactActions;
  availableLists: string[];
  availableTags: string[];
  selectedCount: number;
};

export function ContactsDialogs({
  contactActions,
  availableLists,
  availableTags,
  selectedCount,
}: ContactsDialogsProps) {
  return (
    <>
      {contactActions.isCreateModalOpen ? (
        <ContactModal
          title="Novo contato"
          form={contactActions.form}
          availableLists={availableLists}
          availableTags={availableTags}
          isBusy={contactActions.isSubmitting}
          submitLabel="Salvar contato"
          onCancel={contactActions.closeCreateModal}
          onChange={contactActions.updateField}
          onSubmit={contactActions.handleCreateConfirmed}
          error={contactActions.formError}
        />
      ) : null}

      {contactActions.isImportModalOpen ? (
        <ImportContactsModal
          availableLists={availableLists}
          isBusy={contactActions.isSubmitting}
          onCancel={contactActions.closeImportModal}
          onImport={contactActions.handleImportContacts}
        />
      ) : null}

      {contactActions.editTarget ? (
        <ContactModal
          title="Editar contato"
          form={contactActions.editForm}
          availableLists={availableLists}
          availableTags={availableTags}
          isBusy={contactActions.busyContactId === contactActions.editTarget.id}
          submitLabel="Salvar"
          onCancel={contactActions.closeEditModal}
          onChange={contactActions.updateEditField}
          onSubmit={contactActions.handleEditConfirmed}
        />
      ) : null}

      {contactActions.deleteTarget ? (
        <DeleteContactDialog
          contactName={contactActions.deleteTarget.name}
          isBusy={contactActions.busyContactId === contactActions.deleteTarget.id}
          onCancel={contactActions.closeDeleteDialog}
          onConfirm={contactActions.handleDeleteConfirmed}
        />
      ) : null}

      {contactActions.isBulkDeleteOpen ? (
        <BulkDeleteDialog
          selectedCount={selectedCount}
          isBusy={contactActions.isBulkDeleting}
          onCancel={contactActions.closeBulkDeleteDialog}
          onConfirm={contactActions.handleBulkDeleteConfirmed}
        />
      ) : null}

      {contactActions.bulkAction ? (
        <BulkContactActionDialog
          action={contactActions.bulkAction}
          selectedCount={selectedCount}
          availableLists={availableLists}
          availableTags={availableTags}
          listValue={contactActions.bulkListValue}
          customListValue={contactActions.bulkCustomListValue}
          tagsValue={contactActions.bulkTagsValue}
          isBusy={contactActions.isBulkUpdating}
          onListValueChange={contactActions.setBulkListValue}
          onCustomListValueChange={contactActions.setBulkCustomListValue}
          onTagsValueChange={contactActions.setBulkTagsValue}
          onCancel={contactActions.closeBulkAction}
          onSubmit={contactActions.handleBulkActionConfirmed}
        />
      ) : null}
    </>
  );
}
