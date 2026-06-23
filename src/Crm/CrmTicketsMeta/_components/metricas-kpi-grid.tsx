"use client";

import * as React from "react";
import { Clock, Target, Ticket, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
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
    <AppGrid cols={{ base: 1, sm: 2, xl: 5 }} gap="sm">
      {items.map((item, index) => {
        const Icon = icons[index] ?? Target;
        const toneClasses = getToneClasses(item.tone);

        return (
          <AppCard
            key={item.label}
            variant="outline"
            size="xs"
            className="h-full"
          >
            <AppInline
              align="center"
              justify="between"
              gap="sm"
              className="p-2"
            >
              <AppStack gap="md" className="min-w-0">
                <AppInline align="center" gap="xs">
                  <p className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    {item.label}
                  </p>

                  <AppBadge tone={item.tone} appearance="soft" size="xs">
                    KPI
                  </AppBadge>
                </AppInline>

                <p
                  className={cn(
                    "text-2xl font-bold tracking-tight",
                    toneClasses.value,
                  )}
                >
                  {item.value}
                </p>

                <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {item.description}
                </p>
              </AppStack>

              <span
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)]",
                  toneClasses.icon,
                )}
              >
                <Icon size={17} />
              </span>
            </AppInline>
          </AppCard>
        );
      })}
    </AppGrid>
  );
}
