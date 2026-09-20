import { memo } from "react";
import { PackageCheck, Star } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { DetalleSectionCard } from "./detalle-section-card";

type EquiposCardProps = {
  equipos: DetalleInstalacionTecnicaResponse["equipos"];
};

export const EquiposCard = memo(function EquiposCard({ equipos }: EquiposCardProps) {
  return (
    <DetalleSectionCard
      id="equipos-instalacion"
      title="Equipos"
      icon={PackageCheck}
      trailing={<span className="text-xs text-muted-foreground">{equipos.length}</span>}
    >
      {equipos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin equipos registrados.</p>
      ) : (
        <AppStack gap="xs">
          {equipos.map((equipo) => (
            <article
              key={equipo.id}
              className="rounded-md border border-border px-3 py-2"
            >
              <AppInline justify="between" align="start" gap="sm" fullWidth>
                <div className="min-w-0">
                  <div className="break-words text-sm font-medium text-foreground">
                    {equipo.productoNombre ?? equipo.descripcion ?? "Equipo"}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {equipo.serial ? `Serial ${equipo.serial}` : `Cantidad ${equipo.cantidad}`}
                  </div>
                </div>

                {equipo.esPrincipal ? (
                  <AppBadge tone="primary" size="xs">
                    <Star aria-hidden="true" />
                    Principal
                  </AppBadge>
                ) : null}
              </AppInline>
            </article>
          ))}
        </AppStack>
      )}
    </DetalleSectionCard>
  );
});
