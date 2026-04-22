"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FluxusLogo } from "@/components/brand/FluxusLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [email, setEmail] = useState("");
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
          email,
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
    <Card className="w-full max-w-lg border-border/70 bg-card/92 shadow-[0_24px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-neutral-950/72 dark:shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
      <CardHeader className="p-6 pb-0">
      <FluxusLogo
        variant="wordmark"
        tone="auto"
        imageClassName="h-8 w-auto"
      />
      <CardTitle className="mt-8 text-3xl font-semibold">Ative seu acesso</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Validando convite...</p>
      ) : invitation ? (
        <>
          <p className="leading-7 text-muted-foreground">
            {invitation.is_open_link
              ? `Convite aberto para entrar em ${invitation.workspace_name}.`
              : `Convite para ${invitation.email} em ${invitation.workspace_name}.`}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {invitation.is_open_link ? (
              <label className="block">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 h-11"
                />
              </label>
            ) : null}

            <label className="block">
              <Label>Nome completo</Label>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="mt-2 h-11"
              />
            </label>

            <label className="block">
              <Label>Usuario</Label>
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="mt-2 h-11"
              />
            </label>

            <label className="block">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                className="mt-2 h-11"
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
        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
