import { memo } from "react";
import { ScrollText } from "lucide-react";
import { DetalleSectionCard } from "./detalle-section-card";

export const AuditoriaCard = memo(function AuditoriaCard() {
  return (
    <DetalleSectionCard id="auditoria-instalacion" title="Auditoría" icon={ScrollText}>
      <div className="rounded-md border border-dashed border-border px-3 py-3">
        <p className="text-sm font-medium text-foreground">Sin eventos en esta respuesta</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          El historial se mostrará aquí cuando el endpoint lo incluya.
        </p>
      </div>
    </DetalleSectionCard>
  );
});
