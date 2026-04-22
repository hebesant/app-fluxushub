"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  formatApiError,
  getAccessToken,
  type Campaign,
} from "@/lib/api";
import {
  cancelCampaignRequest,
  prepareCampaignRequest,
  retryFailedCampaignRequest,
  sendCampaignRequest,
} from "../api/campaignsApi";

type UseCampaignMutationsParams = {
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  setSelectedCampaign: Dispatch<SetStateAction<Campaign | null>>;
  loadPreview: (campaign: Campaign) => Promise<void>;
  resetDetails: () => void;
  selectedCampaign: Campaign | null;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useCampaignMutations({
  setCampaigns,
  setSelectedCampaign,
  loadPreview,
  resetDetails,
  selectedCampaign,
  showToast,
}: UseCampaignMutationsParams) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [busyCampaignId, setBusyCampaignId] = useState<number | null>(null);

  async function prepareCampaign(campaign: Campaign) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsPreparing(true);

    try {
      const response = await prepareCampaignRequest(token, campaign.id);

      setCampaigns((current) =>
        current.map((item) =>
          item.id === response.campaign.id ? response.campaign : item
        )
      );
      setSelectedCampaign(response.campaign);
      showToast(
        "success",
        `${response.created_recipients} preparado${
          response.created_recipients === 1 ? "" : "s"
        }, ${response.skipped_recipients} ignorado${
          response.skipped_recipients === 1 ? "" : "s"
        }.`
      );
      await loadPreview(response.campaign);
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsPreparing(false);
    }
  }

  async function sendCampaign(campaign: Campaign) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setBusyCampaignId(campaign.id);
    setIsSending(true);

    try {
      let campaignToSend = campaign;

      if (campaign.status !== "ready") {
        setIsPreparing(true);
        const prepareResponse = await prepareCampaignRequest(token, campaign.id);
        campaignToSend = prepareResponse.campaign;

        setCampaigns((current) =>
          current.map((item) =>
            item.id === prepareResponse.campaign.id
              ? prepareResponse.campaign
              : item
          )
        );
        setSelectedCampaign(prepareResponse.campaign);
        setIsPreparing(false);
      }

      const response = await sendCampaignRequest(token, campaignToSend.id);

      setCampaigns((current) =>
        current.map((item) =>
          item.id === response.campaign.id ? response.campaign : item
        )
      );
      setSelectedCampaign(response.campaign);
      if (response.queued) {
        showToast(
          "success",
          `Campanha adicionada a fila com ${response.total_count} destinatario${
            response.total_count === 1 ? "" : "s"
          }.`
        );
      } else {
        showToast(
          response.failed_count ? "error" : "success",
          `${response.sent_count} enviada${
            response.sent_count === 1 ? "" : "s"
          }, ${response.failed_count} falha${
            response.failed_count === 1 ? "" : "s"
          }.`
        );
      }
      await loadPreview(response.campaign);
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsPreparing(false);
      setIsSending(false);
      setBusyCampaignId(null);
    }
  }

  async function cancelCampaign(campaign: Campaign) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setBusyCampaignId(campaign.id);

    try {
      const canceledCampaign = await cancelCampaignRequest(token, campaign.id);

      setCampaigns((current) =>
        current.map((item) =>
          item.id === canceledCampaign.id ? canceledCampaign : item
        )
      );

      if (selectedCampaign?.id === canceledCampaign.id) {
        setSelectedCampaign(canceledCampaign);
        resetDetails();
      }

      showToast("success", "Campanha cancelada.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyCampaignId(null);
    }
  }

  async function retryFailedCampaign(campaign: Campaign) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setBusyCampaignId(campaign.id);

    try {
      const response = await retryFailedCampaignRequest(token, campaign.id);

      setCampaigns((current) =>
        current.map((item) =>
          item.id === response.campaign.id ? response.campaign : item
        )
      );
      setSelectedCampaign(response.campaign);
      showToast(
        "success",
        `${response.total_count} falha${
          response.total_count === 1 ? "" : "s"
        } adicionada${response.total_count === 1 ? "" : "s"} a fila.`
      );
      await loadPreview(response.campaign);
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyCampaignId(null);
    }
  }

  return {
    isPreparing,
    isSending,
    busyCampaignId,
    prepareCampaign,
    sendCampaign,
    retryFailedCampaign,
    cancelCampaign,
  };
}
