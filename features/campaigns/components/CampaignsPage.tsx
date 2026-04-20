"use client";

import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import { useCampaignFormActions } from "../hooks/useCampaignFormActions";
import { useCampaignRuntimeActions } from "../hooks/useCampaignRuntimeActions";
import { useCampaignsData } from "../hooks/useCampaignsData";
import { CampaignFormModal } from "./CampaignFormModal";
import { CampaignRecipientsModal } from "./CampaignRecipientsModal";
import { CampaignsHeader } from "./CampaignsHeader";
import { CampaignsListCard } from "./CampaignsListCard";

export function CampaignsPage() {
  const showToast = useCallback((type: "success" | "error", message: string) => {
    sonnerToast[type](message);
  }, []);

  const campaignsData = useCampaignsData({ showToast });
  const runtimeActions = useCampaignRuntimeActions({
    setCampaigns: campaignsData.setCampaigns,
    showToast,
  });
  const formActions = useCampaignFormActions({
    activeWorkspace: campaignsData.activeWorkspace,
    instances: campaignsData.instances,
    setCampaigns: campaignsData.setCampaigns,
    setSelectedCampaign: runtimeActions.setSelectedCampaign,
    clearPreview: runtimeActions.clearPreview,
    sendCampaignAfterSave: runtimeActions.sendCampaign,
    showToast,
  });

  return (
    <div className="space-y-6">
      <CampaignsHeader
        onRefresh={campaignsData.loadData}
        onCreate={formActions.openNewCampaign}
      />

      <CampaignsListCard
        campaigns={campaignsData.campaigns}
        totalCampaigns={campaignsData.totalCampaigns}
        search={campaignsData.search}
        statusFilter={campaignsData.statusFilter}
        targetFilter={campaignsData.targetFilter}
        page={campaignsData.page}
        totalPages={campaignsData.totalPages}
        isLoading={campaignsData.isLoading}
        busyCampaignId={runtimeActions.busyCampaignId}
        onSearchChange={campaignsData.updateSearch}
        onStatusFilterChange={campaignsData.updateStatusFilter}
        onTargetFilterChange={campaignsData.updateTargetFilter}
        onPreviousPage={campaignsData.previousPage}
        onNextPage={campaignsData.nextPage}
        onEdit={formActions.openEditCampaign}
        onCancel={runtimeActions.cancelCampaign}
        onSend={runtimeActions.sendCampaign}
        onRetryFailed={runtimeActions.retryFailedCampaign}
        onDetails={runtimeActions.openCampaignDetails}
      />

      {formActions.isFormOpen ? (
        <CampaignFormModal
          form={formActions.form}
          connectedInstances={campaignsData.connectedInstances}
          instances={campaignsData.instances}
          availableTags={campaignsData.availableTags}
          availableLists={campaignsData.availableLists}
          isEditing={Boolean(formActions.editingCampaign)}
          isSubmitting={formActions.isSubmitting}
          onChange={formActions.updateField}
          onInsertVariable={formActions.insertVariable}
          onCancel={formActions.closeForm}
          onSubmit={formActions.preventSubmit}
          onSaveDraft={formActions.handleSaveDraft}
          onSendCampaign={formActions.handleSaveAndSend}
        />
      ) : null}

      {runtimeActions.isRecipientsModalOpen ? (
        <CampaignRecipientsModal
          recipientDetails={runtimeActions.recipientDetails}
          eventDetails={runtimeActions.eventDetails}
          onRecipientsPageChange={runtimeActions.loadRecipientsPage}
          onEventsPageChange={runtimeActions.loadEventsPage}
          onClose={runtimeActions.closeRecipientsModal}
        />
      ) : null}
    </div>
  );
}
