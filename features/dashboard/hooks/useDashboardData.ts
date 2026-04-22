"use client";

import { useCallback, useEffect, useState } from "react";
import { formatApiError, getAccessToken } from "@/lib/api";
import { readSessionCache, writeSessionCache } from "@/lib/session-cache";
import { fetchDashboardData } from "../api/dashboardApi";
import type { DashboardData } from "../types";

const initialDashboardData: DashboardData = {
  instances: [],
  contactsCount: 0,
  campaigns: [],
};
const dashboardCacheKey = "dashboard:home";

export function useDashboardData() {
  const cachedData = readSessionCache<DashboardData>(dashboardCacheKey);
  const [data, setData] = useState<DashboardData>(
    cachedData?.value ?? initialDashboardData
  );
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<DashboardData>(dashboardCacheKey);

    if (!token) {
      return;
    }

    if (!cachedEntry) {
      setIsLoading(true);
    }
    setError("");

    try {
      const nextData = await fetchDashboardData(token);
      setData(nextData);
      writeSessionCache(dashboardCacheKey, nextData);
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    reload: loadData,
  };
}
