import { ClipboardList, Router } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelCargaActual } from "@/Crm/features/dashboard/panel-tecnico.types";

type Props = {
  carga: TecnicoPanelCargaActual;
};

const TECNICO_ROUTES = {
  tickets: "/crm/tickets/tecnico",
  instalaciones: "/crm/instalaciones/tecnico",
} as const;

export function TecnicoQuickActions({ carga }: Props) {
  return (
    <AppGrid
      cols={{
        base: 1,
        sm: 2,
      }}
      gap="sm"
    >
      <AppCard variant="outline" size="sm" radius="md" className="p-3">
        <AppStack gap="sm">
          <AppInline justify="between" align="start" gap="sm" fullWidth>
            <AppInline align="center" gap="sm" wrap={false}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--app-muted)/0.6)]">
                <ClipboardList className="size-4" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Mis tickets</p>

                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Soporte asignado
                </p>
              </div>
            </AppInline>

            <AppBadge
              tone={carga.ticketsUrgentes > 0 ? "danger" : "neutral"}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {carga.ticketsPendientes} pendientes
            </AppBadge>
          </AppInline>

          <AppButton asChild size="sm" width="full">
            <Link to={TECNICO_ROUTES.tickets}>Ver tickets asignados</Link>
          </AppButton>
        </AppStack>
      </AppCard>

      <AppCard variant="outline" size="sm" radius="md" className="p-3">
        <AppStack gap="sm">
          <AppInline justify="between" align="start" gap="sm" fullWidth>
            <AppInline align="center" gap="sm" wrap={false}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--app-muted)/0.6)]">
                <Router className="size-4" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Mis instalaciones</p>

                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Trabajo de campo asignado
                </p>
              </div>
            </AppInline>

            <AppBadge
              tone={carga.instalacionesAtrasadas > 0 ? "warning" : "neutral"}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {carga.instalacionesPendientes} pendientes
            </AppBadge>
          </AppInline>

          <AppButton asChild size="sm" variant="outline" width="full">
            <Link to={TECNICO_ROUTES.instalaciones}>
              Ver instalaciones asignadas
            </Link>
          </AppButton>
        </AppStack>
      </AppCard>
    </AppGrid>
  );
}
