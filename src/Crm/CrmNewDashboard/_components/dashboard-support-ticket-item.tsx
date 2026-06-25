import { Link } from "react-router-dom";
import {
  ChevronRight,
  CircleUserRound,
  Settings,
  UserRound,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { TicketsDashboardSoporte } from "../interfaces/dashboard-interfaces";

export function DashboardSupportTicketItem({
  ticket,
}: {
  ticket: TicketsDashboardSoporte["tickets"][number];
}) {
  const acompanantes = getAcompanantes(ticket.acompanantes);

  const MAX_ACOMPANANTES_VISIBLE = 2;
  const visibles = acompanantes.slice(0, MAX_ACOMPANANTES_VISIBLE);
  const restantes = Math.max(acompanantes.length - visibles.length, 0);

  return (
    <Link
      to={`/crm/ticket-detalles/${ticket.id}`}
      className={[
        "group block min-w-[10.5rem] max-w-[11.5rem]",
        "rounded-[var(--app-radius-sm)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        "xl:min-w-0 xl:max-w-none",
      ].join(" ")}
      aria-label={`Abrir ticket ${ticket.titulo || ticket.id}`}
    >
      <article
        className={[
          "min-w-0 rounded-[var(--app-radius-sm)]",
          "border border-[hsl(var(--app-primary,var(--primary))/0.24)]",
          "bg-[hsl(var(--app-primary,var(--primary))/0.055)]",
          "px-1.5 py-1",
          "transition active:scale-[var(--app-motion-scale-press)]",
          "group-hover:border-[hsl(var(--app-primary,var(--primary))/0.42)]",
          "group-hover:bg-[hsl(var(--app-primary,var(--primary))/0.08)]",
        ].join(" ")}
      >
        <AppInline gap="xs" align="start" justify="between" className="min-w-0">
          <div className="min-w-0">
            <p
              title={ticket.titulo}
              className="truncate text-[12px] font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]"
            >
              {ticket.titulo || `Ticket #${ticket.id}`}
            </p>

            <AppInline
              gap="xs"
              align="center"
              className="mt-0.5 min-w-0 text-[9.5px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            >
              <CircleUserRound className="h-2.5 w-2.5 shrink-0" />

              <span className="truncate">
                {ticket.cliente || "Cliente no registrado"}
              </span>
            </AppInline>
          </div>

          <AppBadge
            size="xs"
            tone="warning"
            appearance="soft"
            radius="sm"
            className="h-4 min-h-4 shrink-0 px-1 text-[9px]"
          >
            <Settings className="h-2.5 w-2.5" />
            Curso
          </AppBadge>
        </AppInline>

        <div className="mt-1 flex min-w-0 flex-wrap gap-1">
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
              className="h-4 min-h-4 px-1 text-[9px]"
            >
              +{restantes}
            </AppBadge>
          ) : null}
        </div>

        <AppInline gap="xs" align="center" justify="end" className="mt-0.5">
          <span className="text-[9.5px] font-medium leading-none text-[hsl(var(--app-primary,var(--primary)))]">
            Ver
          </span>

          <ChevronRight className="h-3 w-3 text-[hsl(var(--app-primary,var(--primary)))]" />
        </AppInline>
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
