import type { CampaignForm } from "../types";

export type CampaignFormChangeHandler = <K extends keyof CampaignForm>(
  field: K,
  value: CampaignForm[K]
) => void;

export type CampaignFormStep = 1 | 2 | 3;
