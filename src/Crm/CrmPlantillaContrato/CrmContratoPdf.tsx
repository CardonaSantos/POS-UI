"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useParams, useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import logoNova from "@/assets/logoNovaSinFondo.png";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface ClienteContrato {
  id: number;
  nombre: string;
  apellidos: string | null;
  telefono?: string | null;
  direccion?: string | null;
  plan?: string | null;
}

export interface ContratoServicio {
  id: number;
  clienteId: number;
  fechaInstalacionProgramada: string | null;
  costoInstalacion: number | null;
  fechaPago: string | null;
  observaciones: string | null;
  ssid: string | null;
  wifiPassword: string | null;
  creadoEn: string;
  actualizadoEn: string;
  cliente: ClienteContrato;
}

export interface PlantillaContrato {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
}

export interface ContratoVistaResponse {
  contrato: ContratoServicio;
  plantilla: PlantillaContrato;
  contratoFinal: string;
  empresa: Empresa;
}

export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  pbx: string;
  sitioWeb: string;
}

type PdfPaper = "letter" | "halfLetter";

const PDF_PAPER_DEFS: Record<
  PdfPaper,
  {
    label: string;
    fileLabel: string;
    widthMm: number;
    heightMm: number;
  }
> = {
  letter: {
    label: "Carta",
    fileLabel: "Carta",
    widthMm: 215.9,
    heightMm: 279.4,
  },
  halfLetter: {
    label: "Media carta",
    fileLabel: "Media_Carta",
    widthMm: 139.7,
    heightMm: 215.9,
  },
};

const normalizePaperParam = (value: string | null): PdfPaper => {
  if (!value) return "letter";

  const normalized = value.toLowerCase().trim();

  if (
    normalized === "half" ||
    normalized === "half-letter" ||
    normalized === "media" ||
    normalized === "media-carta" ||
    normalized === "mediacarta"
  ) {
    return "halfLetter";
  }

  return "letter";
};

const splitContratoFinal = (text: string) => {
  if (!text) return [];

  return text
    .replace(/\r\n/g, "\n")
    .split(
      /\n{2,}|(?=\n\d+(?:\.\d+)?\.?\s)|(?=\nReferencia\s*\d)|(?=\nNombre:)|(?=\nDPI:)|(?=\nTeléfono:)|(?=\nDireccion:)|(?=\nDirección:)|(?=\nRelación:)/g,
    )
    .map((item) => item.trim())
    .filter(Boolean);
};

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }

          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};

function ContratoServicioPDF() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const contratoId = Number.parseInt(id || "0");
  const plantillaId = Number.parseInt(searchParams.get("plantilla") || "0");

  const initialPaper = normalizePaperParam(searchParams.get("paper"));

  const [contratoData, setContratoData] =
    useState<ContratoVistaResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [renderingPreview, setRenderingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [pdfPaper, setPdfPaper] = useState<PdfPaper>(initialPaper);
  const [scale, setScale] = useState(2);

  const [marginTop, setMarginTop] = useState(10);
  const [marginRight, setMarginRight] = useState(10);
  const [marginBottom, setMarginBottom] = useState(10);
  const [marginLeft, setMarginLeft] = useState(10);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const contratoRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const paperDef = PDF_PAPER_DEFS[pdfPaper];
  const isHalfLetter = pdfPaper === "halfLetter";

  const contentWidthMm = useMemo(() => {
    const available = paperDef.widthMm - marginLeft - marginRight;
    return Math.max(80, available);
  }, [paperDef.widthMm, marginLeft, marginRight]);

  const marginConfig: [number, number, number, number] = useMemo(() => {
    return [marginTop, marginRight, marginBottom, marginLeft];
  }, [marginTop, marginRight, marginBottom, marginLeft]);

  const getInfoContrato = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${VITE_CRM_API_URL}/contrato-cliente/get-one-contrato/${contratoId}/${plantillaId}`,
      );

      if (response.status === 200) {
        setContratoData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener datos del contrato");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return `Q${amount.toFixed(2)}`;
  };

  const contratoParrafos = useMemo(() => {
    return splitContratoFinal(contratoData?.contratoFinal || "");
  }, [contratoData?.contratoFinal]);

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewBlob(null);
  };

  const buildPdfBlob = async () => {
    if (!contratoRef.current || !contratoData) return null;

    const sourceElement = contratoRef.current;
    const clonedElement = sourceElement.cloneNode(true) as HTMLElement;

    clonedElement.classList.remove("contract-letter", "contract-half-letter");
    clonedElement.classList.add(
      isHalfLetter ? "contract-half-letter" : "contract-letter",
    );

    clonedElement.style.width = `${contentWidthMm}mm`;
    clonedElement.style.maxWidth = "none";
    clonedElement.style.margin = "0";
    clonedElement.style.boxSizing = "border-box";
    clonedElement.style.background = "#ffffff";

    const renderContainer = document.createElement("div");

    renderContainer.style.position = "fixed";
    renderContainer.style.left = "-10000px";
    renderContainer.style.top = "0";
    renderContainer.style.width = `${contentWidthMm}mm`;
    renderContainer.style.background = "#ffffff";
    renderContainer.style.pointerEvents = "none";
    renderContainer.style.zIndex = "-1";

    renderContainer.appendChild(clonedElement);
    document.body.appendChild(renderContainer);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(clonedElement);

      const opt = {
        margin: marginConfig,
        filename: `Contrato_Servicio_${contratoData.contrato.id}_${paperDef.fileLabel}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
          windowWidth: clonedElement.scrollWidth,
        },
        jsPDF: {
          unit: "mm",
          format: [paperDef.widthMm, paperDef.heightMm],
          orientation: "portrait",
          compress: true,
        },
        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [
            ".avoid-break",
            ".pdf-card",
            ".pdf-signatures",
            ".pdf-footer",
            ".pdf-header",
          ],
          before: [".pdf-page-break"],
        },
      };

      const worker = html2pdf().set(opt).from(clonedElement).toPdf();

      const blob = (await worker.outputPdf("blob")) as Blob;

      return blob;
    } finally {
      document.body.removeChild(renderContainer);
    }
  };

  const generarPreview = async () => {
    if (!contratoData) return;

    try {
      setRenderingPreview(true);
      clearPreview();

      const blob = await buildPdfBlob();

      if (!blob) return;

      const url = URL.createObjectURL(blob);

      setPreviewBlob(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error(error);
      toast.error("Error al generar preview del PDF");
    } finally {
      setRenderingPreview(false);
    }
  };

  const descargarPDF = async () => {
    if (!contratoData) return;

    try {
      setDownloading(true);

      const blob = previewBlob || (await buildPdfBlob());

      if (!blob) return;

      downloadBlob(
        blob,
        `Contrato_Servicio_${contratoData.contrato.id}_${paperDef.fileLabel}.pdf`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar el PDF");
    } finally {
      setDownloading(false);
    }
  };

  const imprimirPreview = () => {
    const iframe = previewIframeRef.current;

    if (!iframe?.contentWindow) {
      toast.error("Primero genera el preview del PDF");
      return;
    }

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  useEffect(() => {
    getInfoContrato();
  }, [contratoId, plantillaId]);

  useEffect(() => {
    clearPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [pdfPaper, scale, marginTop, marginRight, marginBottom, marginLeft]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!contratoData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del contrato
        </h2>

        <button
          onClick={getInfoContrato}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { contrato, empresa } = contratoData;

  return (
    <PageTransitionCrm titleHeader="Contrato" subtitle="" variant="fade-pure">
      <style>
        {`
          .contract-pdf,
          .contract-pdf * {
            box-sizing: border-box;
          }

          .contract-pdf {
            background: #ffffff;
            color: #1f2937;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10pt;
            line-height: 1.38;
            overflow: visible;
          }

          .contract-half-letter {
            font-size: 8.7pt;
            line-height: 1.32;
          }

          .contract-pdf p {
            margin-top: 0;
            margin-bottom: 2.2mm;
          }

          .contract-pdf h1,
          .contract-pdf h2,
          .contract-pdf h3 {
            margin-top: 0;
          }

          .pdf-header,
          .pdf-card,
          .pdf-signatures,
          .pdf-footer,
          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .pdf-long-text {
            break-inside: auto;
            page-break-inside: auto;
          }

          .pdf-paragraph {
            margin: 0 0 3mm 0;
            break-inside: avoid;
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
          }

          .pdf-section-title {
            break-after: avoid;
            page-break-after: avoid;
          }

          .pdf-page-break {
            break-before: page;
            page-break-before: always;
          }

          .contract-pdf img {
            max-width: 100%;
            height: auto;
          }

          @media print {
            @page {
              size: letter;
              margin: 10mm;
            }

            body {
              margin: 0;
              background: #ffffff;
            }

            .no-print {
              display: none !important;
            }

            .contract-pdf {
              width: auto !important;
              max-width: none !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
            }
          }
        `}
      </style>

      <div className="no-print mb-4 rounded-lg border p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs">Tamaño de hoja</label>
            <select
              value={pdfPaper}
              onChange={(event) => setPdfPaper(event.target.value as PdfPaper)}
              className="h-9 rounded-md border px-3 text-sm outline-none"
            >
              <option value="letter">Carta</option>
              <option value="halfLetter">Media carta</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Escala</label>
            <input
              type="number"
              min={1}
              max={3}
              step={0.1}
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
              className="h-9 w-24 rounded-md border px-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Margen arriba mm</label>
            <input
              type="number"
              min={0}
              max={30}
              step={1}
              value={marginTop}
              onChange={(event) => setMarginTop(Number(event.target.value))}
              className="h-9 w-28 rounded-md border px-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Margen derecha mm</label>
            <input
              type="number"
              min={0}
              max={30}
              step={1}
              value={marginRight}
              onChange={(event) => setMarginRight(Number(event.target.value))}
              className="h-9 w-28 rounded-md border px-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Margen abajo mm</label>
            <input
              type="number"
              min={0}
              max={30}
              step={1}
              value={marginBottom}
              onChange={(event) => setMarginBottom(Number(event.target.value))}
              className="h-9 w-28 rounded-md border px-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Margen izquierda mm</label>
            <input
              type="number"
              min={0}
              max={30}
              step={1}
              value={marginLeft}
              onChange={(event) => setMarginLeft(Number(event.target.value))}
              className="h-9 w-28 rounded-md border px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 rounded-md border p-3 text-xs md:grid-cols-4">
          <div>
            Hoja: <span className="font-semibold">{paperDef.label}</span>
          </div>

          <div>
            Medida:{" "}
            <span className="font-semibold">
              {paperDef.widthMm}mm × {paperDef.heightMm}mm
            </span>
          </div>

          <div>
            Ancho imprimible:{" "}
            <span className="font-semibold">{contentWidthMm.toFixed(1)}mm</span>
          </div>

          <div>
            Márgenes:{" "}
            <span className="font-semibold">
              {marginTop}/{marginRight}/{marginBottom}/{marginLeft}mm
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={renderingPreview}
            onClick={generarPreview}
            className="rounded-md border px-4 py-2 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {renderingPreview ? "Generando preview..." : "Actualizar preview"}
          </button>

          <button
            type="button"
            disabled={!previewUrl}
            onClick={imprimirPreview}
            className="rounded-md border px-4 py-2 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Imprimir preview
          </button>

          <button
            type="button"
            disabled={downloading}
            onClick={descargarPDF}
            className="rounded-md border px-4 py-2 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? "Preparando PDF..." : "Descargar PDF"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[auto_minmax(420px,1fr)]">
        <div className="overflow-x-auto pb-8">
          <div className="mx-auto w-fit rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div
              ref={contratoRef}
              className={`contract-pdf ${
                isHalfLetter ? "contract-half-letter" : "contract-letter"
              }`}
              style={{
                width: `${contentWidthMm}mm`,
                maxWidth: "none",
                margin: "0 auto",
                boxSizing: "border-box",
              }}
            >
              <div className="pdf-header mb-6 flex items-start justify-between border-b border-gray-300 pb-6">
                <div className="flex min-w-0 items-center">
                  <div className={isHalfLetter ? "mr-2" : "mr-4"}>
                    <div
                      className={`flex items-center justify-center rounded ${
                        isHalfLetter ? "h-14 w-14" : "h-24 w-24"
                      }`}
                    >
                      <img
                        src={logoNova || "/placeholder.svg"}
                        alt="Logo de la empresa"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h1
                      className={`mb-1 font-semibold text-primary ${
                        isHalfLetter ? "text-base" : "text-2xl"
                      }`}
                    >
                      {empresa?.nombre}
                    </h1>

                    <p className="text-gray-600">{empresa?.direccion}</p>
                    <p className="text-gray-600">Tel: {empresa?.telefono}</p>
                    <p className="text-gray-600">PBX: {empresa?.pbx}</p>
                    <p className="break-words text-gray-600">
                      Email: {empresa?.correo}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <h2 className="font-semibold text-gray-700">
                    CONTRATO DE SERVICIO
                  </h2>

                  <p className="text-gray-600">
                    No. Contrato:{" "}
                    <span className="font-semibold">{contrato.id}</span>
                  </p>

                  <p className="text-gray-600">
                    Fecha de emisión:{" "}
                    <span className="font-semibold">
                      {formatDate(contrato.creadoEn)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pdf-card mb-6 rounded-md bg-gray-50 p-4">
                <h2 className="pdf-section-title mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-700">
                  Información del Cliente
                </h2>

                <div
                  className={
                    isHalfLetter
                      ? "grid grid-cols-1 gap-2"
                      : "grid grid-cols-2 gap-4"
                  }
                >
                  <div>
                    <p className="text-gray-600">
                      Nombre:{" "}
                      <span className="font-semibold">
                        {contrato.cliente.nombre}{" "}
                        {contrato.cliente.apellidos || ""}
                      </span>
                    </p>

                    <p className="text-gray-600">
                      Dirección:{" "}
                      <span className="font-semibold">
                        {contrato.cliente.direccion || "N/A"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">
                      Teléfono:{" "}
                      <span className="font-semibold">
                        {contrato.cliente.telefono || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="pdf-section-title mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-700">
                  Detalles del Contrato
                </h2>

                <div
                  className={`mb-4 grid ${
                    isHalfLetter ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                  }`}
                >
                  <div className="pdf-card rounded-md bg-gray-50 p-3">
                    <p className="text-gray-600">
                      Fecha de instalación programada:{" "}
                      <span className="font-semibold">
                        {formatDate(contrato.fechaInstalacionProgramada)}
                      </span>
                    </p>

                    <p className="text-gray-600">
                      Costo de instalación:{" "}
                      <span className="font-semibold">
                        {formatCurrency(contrato.costoInstalacion)}
                      </span>
                    </p>
                  </div>

                  <div className="pdf-card rounded-md bg-gray-50 p-3">
                    <p className="text-gray-600">
                      Fecha de pago mensual:{" "}
                      <span className="font-semibold">
                        {formatDate(contrato.fechaPago)}
                      </span>
                    </p>

                    <p className="text-gray-600">
                      Plan seleccionado:{" "}
                      <span className="font-semibold">
                        {contrato.cliente.plan || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pdf-card rounded-md bg-gray-50 p-4">
                  <h3 className="mb-2 font-semibold text-gray-700">
                    Observaciones:
                  </h3>

                  <p className="whitespace-pre-line text-gray-700">
                    {contrato.observaciones || "Sin observaciones adicionales."}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="pdf-section-title mb-2 border-b border-gray-200 pb-1 text-lg font-bold text-gray-700">
                  Términos del Contrato
                </h2>

                <div className="rounded-md bg-gray-50 p-4 text-gray-700">
                  <div className="pdf-long-text">
                    {contratoParrafos.length > 0 ? (
                      contratoParrafos.map((parrafo, index) => (
                        <p
                          key={`${parrafo.slice(0, 16)}-${index}`}
                          className="pdf-paragraph whitespace-pre-line"
                        >
                          {parrafo}
                        </p>
                      ))
                    ) : (
                      <p className="pdf-paragraph">
                        Sin términos de contrato definidos.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`pdf-signatures mt-12 mb-6 grid ${
                  isHalfLetter ? "grid-cols-1 gap-10" : "grid-cols-2 gap-8"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`mx-auto border-t border-gray-400 pt-2 ${
                      isHalfLetter ? "w-52" : "w-64"
                    }`}
                  >
                    <p className="font-semibold">Firma del Cliente</p>
                    <p className="text-sm text-gray-600">
                      {contrato.cliente.nombre}{" "}
                      {contrato.cliente.apellidos || ""}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`mx-auto border-t border-gray-400 pt-2 ${
                      isHalfLetter ? "w-52" : "w-64"
                    }`}
                  >
                    <p className="font-semibold">Firma del Representante</p>
                    <p className="text-sm text-gray-600">{empresa?.nombre}</p>
                  </div>
                </div>
              </div>

              <div className="pdf-footer mt-12 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
                <p>
                  Este documento es un contrato oficial de servicio de{" "}
                  {empresa?.nombre}
                </p>

                <p>
                  Para cualquier consulta, comuníquese al teléfono (502){" "}
                  {empresa?.telefono} | pbx: {empresa?.pbx}
                </p>

                <p className="mt-2">
                  Generado el {dayjs().format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="no-print min-h-[700px] rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              Preview PDF real
            </h2>

            <span className="text-xs text-gray-500">
              {previewUrl ? "Preview generado" : "Sin preview"}
            </span>
          </div>

          {previewUrl ? (
            <iframe
              ref={previewIframeRef}
              src={previewUrl}
              title="Preview del contrato PDF"
              className="h-[780px] w-full rounded-md border border-gray-200"
            />
          ) : (
            <div className="flex h-[780px] items-center justify-center rounded-md border border-dashed border-gray-300 px-4 text-center text-sm text-gray-500">
              Ajusta hoja, escala o márgenes y presiona “Actualizar preview”.
            </div>
          )}
        </div>
      </div>
    </PageTransitionCrm>
  );
}

export default ContratoServicioPDF;
