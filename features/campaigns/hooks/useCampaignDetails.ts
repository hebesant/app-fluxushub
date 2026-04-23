"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  formatApiError,
  getAccessToken,
  type Campaign,
  type CampaignEvent,
  type CampaignPreview,
  type CampaignRecipient,
} from "@/lib/api";
import {
  type CampaignDetailCollection,
  fetchCampaignDetails,
} from "../api/campaignsApi";

type LoadDetailsOptions = {
  reset?: boolean;
  silent?: boolean;
  recipientsPage?: number;
  eventsPage?: number;
  pageSize?: number;
};

type UseCampaignDetailsParams = {
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  showToast: (type: "success" | "error", message: string) => void;
};

const DETAILS_PAGE_SIZE = 20;

export function useCampaignDetails({
  setCampaigns,
  showToast,
}: UseCampaignDetailsParams) {
  const [preview, setPreview] = useState<CampaignPreview | null>(null);
  const [recipients, setRecipients] = useState<CampaignRecipient[]>([]);
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [recipientDetails, setRecipientDetails] = useState<
    CampaignDetailCollection<CampaignRecipient>
  >(() => createEmptyDetailCollection());
  const [eventDetails, setEventDetails] = useState<
    CampaignDetailCollection<CampaignEvent>
  >(() => createEmptyDetailCollection());
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const resetDetails = useCallback(() => {
    setPreview(null);
    setRecipients([]);
    setEvents([]);
    setRecipientDetails(createEmptyDetailCollection());
    setEventDetails(createEmptyDetailCollection());
  }, []);

  const loadPreview = useCallback(
    async (campaign: Campaign, options: LoadDetailsOptions = {}) => {
      const token = getAccessToken();
      const shouldReset = options.reset ?? true;

      if (!token) {
        return;
      }

      setSelectedCampaign(campaign);

      if (shouldReset) {
        resetDetails();
      }

      if (!options.silent) {
        setIsPreviewLoading(true);
      }

      try {
        const details = await fetchCampaignDetails(token, campaign.id, {
          recipientsPage: options.recipientsPage,
          eventsPage: options.eventsPage,
          pageSize: options.pageSize ?? DETAILS_PAGE_SIZE,
        });

        setCampaigns((current) =>
          current.map((item) =>
            item.id === details.campaign.id ? details.campaign : item
          )
        );
        setSelectedCampaign(details.campaign);
        setPreview(details.preview);
        setRecipientDetails(details.recipients);
        setEventDetails(details.events);
        setRecipients(details.recipients.items);
        setEvents(details.events.items);
      } catch (requestError) {
        if (!options.silent) {
          showToast("error", formatApiError(requestError));
        }
      } finally {
        if (!options.silent) {
          setIsPreviewLoading(false);
        }
      }
    },
    [resetDetails, setCampaigns, showToast]
  );

  async function loadRecipientsPage(page: number) {
    if (!selectedCampaign) {
      return;
    }

    await loadPreview(selectedCampaign, {
      reset: false,
      recipientsPage: page,
      eventsPage: eventDetails.page,
    });
  }

  async function loadEventsPage(page: number) {
    if (!selectedCampaign) {
      return;
    }

    await loadPreview(selectedCampaign, {
      reset: false,
      recipientsPage: recipientDetails.page,
      eventsPage: page,
    });
  }

  async function openCampaignDetails(campaign: Campaign) {
    setIsRecipientsModalOpen(true);
    await loadPreview(campaign);
  }

  async function openCampaignPreview(campaign: Campaign) {
    setIsPreviewModalOpen(true);
    await loadPreview(campaign);
  }

  useEffect(() => {
    if (
      !isRecipientsModalOpen ||
      !selectedCampaign ||
      selectedCampaign.status !== "sending"
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadPreview(selectedCampaign, {
        reset: false,
        silent: true,
        recipientsPage: recipientDetails.page,
        eventsPage: eventDetails.page,
      });
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [
    eventDetails.page,
    isRecipientsModalOpen,
    loadPreview,
    recipientDetails.page,
    selectedCampaign,
  ]);

  return {
    preview,
    recipients,
    events,
    recipientDetails,
    eventDetails,
    isRecipientsModalOpen,
    isPreviewModalOpen,
    selectedCampaign,
    isPreviewLoading,
    setSelectedCampaign,
    setIsRecipientsModalOpen,
    setIsPreviewModalOpen,
    openCampaignDetails,
    openCampaignPreview,
    loadRecipientsPage,
    loadEventsPage,
    loadPreview,
    clearPreview: resetDetails,
    resetDetails,
  };
}

function createEmptyDetailCollection<T>(): CampaignDetailCollection<T> {
  return {
    items: [],
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: DETAILS_PAGE_SIZE,
  };
}
