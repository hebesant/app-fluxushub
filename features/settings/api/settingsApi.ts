import {
  apiRequest,
  type Invitation,
  type Membership,
  type Workspace,
} from "@/lib/api";

export function fetchWorkspaces(token: string) {
  return apiRequest<Workspace[]>("/api/workspaces/", { token });
}

export function updateWorkspaceSettings(
  token: string,
  workspaceId: number,
  data: Pick<Workspace, "default_send_mode" | "timezone">
) {
  return apiRequest<Workspace>(`/api/workspaces/${workspaceId}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export function fetchMemberships(token: string) {
  return apiRequest<Membership[]>("/api/memberships/", { token });
}

export function updateMembershipRole(
  token: string,
  membershipId: number,
  role: Membership["role"]
) {
  return apiRequest<Membership>(`/api/memberships/${membershipId}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ role }),
  });
}

export function removeMembership(token: string, membershipId: number) {
  return apiRequest<null>(`/api/memberships/${membershipId}/`, {
    method: "DELETE",
    token,
  });
}

export function fetchInvitations(token: string) {
  return apiRequest<Invitation[]>("/api/invitations/", { token });
}

export function createInvitation(
  token: string,
  data: {
    workspace: number;
    email?: string;
    role: Invitation["role"];
    expires_in_minutes: 30 | 120 | 1440 | 10080;
  }
) {
  return apiRequest<Invitation>("/api/invitations/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteInvitation(token: string, invitationId: number) {
  return apiRequest<null>(`/api/invitations/${invitationId}/`, {
    method: "DELETE",
    token,
  });
}
