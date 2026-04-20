"use client";

import { useCallback, useEffect, useState } from "react";
import { formatApiError, getAccessToken } from "@/lib/api";
import { fetchDashboardData } from "../api/dashboardApi";
import type { DashboardData } from "../types";

const initialDashboardData: DashboardData = {
  instances: [],
  contactsCount: 0,
  campaigns: [],
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setData(await fetchDashboardData(token));
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

