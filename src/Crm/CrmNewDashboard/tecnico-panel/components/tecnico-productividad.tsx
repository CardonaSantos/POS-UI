import { CheckCircle2, Gauge } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelProductividadMes } from "@/Crm/features/dashboard/panel-tecnico.types";
import { formatDecimal } from "../helpers/tecnico-dashboard.utils";

type Props = {
  data: TecnicoPanelProductividadMes;
};

export function TecnicoProductividad({ data }: Props) {
  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-3">
      <AppStack gap="md">
        <AppInline justify="between" align="start" gap="sm" fullWidth>
          <div>
            <AppInline align="center" gap="xs" wrap>
              <CheckCircle2 className="size-4" aria-hidden="true" />

              <p className="text-sm font-semibold">Productividad del mes</p>
            </AppInline>

            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Trabajo completado durante el período actual
            </p>
          </div>

          <AppBadge tone="success" appearance="soft" size="xs" radius="full">
            {data.trabajosCompletados} trabajos
          </AppBadge>
        </AppInline>

        <AppGrid
          cols={{
            base: 2,
            md: 4,
          }}
          gap="md"
        >
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Instalaciones
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
              {data.instalacionesCompletadas}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Tickets resueltos
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
              {data.ticketsResueltos}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Días activos
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
              {data.diasConActividad}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Por día activo
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatDecimal(data.promedioTrabajosPorDiaActivo)}
            </p>

            <p className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
              trabajos
            </p>
          </div>
        </AppGrid>

        <div className="rounded-md bg-[hsl(var(--app-muted)/0.4)] p-2.5">
          <AppInline align="center" gap="sm" wrap={false}>
            <Gauge className="size-4 shrink-0" aria-hidden="true" />

            <p className="text-xs">
              Ritmo semanal de tickets:{" "}
              <strong>{formatDecimal(data.ritmoSemanalTickets)}</strong>.
              Promedio diario:{" "}
              <strong>{formatDecimal(data.promedioTicketsPorDia)}</strong>.
            </p>
          </AppInline>
        </div>
      </AppStack>
    </AppCard>
  );
}
