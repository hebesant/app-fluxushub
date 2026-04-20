"use client";

import { useEffect, useSyncExternalStore } from "react";
import { FluxusLogo } from "@/components/brand/FluxusLogo";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { useCurrentUser } from "@/lib/auth";

export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "fluxushub_theme";
const THEME_CHANGE_EVENT = "fluxushub-theme-change";

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === "light"
    ? "light"
    : "dark";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoading } = useCurrentUser();
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getStoredTheme,
    (): ThemeMode => "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white light:bg-slate-50 light:text-slate-950">
        <div className="flex flex-col items-center gap-4">
          <FluxusLogo variant="mark" tone="auto" imageClassName="h-10 w-auto" />
          <p className="text-sm text-neutral-300 light:text-slate-500">
            Carregando Fluxus Hub...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white transition-colors light:bg-slate-50 light:text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(125deg,rgba(2,6,23,1)_0%,rgba(2,6,23,0.94)_48%,rgba(1,73,247,0.28)_100%)] light:bg-[linear-gradient(125deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_55%,rgba(219,234,254,1)_100%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_68%_10%,rgba(56,189,248,0.18),transparent_34%)] light:bg-[radial-gradient(circle_at_68%_10%,rgba(1,73,247,0.10),transparent_34%)]" />

      <div className="grid min-h-screen lg:grid-cols-[232px_1fr]">
        <AppSidebar />

        <section className="min-w-0 px-3 py-3 sm:px-4 lg:px-5 lg:col-start-2">
          <AppTopbar user={user} theme={theme} onToggleTheme={toggleTheme} />
          <div className="mx-auto mt-4 max-w-[1600px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
