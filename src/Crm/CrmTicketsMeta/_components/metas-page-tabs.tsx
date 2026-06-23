"use client";

import * as React from "react";
import { BarChart3, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetasPageTab } from "./metas-tecnicos.helpers";

interface MetasPageTabsProps {
  value: MetasPageTab;
  onChange: (value: MetasPageTab) => void;
  disabled?: boolean;
  className?: string;
}

const METAS_PAGE_TABS: Array<{
  value: MetasPageTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "ticketsMeta",
    label: "Metas soporte",
    description: "Objetivos y avance por técnico",
    icon: <ClipboardList size={14} />,
  },
  {
    value: "metricas",
    label: "Métricas",
    description: "Rendimiento técnico y gráficos",
    icon: <BarChart3 size={14} />,
  },
];

function MetasPageTabButton({
  tab,
  active,
  disabled,
  onClick,
}: {
  tab: (typeof METAS_PAGE_TABS)[number];
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group flex min-h-[42px] min-w-0 items-center gap-2 rounded-[var(--app-radius-md)] border px-3 py-2 text-left",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        "disabled:pointer-events-none disabled:opacity-60",
        active
          ? [
              "border-[hsl(var(--app-primary))]",
              "bg-[hsl(var(--app-primary)/0.1)]",
              "text-[hsl(var(--app-primary))]",
            ]
          : [
              "border-[hsl(var(--app-border,var(--border)))]",
              "bg-[hsl(var(--app-background,var(--background)))]",
              "text-[hsl(var(--app-foreground,var(--foreground)))]",
              "hover:bg-[hsl(var(--app-muted,var(--muted))/0.45)]",
            ],
      )}
    >
      <span
        className={cn(
          "shrink-0 transition-colors",
          active
            ? "text-[hsl(var(--app-primary))]"
            : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] group-hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
        )}
      >
        {tab.icon}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold leading-4">
          {tab.label}
        </span>

        <span className="block truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {tab.description}
        </span>
      </span>
    </button>
  );
}

export function MetasPageTabs({
  value,
  onChange,
  disabled,
  className,
}: MetasPageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Secciones de metas técnicas"
      className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}
    >
      {METAS_PAGE_TABS.map((tab) => (
        <MetasPageTabButton
          key={tab.value}
          tab={tab}
          active={value === tab.value}
          disabled={disabled}
          onClick={() => onChange(tab.value)}
        />
      ))}
    </div>
  );
}
