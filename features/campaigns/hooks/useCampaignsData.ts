import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  formatApiError,
  getAccessToken,
  type Campaign,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import { readSessionCache, writeSessionCache } from "@/lib/session-cache";
import { fetchCampaignsScreenData } from "../api/campaignsApi";
import type { CampaignStatusFilter, CampaignTargetFilter } from "../types";

type UseCampaignsDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

type CampaignsScreenCache = {
  campaigns: Campaign[];
  totalCampaigns: number;
  availableTags: string[];
  availableLists: string[];
  workspaces: Workspace[];
  instances: WhatsAppInstance[];
};

const pageSize = 20;

export function useCampaignsData({
  showToast,
}: UseCampaignsDataParams) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [targetFilter, setTargetFilter] = useState<CampaignTargetFilter>("all");
  const [page, setPage] = useState(1);
  const cacheKey = useMemo(
    () =>
      [
        "campaigns:screen",
        page,
        search.trim(),
        statusFilter,
        targetFilter,
      ].join(":"),
    [page, search, statusFilter, targetFilter]
  );
  const cachedData = useMemo(
    () => readSessionCache<CampaignsScreenCache>(cacheKey),
    [cacheKey]
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    cachedData?.value.campaigns ?? []
  );
  const [totalCampaigns, setTotalCampaigns] = useState(
    cachedData?.value.totalCampaigns ?? 0
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
  const [instances, setInstances] = useState<WhatsAppInstance[]>(
    cachedData?.value.instances ?? []
  );
  const [isLoading, setIsLoading] = useState(!cachedData);

  const connectedInstances = useMemo(
    () => instances.filter((instance) => instance.status === "connected"),
    [instances]
  );
  const activeWorkspace = workspaces[0];
  const totalPages = Math.max(1, Math.ceil(totalCampaigns / pageSize));

  useEffect(() => {
    const nextCachedData = readSessionCache<CampaignsScreenCache>(cacheKey);

    if (!nextCachedData) {
      setIsLoading(true);
      return;
    }

    setCampaigns(nextCachedData.value.campaigns);
    setTotalCampaigns(nextCachedData.value.totalCampaigns);
    setAvailableTags(nextCachedData.value.availableTags);
    setAvailableLists(nextCachedData.value.availableLists);
    setWorkspaces(nextCachedData.value.workspaces);
    setInstances(nextCachedData.value.instances);
    setIsLoading(false);
  }, [cacheKey]);

  const loadData = useCallback(async () => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<CampaignsScreenCache>(cacheKey);

    if (!token) {
      return;
    }

    if (!cachedEntry) {
      setIsLoading(true);
    }

    try {
      const data = await fetchCampaignsScreenData(token, {
        page,
        pageSize,
        search,
        statusFilter,
        targetFilter,
      });

      setWorkspaces(data.workspaces);
      setInstances(data.instances);
      setCampaigns(data.campaigns.results);
      setTotalCampaigns(data.campaigns.count);
      setAvailableTags(data.tagNames);
      setAvailableLists(data.listNames);
      writeSessionCache(cacheKey, {
        workspaces: data.workspaces,
        instances: data.instances,
        campaigns: data.campaigns.results,
        totalCampaigns: data.campaigns.count,
        availableTags: data.tagNames,
        availableLists: data.listNames,
      });
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, page, search, statusFilter, targetFilter, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateSearch(value: string) {
    setPage(1);
    setSearch(value);
  }

  function updateStatusFilter(value: CampaignStatusFilter) {
    setPage(1);
    setStatusFilter(value);
  }

  function updateTargetFilter(value: CampaignTargetFilter) {
    setPage(1);
    setTargetFilter(value);
  }

  function previousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function nextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return {
    campaigns,
    setCampaigns,
    totalCampaigns,
    availableTags,
    availableLists,
    instances,
    connectedInstances,
    activeWorkspace,
    search,
    statusFilter,
    targetFilter,
    page,
    totalPages,
    isLoading,
    loadData,
    updateSearch,
    updateStatusFilter,
    updateTargetFilter,
    previousPage,
    nextPage,
  };
}
