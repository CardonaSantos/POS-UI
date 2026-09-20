import { memo } from "react";
import { FileText, ImageIcon } from "lucide-react";
// import { AppButton } from "@/components/app/primitives/app-button";
import type { ClienteDesinstalacionEvidenciaDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";
import { DetailSection } from "./desinstalacion-detail-ui";

type DesinstalacionEvidenciasCardProps = {
  evidencias: ClienteDesinstalacionEvidenciaDetalle[];

  onUploadEvidence?: () => void;
};

export const DesinstalacionEvidenciasCard = memo(
  function DesinstalacionEvidenciasCard({
    evidencias,

    // onUploadEvidence,
  }: DesinstalacionEvidenciasCardProps) {
    return (
      <DetailSection
        title="Evidencias"
        description={`${evidencias.length} archivo${
          evidencias.length === 1 ? "" : "s"
        } registrado${evidencias.length === 1 ? "" : "s"}.`}
      >
        {evidencias.length === 0 ? (
          <div className="rounded-md border border-dashed px-3 py-6 text-center">
            <ImageIcon
              size={20}
              className="mx-auto text-muted-foreground"
              aria-hidden="true"
            />

            <p className="mt-2 text-xs font-medium">Sin evidencias</p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Las fotografías y documentos del retiro aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {evidencias.map((evidencia) => (
              <EvidenceItem key={evidencia.id} evidencia={evidencia} />
            ))}
          </div>
        )}
      </DetailSection>
    );
  },
);

const EvidenceItem = memo(function EvidenceItem({
  evidencia,
}: {
  evidencia: ClienteDesinstalacionEvidenciaDetalle;
}) {
  const url = evidencia.media.cdnUrl;

  const isImage = evidencia.media.mimeType?.startsWith("image/") ?? false;

  if (isImage && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group overflow-hidden rounded-md border bg-muted/20"
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={url}
            alt={evidencia.descripcion ?? "Evidencia de desinstalación"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>

        <div className="min-w-0 px-2.5 py-2">
          <p className="truncate text-[11px] font-medium">
            {evidencia.descripcion ?? evidencia.tipo}
          </p>

          <p className="truncate text-[10px] text-muted-foreground">
            {evidencia.media.extension ?? "Imagen"}
          </p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url ?? undefined}
      target={url ? "_blank" : undefined}
      rel={url ? "noreferrer" : undefined}
      className="flex min-h-24 min-w-0 flex-col justify-between rounded-md border px-3 py-3"
    >
      <FileText
        size={20}
        className="text-muted-foreground"
        aria-hidden="true"
      />

      <div className="mt-3 min-w-0">
        <p className="truncate text-[11px] font-medium">
          {evidencia.descripcion ?? "Documento"}
        </p>

        <p className="truncate text-[10px] text-muted-foreground">
          {evidencia.media.extension ?? evidencia.media.mimeType ?? "Archivo"}
        </p>
      </div>
    </a>
  );
});
