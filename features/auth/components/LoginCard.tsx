"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest, formatApiError, saveTokens, type AuthResponse } from "@/lib/api";

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<AuthResponse>("/api/auth/token/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveTokens(response);
      router.push("/dashboard");
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-950/72 p-6 text-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl backdrop-saturate-150">
      <div>
        <p className="text-xl font-semibold">FluxusHub</p>
        <h1 className="mt-8 text-3xl font-semibold">Entre no painel</h1>
        <p className="mt-3 leading-7 text-neutral-300">
          Continue suas campanhas, acompanhe a fila e ajuste automacoes.
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-neutral-200">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            required
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-200">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
            required
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <Button
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-primary-500 text-white shadow-[0_0_36px_rgba(1,73,247,0.42)] hover:bg-primary-400"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-neutral-400">
          Ainda nao tem acesso? Fale com o suporte para ativar sua empresa.
        </p>
      </form>
    </section>
  );
}
