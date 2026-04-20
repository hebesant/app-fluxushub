import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html lang="pt-BR" className={cn("dark font-sans", geist.variable)}>
      <body className={cn(inter.className, "bg-neutral-950 text-white")}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
