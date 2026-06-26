import { Link } from "react-router-dom";
import {
  ChevronRight,
  CircleUserRound,
  Settings,
  UserRound,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";

import type { TicketsDashboardSoporte } from "../interfaces/dashboard-interfaces";

export function DashboardSupportTicketItem({
  ticket,
}: {
  ticket: TicketsDashboardSoporte["tickets"][number];
}) {
  const acompanantes = getAcompanantes(ticket.acompanantes);

  const MAX_ACOMPANANTES_VISIBLE = 1;
  const visibles = acompanantes.slice(0, MAX_ACOMPANANTES_VISIBLE);
  const restantes = Math.max(acompanantes.length - visibles.length, 0);

  return (
    <Link
      to={`/crm/ticket-detalles/${ticket.id}`}
      className={[
        "group block min-w-[11.25rem] max-w-[12rem]",
        "rounded-[var(--app-radius-sm)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        "xl:min-w-0 xl:max-w-none",
      ].join(" ")}
      aria-label={`Abrir ticket ${ticket.titulo || ticket.id}`}
    >
      <article
        className={[
          "flex h-[3.05rem] min-w-0 items-center justify-between gap-1.5",
          "rounded-[var(--app-radius-sm)]",
          "border border-[hsl(var(--app-primary,var(--primary))/0.24)]",
          "bg-[hsl(var(--app-primary,var(--primary))/0.055)]",
          "px-1.5 py-0.5",
          "transition active:scale-[var(--app-motion-scale-press)]",
          "group-hover:border-[hsl(var(--app-primary,var(--primary))/0.42)]",
          "group-hover:bg-[hsl(var(--app-primary,var(--primary))/0.08)]",
        ].join(" ")}
      >
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <p
              title={ticket.titulo}
              className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]"
            >
              {ticket.titulo || `Ticket #${ticket.id}`}
            </p>

            <AppBadge
              size="xs"
              tone="warning"
              appearance="soft"
              radius="sm"
              className="mt-0.5 h-3.5 min-h-3.5 shrink-0 px-1 text-[8.5px] [&_svg]:size-2.5"
            >
              <Settings className="h-2.5 w-2.5 animate-spin" />
            </AppBadge>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[8.5px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            <CircleUserRound className="h-2.5 w-2.5 shrink-0" />

            <span title={ticket.cliente} className="min-w-0 flex-1 truncate">
              {ticket.cliente || "Cliente no registrado"}
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-1 overflow-hidden">
            <DashboardSupportPersonChip
              label="Tec"
              name={ticket.tecnico || "Sin técnico"}
              tone={ticket.tecnico ? "primary" : "neutral"}
            />

            {visibles.map((nombre, index) => (
              <DashboardSupportPersonChip
                key={`${ticket.id}-acompanante-${index}`}
                label="A"
                name={nombre}
                tone="info"
              />
            ))}

            {restantes > 0 ? (
              <AppBadge
                size="xs"
                tone="neutral"
                appearance="soft"
                radius="sm"
                className="h-3.5 min-h-3.5 shrink-0 px-1 text-[8.5px]"
              >
                +{restantes}
              </AppBadge>
            ) : null}
          </div>
        </div>

        <ChevronRight className="h-3 w-3 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />
      </article>
    </Link>
  );
}
function DashboardSupportPersonChip({
  label,
  name,
  tone,
}: {
  label: string;
  name: string;
  tone: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <AppBadge
      size="xs"
      tone={tone}
      appearance="soft"
      radius="sm"
      className="h-4 min-h-4 max-w-full justify-start px-1 text-[9px]"
    >
      <UserRound className="h-2.5 w-2.5 shrink-0" />
      <span className="shrink-0">{label}:</span>
      <span className="truncate">{name}</span>
    </AppBadge>
  );
}

function getAcompanantes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}
