"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, clearTokens, getAccessToken, type UserContext } from "@/lib/api";

export function useCurrentUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    apiRequest<UserContext>("/api/auth/me/", { token })
      .then(setUser)
      .catch(() => {
        clearTokens();
        router.replace("/login");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  return { user, isLoading };
}
