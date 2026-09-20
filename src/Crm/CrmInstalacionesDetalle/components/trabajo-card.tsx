import { memo } from "react";
import { ClipboardCheck, FileText, MessageSquareText, Target } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppStack } from "@/components/app/primitives/app-stack";
import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";

type TrabajoCardProps = {
  trabajo: DetalleInstalacionTecnicaResponse["trabajo"];
};

export const TrabajoCard = memo(function TrabajoCard({ trabajo }: TrabajoCardProps) {
  const hasContent = Boolean(
    trabajo.descripcion || trabajo.motivo || trabajo.observaciones || trabajo.resultado,
  );

  return (
    <DetalleSectionCard id="trabajo-instalacion" title="Trabajo" icon={ClipboardCheck}>
      {!hasContent ? (
        <p className="text-sm text-muted-foreground">Sin detalles de trabajo.</p>
      ) : (
        <AppStack gap="sm">
          {trabajo.descripcion ? (
            <DetailValueRow icon={FileText} label="Descripción" value={trabajo.descripcion} />
          ) : null}
          {trabajo.motivo ? (
            <DetailValueRow icon={Target} label="Motivo" value={trabajo.motivo} />
          ) : null}
          {trabajo.observaciones ? (
            <DetailValueRow
              icon={MessageSquareText}
              label="Observaciones"
              value={trabajo.observaciones}
            />
          ) : null}
          {trabajo.resultado ? (
            <DetailValueRow
              icon={ClipboardCheck}
              label="Resultado"
              value={trabajo.resultado}
              emphasize
            />
          ) : null}
        </AppStack>
      )}
    </DetalleSectionCard>
  );
});
