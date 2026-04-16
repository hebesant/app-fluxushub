import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(125deg,rgba(2,6,23,1)_0%,rgba(2,6,23,0.94)_48%,rgba(1,73,247,0.28)_100%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_68%_10%,rgba(56,189,248,0.18),transparent_34%)]" />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar />

        <section className="min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          <AppTopbar />
          <div className="mx-auto mt-6 max-w-7xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
