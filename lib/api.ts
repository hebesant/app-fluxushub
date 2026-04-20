const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  document: string;
  default_send_mode: "slow" | "normal" | "fast";
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
  contact_list_id: number | null;
  name: string;
  phone: string;
  email: string;
  list_name: string;
  notes: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactList = {
  id: number;
  workspace: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type ContactTag = {
  id: number;
  workspace: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type WhatsAppInstance = {
  id: number;
  workspace: number;
  workspace_name: string;
  name: string;
  phone_number: string;
  profile_picture_url: string;
  provider: "evolution";
  provider_instance_id: string;
  evolution_instance_id: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  is_active: boolean;
  created_at: string;
  connected_at: string | null;
};

export type CampaignStatus =
  | "draft"
  | "ready"
  | "sending"
  | "sent"
  | "failed"
  | "canceled";

export type Campaign = {
  id: number;
  workspace: number;
  workspace_name: string;
  whatsapp_instance: number | null;
  whatsapp_instance_name: string;
  whatsapp_instance_label: string;
  name: string;
  target_type: "tag" | "list" | "all";
  target_tag: string;
  target_list: string;
  message_template: string;
  send_mode: "slow" | "normal" | "fast";
  media_type: "none" | "image" | "video";
  media_file: string | null;
  media_file_url: string | null;
  status: CampaignStatus;
  recipients_count: number;
  pending_count: number;
  sent_count: number;
  failed_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type CampaignPreview = {
  total_contacts: number;
  variables: string[];
  allowed_variables: string[];
  samples: Array<{
    contact_id: number;
    name: string;
    phone: string;
    message: string;
  }>;
};

export type CampaignRecipient = {
  id: number;
  campaign: number;
  contact: number;
  contact_name: string;
  contact_email: string;
  phone: string;
  rendered_message: string;
  status: "pending" | "sent" | "failed" | "skipped";
  error_message: string;
  sent_at: string | null;
  created_at: string;
};

export type CampaignEvent = {
  id: number;
  campaign: number;
  event_type:
    | "prepared"
    | "queued"
    | "started"
    | "recipient_sent"
    | "recipient_failed"
    | "canceled"
    | "finished"
    | "failed";
  message: string;
  metadata: Record<string, unknown>;
  created_by: number | null;
  created_by_name: string;
  created_at: string;
};

export type CampaignPrepareResponse = {
  campaign: Campaign;
  created_recipients: number;
  skipped_recipients: number;
  total_contacts: number;
};

export type CampaignSendResponse = {
  campaign: Campaign;
  queued: boolean;
  sent_count: number;
  failed_count: number;
  total_count: number;
};

export type WhatsAppActionResponse = {
  instance: WhatsAppInstance;
  provider?: unknown;
  evolution?: unknown;
  qrcode?: string | null;
  state?: string;
};

export type AuthResponse = {
  access: string;
  refresh?: string;
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
  skipAuthRetry?: boolean;
};

let accessToken: string | null = null;

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

  if (
    response.status === 401 &&
    options.token &&
    !options.skipAuthRetry
  ) {
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
  return accessToken;
}

export function saveTokens(tokens: Pick<AuthResponse, "access">) {
  accessToken = tokens.access;
  removeLegacyStoredTokens();
}

export function clearTokens() {
  accessToken = null;
  removeLegacyStoredTokens();
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

function removeLegacyStoredTokens() {
  if (typeof window === "undefined") {
    return;
  }

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
