import { memo } from "react";
import { CircleDollarSign } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formattMonedaGT } from "../../Utils/formattMonedaGT";
import { getInstallationInitialTotal } from "../tecnico-instalacion-detalle.utils";
import { DetalleSectionCard } from "./detalle-section-card";

type CostosInstalacionCardProps = {
  detalle: DetalleInstalacionTecnicaResponse;
};

export const CostosInstalacionCard = memo(function CostosInstalacionCard({
  detalle,
}: CostosInstalacionCardProps) {
  const rows = [
    { label: "Plan", value: detalle.servicioInternet?.precio ?? 0 },
    { label: "Materiales", value: detalle.cobro.costoMateriales },
    { label: "Mano de obra", value: detalle.cobro.costoManoObra },
    { label: "Otros", value: detalle.cobro.costoOtros },
  ];

  return (
    <DetalleSectionCard
      id="costos-instalacion"
      title="Costos"
      icon={CircleDollarSign}
      trailing={
        <span className="text-sm font-semibold text-foreground">
          {formattMonedaGT(getInstallationInitialTotal(detalle))}
        </span>
      }
    >
      <AppStack gap="xs">
        <dl className="divide-y divide-border rounded-md border border-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium text-foreground">
                {formattMonedaGT(row.value)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 bg-muted/40 px-3 py-2 text-sm">
            <dt className="font-medium text-foreground">Total inicial</dt>
            <dd className="font-semibold text-foreground">
              {formattMonedaGT(getInstallationInitialTotal(detalle))}
            </dd>
          </div>
        </dl>

        {detalle.cobro.notas ? (
          <p className="whitespace-pre-wrap text-xs text-muted-foreground">
            {detalle.cobro.notas}
          </p>
        ) : null}
      </AppStack>
    </DetalleSectionCard>
  );
});
