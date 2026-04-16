import { Button } from "@/components/ui/button";

export function LoginCard() {
  return (
    <section className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-950/72 p-6 text-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl backdrop-saturate-150">
      <div>
        <p className="text-xl font-semibold">FluxusHub</p>
        <h1 className="mt-8 text-3xl font-semibold">Entre no painel</h1>
        <p className="mt-3 leading-7 text-neutral-300">
          Continue suas campanhas, acompanhe a fila e ajuste automacoes.
        </p>
      </div>

      <form className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-200">E-mail</span>
          <input
            type="email"
            placeholder="voce@empresa.com"
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-200">Senha</span>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
          />
        </label>

        <Button className="h-11 w-full rounded-lg bg-primary-500 text-white shadow-[0_0_36px_rgba(1,73,247,0.42)] hover:bg-primary-400">
          Entrar
        </Button>
      </form>
    </section>
  );
}
