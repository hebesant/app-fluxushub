import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatApiError,
  getAccessToken,
  type Contact,
  type Workspace,
} from "@/lib/api";
import { fetchContactsScreenData } from "../api/contactsApi";

type UseContactsDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

const pageSize = 20;

export function useContactsData({ showToast }: UseContactsDataParams) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableLists, setAvailableLists] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);
  const totalPages = Math.max(1, Math.ceil(totalContacts / pageSize));

  const loadData = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchContactsScreenData(token, {
        page,
        pageSize,
        search,
        selectedList,
        selectedTags,
      });

      setWorkspaces(data.workspaces);
      setContacts(data.contacts.results);
      setTotalContacts(data.contacts.count);
      setAvailableLists(data.listNames);
      setAvailableTags(data.tagNames);
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedList, selectedTags, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateSearch(value: string) {
    setPage(1);
    setSearch(value);
  }

  function selectList(listName: string) {
    setPage(1);
    setSelectedList(listName);
  }

  function toggleSelectedTag(tag: string) {
    setPage(1);
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((currentTag) => currentTag !== tag)
        : [...current, tag]
    );
  }

  function clearTagFilters() {
    setPage(1);
    setSelectedTags([]);
  }

  function clearAllFilters() {
    setPage(1);
    setSelectedList("");
    setSelectedTags([]);
  }

  return {
    contacts,
    setContacts,
    totalContacts,
    availableTags,
    availableLists,
    activeWorkspace,
    search,
    selectedTags,
    selectedList,
    page,
    totalPages,
    isLoading,
    loadData,
    setPage,
    updateSearch,
    selectList,
    toggleSelectedTag,
    clearTagFilters,
    clearAllFilters,
  };
}
