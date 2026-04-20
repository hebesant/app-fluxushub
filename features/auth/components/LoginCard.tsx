"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FluxusLogo } from "@/components/brand/FluxusLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card className="w-full max-w-md border-border/70 bg-card/92 shadow-[0_24px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-neutral-950/72 dark:shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
      <CardHeader className="p-6 pb-0">
        <FluxusLogo
          variant="wordmark"
          tone="auto"
          imageClassName="h-8 w-auto"
        />
        <CardTitle className="mt-8 text-3xl font-semibold">Entre no painel</CardTitle>
        <p className="mt-3 leading-7 text-muted-foreground">
          Continue suas campanhas, acompanhe a fila e ajuste automacoes.
        </p>
      </CardHeader>

      <CardContent className="p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <Label>E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
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
            placeholder="Digite sua senha"
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
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-neutral-400">
          Ainda nao tem acesso? Fale com o suporte para ativar sua empresa.
        </p>
      </form>
      </CardContent>
    </Card>
  );
}
