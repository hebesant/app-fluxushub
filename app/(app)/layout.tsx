import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/lib/auth";

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
