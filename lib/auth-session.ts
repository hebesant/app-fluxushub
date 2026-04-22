import { clearSessionCache } from "@/lib/session-cache";
import type { AuthResponse } from "./api-types";

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function saveTokens(tokens: Pick<AuthResponse, "access">) {
  accessToken = tokens.access;
  clearSessionCache();
  removeLegacyStoredTokens();
}

export function clearTokens() {
  accessToken = null;
  clearSessionCache();
  removeLegacyStoredTokens();
}

function removeLegacyStoredTokens() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("fluxushub_access");
  window.localStorage.removeItem("fluxushub_refresh");
}
