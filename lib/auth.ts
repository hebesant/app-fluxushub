"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiRequest,
  clearTokens,
  getAccessToken,
  refreshAccessToken,
  type UserContext,
} from "@/lib/api";

export function useCurrentUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      let token = getAccessToken();

      try {
        if (!token) {
          token = await refreshAccessToken();
        }

        const userContext = await apiRequest<UserContext>("/api/auth/me/", {
          token,
        });

        if (isMounted) {
          setUser(userContext);
        }
      } catch {
        clearTokens();
        router.replace("/login");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { user, isLoading };
}
