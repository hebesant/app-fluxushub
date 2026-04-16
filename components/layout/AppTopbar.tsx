import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-neutral-950/70 px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl backdrop-saturate-150">
      <div>
        <p className="text-sm text-neutral-400">Bom dia, Heber</p>
        <h1 className="text-xl font-semibold text-white">Painel de campanhas</h1>
      </div>

      <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm text-neutral-400 md:flex">
        <Search className="size-4" />
        Buscar campanhas, contatos ou fluxos
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/8 text-white hover:bg-white/15"
        >
          <Bell className="size-4" />
        </Button>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold shadow-[0_0_28px_rgba(1,73,247,0.35)]">
          H
        </div>
      </div>
    </header>
  );
}
