import { describe, expect, it } from "vitest";
import type { CampaignForm } from "../types";
import {
  campaignTargetLabel,
  mediaLabel,
  parseCampaignTargetTags,
  renderLocalPreview,
  sendModeLabel,
} from "./campaignFormUtils";

const baseForm: CampaignForm = {
  name: "Campanha Teste",
  workspace: "1",
  whatsapp_instance: "1",
  target_type: "tag",
  target_tag: "vip",
  target_list: "",
  message_template: "Ola {{first_name}}",
  send_mode: "slow",
  media_type: "none",
  media_file: null,
  media_file_url: null,
};

describe("campaign form utils", () => {
  it("renders known contact variables in the local preview", () => {
    expect(
      renderLocalPreview(
        "Ola {{first_name}} de {{email}} no numero {{phone}}"
      )
    ).toBe("Ola Maria de maria@example.com no numero 5511999999999");
  });

  it("returns a stable target label for all supported target types", () => {
    expect(campaignTargetLabel({ ...baseForm, target_type: "all" })).toBe(
      "Todos os contatos"
    );
    expect(
      campaignTargetLabel({
        ...baseForm,
        target_type: "list",
        target_list: "livia",
      })
    ).toBe("livia");
    expect(
      campaignTargetLabel({
        ...baseForm,
        target_type: "tag",
        target_tag: "vip,promocao",
      })
    ).toBe("vip, promocao");
    expect(
      campaignTargetLabel({
        ...baseForm,
        target_type: "tag",
        target_tag: "",
      })
    ).toBe("Tag nao selecionada");
  });

  it("normalizes selected tags from comma separated values", () => {
    expect(parseCampaignTargetTags("vip, promocao, vip")).toEqual([
      "vip",
      "promocao",
    ]);
  });

  it("labels media and send modes used in the MVP campaign flow", () => {
    expect(mediaLabel("none")).toBe("Somente texto");
    expect(mediaLabel("image")).toBe("Imagem com legenda");
    expect(mediaLabel("video")).toBe("Video MP4 com legenda");
    expect(sendModeLabel("slow")).toBe("Lento 12s");
    expect(sendModeLabel("normal")).toBe("Normal 8s");
    expect(sendModeLabel("fast")).toBe("Rapido 5s");
  });
});
