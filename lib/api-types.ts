export type Workspace = {
  id: number;
  name: string;
  slug: string;
  document: string;
  timezone: string;
  default_send_mode: "slow" | "normal" | "fast";
  is_active: boolean;
  created_at: string;
};

export type Plan = {
  id: number;
  name: string;
  base_price: string;
  included_numbers: number;
  additional_number_price: string;
  is_active: boolean;
};

export type Subscription = {
  id: number;
  workspace: number;
  workspace_name: string;
  plan: number;
  plan_name: string;
  extra_numbers: number;
  allowed_numbers: number;
  status: "trial" | "active" | "past_due" | "canceled";
  starts_at: string;
  ends_at: string | null;
  created_at: string;
};

export type BillingSummary = {
  workspace: number;
  workspace_name: string;
  plan: Plan;
  subscription: Subscription | null;
  included_numbers: number;
  extra_numbers: number;
  allowed_numbers: number;
  estimated_monthly_total: string;
  is_stripe_configured: boolean;
  has_stripe_customer: boolean;
};

export type BillingExtraNumbersUpdateResponse = {
  subscription: Subscription;
  summary: BillingSummary;
};

export type Membership = {
  id: number;
  user: number;
  user_email: string;
  user_full_name: string;
  workspace: number;
  workspace_name: string;
  role: "owner" | "admin" | "member";
  created_at: string;
};

export type UserContext = {
  id: number;
  email: string;
  username: string;
  full_name: string;
  memberships: Membership[];
};

export type Contact = {
  id: number;
  workspace: number;
  contact_list_id: number | null;
  name: string;
  phone: string;
  email: string;
  list_name: string;
  notes: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactList = {
  id: number;
  workspace: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type ContactTag = {
  id: number;
  workspace: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type WhatsAppInstance = {
  id: number;
  workspace: number;
  workspace_name: string;
  name: string;
  phone_number: string;
  profile_picture_url: string;
  provider: "evolution";
  provider_instance_id: string;
  evolution_instance_id: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  is_active: boolean;
  created_at: string;
  connected_at: string | null;
};

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "ready"
  | "sending"
  | "sent"
  | "failed"
  | "canceled";

export type Campaign = {
  id: number;
  workspace: number;
  workspace_name: string;
  whatsapp_instance: number | null;
  whatsapp_instance_name: string;
  whatsapp_instance_label: string;
  name: string;
  target_type: "tag" | "list" | "all";
  target_tag: string;
  target_list: string;
  message_template: string;
  send_mode: "slow" | "normal" | "fast";
  media_type: "none" | "image" | "video";
  media_file: string | null;
  media_file_url: string | null;
  status: CampaignStatus;
  scheduled_at: string | null;
  scheduled_at_local: string | null;
  recipients_count: number;
  pending_count: number;
  sent_count: number;
  failed_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type CampaignPreview = {
  total_contacts: number;
  variables: string[];
  allowed_variables: string[];
  samples: Array<{
    contact_id: number;
    name: string;
    phone: string;
    message: string;
  }>;
};

export type CampaignRecipient = {
  id: number;
  campaign: number;
  contact: number;
  contact_name: string;
  contact_email: string;
  phone: string;
  rendered_message: string;
  status: "pending" | "sent" | "failed" | "skipped";
  error_message: string;
  sent_at: string | null;
  created_at: string;
};

export type CampaignEvent = {
  id: number;
  campaign: number;
  event_type:
    | "prepared"
    | "queued"
    | "started"
    | "recipient_sent"
    | "recipient_failed"
    | "canceled"
    | "finished"
    | "failed";
  message: string;
  metadata: Record<string, unknown>;
  created_by: number | null;
  created_by_name: string;
  created_at: string;
};

export type CampaignPrepareResponse = {
  campaign: Campaign;
  created_recipients: number;
  skipped_recipients: number;
  total_contacts: number;
};

export type CampaignSendResponse = {
  campaign: Campaign;
  queued: boolean;
  sent_count: number;
  failed_count: number;
  total_count: number;
};

export type WhatsAppActionResponse = {
  instance: WhatsAppInstance;
  provider?: unknown;
  evolution?: unknown;
  qrcode?: string | null;
  state?: string;
};

export type AuthResponse = {
  access: string;
  refresh?: string;
  user?: UserContext;
  workspace?: Workspace;
};

export type Invitation = {
  id: number;
  email: string;
  workspace: number;
  workspace_name: string;
  role: "owner" | "admin" | "member";
  token: string;
  accept_url: string;
  is_open_link: boolean;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  is_expired: boolean;
  is_accepted: boolean;
  is_valid: boolean;
};
