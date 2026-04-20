import {
  apiRequest,
  type Campaign,
  type PaginatedResponse,
  type WhatsAppInstance,
} from "@/lib/api";
import type { DashboardData } from "../types";

export async function fetchDashboardData(token: string): Promise<DashboardData> {
  const [instances, contacts, campaigns] = await Promise.all([
    apiRequest<WhatsAppInstance[]>("/api/whatsapp-instances/", { token }),
    apiRequest<PaginatedResponse<unknown>>("/api/contacts/?page_size=1", {
      token,
    }),
    apiRequest<PaginatedResponse<Campaign>>("/api/campaigns/?page_size=5", {
      token,
    }),
  ]);

  return {
    instances,
    contactsCount: contacts.count,
    campaigns: campaigns.results,
  };
}

