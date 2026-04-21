"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiRequest,
  clearTokens,
  getAccessToken,
  refreshAccessToken,
  type UserContext,
} from "@/lib/api";

type AuthContextValue = {
  user: UserContext | null;
  isLoading: boolean;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  const loadUser = useCallback(async () => {
    let token = getAccessToken();

    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      if (!token) {
        token = await refreshAccessToken();
      }

      const userContext = await apiRequest<UserContext>("/api/auth/me/", {
        token,
      });

      if (isMountedRef.current) {
        setUser(userContext);
      }
    } catch {
      clearTokens();
      if (isMountedRef.current) {
        setUser(null);
        router.replace("/login");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [router]);

  useEffect(() => {
    isMountedRef.current = true;

    loadUser();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      reloadUser: loadUser,
    }),
    [user, isLoading, loadUser]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}

export function useCurrentUser() {
  return useAuth();
}
