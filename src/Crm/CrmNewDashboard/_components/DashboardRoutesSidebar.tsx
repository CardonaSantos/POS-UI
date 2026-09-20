"use client";

import * as React from "react";

import { AlertTriangle, Route, Users } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";

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

  const totalClientesRuta = React.useMemo(
    () => rutas.reduce((acc, ruta) => acc + Number(ruta.totalClientes || 0), 0),
    [rutas],
  );

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="h-full min-h-0 min-w-0 overflow-hidden p-2"
    >
      <div className="flex h-full min-h-0 flex-col gap-1.5">
        {/* HEADER */}
        <AppInline
          gap="xs"
          align="center"
          justify="between"
          className="min-w-0 shrink-0"
        >
          <AppInline gap="xs" align="center" className="min-w-0">
            <Route className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

            <h2 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
              Rutas y cobros
            </h2>
          </AppInline>
        </AppInline>

        {/* RESUMEN */}
        <div className="grid shrink-0 grid-cols-2 gap-1">
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

        {/*
         * ========================================================
         * DOS MITADES REALES
         * ========================================================
         *
         * Ambas disponen exactamente del mismo espacio.
         * Cuando la lista supera su mitad, aparece scroll.
         */}
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-1.5">
          {/* RUTAS */}
          <section className="min-h-0 min-w-0 overflow-hidden border-t border-[hsl(var(--app-border,var(--border)))] pt-1">
            <DashboardActiveRoutesList rutas={rutas} />
          </section>

          {/* MOROSOS */}
          <section className="min-h-0 min-w-0 overflow-hidden border-t border-[hsl(var(--app-border,var(--border)))] pt-1">
            <DashboardTopMorososList morosos={morosos} />
          </section>
        </div>
      </div>
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
        "flex h-6 min-w-0 items-center justify-between gap-1",
        "rounded-[var(--app-radius-sm)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.12)]",
        "px-1.5",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-1">
        <AppBadge
          size="xs"
          tone={tone}
          appearance="soft"
          radius="sm"
          className="h-3.5 min-h-3.5 px-0.5 [&_svg]:size-2.5"
        >
          {icon}
        </AppBadge>

        <span className="truncate text-[9px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-[12px] font-semibold leading-none tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </span>
    </div>
  );
}
