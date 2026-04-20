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
import { fetchCampaignsScreenData } from "../api/campaignsApi";
import type { CampaignStatusFilter, CampaignTargetFilter } from "../types";

type UseCampaignsDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

const pageSize = 20;

export function useCampaignsData({
  showToast,
}: UseCampaignsDataParams) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableLists, setAvailableLists] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [targetFilter, setTargetFilter] = useState<CampaignTargetFilter>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const connectedInstances = useMemo(
    () => instances.filter((instance) => instance.status === "connected"),
    [instances]
  );
  const activeWorkspace = workspaces[0];
  const totalPages = Math.max(1, Math.ceil(totalCampaigns / pageSize));

  const loadData = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);

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
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, targetFilter, showToast]);

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
