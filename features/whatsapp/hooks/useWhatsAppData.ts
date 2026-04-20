import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatApiError,
  getAccessToken,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import { fetchWhatsAppScreenData } from "../api/whatsappApi";

type UseWhatsAppDataParams = {
  showToast: (type: "success" | "error", message: string) => void;
};

export function useWhatsAppData({ showToast }: UseWhatsAppDataParams) {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);

  const loadData = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchWhatsAppScreenData(token);

      setWorkspaces(data.workspaces);
      setInstances(data.instances);
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
