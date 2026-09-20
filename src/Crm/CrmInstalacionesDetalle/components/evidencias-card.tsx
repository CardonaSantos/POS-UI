import { memo } from "react";
import { ExternalLink, Images } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import {
  formatEnumValue,
  formatShortDate,
  getEvidenceAlt,
} from "../tecnico-instalacion-detalle.utils";
import { DetalleSectionCard } from "./detalle-section-card";

type EvidenciasCardProps = {
  evidencias: DetalleInstalacionTecnicaResponse["evidencias"];
};

export const EvidenciasCard = memo(function EvidenciasCard({
  evidencias,
}: EvidenciasCardProps) {
  return (
    <DetalleSectionCard
      id="evidencias-instalacion"
      title="Evidencias"
      icon={Images}
      trailing={
        <span className="text-xs text-muted-foreground">
          {evidencias.length}
        </span>
      }
    >
      {evidencias.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin evidencias.</p>
      ) : (
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
          aria-label="Galería de evidencias"
        >
          {evidencias.map((evidencia) => (
            <figure
              key={evidencia.evidenciaId}
              className="w-[78%] max-w-72 shrink-0 snap-start overflow-hidden rounded-md border border-border bg-muted/20 sm:w-64"
            >
              {evidencia.url ? (
                <a
                  href={evidencia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-[4/3] overflow-hidden bg-muted"
                  aria-label={`Abrir ${getEvidenceAlt(evidencia)}`}
                >
                  <img
                    src={evidencia.url}
                    alt={getEvidenceAlt(evidencia)}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                  <span
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
                    aria-hidden="true"
                  >
                    <ExternalLink className="size-3.5" />
                  </span>
                </a>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-muted text-muted-foreground">
                  <Images className="size-6" aria-hidden="true" />
                </div>
              )}

              <figcaption className="px-3 py-2">
                <AppInline justify="between" align="center" gap="xs" fullWidth>
                  <AppBadge tone="neutral" size="xs">
                    {formatEnumValue(evidencia.tipo)}
                  </AppBadge>
                  <span className="text-xs text-muted-foreground">
                    {formatShortDate(evidencia.creadoEn) ?? ""}
                  </span>
                </AppInline>
                {evidencia.descripcion ? (
                  <p className="mt-2 line-clamp-2 text-sm text-foreground">
                    {evidencia.descripcion}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </DetalleSectionCard>
  );
});
