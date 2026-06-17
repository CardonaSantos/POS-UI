import { AppButton } from "../primitives/app-button";
import { AppCard } from "../primitives/app-card";
import { AppInput } from "../primitives/app-input";
import { AppInline } from "../primitives/app-inline";
import { AppStack } from "../primitives/app-stack";
import { AppSwitch } from "../primitives/app-switch";
import { useAppTheme } from "./app-theme-provider";

const PRESET_COLORS = [
  { label: "Verde", value: "#1fc99a" },
  { label: "Azul", value: "#2563eb" },
  { label: "Morado", value: "#7c3aed" },
  { label: "Fucsia", value: "#e11d8f" },
];

export function AppThemeSwitcher() {
  const {
    accentColor,
    appearance,
    setAccentColor,
    setAppearance,
    resetAccentColor,
  } = useAppTheme();

  return (
    <AppCard
      title="Theme"
      description="Personaliza el color principal y el modo de apariencia."
    >
      <AppStack gap="sm">
        <AppInline gap="xs" wrap>
          {PRESET_COLORS.map((color) => (
            <AppButton
              key={color.value}
              size="xs"
              variant={accentColor === color.value ? "primary" : "secondary"}
              onClick={() => setAccentColor(color.value)}
            >
              {color.label}
            </AppButton>
          ))}
        </AppInline>

        <AppInline gap="xs" wrap>
          <input
            type="color"
            value={accentColor}
            onChange={(event) => setAccentColor(event.target.value)}
            className="h-8 w-12 cursor-pointer rounded-md border border-[hsl(var(--app-border))] bg-transparent"
          />

          <AppInput
            size="xs"
            value={accentColor}
            onChange={(event) => setAccentColor(event.target.value)}
            className="max-w-32"
          />

          <AppButton size="xs" variant="secondary" onClick={resetAccentColor}>
            Reset
          </AppButton>
        </AppInline>

        <AppSwitch
          checked={appearance === "dark"}
          onCheckedChange={(checked) => {
            setAppearance(checked ? "dark" : "light");
          }}
          label="Modo oscuro"
          description="Persiste entre recargas."
        />
      </AppStack>
    </AppCard>
  );
}
