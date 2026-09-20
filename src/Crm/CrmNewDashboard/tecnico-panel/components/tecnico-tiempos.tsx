import { Clock3 } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelTiempos } from "@/Crm/features/dashboard/panel-tecnico.types";
import { formatMinutesDuration } from "../helpers/tecnico-dashboard.utils";

type Props = {
  data: TecnicoPanelTiempos;
};

export function TecnicoTiempos({ data }: Props) {
  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-3">
      <AppStack gap="md">
        <div>
          <AppInline align="center" gap="xs" wrap>
            <Clock3 className="size-4" aria-hidden="true" />

            <p className="text-sm font-semibold">Tiempos promedio</p>
          </AppInline>

          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Duración registrada de los trabajos completados
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            sm: 2,
          }}
          gap="sm"
        >
          <div className="rounded-md bg-[hsl(var(--app-muted)/0.4)] p-3">
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Resolución de ticket
            </p>

            <p className="mt-1 text-base font-semibold tabular-nums">
              {formatMinutesDuration(data.promedioResolucionTicketMinutos)}
            </p>
          </div>

          <div className="rounded-md bg-[hsl(var(--app-muted)/0.4)] p-3">
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Instalación
            </p>

            <p className="mt-1 text-base font-semibold tabular-nums">
              {formatMinutesDuration(data.promedioInstalacionMinutos)}
            </p>
          </div>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
