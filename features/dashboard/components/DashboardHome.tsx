"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardChecklistCard } from "./DashboardChecklistCard";
import { DashboardHero } from "./DashboardHero";
import { DashboardMetricsGrid } from "./DashboardMetricsGrid";
import { RecentCampaignsCard } from "./RecentCampaignsCard";
import { SendingCampaignCard } from "./SendingCampaignCard";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  buildDashboardChecklist,
  dashboardTitle,
  getFailedCampaigns,
  getPrimaryAction,
  getSendingCampaign,
} from "../utils/dashboardSummary";

export function DashboardHome() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading, error } = useDashboardData();
  const isPageLoading = isAuthLoading || isLoading;
  const workspaceName = user?.memberships[0]?.workspace_name ?? "sua operacao";

  const connectedInstances = useMemo(
    () => data.instances.filter((instance) => instance.status === "connected"),
    [data.instances]
  );
  const sendingCampaign = useMemo(
    () => getSendingCampaign(data.campaigns),
    [data.campaigns]
  );
  const failedCampaigns = useMemo(
    () => getFailedCampaigns(data.campaigns),
    [data.campaigns]
  );
  const primaryAction = useMemo(
    () =>
      getPrimaryAction({
        connectedInstancesCount: connectedInstances.length,
        contactsCount: data.contactsCount,
      }),
    [connectedInstances.length, data.contactsCount]
  );
  const checklist = useMemo(
    () =>
      buildDashboardChecklist({
        connectedInstancesCount: connectedInstances.length,
        contactsCount: data.contactsCount,
        campaignsCount: data.campaigns.length,
      }),
    [connectedInstances.length, data.campaigns.length, data.contactsCount]
  );
  const heroTitle = isPageLoading
    ? "Carregando sua operacao..."
    : dashboardTitle({
        workspaceName,
        connectedInstancesCount: connectedInstances.length,
        contactsCount: data.contactsCount,
      });
  const heroAction = isPageLoading
    ? { href: "/dashboard", label: "Carregando..." }
    : primaryAction;

  return (
    <div className="space-y-6">
      <DashboardHero
        title={heroTitle}
        primaryAction={heroAction}
        error={error}
      />

      <DashboardMetricsGrid
        instances={data.instances}
        connectedInstancesCount={connectedInstances.length}
        contactsCount={data.contactsCount}
        campaigns={data.campaigns}
        failedCampaignsCount={failedCampaigns.length}
        hasSendingCampaign={Boolean(sendingCampaign)}
        isLoading={isPageLoading}
      />

      {sendingCampaign ? (
        <SendingCampaignCard campaign={sendingCampaign} />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <DashboardChecklistCard items={checklist} isLoading={isPageLoading} />
        <RecentCampaignsCard
          campaigns={data.campaigns}
          isLoading={isPageLoading}
        />
      </section>
    </div>
  );
}
