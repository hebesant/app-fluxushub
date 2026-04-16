import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  MousePointerClick,
  Send,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    label: "Mensagens enviadas",
    value: "128.4k",
    detail: "+18% nos ultimos 7 dias",
    icon: Send,
  },
  {
    label: "Taxa de entrega",
    value: "98.2%",
    detail: "Fila saudavel",
    icon: CheckCircle2,
  },
  {
    label: "Cliques",
    value: "42.8%",
    detail: "Melhor campanha: Abril",
    icon: MousePointerClick,
  },
  {
    label: "Contatos ativos",
    value: "36.9k",
    detail: "3 segmentos em alta",
    icon: UsersRound,
  },
];

const campaigns = [
  ["Lancamento Abril", "WhatsApp", "Ativa", "18k"],
  ["Recuperacao carrinho", "SMS", "Pausada", "7.4k"],
  ["Newsletter clientes", "E-mail", "Agendada", "22k"],
];

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/8 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_70%_24%,rgba(1,73,247,0.34),transparent_34%)]" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">
              Visao geral
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Acompanhe cada disparo sem perder o ritmo da operacao.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
              Campanhas, contatos e automacoes conectados em um painel feito
              para decidir rapido.
            </p>
          </div>

          <Button className="h-11 rounded-lg bg-primary-500 px-5 text-white shadow-[0_0_36px_rgba(1,73,247,0.42)] hover:bg-primary-400">
            Nova campanha
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary-500/90 text-white">
                  <Icon className="size-4" />
                </div>
                <span className="text-xs text-emerald-300">Online</span>
              </div>
              <p className="mt-5 text-sm text-neutral-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-neutral-300">{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Campanhas recentes</h3>
            <Button
              variant="outline"
              className="border-white/10 bg-white/8 text-white hover:bg-white/15"
            >
              Ver todas
            </Button>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
            {campaigns.map(([name, channel, status, queue]) => (
              <div
                key={name}
                className="grid grid-cols-[1fr_110px_110px_80px] items-center gap-4 border-b border-white/10 px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-medium text-white">{name}</span>
                <span className="text-neutral-300">{channel}</span>
                <span className="text-primary-200">{status}</span>
                <span className="text-right text-neutral-300">{queue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
          <h3 className="text-lg font-semibold">Fila inteligente</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-white px-4 py-3 text-neutral-950">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageCircle className="size-4 text-primary-500" />
                Proximo envio
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                4.200 contatos entram na janela ideal as 14:30.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-4">
                <p className="text-xs text-neutral-400">Aguardando</p>
                <p className="mt-1 text-2xl font-semibold">12k</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-4">
                <p className="text-xs text-neutral-400">Prioridade</p>
                <p className="mt-1 text-2xl font-semibold">2.8k</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
