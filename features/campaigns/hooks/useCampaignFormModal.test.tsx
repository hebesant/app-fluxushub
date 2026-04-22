import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { initialCampaignForm, type CampaignForm } from "../types";
import { useCampaignFormModal } from "./useCampaignFormModal";

function renderCampaignFormHook(form: CampaignForm) {
  const onChange = vi.fn();
  const rendered = renderHook(
    ({ currentForm }) =>
      useCampaignFormModal({
        form: currentForm,
        availableTags: ["vip", "promocao"],
        availableLists: ["livia"],
        onChange,
      }),
    { initialProps: { currentForm: form } }
  );

  return { ...rendered, onChange };
}

describe("useCampaignFormModal", () => {
  it("does not advance past audience step without a valid tag", () => {
    const { result } = renderCampaignFormHook({
      ...initialCampaignForm,
      name: "Campanha VIP",
      message_template: "Ola {{first_name}}",
      target_type: "tag",
      target_tag: "",
    });

    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(2);
    expect(result.current.canContinueCurrentStep).toBe(false);

    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(2);
  });

  it("allows the audience step when tag, list or all contacts are valid", () => {
    const { result, rerender } = renderCampaignFormHook({
      ...initialCampaignForm,
      name: "Campanha VIP",
      message_template: "Ola {{first_name}}",
      target_type: "tag",
      target_tag: "vip,promocao",
    });

    act(() => result.current.goNext());
    expect(result.current.currentStep).toBe(2);
    expect(result.current.canContinueCurrentStep).toBe(true);

    rerender({
      currentForm: {
        ...initialCampaignForm,
        name: "Campanha Lista",
        message_template: "Ola {{first_name}}",
        target_type: "list",
        target_list: "livia",
      },
    });
    expect(result.current.canContinueCurrentStep).toBe(true);

    rerender({
      currentForm: {
        ...initialCampaignForm,
        name: "Campanha Todos",
        message_template: "Ola {{first_name}}",
        target_type: "all",
      },
    });
    expect(result.current.canContinueCurrentStep).toBe(true);
  });

  it("clears incompatible target fields when target type changes", () => {
    const { result, onChange } = renderCampaignFormHook({
      ...initialCampaignForm,
      target_type: "tag",
      target_tag: "vip",
      target_list: "livia",
    });

    act(() => result.current.handleTargetTypeChange("list"));

    expect(onChange).toHaveBeenCalledWith("target_type", "list");
    expect(onChange).toHaveBeenCalledWith("target_tag", "");
    expect(onChange).not.toHaveBeenCalledWith("target_list", "");
  });

  it("toggles tags and keeps the payload comma separated", () => {
    const { result, onChange } = renderCampaignFormHook({
      ...initialCampaignForm,
      target_type: "tag",
      target_tag: "vip",
    });

    act(() => result.current.toggleTargetTag("promocao"));
    expect(onChange).toHaveBeenCalledWith("target_tag", "vip,promocao");

    act(() => result.current.toggleTargetTag("vip"));
    expect(onChange).toHaveBeenCalledWith("target_tag", "");
  });

  it("rejects videos larger than the MVP upload limit", () => {
    const { result, onChange } = renderCampaignFormHook(initialCampaignForm);
    const file = new File(["x".repeat(11 * 1024 * 1024)], "video.mp4", {
      type: "video/mp4",
    });
    const event = {
      target: {
        files: [file],
        value: "video.mp4",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => result.current.handleMediaFileChange(event));

    expect(result.current.mediaError).toBe("O video deve ter no maximo 10 MB.");
    expect(event.target.value).toBe("");
    expect(onChange).toHaveBeenCalledWith("media_type", "none");
    expect(onChange).toHaveBeenCalledWith("media_file", null);
    expect(onChange).toHaveBeenCalledWith("media_file_url", null);
  });
});
