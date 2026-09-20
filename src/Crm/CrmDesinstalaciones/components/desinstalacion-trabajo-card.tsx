import { memo } from "react";
import type { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";
import { DetailItem, DetailSection } from "./desinstalacion-detail-ui";

export const DesinstalacionTrabajoCard = memo(
  function DesinstalacionTrabajoCard({
    detalle,
  }: {
    detalle: ClienteDesinstalacionDetalle;
  }) {
    return (
      <DetailSection
        title="Trabajo y retiro"
        description="Técnicos y equipos asociados al trabajo."
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <DetailItem label="Técnicos" value={detalle.tecnicos.length} />

          <DetailItem label="Equipos" value={detalle.equipos.length} />

          <DetailItem
            label="Retiro requerido"
            value={detalle.requiereRetiroEquipo ? "Sí" : "No"}
          />

          <DetailItem
            label="Equipo recuperado"
            value={detalle.equipoRecuperado ? "Sí" : "No"}
          />
        </dl>

        {detalle.tecnicos.length > 0 ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {detalle.tecnicos.map((asignacion) => (
              <div
                key={asignacion.id}
                className="min-w-0 rounded-md border px-3 py-2"
              >
                <p className="truncate text-xs font-medium">
                  {asignacion.tecnico?.nombre ??
                    asignacion.tecnicoNombreSnapshot ??
                    "Técnico"}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  {asignacion.rol}
                  {asignacion.esResponsable ? " · Responsable" : ""}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </DetailSection>
    );
  },
);
