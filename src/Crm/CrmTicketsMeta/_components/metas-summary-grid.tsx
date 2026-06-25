"use client";

import * as React from "react";
import { Clock, Target, TrendingUp, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { MetasSummary } from "./metas-tecnicos.helpers";

interface MetasSummaryGridProps {
  summary: MetasSummary;
  className?: string;
}

type SummaryTone = "primary" | "success" | "warning" | "info";

interface SummaryItem {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  tone: SummaryTone;
}

function getToneClasses(tone: SummaryTone) {
  switch (tone) {
    case "success":
      return {
        icon: "bg-[hsl(var(--app-success)/0.12)] text-[hsl(var(--app-success))]",
        value: "text-[hsl(var(--app-success))]",
      };

    case "warning":
      return {
        icon: "bg-[hsl(var(--app-warning)/0.12)] text-[hsl(var(--app-warning))]",
        value: "text-[hsl(var(--app-warning))]",
      };

    case "info":
      return {
        icon: "bg-[hsl(var(--app-info)/0.12)] text-[hsl(var(--app-info))]",
        value: "text-[hsl(var(--app-info))]",
      };

    default:
      return {
        icon: "bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]",
        value: "text-[hsl(var(--app-primary))]",
      };
  }
}

function SummaryStatCard({ item }: { item: SummaryItem }) {
  const toneClasses = getToneClasses(item.tone);

  return (
    <AppCard variant="outline" size="xs" className="h-full px-3 py-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppInline align="center" gap="xs" className="min-w-0">
          <span
            className={cn(
              "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] [&_svg]:h-3.5 [&_svg]:w-3.5",
              toneClasses.icon,
            )}
          >
            {item.icon}
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
}

export function MetasSummaryGrid({
  summary,
  className,
}: MetasSummaryGridProps) {
  const items = React.useMemo<SummaryItem[]>(
    () => [
      {
        label: "Total metas",
        value: summary.totalMetas,
        description: "Registradas",
        icon: <Target size={14} />,
        tone: "primary",
      },
      {
        label: "Activas",
        value: summary.metasActivas,
        description: "Abiertas",
        icon: <Clock size={14} />,
        tone: "success",
      },
      {
        label: "Resueltos",
        value: summary.ticketsResueltos,
        description: "Acumulados",
        icon: <TrendingUp size={14} />,
        tone: "warning",
      },
      {
        label: "Meta total",
        value: summary.metaTotal,
        description: "Objetivo",
        icon: <Trophy size={14} />,
        tone: "info",
      },
    ],
    [summary],
  );

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="xs" className={className}>
      {items.map((item) => (
        <SummaryStatCard key={item.label} item={item} />
      ))}
    </AppGrid>
  );
}
