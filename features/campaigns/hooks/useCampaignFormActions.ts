import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import {
  formatApiError,
  getAccessToken,
  type Campaign,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import { saveCampaign } from "../api/campaignsApi";
import { type CampaignForm, initialCampaignForm } from "../types";

type UseCampaignFormActionsParams = {
  activeWorkspace?: Workspace;
  instances: WhatsAppInstance[];
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  setSelectedCampaign: (campaign: Campaign) => void;
  clearPreview: () => void;
  sendCampaignAfterSave: (campaign: Campaign) => Promise<void>;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useCampaignFormActions({
  activeWorkspace,
  instances,
  setCampaigns,
  setSelectedCampaign,
  clearPreview,
  sendCampaignAfterSave,
  showToast,
}: UseCampaignFormActionsParams) {
  const [form, setForm] = useState(initialCampaignForm);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof CampaignForm>(
    field: K,
    value: CampaignForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function insertVariable(value: string) {
    setForm((current) => ({
      ...current,
      message_template: `${current.message_template}${
        current.message_template ? " " : ""
      }${value}`,
    }));
  }

  function openNewCampaign() {
    setEditingCampaign(null);
    setForm((current) => ({
      ...initialCampaignForm,
      workspace: current.workspace || String(activeWorkspace?.id ?? ""),
      send_mode: activeWorkspace?.default_send_mode ?? "slow",
      whatsapp_instance:
        current.whatsapp_instance ||
        String(
          instances.find((instance) => instance.status === "connected")?.id ??
            instances[0]?.id ??
            ""
        ),
    }));
    setIsFormOpen(true);
  }

  function openEditCampaign(campaign: Campaign) {
    if (!["draft", "scheduled"].includes(campaign.status)) {
      showToast("error", "Apenas rascunhos e agendados podem ser editados.");
      return;
    }

    setEditingCampaign(campaign);
    setForm({
      name: campaign.name,
      workspace: String(campaign.workspace),
      whatsapp_instance: campaign.whatsapp_instance
        ? String(campaign.whatsapp_instance)
        : "",
      target_type: campaign.target_type,
      target_tag: campaign.target_tag,
      target_list: campaign.target_list,
      message_template: campaign.message_template,
      send_mode: campaign.send_mode,
      schedule_type: campaign.status === "scheduled" ? "scheduled" : "now",
      scheduled_for_local: campaign.scheduled_at_local ?? "",
      media_type: campaign.media_type,
      media_file: null,
      media_file_url: campaign.media_file_url,
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingCampaign(null);
  }

  async function saveCurrentCampaign() {
    const token = getAccessToken();

    if (!token) {
      return null;
    }

    const workspaceId = Number(form.workspace || activeWorkspace?.id);
    const savedCampaign = await saveCampaign(
      token,
      form,
      workspaceId,
      editingCampaign?.id
    );
    const isEditing = Boolean(editingCampaign);

    setCampaigns((current) =>
      isEditing
        ? current.map((campaign) =>
            campaign.id === savedCampaign.id ? savedCampaign : campaign
          )
        : [savedCampaign, ...current]
    );
    setSelectedCampaign(savedCampaign);
    setEditingCampaign(null);
    setIsFormOpen(false);
    setForm((current) => ({
      ...initialCampaignForm,
      workspace: current.workspace,
      whatsapp_instance: current.whatsapp_instance,
    }));
    clearPreview();

    return savedCampaign;
  }

  async function handleSaveDraft() {
    setIsSubmitting(true);

    try {
      const savedCampaign = await saveCurrentCampaign();

      if (savedCampaign) {
        showToast(
          "success",
          savedCampaign.status === "scheduled"
            ? editingCampaign
              ? "Agendamento atualizado."
              : "Disparo agendado."
            : editingCampaign
              ? "Rascunho atualizado."
              : "Campanha criada."
        );
      }
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveAndSend() {
    setIsSubmitting(true);

    try {
      const savedCampaign = await saveCurrentCampaign();

      if (savedCampaign) {
        if (form.schedule_type === "scheduled") {
          showToast("success", "Disparo agendado com sucesso.");
        } else {
          await sendCampaignAfterSave(savedCampaign);
        }
      }
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function preventSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return {
    form,
    editingCampaign,
    isFormOpen,
    isSubmitting,
    updateField,
    insertVariable,
    openNewCampaign,
    openEditCampaign,
    closeForm,
    preventSubmit,
    handleSaveDraft,
    handleSaveAndSend,
  };
}
