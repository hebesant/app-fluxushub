"use client";

import { toast as sonnerToast } from "sonner";
import { Card } from "@/components/ui/card";
import { useContactActions } from "../hooks/useContactActions";
import { useContactSelection } from "../hooks/useContactSelection";
import { useContactsData } from "../hooks/useContactsData";
import { ContactsDialogs } from "./ContactsDialogs";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsPagination } from "./ContactsPagination";
import { ContactSegmentsPanel } from "./ContactSegmentsPanel";
import { ContactsTable } from "./ContactsTable";
import { ContactsToolbar } from "./ContactsToolbar";

function showContactToast(type: "success" | "error", message: string) {
  sonnerToast[type](message);
}

export function ContactsPage() {
  const contactsData = useContactsData({ showToast: showContactToast });
  const {
    selectedContactIds,
    selectedContacts,
    allVisibleContactsSelected,
    toggleContactSelection,
    toggleVisibleContactsSelection,
    removeContactIds,
    clearSelection,
  } = useContactSelection(contactsData.contacts);

  const contactActions = useContactActions({
    activeWorkspace: contactsData.activeWorkspace,
    loadData: contactsData.loadData,
    selectedContactIds,
    selectedContacts,
    setContacts: contactsData.setContacts,
    removeContactIds,
    clearSelection,
    showToast: showContactToast,
  });

  return (
    <div className="space-y-6">
      <ContactsHeader
        onImport={contactActions.openImportModal}
        onCreate={contactActions.openCreateModal}
      />

      <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
        <ContactsToolbar
          visibleCount={contactsData.contacts.length}
          totalCount={contactsData.totalContacts}
          search={contactsData.search}
          selectedList={contactsData.selectedList}
          selectedTags={contactsData.selectedTags}
          availableLists={contactsData.availableLists}
          availableTags={contactsData.availableTags}
          selectedCount={selectedContactIds.length}
          onSearchChange={contactsData.updateSearch}
          onListChange={contactsData.selectList}
          onToggleTag={contactsData.toggleSelectedTag}
          onClearTags={contactsData.clearTagFilters}
          onOpenBulkAction={contactActions.openBulkAction}
          onOpenBulkDelete={contactActions.openBulkDeleteDialog}
          onRefresh={contactsData.loadData}
        />

        <div className="mt-5 grid gap-4 xl:grid-cols-[230px_1fr]">
          <ContactSegmentsPanel
            lists={contactsData.availableLists}
            tags={contactsData.availableTags}
            activeList={contactsData.selectedList}
            activeTags={contactsData.selectedTags}
            onSelectList={contactsData.selectList}
            onToggleTag={contactsData.toggleSelectedTag}
            onClear={contactsData.clearAllFilters}
          />

          <div className="overflow-hidden rounded-lg border border-border dark:border-white/10">
            <ContactsTable
              contacts={contactsData.contacts}
              isLoading={contactsData.isLoading}
              selectedContactIds={selectedContactIds}
              allVisibleContactsSelected={allVisibleContactsSelected}
              busyContactId={contactActions.busyContactId}
              onToggleVisibleSelection={toggleVisibleContactsSelection}
              onToggleContactSelection={toggleContactSelection}
              onEdit={contactActions.openEditModal}
              onDelete={contactActions.openDeleteDialog}
            />
          </div>
        </div>

        <ContactsPagination
          page={contactsData.page}
          totalPages={contactsData.totalPages}
          isLoading={contactsData.isLoading}
          onPageChange={contactsData.setPage}
        />
      </Card>

      <ContactsDialogs
        contactActions={contactActions}
        availableLists={contactsData.availableLists}
        availableTags={contactsData.availableTags}
        selectedCount={selectedContactIds.length}
      />
    </div>
  );
}
