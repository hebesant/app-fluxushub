import { useMemo, useState } from "react";
import type { Contact } from "@/lib/api";

export function useContactSelection(contacts: Contact[]) {
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);

  const visibleContactIds = useMemo(
    () => contacts.map((contact) => contact.id),
    [contacts]
  );
  const visibleContactIdSet = useMemo(
    () => new Set(visibleContactIds),
    [visibleContactIds]
  );
  const visibleSelectedContactIds = useMemo(
    () => selectedContactIds.filter((id) => visibleContactIdSet.has(id)),
    [selectedContactIds, visibleContactIdSet]
  );
  const selectedContacts = useMemo(
    () => contacts.filter((contact) => visibleSelectedContactIds.includes(contact.id)),
    [contacts, visibleSelectedContactIds]
  );
  const allVisibleContactsSelected =
    visibleContactIds.length > 0 &&
    visibleContactIds.every((id) => visibleSelectedContactIds.includes(id));

  function toggleContactSelection(contactId: number) {
    setSelectedContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId]
    );
  }

  function toggleVisibleContactsSelection() {
    setSelectedContactIds((current) => {
      if (allVisibleContactsSelected) {
        return current.filter((id) => !visibleContactIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleContactIds]));
    });
  }

  function removeContactIds(contactIds: number[]) {
    setSelectedContactIds((current) =>
      current.filter((id) => !contactIds.includes(id))
    );
  }

  function clearSelection() {
    setSelectedContactIds([]);
  }

  return {
    selectedContactIds: visibleSelectedContactIds,
    selectedContacts,
    allVisibleContactsSelected,
    setSelectedContactIds,
    toggleContactSelection,
    toggleVisibleContactsSelection,
    removeContactIds,
    clearSelection,
  };
}
