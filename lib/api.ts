const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  document: string;
  is_active: boolean;
  created_at: string;
};

export type Membership = {
  id: number;
  user: number;
  user_email: string;
  workspace: number;
  workspace_name: string;
  role: "owner" | "admin" | "member";
  created_at: string;
};

export type UserContext = {
  id: number;
  email: string;
  username: string;
  full_name: string;
  memberships: Membership[];
};

export type Contact = {
  id: number;
  workspace: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WhatsAppInstance = {
  id: number;
  workspace: number;
  workspace_name: string;
  name: string;
  phone_number: string;
  profile_picture_url: string;
  evolution_instance_id: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  is_active: boolean;
  created_at: string;
  connected_at: string | null;
};

export type WhatsAppActionResponse = {
  instance: WhatsAppInstance;
  evolution: unknown;
  qrcode?: string | null;
  state?: string;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user?: UserContext;
  workspace?: Workspace;
};

export type Invitation = {
  email: string;
  workspace: number;
  workspace_name: string;
  role: "owner" | "admin" | "member";
  expires_at: string;
  is_expired: boolean;
  is_accepted: boolean;
  is_valid: boolean;
};

type RequestOptions = RequestInit & {
  token?: string | null;
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

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
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

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("fluxushub_access");
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("fluxushub_refresh");
}

export function saveTokens(tokens: Pick<AuthResponse, "access" | "refresh">) {
  window.localStorage.setItem("fluxushub_access", tokens.access);
  window.localStorage.setItem("fluxushub_refresh", tokens.refresh);
}

export function clearTokens() {
  window.localStorage.removeItem("fluxushub_access");
  window.localStorage.removeItem("fluxushub_refresh");
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

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
