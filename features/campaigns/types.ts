export type CampaignForm = {
  name: string;
  workspace: string;
  whatsapp_instance: string;
  target_type: "tag" | "list" | "all";
  target_tag: string;
  target_list: string;
  message_template: string;
  send_mode: "slow" | "normal" | "fast";
  schedule_type: "now" | "scheduled";
  scheduled_for_local: string;
  media_type: "none" | "image" | "video";
  media_file: File | null;
  media_file_url: string | null;
};

export type CampaignStatusFilter =
  | "all"
  | "draft"
  | "scheduled"
  | "ready"
  | "sending"
  | "sent"
  | "failed"
  | "canceled";

export type CampaignTargetFilter = "all" | "tag" | "list" | "contacts";

export const initialCampaignForm: CampaignForm = {
  name: "",
  workspace: "",
  whatsapp_instance: "",
  target_type: "tag",
  target_tag: "",
  target_list: "",
  message_template: "Ola {{first_name}}, tudo bem?",
  send_mode: "slow",
  schedule_type: "now",
  scheduled_for_local: "",
  media_type: "none",
  media_file: null,
  media_file_url: null,
};
