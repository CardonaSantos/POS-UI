import { AppBadgeTone } from "@/Crm/CrmServices/_components/crm-service.helpers";
import { TicketStats } from "./ticket-helpers";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppInline } from "@/components/app/primitives/app-inline";
import {
  ClipboardList,
  MapPin,
  Siren,
  TicketCheck,
  Wrench,
} from "lucide-react";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppGrid } from "@/components/app/primitives/app-grid";

export function TecDashboardSummary({
  stats,
  isFetching,
}: {
  stats: TicketStats;
  isFetching: boolean;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppStack gap="xs">
        <AppInline gap="sm" align="center" justify="between">
          <AppInline gap="xs" align="center" className="min-w-0">
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-[var(--app-radius-md)]",
                "bg-[hsl(var(--app-primary)/0.12)]",
                "text-[hsl(var(--app-primary))]",
              ].join(" ")}
            >
              <ClipboardList className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] leading-tight text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Tickets asignados
              </p>

              <AppInline gap="xs" align="center">
                <span className="text-base font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
                  {stats.total}
                </span>

                <AppBadge size="xs" tone="neutral" appearance="soft">
                  Total
                </AppBadge>
              </AppInline>
            </div>
          </AppInline>

          {isFetching ? (
            <AppBadge size="xs" tone="info" appearance="soft">
              Actualizando
            </AppBadge>
          ) : null}
        </AppInline>

        <AppGrid cols={{ base: 2, sm: 4 }} gap="xs">
          <TecMetricCard
            label="Urgentes"
            value={stats.urgentes}
            tone="danger"
            icon={<Siren className="h-3.5 w-3.5" />}
          />

          <TecMetricCard
            label="Nuevos"
            value={stats.nuevos}
            tone="success"
            icon={<TicketCheck className="h-3.5 w-3.5" />}
          />

          <TecMetricCard
            label="En proceso"
            value={stats.enProceso}
            tone="warning"
            icon={<Wrench className="h-3.5 w-3.5" />}
          />

          <TecMetricCard
            label="Con mapa"
            value={stats.conUbicacion}
            tone="info"
            icon={<MapPin className="h-3.5 w-3.5" />}
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}

function TecMetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: AppBadgeTone;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-[var(--app-radius-md)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-card-bg,var(--card))/0.72)]",
        "px-2 py-1.5",
      ].join(" ")}
    >
      <AppInline gap="xs" align="center" justify="between">
        <span className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>

        <AppBadge size="xs" tone={tone} appearance="soft">
          {icon}
        </AppBadge>
      </AppInline>

      <p className="mt-0.5 text-sm font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </p>
    </div>
  );
}
