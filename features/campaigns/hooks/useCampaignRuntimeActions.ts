import type { Dispatch, SetStateAction } from "react";
import { type Campaign } from "@/lib/api";
import { useCampaignDetails } from "./useCampaignDetails";
import { useCampaignMutations } from "./useCampaignMutations";

type UseCampaignRuntimeActionsParams = {
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useCampaignRuntimeActions({
  setCampaigns,
  showToast,
}: UseCampaignRuntimeActionsParams) {
  const details = useCampaignDetails({
    setCampaigns,
    showToast,
  });
  const mutations = useCampaignMutations({
    setCampaigns,
    setSelectedCampaign: details.setSelectedCampaign,
    loadPreview: details.loadPreview,
    resetDetails: details.resetDetails,
    selectedCampaign: details.selectedCampaign,
    showToast,
  });

  function openRecipientsModal() {
    details.setIsRecipientsModalOpen(true);
  }

  function closeRecipientsModal() {
    details.setIsRecipientsModalOpen(false);
  }

  return {
    preview: details.preview,
    recipients: details.recipients,
    events: details.events,
    recipientDetails: details.recipientDetails,
    eventDetails: details.eventDetails,
    isRecipientsModalOpen: details.isRecipientsModalOpen,
    selectedCampaign: details.selectedCampaign,
    isPreviewLoading: details.isPreviewLoading,
    isPreparing: mutations.isPreparing,
    isSending: mutations.isSending,
    busyCampaignId: mutations.busyCampaignId,
    setSelectedCampaign: details.setSelectedCampaign,
    clearPreview: details.clearPreview,
    openRecipientsModal,
    closeRecipientsModal,
    openCampaignDetails: details.openCampaignDetails,
    loadRecipientsPage: details.loadRecipientsPage,
    loadEventsPage: details.loadEventsPage,
    loadPreview: details.loadPreview,
    prepareCampaign: mutations.prepareCampaign,
    sendCampaign: mutations.sendCampaign,
    retryFailedCampaign: mutations.retryFailedCampaign,
    cancelCampaign: mutations.cancelCampaign,
  };
}
