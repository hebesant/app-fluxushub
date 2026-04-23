import type { CampaignForm } from "../types";

export const maxVideoSizeBytes = 10 * 1024 * 1024;

export const concreteSendModes = [
  {
    id: "slow",
    name: "Lento",
    detail: "Mais conservador para comecar.",
  },
  {
    id: "normal",
    name: "Normal",
    detail: "Equilibrio para a maioria dos disparos.",
  },
  {
    id: "fast",
    name: "Rapido",
    detail: "Maior ritmo para bases mais quentes.",
  },
] as const;

export function renderLocalPreview(template: string) {
  return template
    .replaceAll("{{name}}", "Maria Cliente")
    .replaceAll("{{first_name}}", "Maria")
    .replaceAll("{{phone}}", "5511999999999")
    .replaceAll("{{email}}", "maria@example.com");
}

export function renderWhatsAppText(message: string) {
  const parts = message.split(/(\*[^*\n]+\*|_[^_\n]+_)/g);

  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <strong key={index}>{part.slice(1, -1)}</strong>;
    }

    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

export function campaignTargetLabel(form: CampaignForm) {
  if (form.target_type === "all") {
    return "Todos os contatos";
  }

  if (form.target_type === "list") {
    return form.target_list || "Lista nao selecionada";
  }

  const tags = parseCampaignTargetTags(form.target_tag);

  if (!tags.length) {
    return "Tag nao selecionada";
  }

  return tags.join(", ");
}

export function parseCampaignTargetTags(value: string) {
  const tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(tags));
}

export function mediaLabel(mediaType: CampaignForm["media_type"]) {
  if (mediaType === "image") {
    return "Imagem com legenda";
  }

  if (mediaType === "video") {
    return "Video MP4 com legenda";
  }

  return "Somente texto";
}

export function sendModeLabel(sendMode: CampaignForm["send_mode"]) {
  const option = concreteSendModes.find((item) => item.id === sendMode);
  return option?.name ?? "Lento";
}

export function scheduleLabel(
  form: Pick<CampaignForm, "schedule_type" | "scheduled_for_local">,
  workspaceTimezone: string
) {
  if (form.schedule_type !== "scheduled" || !form.scheduled_for_local) {
    return "Enviar agora";
  }

  return `${form.scheduled_for_local.replace("T", " ")} (${workspaceTimezone})`;
}
