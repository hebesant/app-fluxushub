import { Button } from "@/components/ui/button";
import type { CampaignFormStep } from "./campaignFormTypes";

type CampaignFormFooterProps = {
  currentStep: CampaignFormStep;
  isEditing: boolean;
  isSubmitting: boolean;
  canContinueCurrentStep: boolean;
  canSubmit: boolean;
  onCancel: () => void;
  onGoBack: () => void;
  onGoNext: () => void;
  onSaveDraft: () => void;
  onSendCampaign: () => void;
};

export function CampaignFormFooter({
  currentStep,
  isEditing,
  isSubmitting,
  canContinueCurrentStep,
  canSubmit,
  onCancel,
  onGoBack,
  onGoNext,
  onSaveDraft,
  onSendCampaign,
}: CampaignFormFooterProps) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button type="button" variant="outline" onClick={onCancel} className="h-10">
        Cancelar
      </Button>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={onGoBack} className="h-10">
            Voltar
          </Button>
        ) : null}

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={onGoNext}
            disabled={!canContinueCurrentStep}
            className="h-10 bg-primary-500 text-white hover:bg-primary-400"
          >
            Proximo
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting || !canSubmit}
              className="h-10"
            >
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Atualizar rascunho"
                  : "Salvar rascunho"}
            </Button>
            <Button
              type="button"
              onClick={onSendCampaign}
              disabled={isSubmitting || !canSubmit}
              className="h-10 bg-emerald-500 text-white hover:bg-emerald-400"
            >
              {isSubmitting ? "Enviando..." : "Enviar disparo"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
