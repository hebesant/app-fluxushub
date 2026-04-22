import { clearTokens, saveTokens } from "./auth-session";
import type { AuthResponse } from "./api-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = RequestInit & {
  token?: string | null;
  skipAuthRetry?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super("API request failed");
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!headers.has("Content-Type") && options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });

  const data = await readResponse(response);

  if (response.status === 401 && options.token && !options.skipAuthRetry) {
    try {
      const refreshedAccessToken = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${refreshedAccessToken}`);

      const retryResponse = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
      const retryData = await readResponse(retryResponse);

      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, retryData);
      }

      return retryData as T;
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

export async function refreshAccessToken() {
  const response = await apiRequest<AuthResponse>("/api/auth/token/refresh/", {
    method: "POST",
    skipAuthRetry: true,
  });

  saveTokens(response);
  return response.access;
}

export async function logout() {
  try {
    await apiRequest<null>("/api/auth/logout/", {
      method: "POST",
      skipAuthRetry: true,
    });
  } finally {
    clearTokens();
  }
}

export function formatApiError(error: unknown) {
  if (error instanceof ApiError) {
    if (typeof error.data === "string") {
      return error.data;
    }

    if (error.data && typeof error.data === "object") {
      return Object.entries(error.data)
        .map(([field, value]) => `${field}: ${formatValue(value)}`)
        .join(" ");
    }
  }

  return "Nao foi possivel concluir a acao.";
}

async function readResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
