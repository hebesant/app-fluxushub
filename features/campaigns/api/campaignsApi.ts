import {
  apiRequest,
  type Campaign,
  type CampaignEvent,
  type CampaignPrepareResponse,
  type CampaignPreview,
  type CampaignRecipient,
  type CampaignSendResponse,
  type ContactList,
  type ContactTag,
  type PaginatedResponse,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import type {
  CampaignForm,
  CampaignStatusFilter,
  CampaignTargetFilter,
} from "../types";

export type CampaignsQuery = {
  page: number;
  pageSize: number;
  search: string;
  statusFilter: CampaignStatusFilter;
  targetFilter: CampaignTargetFilter;
};

export type CampaignDetailsQuery = {
  recipientsPage?: number;
  eventsPage?: number;
  pageSize?: number;
};

export type CampaignDetailCollection<T> = {
  items: T[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  pageSize: number;
};

export async function fetchCampaignsScreenData(
  token: string,
  query: CampaignsQuery
) {
  const campaignParams = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
  });

  if (query.search.trim()) {
    campaignParams.set("search", query.search.trim());
  }

  if (query.statusFilter !== "all") {
    campaignParams.set("status", query.statusFilter);
  }

  if (query.targetFilter !== "all") {
    campaignParams.set(
      "target_type",
      query.targetFilter === "contacts" ? "all" : query.targetFilter
    );
  }

  const [workspaces, instances, campaigns, tags, lists] = await Promise.all([
    apiRequest<Workspace[]>("/api/workspaces/", { token }),
    apiRequest<WhatsAppInstance[]>("/api/whatsapp-instances/", { token }),
    apiRequest<PaginatedResponse<Campaign>>(`/api/campaigns/?${campaignParams}`, {
      token,
    }),
    apiRequest<PaginatedResponse<ContactTag> | ContactTag[]>("/api/contact-tags/", {
      token,
    }),
    apiRequest<PaginatedResponse<ContactList> | ContactList[]>(
      "/api/contact-lists/",
      { token }
    ),
  ]);
  const tagItems = normalizeMaybePaginated(tags);
  const listItems = normalizeMaybePaginated(lists);

  return {
    workspaces,
    instances,
    campaigns,
    tagNames: tagItems.map((tag) => tag.name),
    listNames: listItems.map((list) => list.name),
  };
}

export function saveCampaign(
  token: string,
  form: CampaignForm,
  workspaceId: number,
  campaignId?: number
) {
  const body = new FormData();

  body.append("workspace", String(workspaceId));
  body.append("whatsapp_instance", String(Number(form.whatsapp_instance)));
  body.append("name", form.name);
  body.append("target_type", form.target_type);
  body.append("target_tag", form.target_tag);
  body.append("target_list", form.target_list);
  body.append("message_template", form.message_template);
  body.append("send_mode", form.send_mode);
  body.append("schedule_type", form.schedule_type);
  body.append("scheduled_for_local", form.scheduled_for_local);
  body.append("media_type", form.media_type);

  if (form.media_file) {
    body.append("media_file", form.media_file);
  }

  return apiRequest<Campaign>(
    campaignId ? `/api/campaigns/${campaignId}/` : "/api/campaigns/",
    {
      method: campaignId ? "PATCH" : "POST",
      token,
      body,
    }
  );
}

export async function fetchCampaignDetails(
  token: string,
  campaignId: number,
  query: CampaignDetailsQuery = {}
) {
  const pageSize = query.pageSize ?? 20;
  const recipientsPage = query.recipientsPage ?? 1;
  const eventsPage = query.eventsPage ?? 1;
  const recipientParams = new URLSearchParams({
    page: String(recipientsPage),
    page_size: String(pageSize),
  });
  const eventParams = new URLSearchParams({
    page: String(eventsPage),
    page_size: String(pageSize),
  });

  const [campaign, preview, recipients, events] = await Promise.all([
    apiRequest<Campaign>(`/api/campaigns/${campaignId}/`, { token }),
    apiRequest<CampaignPreview>(`/api/campaigns/${campaignId}/preview/`, {
      token,
    }),
    apiRequest<PaginatedResponse<CampaignRecipient> | CampaignRecipient[]>(
      `/api/campaigns/${campaignId}/recipients/?${recipientParams}`,
      { token }
    ),
    apiRequest<PaginatedResponse<CampaignEvent> | CampaignEvent[]>(
      `/api/campaigns/${campaignId}/events/?${eventParams}`,
      { token }
    ),
  ]);

  return {
    campaign,
    preview,
    recipients: normalizeDetailCollection(
      recipients,
      recipientsPage,
      pageSize
    ),
    events: normalizeDetailCollection(events, eventsPage, pageSize),
  };
}

export function normalizeDetailCollection<T>(
  response: PaginatedResponse<T> | T[],
  page: number,
  pageSize: number
): CampaignDetailCollection<T> {
  if (Array.isArray(response)) {
    return {
      items: response,
      count: response.length,
      next: null,
      previous: null,
      page,
      pageSize,
    };
  }

  return {
    items: response.results,
    count: response.count,
    next: response.next,
    previous: response.previous,
    page,
    pageSize,
  };
}

function normalizeMaybePaginated<T>(response: PaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function prepareCampaignRequest(token: string, campaignId: number) {
  return apiRequest<CampaignPrepareResponse>(
    `/api/campaigns/${campaignId}/prepare/`,
    {
      method: "POST",
      token,
    }
  );
}

export function sendCampaignRequest(token: string, campaignId: number) {
  return apiRequest<CampaignSendResponse>(`/api/campaigns/${campaignId}/send/`, {
    method: "POST",
    token,
  });
}

export function retryFailedCampaignRequest(token: string, campaignId: number) {
  return apiRequest<CampaignSendResponse>(
    `/api/campaigns/${campaignId}/retry-failed/`,
    {
      method: "POST",
      token,
    }
  );
}

export function cancelCampaignRequest(token: string, campaignId: number) {
  return apiRequest<Campaign>(`/api/campaigns/${campaignId}/cancel/`, {
    method: "POST",
    token,
  });
}
