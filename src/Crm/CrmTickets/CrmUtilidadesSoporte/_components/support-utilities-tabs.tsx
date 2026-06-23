"use client";
import * as React from "react";
import { CheckCheck, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportUtilityTab } from "./ticket-tags.helpers";

interface SupportUtilitiesTabsProps {
  value: SupportUtilityTab;
  onChange: (value: SupportUtilityTab) => void;
  disabled?: boolean;
}

const SUPPORT_TABS: Array<{
  value: SupportUtilityTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "TicketTags",
    label: "Tags Ticket",
    description: "Etiquetas para clasificar soportes",
    icon: <Ticket size={14} />,
  },
  {
    value: "soluciones",
    label: "Soluciones Ticket",
    description: "Respuestas rápidas y reparaciones comunes",
    icon: <CheckCheck size={14} />,
  },
];

export function SupportUtilitiesTabs({
  value,
  onChange,
  disabled,
}: SupportUtilitiesTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Utilidades de soporte"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {SUPPORT_TABS.map((tab) => {
        const active = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex min-h-[42px] min-w-0 items-center gap-2 rounded-[var(--app-radius-md)] border px-3 py-2 text-left",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
              "disabled:pointer-events-none disabled:opacity-60",
              active
                ? "border-[hsl(var(--app-primary))] bg-[hsl(var(--app-primary)/0.1)] text-[hsl(var(--app-primary))]"
                : "border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] text-[hsl(var(--app-foreground,var(--foreground)))] hover:bg-[hsl(var(--app-muted,var(--muted))/0.45)]",
            )}
          >
            <span
              className={cn(
                "shrink-0",
                active
                  ? "text-[hsl(var(--app-primary))]"
                  : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
              )}
            >
              {tab.icon}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">
                {tab.label}
              </span>
              <span className="block truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {tab.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
