import { memo } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Wifi,
} from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  formatDateTime,
  formatEnumValue,
} from "../tecnico-instalacion-detalle.utils";
import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";

type ResumenOperativoCardProps = {
  detalle: DetalleInstalacionTecnicaResponse;
};

export const ResumenOperativoCard = memo(function ResumenOperativoCard({
  detalle,
}: ResumenOperativoCardProps) {
  const plan = detalle.servicioInternet
    ? [detalle.servicioInternet.nombre, detalle.servicioInternet.velocidad]
        .filter(Boolean)
        .join(" · ")
    : "Sin plan";

  return (
    <DetalleSectionCard id="resumen-operativo" title="Resumen" icon={FileText}>
      <AppStack gap="sm">
        <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
          <DetailValueRow icon={Wifi} label="Plan" value={plan} emphasize />
          <DetailValueRow
            icon={CalendarClock}
            label="Programada"
            value={formatDateTime(detalle.agenda.programadaPara) ?? "Sin fecha"}
          />
          {detalle.agenda.inicioReal ? (
            <DetailValueRow
              icon={Clock3}
              label="Inicio"
              value={formatDateTime(detalle.agenda.inicioReal) ?? "Sin fecha"}
            />
          ) : null}
          {detalle.agenda.finalizacionReal ? (
            <DetailValueRow
              icon={CheckCircle2}
              label="Finalización"
              value={
                formatDateTime(detalle.agenda.finalizacionReal) ?? "Sin fecha"
              }
            />
          ) : null}
        </AppGrid>

        {detalle.trabajo.descripcion ? (
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
            <div className="text-xs text-muted-foreground">Trabajo</div>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">
              {detalle.trabajo.descripcion}
            </p>
          </div>
        ) : null}

        <span className="sr-only">
          Tipo de instalación: {formatEnumValue(detalle.tipo)}
        </span>
      </AppStack>
    </DetalleSectionCard>
  );
});
