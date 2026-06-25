"use client";

import * as React from "react";
import { AlertTriangle, Route, Users } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { MorosoTop, RutaActiva } from "../interfaces/dashboard-interfaces";
import {
  DashboardActiveRoutesList,
  DashboardTopMorososList,
} from "./dashboard-route-metric";

interface DashboardRoutesSidebarProps {
  rutaActiva: RutaActiva[];
  topMorosos: MorosoTop[];
}

export function DashboardRoutesSidebar({
  rutaActiva,
  topMorosos,
}: DashboardRoutesSidebarProps) {
  const rutas = Array.isArray(rutaActiva) ? rutaActiva : [];
  const morosos = Array.isArray(topMorosos) ? topMorosos : [];

  const totalClientesRuta = React.useMemo(() => {
    return rutas.reduce(
      (acc, ruta) => acc + Number(ruta.totalClientes || 0),
      0,
    );
  }, [rutas]);

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="min-w-0 lg:h-full p-2"
    >
      <AppStack gap="xs" className="min-w-0">
        {/* Header compacto */}
        <AppInline
          gap="xs"
          align="center"
          justify="between"
          className="min-w-0"
        >
          <AppInline gap="xs" align="center" className="min-w-0">
            <Route className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

            <div className="min-w-0">
              <h2 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
                Rutas y cobros
              </h2>
            </div>
          </AppInline>

          <AppInline gap="xs" align="center" className="shrink-0">
            <AppBadge size="xs" tone="primary" appearance="soft">
              {rutas.length}
            </AppBadge>

            <AppBadge size="xs" tone="danger" appearance="soft">
              {morosos.length}
            </AppBadge>
          </AppInline>
        </AppInline>

        {/* Métricas ultra compactas */}
        <div className="grid grid-cols-2 gap-1 ">
          <CompactRouteStat
            label="Clientes"
            value={totalClientesRuta}
            tone="primary"
            icon={<Users className="h-3 w-3" />}
          />

          <CompactRouteStat
            label="Morosos"
            value={morosos.length}
            tone="danger"
            icon={<AlertTriangle className="h-3 w-3" />}
          />
        </div>

        {/* Listas */}
        <div className="min-w-0 border-t border-[hsl(var(--app-border,var(--border)))] pt-1.5">
          <DashboardActiveRoutesList rutas={rutas} />
        </div>

        <div className="min-w-0 border-t border-[hsl(var(--app-border,var(--border)))] pt-1.5">
          <DashboardTopMorososList morosos={morosos} />
        </div>
      </AppStack>
    </AppCard>
  );
}

function CompactRouteStat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "primary" | "danger" | "success" | "warning" | "info" | "neutral";
}) {
  return (
    <div
      className={[
        "min-w-0 rounded-[var(--app-radius-sm)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.12)]",
        "px-1.5 py-1",
      ].join(" ")}
    >
      <AppInline gap="xs" align="center" justify="between" className="min-w-0">
        <span className="truncate text-[10px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>

        <AppBadge
          size="xs"
          tone={tone}
          appearance="soft"
          radius="sm"
          className="h-4 min-h-4 px-1"
        >
          {icon}
        </AppBadge>
      </AppInline>

      <p className="mt-0.5 truncate text-[14px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </p>
    </div>
  );
}
