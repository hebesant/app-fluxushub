import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
  cancelCampaignRequest,
  fetchCampaignDetails,
  prepareCampaignRequest,
  retryFailedCampaignRequest,
  sendCampaignRequest,
} from "../api/campaignsApi";

type UseCampaignRuntimeActionsParams = {
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  showToast: (type: "success" | "error", message: string) => void;
};

type LoadDetailsOptions = {
  reset?: boolean;
  silent?: boolean;
  recipientsPage?: number;
  eventsPage?: number;
  pageSize?: number;
};

const DETAILS_PAGE_SIZE = 20;

export function useCampaignRuntimeActions({
  setCampaigns,
  showToast,
}: UseCampaignRuntimeActionsParams) {
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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [busyCampaignId, setBusyCampaignId] = useState<number | null>(null);

  function clearPreview() {
    setPreview(null);
  }

  function openRecipientsModal() {
    setIsRecipientsModalOpen(true);
  }

  function closeRecipientsModal() {
    setIsRecipientsModalOpen(false);
  }

  async function openCampaignDetails(campaign: Campaign) {
    setIsRecipientsModalOpen(true);
    await loadPreview(campaign);
  }

  const loadPreview = useCallback(
    async (campaign: Campaign, options: LoadDetailsOptions = {}) => {
      const token = getAccessToken();
      const shouldReset = options.reset ?? true;

      if (!token) {
        return;
      }

      setSelectedCampaign(campaign);

      if (shouldReset) {
        setPreview(null);
        setRecipients([]);
        setEvents([]);
        setRecipientDetails(createEmptyDetailCollection());
        setEventDetails(createEmptyDetailCollection());
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
    [setCampaigns, showToast]
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
        setPreview(null);
        setRecipients([]);
        setEvents([]);
        setRecipientDetails(createEmptyDetailCollection());
        setEventDetails(createEmptyDetailCollection());
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
    preview,
    recipients,
    events,
    recipientDetails,
    eventDetails,
    isRecipientsModalOpen,
    selectedCampaign,
    isPreviewLoading,
    isPreparing,
    isSending,
    busyCampaignId,
    setSelectedCampaign,
    clearPreview,
    openRecipientsModal,
    closeRecipientsModal,
    openCampaignDetails,
    loadRecipientsPage,
    loadEventsPage,
    loadPreview,
    prepareCampaign,
    sendCampaign,
    retryFailedCampaign,
    cancelCampaign,
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
