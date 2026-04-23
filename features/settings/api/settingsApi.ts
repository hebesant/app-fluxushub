import {
  apiRequest,
  type BillingExtraNumbersUpdateResponse,
  type BillingSummary,
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

export function fetchBillingSummary(token: string, workspaceId: number) {
  return apiRequest<BillingSummary>(`/api/billing/summary/?workspace=${workspaceId}`, {
    token,
  });
}

export function createBillingCheckoutSession(
  token: string,
  data: { workspace: number; extra_numbers: number }
) {
  return apiRequest<{ id: string; url: string }>("/api/billing/checkout-session/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function createBillingPortalSession(
  token: string,
  data: { workspace: number }
) {
  return apiRequest<{ url: string }>("/api/billing/portal-session/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateBillingExtraNumbers(
  token: string,
  data: { workspace: number; extra_numbers: number }
) {
  return apiRequest<BillingExtraNumbersUpdateResponse>(
    "/api/billing/extra-numbers/",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}
