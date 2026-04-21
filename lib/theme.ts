export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "fluxushub_theme";
export const THEME_COOKIE_KEY = "fluxushub_theme";
export const THEME_CHANGE_EVENT = "fluxushub-theme-change";

export function getThemeDomainScript() {
  return `((location.hostname==="fluxushub.com.br"||location.hostname.endsWith(".fluxushub.com.br"))?".fluxushub.com.br":"")`;
}

export function getThemeBootstrapScript() {
  return `(function(){try{var storageKey="${THEME_STORAGE_KEY}";var cookieKey="${THEME_COOKIE_KEY}";var cookieMatch=document.cookie.match(new RegExp("(?:^|; )"+cookieKey+"=([^;]+)"));var cookieTheme=cookieMatch?decodeURIComponent(cookieMatch[1]):null;var storedTheme=localStorage.getItem(storageKey);var theme=(cookieTheme==="light"||cookieTheme==="dark")?cookieTheme:((storedTheme==="light"||storedTheme==="dark")?storedTheme:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));document.documentElement.classList.toggle("light",theme==="light");document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.dataset.theme=theme;localStorage.setItem(storageKey,theme);}catch(e){}})();`;
}
