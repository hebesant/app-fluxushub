"use client";

import { AlertCircle, CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BillingSummary } from "@/lib/api";
import { InfoCard, SettingsPanel } from "./settingsShared";

export function BillingSettingsSection({
  canManageBilling,
  isLoadingBilling,
  billingSummary,
  extraNumbersDraft,
  onExtraNumbersDraftChange,
  isCreatingCheckout,
  isUpdatingExtraNumbers,
  isOpeningPortal,
  onPrimaryAction,
  onOpenPortal,
}: {
  canManageBilling: boolean;
  isLoadingBilling: boolean;
  billingSummary: BillingSummary | null;
  extraNumbersDraft: number;
  onExtraNumbersDraftChange: (value: number) => void;
  isCreatingCheckout: boolean;
  isUpdatingExtraNumbers: boolean;
  isOpeningPortal: boolean;
  onPrimaryAction: () => void;
  onOpenPortal: () => void;
}) {
  const hasManagedStripeSubscription =
    billingSummary?.subscription != null &&
    billingSummary.subscription.status !== "canceled" &&
    billingSummary.has_stripe_customer;
  const primaryButtonLabel = hasManagedStripeSubscription
    ? isUpdatingExtraNumbers
      ? "Atualizando extras..."
      : "Atualizar numeros extras"
    : isCreatingCheckout
      ? "Abrindo checkout..."
      : "Ir para checkout";

  return (
    <SettingsPanel
      icon={CreditCard}
      title="Billing"
      description="Plano atual do workspace, numeros inclusos e cobranca mensal."
    >
      <div className="space-y-5">
        {!canManageBilling ? (
          <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
            Apenas owners podem visualizar e gerenciar billing deste workspace.
          </div>
        ) : null}

        {canManageBilling && isLoadingBilling ? (
          <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
            Carregando dados de billing...
          </div>
        ) : null}

        {canManageBilling && !isLoadingBilling && billingSummary ? (
          <>
            <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-medium text-foreground dark:text-white">
                    {billingSummary.plan.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Billing do workspace {billingSummary.workspace_name}.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {getSubscriptionStatusLabel(billingSummary.subscription?.status)}
                  </Badge>
                  <Badge variant="secondary">
                    Total estimado {formatCurrency(billingSummary.estimated_monthly_total)}
                    /mes
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <InfoCard
                label="Plano base"
                value={formatCurrency(billingSummary.plan.base_price)}
                helper={`${billingSummary.included_numbers} numero incluso por workspace.`}
              />
              <InfoCard
                label="Numero adicional"
                value={formatCurrency(billingSummary.plan.additional_number_price)}
                helper="Cobrado mensalmente por numero extra ativo."
              />
              <InfoCard
                label="Extras atuais"
                value={String(billingSummary.extra_numbers)}
                helper="Quantidade extra atualmente prevista no backend."
              />
              <InfoCard
                label="Limite total"
                value={String(billingSummary.allowed_numbers)}
                helper="Soma do numero incluso com os extras."
              />
              <InfoCard
                label={getCycleLabel(billingSummary.subscription?.status)}
                value={formatDateTime(billingSummary.subscription?.ends_at)}
                helper={getCycleHelper(billingSummary.subscription?.status)}
              />
              <InfoCard
                label="Inicio do ciclo"
                value={formatDateTime(billingSummary.subscription?.starts_at)}
                helper="Data registrada no backend para o ciclo atual da assinatura."
              />
            </div>

            {!billingSummary.is_stripe_configured ? (
              <div className="rounded-lg border border-amber-300/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:text-amber-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    A integracao com Stripe ainda nao esta configurada neste ambiente.
                  </div>
                </div>
              </div>
            ) : null}

            {billingSummary.is_stripe_configured ? (
              <div className={getStatusMessageClasses(billingSummary.subscription?.status)}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div>{getStatusMessage(billingSummary.subscription?.status)}</div>
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium text-foreground dark:text-white">
                      Assinatura e numeros extras
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Defina quantos numeros adicionais este workspace precisa e siga
                      para o checkout da Stripe.
                    </p>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[220px_auto_auto] lg:items-end">
                    <div>
                      <Label htmlFor="extra_numbers">Numeros adicionais</Label>
                      <Input
                        id="extra_numbers"
                        type="number"
                        min={0}
                        value={String(extraNumbersDraft)}
                        onChange={(event) =>
                          onExtraNumbersDraftChange(
                            Number.parseInt(event.target.value || "0", 10) || 0
                          )
                        }
                        className="mt-2 h-11"
                        disabled={!billingSummary.is_stripe_configured}
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={onPrimaryAction}
                      disabled={
                        !billingSummary.is_stripe_configured ||
                        isCreatingCheckout ||
                        isUpdatingExtraNumbers
                      }
                      className="h-11 bg-primary-500 text-white hover:bg-primary-400"
                    >
                      {primaryButtonLabel}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={onOpenPortal}
                      disabled={
                        !billingSummary.is_stripe_configured ||
                        !billingSummary.has_stripe_customer ||
                        isOpeningPortal
                      }
                      className="h-11"
                    >
                      <ExternalLink className="size-4" />
                      {isOpeningPortal ? "Abrindo portal..." : "Gerenciar cobranca"}
                    </Button>
                  </div>

                  <p className="text-xs leading-5 text-muted-foreground">
                    O checkout cuida da primeira adesao ou da retomada da cobranca.
                    Depois da assinatura ativa, este painel pode ajustar numeros
                    extras diretamente e o Customer Portal da Stripe segue como
                    caminho principal para pagamento e autoatendimento.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </SettingsPanel>
  );
}

function formatCurrency(value: string) {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function getSubscriptionStatusLabel(status?: BillingSummary["subscription"] extends infer T
  ? T extends { status: infer S }
    ? S
    : never
  : never) {
  if (status === "active") {
    return "Ativa";
  }

  if (status === "past_due") {
    return "Pagamento pendente";
  }

  if (status === "canceled") {
    return "Cancelada";
  }

  if (status === "trial") {
    return "Trial";
  }

  return "Sem assinatura Stripe";
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("pt-BR");
}

function getCycleLabel(status?: string) {
  if (status === "trial") {
    return "Fim do trial";
  }

  if (status === "canceled") {
    return "Encerrada em";
  }

  return "Proxima referencia";
}

function getCycleHelper(status?: string) {
  if (status === "trial") {
    return "Quando o trial termina e a cobranca recorrente passa a valer.";
  }

  if (status === "canceled") {
    return "Momento registrado no backend para fim da assinatura.";
  }

  return "Data de referencia atual do ciclo sincronizado com o backend.";
}

function getStatusMessage(status?: string) {
  if (status === "active") {
    return "Assinatura ativa. O workspace segue coberto pelo ciclo atual e pode gerenciar pagamento pelo portal da Stripe.";
  }

  if (status === "trial") {
    return "Workspace em trial. Revise os numeros extras e conclua o checkout antes do fim do periodo para evitar interrupcao.";
  }

  if (status === "past_due") {
    return "Existe pendencia de pagamento. O melhor caminho agora e abrir o portal da Stripe para atualizar metodo de pagamento ou concluir a cobranca.";
  }

  if (status === "canceled") {
    return "A assinatura foi cancelada. Para retomar a cobranca, abra um novo checkout com a configuracao atual de numeros extras.";
  }

  return "Este workspace ainda nao concluiu uma assinatura Stripe. Defina os numeros extras necessarios e siga para o checkout.";
}

function getStatusMessageClasses(status?: string) {
  if (status === "active") {
    return "rounded-lg border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:border-emerald-300/20 dark:text-emerald-100";
  }

  if (status === "past_due" || status === "canceled") {
    return "rounded-lg border border-amber-300/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:text-amber-100";
  }

  return "rounded-lg border border-border bg-muted/45 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40";
}
