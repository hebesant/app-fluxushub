export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    enabled: true,
  },
  {
    label: "Contatos",
    href: "/contacts",
    icon: "contacts",
    enabled: true,
  },
  {
    label: "Campanhas",
    href: "/campaigns",
    icon: "campaigns",
    enabled: true,
  },
  {
    label: "WhatsApp",
    href: "/whatsapp",
    icon: "whatsapp",
    enabled: true,
  },
] as const;

export const settingsNavigationItem = {
  label: "Configuracoes",
  href: "/settings",
  icon: "settings",
  enabled: true,
} as const;
