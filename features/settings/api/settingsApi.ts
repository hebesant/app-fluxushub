import { apiRequest, type Workspace } from "@/lib/api";

export function fetchWorkspaces(token: string) {
  return apiRequest<Workspace[]>("/api/workspaces/", { token });
}

export function updateWorkspaceSettings(
  token: string,
  workspaceId: number,
  data: Pick<Workspace, "default_send_mode">
) {
  return apiRequest<Workspace>(`/api/workspaces/${workspaceId}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}
