import { Check, ChevronRight } from "lucide-react";
import type { CampaignFormStep } from "./campaignFormTypes";

const steps: Array<{ id: CampaignFormStep; label: string }> = [
  { id: 1, label: "Conteudo" },
  { id: 2, label: "Publico" },
  { id: 3, label: "Envio" },
];

type CampaignFormStepperProps = {
  currentStep: CampaignFormStep;
};

export function CampaignFormStepper({ currentStep }: CampaignFormStepperProps) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
        Etapa {currentStep} de {steps.length}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
                currentStep === step.id
                  ? "border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                  : step.id < currentStep
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100"
                    : "border-border bg-muted/45 text-muted-foreground dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.id < currentStep
                    ? "bg-emerald-500 text-white"
                    : currentStep === step.id
                      ? "bg-primary-500 text-white"
                      : "bg-background text-muted-foreground dark:bg-neutral-900"
                }`}
              >
                {step.id < currentStep ? <Check className="size-4" /> : step.id}
              </span>
              <span>
                <span className="block text-xs">Passo {step.id}</span>
                <span className="font-medium">{step.label}</span>
              </span>
            </button>
            {index < steps.length - 1 ? (
              <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
