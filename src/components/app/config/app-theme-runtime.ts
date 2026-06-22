export const APP_ACCENT_STORAGE_KEY = "app:accent-color";
export const APP_APPEARANCE_STORAGE_KEY = "app:appearance";

export type AppAppearance = "light" | "dark" | "system";

function getSystemAppearance(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveAppearance(appearance: AppAppearance): "light" | "dark" {
  if (appearance === "system") {
    return getSystemAppearance();
  }

  return appearance;
}

export function applyAppAppearance(appearance: AppAppearance) {
  if (typeof document === "undefined") return;

  const resolved = resolveAppearance(appearance);
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === "dark");
  root.dataset.appAppearance = appearance;

  localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appearance);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) return null;

  return { r, g, b };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function applyAppAccentColor(hex: string) {
  if (typeof document === "undefined") return;

  const rgb = hexToRgb(hex);
  if (!rgb) return;

  const hsl = rgbToHsl(rgb);
  const root = document.documentElement;

  root.style.setProperty("--app-primary", hsl);
  root.style.setProperty("--app-ring", hsl);
  root.style.setProperty("--app-input-border-focus", hsl);
  root.style.setProperty("--app-button-primary-bg", hsl);
  root.style.setProperty("--app-button-primary-bg-hover", hsl);
  root.style.setProperty("--app-table-row-selected-bg", hsl);

  localStorage.setItem(APP_ACCENT_STORAGE_KEY, hex);
}
