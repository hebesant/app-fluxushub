"use client";

import {
  ArrowUpRight,
  MessageCircle,
  QrCode,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";

const metrics = [
  {
    label: "Conexao WhatsApp",
    value: "QR Code",
    detail: "Configure a primeira instancia",
    icon: QrCode,
  },
  {
    label: "Contatos",
    value: "Base",
    detail: "Cadastre seus primeiros clientes",
    icon: UsersRound,
  },
  {
    label: "Envios",
    value: "Depois",
    detail: "Entram apos conectar a instancia",
    icon: MessageCircle,
  },
];

const steps = [
  ["1", "Conectar WhatsApp", "Crie uma instancia e use o QR Code quando a Evolution entrar."],
  ["2", "Cadastrar contatos", "Organize os primeiros clientes com nome, telefone e tags."],
  ["3", "Enviar teste", "Depois da conexao real, validamos uma mensagem controlada."],
];

export function DashboardHome() {
  const { user } = useCurrentUser();
  const workspaceName = user?.memberships[0]?.workspace_name ?? "sua loja";

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
              {workspaceName} pronta para conectar o primeiro WhatsApp.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
              O MVP começa com QR Code, instancia conectada e contatos. Campanhas
              entram depois que esse fluxo estiver confiavel.
            </p>
          </div>

          <Button
            asChild
            className="h-11 rounded-lg bg-primary-500 px-5 text-white shadow-[0_0_36px_rgba(1,73,247,0.42)] hover:bg-primary-400"
          >
            <Link href="/whatsapp">
              Conectar WhatsApp
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Onboarding</h3>
            <Button
              asChild
              variant="outline"
              className="border-white/10 bg-white/8 text-white hover:bg-white/15"
            >
              <Link href="/contacts">Abrir contatos</Link>
            </Button>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
            {steps.map(([number, title, description]) => (
              <div
                key={title}
                className="grid grid-cols-[44px_1fr] items-start gap-4 border-b border-white/10 px-4 py-4 text-sm last:border-b-0"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-500 text-xs font-semibold text-white">
                  {number}
                </span>
                <span>
                  <span className="block font-medium text-white">{title}</span>
                  <span className="mt-1 block text-neutral-300">{description}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
          <h3 className="text-lg font-semibold">Conexao via QR Code</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-white px-4 py-3 text-neutral-950">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageCircle className="size-4 text-primary-500" />
                Foco atual
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                Criar a instancia no app, depois plugar a Evolution API para gerar
                o QR Code real.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-4">
                <p className="text-xs text-neutral-400">Status inicial</p>
                <p className="mt-1 text-2xl font-semibold">Offline</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-4">
                <p className="text-xs text-neutral-400">Metodo</p>
                <p className="mt-1 text-2xl font-semibold">QR</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
