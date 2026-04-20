import type { Campaign, WhatsAppInstance } from "@/lib/api";

export type DashboardData = {
  instances: WhatsAppInstance[];
  contactsCount: number;
  campaigns: Campaign[];
};

export type DashboardChecklistItem = {
  label: string;
  detail: string;
  isDone: boolean;
  href: string;
};

export type DashboardPrimaryAction = {
  href: string;
  label: string;
};

