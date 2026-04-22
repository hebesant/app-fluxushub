import { ModalCloseButton } from "@/components/ui/modal-close-button";
import type { WhatsAppInstance } from "@/lib/api";
import type { CampaignForm } from "../types";
import { CampaignAudienceStep } from "./CampaignAudienceStep";
import { CampaignContentStep } from "./CampaignContentStep";
import { CampaignFormFooter } from "./CampaignFormFooter";
import { CampaignFormHeader } from "./CampaignFormHeader";
import { CampaignFormStepper } from "./CampaignFormStepper";
import { CampaignReviewStep } from "./CampaignReviewStep";
import { useCampaignFormModal } from "../hooks/useCampaignFormModal";

type CampaignFormModalProps = {
  form: CampaignForm;
  workspaceTimezone: string;
  connectedInstances: WhatsAppInstance[];
  instances: WhatsAppInstance[];
  availableTags: string[];
  availableLists: string[];
  isEditing: boolean;
  isSubmitting: boolean;
  onChange: <K extends keyof CampaignForm>(
    field: K,
    value: CampaignForm[K]
  ) => void;
  onInsertVariable: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSaveDraft: () => void;
  onSendCampaign: () => void;
};

export function CampaignFormModal({
  form,
  workspaceTimezone,
  connectedInstances,
  instances,
  availableTags,
  availableLists,
  isEditing,
  isSubmitting,
  onChange,
  onInsertVariable,
  onCancel,
  onSubmit,
  onSaveDraft,
  onSendCampaign,
}: CampaignFormModalProps) {
  const instanceOptions = connectedInstances.length ? connectedInstances : instances;
  const modalState = useCampaignFormModal({
    form,
    availableTags,
    availableLists,
    onChange,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
      >
        <ModalCloseButton onClick={onCancel} />

        <CampaignFormHeader isEditing={isEditing} />

        <CampaignFormStepper currentStep={modalState.currentStep} />

        {modalState.currentStep === 1 ? (
          <CampaignContentStep
            form={form}
            mediaPreviewUrl={modalState.mediaPreviewUrl}
            mediaError={modalState.mediaError}
            messageTextareaRef={modalState.messageTextareaRef}
            onChange={onChange}
            onInsertVariable={onInsertVariable}
            onApplyTextFormat={modalState.applyTextFormat}
            onMediaFileChange={modalState.handleMediaFileChange}
            onRemoveMedia={modalState.removeMedia}
          />
        ) : null}

        {modalState.currentStep === 2 ? (
          <CampaignAudienceStep
            form={form}
            availableTags={availableTags}
            availableLists={availableLists}
            selectedTags={modalState.selectedTags}
            selectedTagIsValid={modalState.selectedTagIsValid}
            selectedListIsValid={modalState.selectedListIsValid}
            onChange={onChange}
            onTargetTypeChange={modalState.handleTargetTypeChange}
            onToggleTargetTag={modalState.toggleTargetTag}
          />
        ) : null}

        {modalState.currentStep === 3 ? (
          <CampaignReviewStep
            form={form}
            instanceOptions={instanceOptions}
            instances={instances}
            mediaPreviewUrl={modalState.mediaPreviewUrl}
            workspaceTimezone={workspaceTimezone}
            onChange={onChange}
          />
        ) : null}

        <CampaignFormFooter
          currentStep={modalState.currentStep}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          canContinueCurrentStep={modalState.canContinueCurrentStep}
          canSubmit={modalState.canSubmit}
          primaryActionLabel={
            form.schedule_type === "scheduled" ? "Agendar disparo" : "Enviar disparo"
          }
          primaryActionLoadingLabel={
            form.schedule_type === "scheduled" ? "Agendando..." : "Enviando..."
          }
          onCancel={onCancel}
          onGoBack={modalState.goBack}
          onGoNext={modalState.goNext}
          onSaveDraft={onSaveDraft}
          onSendCampaign={onSendCampaign}
        />
      </form>
    </div>
  );
}
