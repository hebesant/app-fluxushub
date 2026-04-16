"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  apiRequest,
  formatApiError,
  saveTokens,
  type AuthResponse,
  type Invitation,
} from "@/lib/api";

export function AcceptInviteCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Convite nao encontrado.");
      setIsLoading(false);
      return;
    }

    apiRequest<Invitation>(`/api/invitations/validate/?token=${encodeURIComponent(token)}`)
      .then(setInvitation)
      .catch((requestError) => setError(formatApiError(requestError)))
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<AuthResponse>("/api/invitations/accept/", {
        method: "POST",
        body: JSON.stringify({
          token,
          full_name: fullName,
          username,
          password,
        }),
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
    <section className="w-full max-w-lg rounded-lg border border-white/10 bg-neutral-950/72 p-6 text-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl backdrop-saturate-150">
      <p className="text-xl font-semibold">FluxusHub</p>
      <h1 className="mt-8 text-3xl font-semibold">Ative seu acesso</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-neutral-300">Validando convite...</p>
      ) : invitation ? (
        <>
          <p className="mt-3 leading-7 text-neutral-300">
            Convite para {invitation.email} em {invitation.workspace_name}.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-neutral-200">Nome completo</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-200">Usuario</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-200">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
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
              {isSubmitting ? "Ativando..." : "Ativar conta"}
            </Button>
          </form>
        </>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error || "Convite invalido."}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-white/8 text-white hover:bg-white/15"
          >
            <Link href="/login">Voltar para login</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
