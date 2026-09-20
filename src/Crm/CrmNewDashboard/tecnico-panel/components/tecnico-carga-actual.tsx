import { AlertTriangle } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelCargaActual } from "@/Crm/features/dashboard/panel-tecnico.types";

type Props = {
  data: TecnicoPanelCargaActual;
};

type MetricProps = {
  label: string;
  value: number;
  helper?: string;
};

function Metric({ label, value, helper }: MetricProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>

      {helper ? (
        <p className="mt-0.5 text-[11px] text-[hsl(var(--app-muted-foreground))]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function TecnicoCargaActual({ data }: Props) {
  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-3">
      <AppStack gap="md">
        <AppInline justify="between" align="center" gap="sm" fullWidth>
          <div>
            <p className="text-sm font-semibold">Carga actual</p>

            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Trabajo pendiente y prioridades
            </p>
          </div>

          <AppInline gap="xs" wrap>
            {data.ticketsUrgentes > 0 ? (
              <AppBadge tone="danger" appearance="soft" size="xs" radius="full">
                {data.ticketsUrgentes} urgente
                {data.ticketsUrgentes === 1 ? "" : "s"}
              </AppBadge>
            ) : null}

            {data.instalacionesAtrasadas > 0 ? (
              <AppBadge
                tone="warning"
                appearance="soft"
                size="xs"
                radius="full"
              >
                {data.instalacionesAtrasadas} atrasadas
              </AppBadge>
            ) : null}
          </AppInline>
        </AppInline>

        <AppGrid
          cols={{
            base: 2,
            md: 4,
          }}
          gap="md"
        >
          <Metric
            label="Tickets"
            value={data.ticketsPendientes}
            helper={`${data.ticketsListosParaTrabajar} listos`}
          />

          <Metric
            label="Urgentes"
            value={data.ticketsUrgentes}
            helper={`${data.ticketsConMas48Horas} con +48 h`}
          />

          <Metric
            label="Instalaciones"
            value={data.instalacionesPendientes}
            helper="Pendientes"
          />

          <Metric
            label="Atrasadas"
            value={data.instalacionesAtrasadas}
            helper={`${data.instalacionesProgramadasHoy} para hoy`}
          />
        </AppGrid>

        {(data.ticketsConMas48Horas > 0 || data.instalacionesAtrasadas > 0) && (
          <div className="rounded-md bg-[hsl(var(--app-muted)/0.45)] p-2.5">
            <AppInline align="start" gap="sm" wrap={false}>
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />

              <p className="text-xs">
                Hay trabajo acumulado que requiere atención:{" "}
                <strong>{data.ticketsConMas48Horas} tickets</strong> superan 48
                horas y{" "}
                <strong>{data.instalacionesAtrasadas} instalaciones</strong>{" "}
                están atrasadas.
              </p>
            </AppInline>
          </div>
        )}
      </AppStack>
    </AppCard>
  );
}
