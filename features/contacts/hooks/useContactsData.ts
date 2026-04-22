import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatApiError,
  getAccessToken,
  type Contact,
  type Workspace,
} from "@/lib/api";
import { readSessionCache, writeSessionCache } from "@/lib/session-cache";
import { fetchContactsScreenData } from "../api/contactsApi";

type UseContactsDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

type ContactsScreenCache = {
  contacts: Contact[];
  totalContacts: number;
  availableTags: string[];
  availableLists: string[];
  workspaces: Workspace[];
};

const pageSize = 20;

export function useContactsData({ showToast }: UseContactsDataParams) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [page, setPage] = useState(1);
  const cacheKey = useMemo(
    () =>
      [
        "contacts:screen",
        page,
        search.trim(),
        selectedList,
        [...selectedTags].sort().join(","),
      ].join(":"),
    [page, search, selectedList, selectedTags]
  );
  const cachedData = useMemo(
    () => readSessionCache<ContactsScreenCache>(cacheKey),
    [cacheKey]
  );
  const [contacts, setContacts] = useState<Contact[]>(
    cachedData?.value.contacts ?? []
  );
  const [totalContacts, setTotalContacts] = useState(
    cachedData?.value.totalContacts ?? 0
  );
  const [availableTags, setAvailableTags] = useState<string[]>(
    cachedData?.value.availableTags ?? []
  );
  const [availableLists, setAvailableLists] = useState<string[]>(
    cachedData?.value.availableLists ?? []
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    cachedData?.value.workspaces ?? []
  );
  const [isLoading, setIsLoading] = useState(!cachedData);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);
  const totalPages = Math.max(1, Math.ceil(totalContacts / pageSize));

  useEffect(() => {
    const nextCachedData = readSessionCache<ContactsScreenCache>(cacheKey);

    if (!nextCachedData) {
      setIsLoading(true);
      return;
    }

    setContacts(nextCachedData.value.contacts);
    setTotalContacts(nextCachedData.value.totalContacts);
    setAvailableLists(nextCachedData.value.availableLists);
    setAvailableTags(nextCachedData.value.availableTags);
    setWorkspaces(nextCachedData.value.workspaces);
    setIsLoading(false);
  }, [cacheKey]);

  const loadData = useCallback(async () => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<ContactsScreenCache>(cacheKey);

    if (!token) {
      return;
    }

    if (!cachedEntry) {
      setIsLoading(true);
    }

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
      writeSessionCache(cacheKey, {
        workspaces: data.workspaces,
        contacts: data.contacts.results,
        totalContacts: data.contacts.count,
        availableLists: data.listNames,
        availableTags: data.tagNames,
      });
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, page, search, selectedList, selectedTags, showToast]);

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
