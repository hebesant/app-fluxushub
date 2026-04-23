import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getThemeBootstrapScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Fluxus Hub",
  description: "Painel da Fluxus Hub para campanhas e automacoes.",
  icons: {
    icon: [
      {
        url: "/fluxus-hub-logo-blue.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/fluxus-hub-logo-blue.svg",
    apple: "/fluxus-hub-logo-blue.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="font-sans">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapScript(),
          }}
        />
      </head>
      <body className="bg-neutral-950 text-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
