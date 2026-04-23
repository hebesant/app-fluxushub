"use client";

import { useEffect, useMemo, useState } from "react";
import { toast as sonnerToast } from "sonner";
import {
  type BillingSummary,
  formatApiError,
  getAccessToken,
  type Invitation,
  type Membership,
  type Workspace,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { readSessionCache, writeSessionCache } from "@/lib/session-cache";
import { concreteSendModes } from "@/features/campaigns/components/campaignFormUtils";
import {
  createBillingCheckoutSession,
  createBillingPortalSession,
  createInvitation,
  updateBillingExtraNumbers,
  fetchBillingSummary,
  deleteInvitation,
  fetchInvitations,
  fetchMemberships,
  fetchWorkspaces,
  removeMembership,
  updateMembershipRole,
  updateWorkspaceSettings,
} from "../api/settingsApi";
import {
  type MvpAssignableRole,
  type SendMode,
  getRoleLabel,
} from "../components/settingsShared";

type SettingsWorkspaceCache = {
  workspace: Workspace | null;
};

type SettingsTeamCache = {
  memberships: Membership[];
  invitations: Invitation[];
};

type SettingsBillingCache = {
  billingSummary: BillingSummary | null;
};

const settingsWorkspaceCacheKey = "settings:workspace";
const settingsTeamCacheKey = "settings:team";
const settingsBillingCacheKey = "settings:billing";

export function useSettingsData() {
  const { user } = useAuth();
  const cachedWorkspaceData = readSessionCache<SettingsWorkspaceCache>(
    settingsWorkspaceCacheKey
  );
  const cachedTeamData = readSessionCache<SettingsTeamCache>(settingsTeamCacheKey);
  const cachedBillingData =
    readSessionCache<SettingsBillingCache>(settingsBillingCacheKey);
  const [selectedSendMode, setSelectedSendMode] = useState<SendMode>("slow");
  const [selectedTimezone, setSelectedTimezone] = useState("America/Sao_Paulo");
  const [workspace, setWorkspace] = useState<Workspace | null>(
    cachedWorkspaceData?.value.workspace ?? null
  );
  const [memberships, setMemberships] = useState<Membership[]>(
    cachedTeamData?.value.memberships ?? []
  );
  const [invitations, setInvitations] = useState<Invitation[]>(
    cachedTeamData?.value.invitations ?? []
  );
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(
    cachedBillingData?.value.billingSummary ?? null
  );
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(!cachedWorkspaceData);
  const [isLoadingTeam, setIsLoadingTeam] = useState(!cachedTeamData);
  const [isLoadingBilling, setIsLoadingBilling] = useState(!cachedBillingData);
  const [isSavingSendMode, setIsSavingSendMode] = useState(false);
  const [isSavingTimezone, setIsSavingTimezone] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MvpAssignableRole>("member");
  const [inviteExpiry, setInviteExpiry] = useState<30 | 120 | 1440 | 10080>(1440);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isUpdatingExtraNumbers, setIsUpdatingExtraNumbers] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);
  const [latestInviteLink, setLatestInviteLink] = useState("");
  const [extraNumbersDraft, setExtraNumbersDraft] = useState(0);

  const workspaceName =
    workspace?.name ?? user?.memberships[0]?.workspace_name ?? "Workspace";
  const browserTimezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "America/Sao_Paulo";
  const name = user?.full_name || user?.email || "Usuario";
  const selectedMode = concreteSendModes.find(
    (mode) => mode.id === selectedSendMode
  );
  const currentWorkspaceMembership = useMemo(
    () =>
      user?.memberships.find((membership) => membership.workspace === workspace?.id) ??
      null,
    [user, workspace]
  );
  const canManageTeam = currentWorkspaceMembership?.role === "owner";
  const canManageBilling = currentWorkspaceMembership?.role === "owner";
  const workspaceMemberships = useMemo(
    () => memberships.filter((membership) => membership.workspace === workspace?.id),
    [memberships, workspace]
  );
  const workspaceInvitations = useMemo(
    () =>
      invitations.filter(
        (invitation) =>
          invitation.workspace === workspace?.id && !invitation.is_accepted
      ),
    [invitations, workspace]
  );
  const currentRoleLabel = useMemo(
    () => getRoleLabel(currentWorkspaceMembership?.role ?? "member"),
    [currentWorkspaceMembership]
  );
  const visibleRoleOptions: Array<{
    value: MvpAssignableRole;
    label: string;
  }> = [
    { value: "member", label: "Member" },
    { value: "owner", label: "Owner" },
  ];

  useEffect(() => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<SettingsWorkspaceCache>(
      settingsWorkspaceCacheKey
    );

    if (!token) {
      setIsLoadingWorkspace(false);
      return;
    }

    if (!cachedEntry) {
      setIsLoadingWorkspace(true);
    }

    fetchWorkspaces(token)
      .then((workspaces) => {
        const activeWorkspace = workspaces[0] ?? null;
        setWorkspace(activeWorkspace);
        setSelectedSendMode(activeWorkspace?.default_send_mode ?? "slow");
        setSelectedTimezone(
          activeWorkspace?.timezone ?? browserTimezone ?? "America/Sao_Paulo"
        );
        writeSessionCache(settingsWorkspaceCacheKey, {
          workspace: activeWorkspace,
        });
      })
      .catch((requestError) => {
        sonnerToast.error(formatApiError(requestError));
      })
      .finally(() => setIsLoadingWorkspace(false));
  }, [browserTimezone]);

  useEffect(() => {
    const token = getAccessToken();
    const cachedEntry = readSessionCache<SettingsTeamCache>(settingsTeamCacheKey);

    if (!token) {
      setIsLoadingTeam(false);
      return;
    }

    if (!cachedEntry) {
      setIsLoadingTeam(true);
    }

    Promise.all([fetchMemberships(token), fetchInvitations(token)])
      .then(([loadedMemberships, loadedInvitations]) => {
        setMemberships(loadedMemberships);
        setInvitations(loadedInvitations);
        writeTeamCache(loadedMemberships, loadedInvitations);
      })
      .catch((requestError) => {
        sonnerToast.error(formatApiError(requestError));
      })
      .finally(() => setIsLoadingTeam(false));
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    const cachedEntry =
      readSessionCache<SettingsBillingCache>(settingsBillingCacheKey);

    if (!token || !workspace || !canManageBilling) {
      setIsLoadingBilling(false);
      return;
    }

    if (!cachedEntry) {
      setIsLoadingBilling(true);
    }

    fetchBillingSummary(token, workspace.id)
      .then((summary) => {
        setBillingSummary(summary);
        setExtraNumbersDraft(summary.extra_numbers);
        writeSessionCache(settingsBillingCacheKey, {
          billingSummary: summary,
        });
      })
      .catch((requestError) => {
        sonnerToast.error(formatApiError(requestError));
      })
      .finally(() => setIsLoadingBilling(false));
  }, [workspace, canManageBilling]);

  async function refreshBilling() {
    const token = getAccessToken();

    if (!token || !workspace || !canManageBilling) {
      return;
    }

    setIsLoadingBilling(true);
    try {
      const summary = await fetchBillingSummary(token, workspace.id);
      setBillingSummary(summary);
      setExtraNumbersDraft(summary.extra_numbers);
      writeSessionCache(settingsBillingCacheKey, {
        billingSummary: summary,
      });
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsLoadingBilling(false);
    }
  }

  async function saveSendMode() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSavingSendMode(true);

    try {
      const updatedWorkspace = await updateWorkspaceSettings(token, workspace.id, {
        default_send_mode: selectedSendMode,
        timezone: workspace.timezone,
      });
      setWorkspace(updatedWorkspace);
      setSelectedSendMode(updatedWorkspace.default_send_mode);
      writeSessionCache(settingsWorkspaceCacheKey, {
        workspace: updatedWorkspace,
      });
      sonnerToast.success("Configuracao salva.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsSavingSendMode(false);
    }
  }

  async function saveTimezone() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSavingTimezone(true);

    try {
      const updatedWorkspace = await updateWorkspaceSettings(token, workspace.id, {
        default_send_mode: workspace.default_send_mode,
        timezone: selectedTimezone,
      });
      setWorkspace(updatedWorkspace);
      setSelectedTimezone(updatedWorkspace.timezone);
      writeSessionCache(settingsWorkspaceCacheKey, {
        workspace: updatedWorkspace,
      });
      sonnerToast.success("Timezone do workspace salva.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsSavingTimezone(false);
    }
  }

  async function handleInviteSubmit() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsCreatingInvite(true);

    try {
      await createInvitation(token, {
        workspace: workspace.id,
        role: inviteRole,
        email: inviteEmail.trim() || undefined,
        expires_in_minutes: inviteExpiry,
      });
      const refreshedInvitations = await fetchInvitations(token);
      const newestInvite =
        refreshedInvitations.find((invitation) => invitation.accept_url) ?? null;
      setInvitations(refreshedInvitations);
      writeTeamCache(memberships, refreshedInvitations);
      setLatestInviteLink(newestInvite?.accept_url ?? "");
      setInviteEmail("");
      setInviteRole("member");
      setInviteExpiry(1440);
      sonnerToast.success("Link de convite gerado.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsCreatingInvite(false);
    }
  }

  async function openBillingCheckout() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsCreatingCheckout(true);

    try {
      const response = await createBillingCheckoutSession(token, {
        workspace: workspace.id,
        extra_numbers: extraNumbersDraft,
      });
      window.location.href = response.url;
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
      setIsCreatingCheckout(false);
    }
  }

  async function updateExistingBillingExtraNumbers() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsUpdatingExtraNumbers(true);

    try {
      const response = await updateBillingExtraNumbers(token, {
        workspace: workspace.id,
        extra_numbers: extraNumbersDraft,
      });
      setBillingSummary(response.summary);
      setExtraNumbersDraft(response.summary.extra_numbers);
      writeSessionCache(settingsBillingCacheKey, {
        billingSummary: response.summary,
      });
      sonnerToast.success("Numeros extras atualizados na assinatura.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setIsUpdatingExtraNumbers(false);
    }
  }

  async function handleBillingPrimaryAction() {
    const hasManagedStripeSubscription =
      billingSummary?.subscription != null &&
      billingSummary.subscription.status !== "canceled" &&
      billingSummary.has_stripe_customer;

    if (hasManagedStripeSubscription) {
      await updateExistingBillingExtraNumbers();
      return;
    }

    await openBillingCheckout();
  }

  async function openBillingPortal() {
    const token = getAccessToken();

    if (!token || !workspace) {
      sonnerToast.error("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsOpeningPortal(true);

    try {
      const response = await createBillingPortalSession(token, {
        workspace: workspace.id,
      });
      window.location.href = response.url;
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
      setIsOpeningPortal(false);
    }
  }

  async function handleMembershipRoleChange(
    membershipId: number,
    role: Membership["role"]
  ) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setPendingActionId(membershipId);
    try {
      await updateMembershipRole(token, membershipId, role);
      const refreshedMemberships = await fetchMemberships(token);
      setMemberships(refreshedMemberships);
      writeTeamCache(refreshedMemberships, invitations);
      sonnerToast.success("Permissao atualizada.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleMembershipRemove(membershipId: number) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setPendingActionId(membershipId);
    try {
      await removeMembership(token, membershipId);
      const refreshedMemberships = await fetchMemberships(token);
      setMemberships(refreshedMemberships);
      writeTeamCache(refreshedMemberships, invitations);
      sonnerToast.success("Membro removido do workspace.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleInvitationDelete(invitationId: number) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setPendingActionId(invitationId);
    try {
      await deleteInvitation(token, invitationId);
      const refreshedInvitations = await fetchInvitations(token);
      setInvitations(refreshedInvitations);
      writeTeamCache(memberships, refreshedInvitations);
      sonnerToast.success("Convite removido.");
    } catch (requestError) {
      sonnerToast.error(formatApiError(requestError));
    } finally {
      setPendingActionId(null);
    }
  }

  async function copyInviteLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      sonnerToast.success("Link copiado.");
    } catch {
      sonnerToast.error("Nao foi possivel copiar o link.");
    }
  }

  function writeTeamCache(
    nextMemberships: Membership[],
    nextInvitations: Invitation[]
  ) {
    writeSessionCache(settingsTeamCacheKey, {
      memberships: nextMemberships,
      invitations: nextInvitations,
    });
  }

  return {
    user,
    workspace,
    billingSummary,
    workspaceName,
    name,
    selectedSendMode,
    setSelectedSendMode,
    selectedTimezone,
    setSelectedTimezone,
    browserTimezone,
    selectedMode,
    workspaceMemberships,
    workspaceInvitations,
    currentRoleLabel,
    canManageTeam,
    canManageBilling,
    visibleRoleOptions,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    inviteExpiry,
    setInviteExpiry,
    isLoadingWorkspace,
    isLoadingTeam,
    isLoadingBilling,
    isSavingSendMode,
    isSavingTimezone,
    isCreatingInvite,
    isCreatingCheckout,
    isUpdatingExtraNumbers,
    isOpeningPortal,
    pendingActionId,
    latestInviteLink,
    extraNumbersDraft,
    saveSendMode,
    saveTimezone,
    setExtraNumbersDraft,
    refreshBilling,
    openBillingCheckout,
    handleBillingPrimaryAction,
    openBillingPortal,
    handleInviteSubmit,
    handleMembershipRoleChange,
    handleMembershipRemove,
    handleInvitationDelete,
    copyInviteLink,
  };
}
