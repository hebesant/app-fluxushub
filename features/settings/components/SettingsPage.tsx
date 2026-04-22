"use client";

import { useState } from "react";
import { AccountSettingsSection } from "./AccountSettingsSection";
import { SendingSettingsSection } from "./SendingSettingsSection";
import { SettingsSidebar } from "./SettingsSidebar";
import { TeamSettingsSection } from "./TeamSettingsSection";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { type SettingsTab } from "./settingsShared";
import { useSettingsData } from "../hooks/useSettingsData";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("workspace");
  const settings = useSettingsData();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">
          Configuracoes
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Ajustes do workspace e padroes de envio.
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-neutral-300">
          Central para organizar conta, workspace e comportamento padrao das
          campanhas. O modo de envio ainda podera ser ajustado por campanha.
        </p>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[280px_1fr]">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "workspace" ? (
          <WorkspaceSettingsSection
            workspace={settings.workspace}
            workspaceName={settings.workspaceName}
            currentRoleLabel={settings.currentRoleLabel}
            selectedModeName={settings.selectedMode?.name ?? "Lento"}
            selectedTimezone={settings.selectedTimezone}
            browserTimezone={settings.browserTimezone}
            isSavingTimezone={settings.isSavingTimezone}
            canManageWorkspace={settings.canManageTeam}
            onTimezoneChange={settings.setSelectedTimezone}
            onSaveTimezone={settings.saveTimezone}
          />
        ) : null}

        {activeTab === "team" ? (
          <TeamSettingsSection
            canManageTeam={settings.canManageTeam}
            inviteEmail={settings.inviteEmail}
            onInviteEmailChange={settings.setInviteEmail}
            inviteRole={settings.inviteRole}
            onInviteRoleChange={settings.setInviteRole}
            inviteExpiry={settings.inviteExpiry}
            onInviteExpiryChange={settings.setInviteExpiry}
            isCreatingInvite={settings.isCreatingInvite}
            onInviteSubmit={settings.handleInviteSubmit}
            latestInviteLink={settings.latestInviteLink}
            onCopyInviteLink={settings.copyInviteLink}
            isLoadingTeam={settings.isLoadingTeam}
            workspaceMemberships={settings.workspaceMemberships}
            workspaceInvitations={settings.workspaceInvitations}
            visibleRoleOptions={settings.visibleRoleOptions}
            pendingActionId={settings.pendingActionId}
            onMembershipRoleChange={settings.handleMembershipRoleChange}
            onMembershipRemove={settings.handleMembershipRemove}
            onInvitationDelete={settings.handleInvitationDelete}
          />
        ) : null}

        {activeTab === "sending" ? (
          <SendingSettingsSection
            selectedSendMode={settings.selectedSendMode}
            onSendModeChange={settings.setSelectedSendMode}
            selectedModeName={settings.selectedMode?.name ?? "Lento"}
            isLoadingWorkspace={settings.isLoadingWorkspace}
            isSavingSendMode={settings.isSavingSendMode}
            workspace={settings.workspace}
            onSave={settings.saveSendMode}
          />
        ) : null}

        {activeTab === "account" ? (
          <AccountSettingsSection
            user={settings.user ?? null}
            name={settings.name}
            workspaceName={settings.workspaceName}
            currentRoleLabel={settings.currentRoleLabel}
          />
        ) : null}
      </div>
    </div>
  );
}
