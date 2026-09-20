import { Activity } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelResumenActividad } from "@/Crm/features/dashboard/panel-tecnico.types";

type Props = {
  data: TecnicoPanelResumenActividad;
};

export function TecnicoResumenActividad({ data }: Props) {
  const best = data.diaMasProductivo;

  const lowest = data.diaMenosProductivoConActividad;

  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-3">
      <AppStack gap="md">
        <div>
          <AppInline align="center" gap="xs" wrap>
            <Activity className="size-4" aria-hidden="true" />

            <p className="text-sm font-semibold">Resumen de actividad</p>
          </AppInline>

          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Días con mayor y menor producción registrada
          </p>
        </div>

        {best ? (
          <AppGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            gap="sm"
          >
            <div className="rounded-md bg-[hsl(var(--app-muted)/0.4)] p-3">
              <AppInline justify="between" align="start" gap="sm" fullWidth>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Día más productivo
                  </p>

                  <p className="mt-1 text-sm font-semibold">{best.etiqueta}</p>
                </div>

                <AppBadge
                  tone="success"
                  appearance="soft"
                  size="xs"
                  radius="full"
                >
                  {best.total} trabajos
                </AppBadge>
              </AppInline>

              <p className="mt-2 text-[11px] text-[hsl(var(--app-muted-foreground))]">
                {best.tickets} tickets · {best.instalaciones} instalaciones
              </p>
            </div>

            <div className="rounded-md bg-[hsl(var(--app-muted)/0.4)] p-3">
              <AppInline justify="between" align="start" gap="sm" fullWidth>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Menor actividad
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {lowest?.etiqueta ?? "Sin datos"}
                  </p>
                </div>

                {lowest ? (
                  <AppBadge
                    tone="neutral"
                    appearance="soft"
                    size="xs"
                    radius="full"
                  >
                    {lowest.total} trabajos
                  </AppBadge>
                ) : null}
              </AppInline>

              {lowest ? (
                <p className="mt-2 text-[11px] text-[hsl(var(--app-muted-foreground))]">
                  {lowest.tickets} tickets · {lowest.instalaciones}{" "}
                  instalaciones
                </p>
              ) : null}
            </div>
          </AppGrid>
        ) : (
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            Todavía no existe actividad registrada durante este mes.
          </p>
        )}
      </AppStack>
    </AppCard>
  );
}
