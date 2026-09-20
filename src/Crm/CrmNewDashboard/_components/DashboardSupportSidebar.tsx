"use client";

import { Settings, TicketCheck, UsersRound, Wifi, Wrench } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { TicketsDashboardSoporte } from "../interfaces/dashboard-interfaces";

import { DashboardSupportTicketItem } from "./dashboard-support-ticket-item";

interface DashboardSupportSidebarProps {
  ticketsSoporte: TicketsDashboardSoporte;
}

export function DashboardSupportSidebar({
  ticketsSoporte,
}: DashboardSupportSidebarProps) {
  const tickets = Array.isArray(ticketsSoporte.tickets)
    ? ticketsSoporte.tickets
    : [];

  const tecnicosEnLinea = ticketsSoporte.ticketsMetricas?.enLinea ?? 0;

  const ticketsEnProceso = tickets.length;

  const restantes = Math.max(tecnicosEnLinea - ticketsEnProceso, 0);

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
            <TicketCheck className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

            <h2 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
              Soporte técnico
            </h2>
          </AppInline>

          <AppBadge
            size="xs"
            tone="success"
            appearance="soft"
            radius="sm"
            className="h-4 min-h-4 shrink-0 px-1.5 text-[9px]"
          >
            {tecnicosEnLinea} línea
          </AppBadge>
        </AppInline>

        {/* MÉTRICAS */}
        <div className="grid shrink-0 grid-cols-3 gap-1">
          <CompactSupportMetric
            label="Línea"
            value={tecnicosEnLinea}
            tone="success"
            icon={<Wifi className="h-3 w-3" />}
          />

          <CompactSupportMetric
            label="Proceso"
            value={ticketsEnProceso}
            tone="warning"
            icon={<Settings className="h-3 w-3" />}
          />

          <CompactSupportMetric
            label="Libres"
            value={restantes}
            tone="info"
            icon={<UsersRound className="h-3 w-3" />}
          />
        </div>

        {/* TICKETS */}
        <section
          aria-labelledby="dashboard-soporte-en-proceso"
          className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-[hsl(var(--app-border,var(--border)))] pt-1"
        >
          {/* Encabezado siempre visible */}
          <AppInline
            gap="xs"
            align="center"
            justify="between"
            className="mb-1 min-w-0 shrink-0 px-1"
          >
            <AppInline gap="xs" align="center" className="min-w-0">
              <Wrench className="h-3 w-3 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

              <h3
                id="dashboard-soporte-en-proceso"
                className="truncate text-[10px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]"
              >
                Tickets en proceso
              </h3>
            </AppInline>

            <AppBadge
              size="xs"
              tone="warning"
              appearance="soft"
              radius="sm"
              className="h-4 min-h-4 shrink-0 px-1.5 text-[9px]"
            >
              {ticketsEnProceso}
            </AppBadge>
          </AppInline>

          {/* Solo esta parte hace scroll */}
          {tickets.length > 0 ? (
            <div className="dashboard-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-1 pr-1.5">
              <div className="space-y-1">
                {tickets.map((ticket) => (
                  <DashboardSupportTicketItem key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 px-1">
              <AppEmptyState
                preset="empty"
                variant="dashed"
                size="xs"
                align="left"
                title="Sin tickets"
                description="No hay técnicos atendiendo tickets."
              />
            </div>
          )}
        </section>
      </div>
    </AppCard>
  );
}

function CompactSupportMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;

  tone: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
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

        <span className="min-w-0 truncate text-[9px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-[12px] font-semibold leading-none tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </span>
    </div>
  );
}
