"use client";

import * as React from "react";
import { Clock, Target, TrendingUp, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

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
    <AppCard variant="outline" size="xs" className="h-full p-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppStack gap="md" className="min-w-0">
          <AppInline align="center" gap="xs">
            <p className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {item.label}
            </p>

            <AppBadge
              tone={item.tone === "info" ? "primary" : item.tone}
              appearance="soft"
              size="xs"
            >
              KPI
            </AppBadge>
          </AppInline>

          <p
            className={cn(
              "truncate text-2xl font-bold tracking-tight",
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
          {item.icon}
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
        description: "Metas registradas",
        icon: <Target size={17} />,
        tone: "primary",
      },
      {
        label: "Metas activas",
        value: summary.metasActivas,
        description: "Metas abiertas",
        icon: <Clock size={17} />,
        tone: "success",
      },
      {
        label: "Tickets resueltos",
        value: summary.ticketsResueltos,
        description: "Resoluciones acumuladas",
        icon: <TrendingUp size={17} />,
        tone: "warning",
      },
      {
        label: "Meta total",
        value: summary.metaTotal,
        description: "Objetivo acumulado",
        icon: <Trophy size={17} />,
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
