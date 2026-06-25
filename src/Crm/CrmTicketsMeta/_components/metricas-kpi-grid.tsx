"use client";

import * as React from "react";
import { Clock, Target, Ticket, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { TicketsActuales } from "./types";
import { getTicketsActualesSummary } from "./metricas.helpers";

interface MetricasKpiGridProps {
  ticketsActuales: TicketsActuales | null;
  resueltosDelMes: number;
}

const icons = [Target, Clock, TrendingUp, Ticket, Target];

function getToneClasses(tone: "primary" | "success" | "warning" | "info") {
  if (tone === "success") {
    return {
      icon: "bg-[hsl(var(--app-success)/0.12)] text-[hsl(var(--app-success))]",
      value: "text-[hsl(var(--app-success))]",
    };
  }

  if (tone === "warning") {
    return {
      icon: "bg-[hsl(var(--app-warning)/0.12)] text-[hsl(var(--app-warning))]",
      value: "text-[hsl(var(--app-warning))]",
    };
  }

  if (tone === "info") {
    return {
      icon: "bg-[hsl(var(--app-info)/0.12)] text-[hsl(var(--app-info))]",
      value: "text-[hsl(var(--app-info))]",
    };
  }

  return {
    icon: "bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]",
    value: "text-[hsl(var(--app-primary))]",
  };
}

export function MetricasKpiGrid({
  ticketsActuales,
  resueltosDelMes,
}: MetricasKpiGridProps) {
  const items = React.useMemo(
    () => getTicketsActualesSummary(ticketsActuales, resueltosDelMes),
    [ticketsActuales, resueltosDelMes],
  );

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 5 }} gap="xs">
      {items.map((item, index) => {
        const Icon = icons[index] ?? Target;
        const toneClasses = getToneClasses(item.tone);

        return (
          <AppCard
            key={item.label}
            variant="outline"
            size="xs"
            className="h-full px-3 py-2"
          >
            <AppInline align="center" justify="between" gap="sm">
              <AppInline align="center" gap="xs" className="min-w-0">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)]",
                    toneClasses.icon,
                  )}
                >
                  <Icon size={13} />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    {item.label}
                  </p>

                  <p
                    className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                    title={item.description}
                  >
                    {item.description}
                  </p>
                </div>
              </AppInline>

              <span
                className={cn(
                  "shrink-0 text-base font-bold leading-none tabular-nums tracking-tight",
                  toneClasses.value,
                )}
              >
                {item.value}
              </span>
            </AppInline>
          </AppCard>
        );
      })}
    </AppGrid>
  );
}
