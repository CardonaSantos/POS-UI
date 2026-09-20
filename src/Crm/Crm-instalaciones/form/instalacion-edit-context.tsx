import { UserRound, Wifi } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";

type Props = {
  detalle: ClienteInstalacionDetalle;
};

export function InstalacionEditContext({ detalle }: Props) {
  const clienteNombre = [detalle.cliente.nombre, detalle.cliente.apellidos]
    .filter(Boolean)
    .join(" ");

  return (
    <section aria-labelledby="instalacion-contexto-title">
      <AppStack gap="sm">
        <div>
          <h2 id="instalacion-contexto-title" className="text-base font-medium">
            Contexto de la instalación
          </h2>

          <p className="text-sm text-muted-foreground">
            El cliente y el servicio actual no se modifican desde esta edición.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppCard className="p-2">
            <AppInline align="center" gap="sm" wrap={false}>
              <UserRound className="size-4 shrink-0" aria-hidden="true" />

              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">Cliente</p>

                <p className="truncate text-sm font-medium">
                  {clienteNombre || `Cliente #${detalle.clienteId}`}
                </p>

                {detalle.cliente.telefono ? (
                  <p className="text-xs text-muted-foreground">
                    {detalle.cliente.telefono}
                  </p>
                ) : null}
              </div>
            </AppInline>
          </AppCard>

          <AppCard className="p-2">
            <AppInline align="center" gap="sm" wrap={false}>
              <Wifi className="size-4 shrink-0" aria-hidden="true" />

              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">
                  Servicio actual
                </p>

                <p className="truncate text-sm font-medium">
                  {detalle.servicioInternet?.nombre ??
                    "Sin servicio relacionado"}
                </p>

                {detalle.servicioInternet?.velocidad ? (
                  <p className="text-xs text-muted-foreground">
                    {detalle.servicioInternet.velocidad}
                  </p>
                ) : null}
              </div>
            </AppInline>
          </AppCard>
        </AppGrid>
      </AppStack>
    </section>
  );
}
