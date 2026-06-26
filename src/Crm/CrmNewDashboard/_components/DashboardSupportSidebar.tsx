"use client";

import { TicketCheck, Wifi, Wrench, UsersRound, Settings } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

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
      className="flex min-w-0 flex-1 flex-col p-2 xl:h-full xl:min-h-0"
    >
      <AppStack gap="xs" className="flex h-full min-h-0 flex-col">
        {/* Header compacto */}
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
            className="h-4 min-h-4 px-1.5 text-[10px]"
          >
            {tecnicosEnLinea} línea
          </AppBadge>
        </AppInline>

        {/* Métricas compactas */}
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

        <section
          aria-labelledby="dashboard-soporte-en-proceso"
          className={[
            "flex min-w-0 flex-1 flex-col border-t pt-1",
            "border-[hsl(var(--app-border,var(--border)))]",
            "xl:min-h-0",
          ].join(" ")}
        >
          <div className="flex min-w-0 flex-1 flex-col p-1 xl:min-h-0">
            <AppInline
              gap="xs"
              align="center"
              justify="between"
              className="mb-1 min-w-0 shrink-0"
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
                className="h-4 min-h-4 px-1.5 text-[10px]"
              >
                {ticketsEnProceso}
              </AppBadge>
            </AppInline>

            {tickets.length > 0 ? (
              <div
                className={[
                  "flex gap-1 overflow-x-auto pb-0.5",
                  "xl:block xl:min-h-0 xl:flex-1 xl:space-y-1 xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
              >
                {tickets.map((ticket) => (
                  <DashboardSupportTicketItem key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div className="min-h-0 flex-1">
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
          </div>
        </section>
      </AppStack>
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
        "px-1.5 py-0.5",
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

        <span className="min-w-0 truncate text-[9.5px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-[12px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </span>
    </div>
  );
}
