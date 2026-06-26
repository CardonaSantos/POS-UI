import * as React from "react";
import {
  AlertTriangle,
  ChevronRight,
  CircleDollarSign,
  UserRound,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { MorosoTop, RutaActiva } from "../interfaces/dashboard-interfaces";

type AppTone =
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "neutral";

export function DashboardRouteMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: AppTone;
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

export function DashboardActiveRoutesList({ rutas }: { rutas: RutaActiva[] }) {
  return (
    <section
      aria-labelledby="dashboard-rutas-activas"
      className="min-w-0 p-0.5"
    >
      <AppInline
        gap="xs"
        align="center"
        justify="between"
        className="mb-0.5 min-w-0"
      >
        <AppInline gap="xs" align="center" className="min-w-0">
          <CircleDollarSign className="h-3 w-3 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

          <h3
            id="dashboard-rutas-activas"
            className="truncate text-[10px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]"
          >
            Rutas activas
          </h3>
        </AppInline>

        <AppBadge
          size="xs"
          tone="neutral"
          appearance="soft"
          radius="sm"
          className="h-3.5 min-h-3.5 px-1 text-[9px]"
        >
          {rutas.length}
        </AppBadge>
      </AppInline>

      {rutas.length > 0 ? (
        <div
          className={[
            "flex gap-1 overflow-x-auto pb-0.5",
            "lg:block lg:max-h-[6.75rem] lg:space-y-0.5 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          {rutas.map((ruta) => (
            <DashboardRouteItem
              key={`${ruta.nombreRuta}-${ruta.cobrador}`}
              ruta={ruta}
            />
          ))}
        </div>
      ) : (
        <AppEmptyState
          preset="empty"
          variant="dashed"
          size="xs"
          align="left"
          title="Sin rutas activas"
          description="No hay rutas de cobro activas."
        />
      )}
    </section>
  );
}

function DashboardRouteItem({ ruta }: { ruta: RutaActiva }) {
  return (
    <article
      className={[
        "flex h-7 min-w-[10.5rem] max-w-[11rem] items-center justify-between gap-1.5",
        "rounded-[var(--app-radius-sm)]",
        "border border-[hsl(var(--app-primary,var(--primary))/0.22)]",
        "bg-[hsl(var(--app-primary,var(--primary))/0.055)]",
        "px-1.5 py-0.5",
        "lg:min-w-0 lg:max-w-none",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-1">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--app-success))]" />

        <div className="min-w-0">
          <p
            title={ruta.nombreRuta}
            className="truncate text-[11px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]"
          >
            {ruta.nombreRuta || "Ruta sin nombre"}
          </p>

          <AppInline
            gap="xs"
            align="center"
            className="mt-0.5 min-w-0 text-[8.5px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          >
            <UserRound className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{ruta.cobrador || "Sin cobrador"}</span>
          </AppInline>
        </div>
      </div>

      <AppBadge
        size="xs"
        tone="primary"
        appearance="soft"
        radius="sm"
        className="h-4 min-h-4 shrink-0 px-1 text-[9px]"
      >
        {ruta.totalClientes}
      </AppBadge>
    </article>
  );
}

export function DashboardTopMorososList({ morosos }: { morosos: MorosoTop[] }) {
  return (
    <section
      aria-labelledby="dashboard-top-morosos"
      className="flex h-full min-h-0 flex-col p-0.5"
    >
      <AppInline
        gap="xs"
        align="center"
        justify="between"
        className="mb-0.5 min-w-0 shrink-0"
      >
        <AppInline gap="xs" align="center" className="min-w-0">
          <AlertTriangle className="h-3 w-3 shrink-0 text-[hsl(var(--app-danger,var(--destructive)))]" />

          <h3
            id="dashboard-top-morosos"
            className="truncate text-[10px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]"
          >
            Top morosos
          </h3>
        </AppInline>

        <span className="shrink-0 text-[8.5px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          7 días
        </span>
      </AppInline>

      {morosos.length > 0 ? (
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
          {morosos.map((moroso, index) => (
            <DashboardMorosoItem
              key={moroso.id}
              moroso={moroso}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <AppEmptyState
            preset="success"
            variant="dashed"
            size="xs"
            align="left"
            title="Sin morosos destacados"
            description="No hay clientes críticos."
          />
        </div>
      )}
    </section>
  );
}

function DashboardMorosoItem({
  moroso,
  index,
}: {
  moroso: MorosoTop;
  index: number;
}) {
  return (
    <article
      className={[
        "flex h-6 min-w-0 items-center justify-between gap-1.5",
        "rounded-[var(--app-radius-sm)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-card-bg,var(--card)))]",
        "px-1 py-0.5",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span
          className={[
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
            "bg-[hsl(var(--app-danger,var(--destructive))/0.10)]",
            "text-[8px] font-semibold leading-none",
            "text-[hsl(var(--app-danger,var(--destructive)))]",
          ].join(" ")}
        >
          {index + 1}
        </span>

        <span
          title={moroso.nombre}
          className="min-w-0 flex-1 truncate text-[10.5px] font-medium leading-none text-[hsl(var(--app-foreground,var(--foreground)))]"
        >
          {moroso.nombre || "Cliente sin nombre"}
        </span>
      </div>

      <AppInline gap="xs" align="center" className="shrink-0">
        <span className="text-[12px] font-semibold leading-none text-[hsl(var(--app-danger,var(--destructive)))]">
          {moroso.cantidad}
        </span>

        <ChevronRight className="h-2.5 w-2.5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />
      </AppInline>
    </article>
  );
}
