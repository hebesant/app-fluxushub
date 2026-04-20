"use client";

import { LogOut, Moon, Search, Settings, Sun, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ThemeMode } from "@/components/layout/AppShell";
import { logout, type UserContext } from "@/lib/api";

export function AppTopbar({
  user,
  theme,
  onToggleTheme,
}: {
  user: UserContext | null;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const router = useRouter();
  const name = user?.full_name || user?.email || "Visitante";
  const initial = name.charAt(0).toUpperCase();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function openSettings() {
    router.push("/settings");
  }

  return (
    <header className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-neutral-950/70 px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl backdrop-saturate-150 light:border-slate-200 light:bg-white/86 light:shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
      <div>
        <p className="text-sm text-neutral-400">Bom dia, {name}</p>
        <h1 className="text-xl font-semibold text-white">
          {user?.memberships[0]?.workspace_name ?? "Painel"}
        </h1>
      </div>

      <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm text-neutral-400 md:flex">
        <Search className="size-4" />
        Buscar campanhas, contatos ou fluxos
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/8 text-white hover:bg-white/15 light:border-slate-200 light:bg-white light:text-slate-700 light:hover:bg-slate-100"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-2 border-white/10 bg-white/8 px-2 text-white hover:bg-white/15 light:border-slate-200 light:bg-white light:text-slate-700 light:hover:bg-slate-100"
              title="Menu do usuario"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold text-white shadow-[0_0_28px_rgba(1,73,247,0.35)]">
                {initial}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>
              <UserRound className="size-4" />
              {name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={openSettings}>
              <Settings className="size-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
