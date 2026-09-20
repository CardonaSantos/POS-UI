import { useMemo, useRef, useState } from "react";

import { useParams, useSearchParams } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import "./styles/contrato-document.css";
import {
  normalizePaperParam,
  PDF_PAPER_DEFS,
  PdfPaper,
} from "./helpers/contrato-pdf.utils";
import { useGetContratoInstalacion } from "../CrmHooks/hooks/use-contrato/use-contrato";
import { useContratoPdf } from "../CrmHooks/hooks/use-contrato/useContratoPdf";
import { ContratoDocument } from "./ContratoDocument";

export function ContratoInstalacionPage() {
  const { instalacionId: instalacionIdParam } = useParams<{
    instalacionId: string;
  }>();

  const [searchParams] = useSearchParams();

  const instalacionId = Number.parseInt(instalacionIdParam ?? "0", 10);

  const plantillaId = Number.parseInt(searchParams.get("plantilla") ?? "0", 10);

  const [paper, setPaper] = useState<PdfPaper>(() =>
    normalizePaperParam(searchParams.get("paper")),
  );

  const [scale, setScale] = useState(2);

  const [margins] = useState<[number, number, number, number]>([8, 8, 8, 8]);

  const query = useGetContratoInstalacion(instalacionId, plantillaId);

  const contractRef = useRef<HTMLDivElement>(null);

  const paperDef = PDF_PAPER_DEFS[paper];

  const contentWidthMm = useMemo(
    () => Math.max(80, paperDef.widthMm - margins[1] - margins[3]),
    [margins, paperDef.widthMm],
  );

  const pdf = useContratoPdf({
    contractRef,

    documentNumber: query.data?.documento.numero ?? 0,

    paper: paperDef,

    contentWidthMm,

    margins,

    scale,
  });

  if (!instalacionId || !plantillaId) {
    return (
      <div className="p-6 text-sm text-red-600">
        Instalación o plantilla inválida.
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        Cargando contrato...
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">No se pudo obtener el contrato.</p>

        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-3 rounded-md border px-4 py-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const data = query.data;

  return (
    <PageTransitionCrm
      titleHeader="Contrato de servicio"
      subtitle={`Instalación #${data.instalacion.id} · ${data.cliente.nombreCompleto}`}
      variant="fade-pure"
    >
      {/* Toolbar compacto */}

      <div className="no-print mb-4 flex flex-wrap items-end gap-3 rounded-lg border p-3">
        <label className="flex flex-col gap-1 text-xs">
          Hoja
          <select
            value={paper}
            onChange={(event) => setPaper(event.target.value as PdfPaper)}
            className="h-9 rounded-md border px-3"
          >
            <option value="letter">Carta</option>

            <option value="halfLetter">Media carta</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          Escala
          <input
            type="number"
            min={1}
            max={3}
            step={0.1}
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="h-9 w-20 rounded-md border px-2"
          />
        </label>

        <button
          type="button"
          disabled={pdf.isGenerating}
          onClick={pdf.generatePreview}
          className="h-9 rounded-md border px-4 text-sm"
        >
          {pdf.isGenerating ? "Generando..." : "Preview"}
        </button>

        <button
          type="button"
          disabled={!pdf.previewUrl}
          onClick={pdf.print}
          className="h-9 rounded-md border px-4 text-sm"
        >
          Imprimir
        </button>

        <button
          type="button"
          disabled={pdf.isDownloading}
          onClick={pdf.download}
          className="h-9 rounded-md border px-4 text-sm"
        >
          {pdf.isDownloading ? "Preparando..." : "Descargar PDF"}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
        {/* Documento */}

        <div className="overflow-x-auto pb-8">
          <div className="mx-auto w-fit rounded-lg border bg-white p-3 shadow-sm">
            <div
              ref={contractRef}
              style={{
                width: `${contentWidthMm}mm`,
              }}
            >
              <ContratoDocument
                data={data}
                halfLetter={paper === "halfLetter"}
              />
            </div>
          </div>
        </div>

        {/* PDF real */}

        <div className="no-print min-h-[680px] rounded-lg border bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm">Preview PDF</strong>

            <span className="text-xs text-muted-foreground">
              {paperDef.label}
            </span>
          </div>

          {pdf.previewUrl ? (
            <iframe
              ref={pdf.iframeRef}
              src={pdf.previewUrl}
              title="Preview contrato"
              className="h-[760px] w-full rounded-md border"
            />
          ) : (
            <div className="flex h-[680px] items-center justify-center rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Presiona Preview para generar el PDF real.
            </div>
          )}
        </div>
      </div>
    </PageTransitionCrm>
  );
}

export default ContratoInstalacionPage;
