import {
  apiRequest,
  type WhatsAppActionResponse,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import type { InstanceForm } from "../types";

export async function fetchWhatsAppScreenData(token: string) {
  const [workspaces, instances] = await Promise.all([
    apiRequest<Workspace[]>("/api/workspaces/", { token }),
    apiRequest<WhatsAppInstance[]>("/api/whatsapp-instances/", { token }),
  ]);

  return { workspaces, instances };
}

export function createWhatsAppInstance(
  token: string,
  form: InstanceForm,
  workspaceId: number
) {
  return apiRequest<WhatsAppInstance>("/api/whatsapp-instances/", {
    method: "POST",
    token,
    body: JSON.stringify({
      workspace: workspaceId,
      name: form.name,
      phone_number: "",
      status: "disconnected",
      is_active: true,
    }),
  });
}

export function connectWhatsAppInstance(token: string, instanceId: number) {
  return apiRequest<WhatsAppActionResponse>(
    `/api/whatsapp-instances/${instanceId}/connect/`,
    {
      method: "POST",
      token,
    }
  );
}

export function refreshWhatsAppInstanceStatus(token: string, instanceId: number) {
  return apiRequest<WhatsAppActionResponse>(
    `/api/whatsapp-instances/${instanceId}/status/`,
    { token }
  );
}

export function disconnectWhatsAppInstance(token: string, instanceId: number) {
  return apiRequest<WhatsAppActionResponse>(
    `/api/whatsapp-instances/${instanceId}/disconnect/`,
    {
      method: "POST",
      token,
    }
  );
}

export function deleteWhatsAppInstance(token: string, instanceId: number) {
  return apiRequest<null>(`/api/whatsapp-instances/${instanceId}/`, {
    method: "DELETE",
    token,
  });
}

export function updateWhatsAppInstance(
  token: string,
  instanceId: number,
  name: string
) {
  return apiRequest<WhatsAppInstance>(`/api/whatsapp-instances/${instanceId}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ name }),
  });
}
