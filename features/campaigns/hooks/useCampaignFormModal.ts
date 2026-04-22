import { useEffect, useMemo, useRef, useState } from "react";
import type { CampaignForm } from "../types";
import type { CampaignFormStep } from "../components/campaignFormTypes";
import {
  maxVideoSizeBytes,
  parseCampaignTargetTags,
} from "../components/campaignFormUtils";

type UseCampaignFormModalParams = {
  form: CampaignForm;
  availableTags: string[];
  availableLists: string[];
  onChange: <K extends keyof CampaignForm>(
    field: K,
    value: CampaignForm[K]
  ) => void;
};

export function useCampaignFormModal({
  form,
  availableTags,
  availableLists,
  onChange,
}: UseCampaignFormModalParams) {
  const [currentStep, setCurrentStep] = useState<CampaignFormStep>(1);
  const [mediaError, setMediaError] = useState("");
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);
  const localPreviewUrl = useMemo(
    () => (form.media_file ? URL.createObjectURL(form.media_file) : ""),
    [form.media_file]
  );
  const mediaPreviewUrl = localPreviewUrl || form.media_file_url;
  const selectedTags = useMemo(
    () => parseCampaignTargetTags(form.target_tag),
    [form.target_tag]
  );
  const selectedTagIsValid =
    selectedTags.length > 0 &&
    selectedTags.every((tag) => availableTags.includes(tag));
  const selectedListIsValid = availableLists.includes(form.target_list);
  const canContinueContent =
    Boolean(form.name.trim()) && Boolean(form.message_template.trim());
  const canContinueAudience =
    form.target_type === "all" ||
    (form.target_type === "tag" && selectedTagIsValid) ||
    (form.target_type === "list" && selectedListIsValid);
  const canContinueCurrentStep =
    currentStep === 1 ? canContinueContent : canContinueAudience;
  const canSubmit =
    canContinueContent && canContinueAudience && Boolean(form.whatsapp_instance);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  function handleMediaFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    const isVideo =
      file?.type === "video/mp4" || file?.name.toLowerCase().endsWith(".mp4");

    if (file && isVideo && file.size > maxVideoSizeBytes) {
      event.target.value = "";
      setMediaError("O video deve ter no maximo 10 MB.");
      clearMedia();
      return;
    }

    setMediaError("");
    onChange("media_file", file);
    onChange("media_type", file ? (isVideo ? "video" : "image") : "none");
    onChange("media_file_url", null);
  }

  function removeMedia() {
    setMediaError("");
    clearMedia();
  }

  function goNext() {
    if (!canContinueCurrentStep) {
      return;
    }

    setCurrentStep((step) => Math.min(3, step + 1) as CampaignFormStep);
  }

  function goBack() {
    setCurrentStep((step) => Math.max(1, step - 1) as CampaignFormStep);
  }

  function handleTargetTypeChange(value: CampaignForm["target_type"]) {
    onChange("target_type", value);

    if (value !== "tag") {
      onChange("target_tag", "");
    }

    if (value !== "list") {
      onChange("target_list", "");
    }
  }

  function toggleTargetTag(tag: string) {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((currentTag) => currentTag !== tag)
      : [...selectedTags, tag];

    onChange("target_tag", nextTags.join(","));
  }

  function applyTextFormat(prefix: "*" | "_", fallbackText: string) {
    const textarea = messageTextareaRef.current;
    const currentMessage = form.message_template;
    const selectionStart = textarea?.selectionStart ?? currentMessage.length;
    const selectionEnd = textarea?.selectionEnd ?? currentMessage.length;
    const selectedText = currentMessage.slice(selectionStart, selectionEnd);
    const textToWrap = selectedText || fallbackText;
    const formattedText = `${prefix}${textToWrap}${prefix}`;
    const nextMessage = `${currentMessage.slice(
      0,
      selectionStart
    )}${formattedText}${currentMessage.slice(selectionEnd)}`;

    onChange("message_template", nextMessage);

    window.setTimeout(() => {
      textarea?.focus();
      const cursorStart = selectionStart + 1;
      const cursorEnd = cursorStart + textToWrap.length;
      textarea?.setSelectionRange(cursorStart, cursorEnd);
    }, 0);
  }

  function clearMedia() {
    onChange("media_type", "none");
    onChange("media_file", null);
    onChange("media_file_url", null);
  }

  return {
    currentStep,
    mediaError,
    mediaPreviewUrl,
    messageTextareaRef,
    selectedTagIsValid,
    selectedTags,
    selectedListIsValid,
    canContinueCurrentStep,
    canSubmit,
    goNext,
    goBack,
    handleTargetTypeChange,
    toggleTargetTag,
    applyTextFormat,
    handleMediaFileChange,
    removeMedia,
  };
}
