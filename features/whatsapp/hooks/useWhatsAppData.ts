import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatApiError,
  getAccessToken,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import { readSessionCache, writeSessionCache } from "@/lib/session-cache";
import { fetchWhatsAppScreenData } from "../api/whatsappApi";

type UseWhatsAppDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

type WhatsAppScreenCache = {
  instances: WhatsAppInstance[];
  workspaces: Workspace[];
};

const whatsappCacheKey = "whatsapp:screen";

export function useWhatsAppData({ showToast }: UseWhatsAppDataParams) {
  const cachedData = readSessionCache<WhatsAppScreenCache>(whatsappCacheKey);
  const [instances, setInstances] = useState<WhatsAppInstance[]>(
    cachedData?.value.instances ?? []
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    cachedData?.value.workspaces ?? []
  );
  const [isLoading, setIsLoading] = useState(!cachedData);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);

  const loadData = useCallback(async () => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<WhatsAppScreenCache>(whatsappCacheKey);

    if (!token) {
      return;
    }

    if (!cachedEntry) {
      setIsLoading(true);
    }

    try {
      const data = await fetchWhatsAppScreenData(token);

      setWorkspaces(data.workspaces);
      setInstances(data.instances);
      writeSessionCache(whatsappCacheKey, {
        workspaces: data.workspaces,
        instances: data.instances,
      });
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    instances,
    setInstances,
    activeWorkspace,
    isLoading,
    loadData,
  };
}
