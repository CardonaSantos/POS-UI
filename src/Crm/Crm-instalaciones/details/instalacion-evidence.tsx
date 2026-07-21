import { ImageIcon } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { ClienteInstalacionEvidenciaDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { formatBytes, humanizeEnum } from "./instalacion-utils.utils";
import { formattShortFecha } from "@/utils/formattFechas";

type InstalacionEvidenceGalleryProps = {
  evidencias: ClienteInstalacionEvidenciaDetalle[];
  onOpenEvidence: (index: number) => void;
};

export function InstalacionEvidenceGallery({
  evidencias,
  onOpenEvidence,
}: InstalacionEvidenceGalleryProps) {
  const imageEvidences = evidencias.filter((evidencia) =>
    Boolean(evidencia.media.cdnUrl),
  );

  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-2">
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" fullWidth>
          <div>
            <h2 className="text-base font-semibold">Evidencias</h2>

            <p className="text-sm">
              Fotografías y archivos registrados durante la instalación.
            </p>
          </div>

          <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
            {evidencias.length}
          </AppBadge>
        </AppInline>

        {imageEvidences.length === 0 ? (
          <div
            className={[
              "flex min-h-32 flex-col items-center justify-center gap-2 rounded-[var(--app-radius-md)]",
              "border border-dashed border-[hsl(var(--app-border))]",
              "text-center text-[hsl(var(--app-muted-foreground))]",
            ].join(" ")}
          >
            <ImageIcon size={24} aria-hidden="true" />

            <p className="text-sm">No hay imágenes registradas.</p>
          </div>
        ) : (
          <AppGrid
            cols={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            gap="sm"
          >
            {imageEvidences.map((evidencia, index) => {
              const uploadedBy = evidencia.media.subidoPor?.nombre;

              return (
                <article key={evidencia.id}>
                  <AppStack gap="xs">
                    <button
                      type="button"
                      onClick={() => onOpenEvidence(index)}
                      className={[
                        "group relative aspect-[4/3] w-full overflow-hidden",
                        "rounded-[var(--app-radius-sm)]",
                        "border border-[hsl(var(--app-border))]",
                        "bg-[hsl(var(--app-muted))]",
                        "focus-visible:outline focus-visible:outline-2",
                        "focus-visible:outline-offset-2",
                        "focus-visible:outline-[hsl(var(--app-primary))]",
                      ].join(" ")}
                      aria-label={`Abrir evidencia ${index + 1}`}
                    >
                      <img
                        src={evidencia.media.cdnUrl ?? ""}
                        alt={
                          evidencia.descripcion ??
                          `Evidencia ${humanizeEnum(evidencia.tipo)}`
                        }
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    </button>

                    <AppInline justify="between" align="center" gap="xs">
                      <AppBadge
                        tone="info"
                        appearance="soft"
                        size="xs"
                        radius="full"
                      >
                        {humanizeEnum(evidencia.tipo)}
                      </AppBadge>

                      <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                        {formatBytes(evidencia.media.tamanioBytes)}
                      </span>
                    </AppInline>

                    <p className="line-clamp-2 text-sm">
                      {evidencia.descripcion ?? "Sin descripción"}
                    </p>

                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      {uploadedBy
                        ? `Subida por ${uploadedBy}`
                        : "Usuario no disponible"}
                      {" · "}
                      {formattShortFecha(evidencia.creadoEn)}
                    </p>
                  </AppStack>
                </article>
              );
            })}
          </AppGrid>
        )}
      </AppStack>
    </AppCard>
  );
}
