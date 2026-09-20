import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import {
  downloadBlob,
  PdfPaperDef,
  waitForImages,
} from "@/Crm/CrmPlantillaContrato/helpers/contrato-pdf.utils";

interface UseContratoPdfParams {
  contractRef: RefObject<HTMLDivElement>;

  documentNumber: number;

  paper: PdfPaperDef;

  contentWidthMm: number;

  margins: [number, number, number, number];

  scale: number;
}

export function useContratoPdf({
  contractRef,
  documentNumber,
  paper,
  contentWidthMm,
  margins,
  scale,
}: UseContratoPdfParams) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const clearPreview = useCallback(() => {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return null;
    });

    setPreviewBlob(null);
  }, []);

  const buildBlob = useCallback(async () => {
    if (!contractRef.current) {
      return null;
    }

    const clone = contractRef.current.cloneNode(true) as HTMLElement;

    clone.style.width = `${contentWidthMm}mm`;

    clone.style.maxWidth = "none";
    clone.style.margin = "0";

    const container = document.createElement("div");

    Object.assign(container.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: `${contentWidthMm}mm`,
      background: "#fff",
      pointerEvents: "none",
      zIndex: "-1",
    });

    container.appendChild(clone);

    document.body.appendChild(container);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(clone);

      const worker = html2pdf()
        .set({
          margin: margins,

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
            windowWidth: clone.scrollWidth,
          },

          jsPDF: {
            unit: "mm",
            format: [paper.widthMm, paper.heightMm],
            orientation: "portrait",
            compress: true,
          },

          pagebreak: {
            mode: ["css", "legacy"],

            avoid: [
              ".pdf-header",
              ".pdf-signatures",
              ".pdf-footer",
              ".contract-info-grid",
              ".contract-note",
              ".contract-cost-summary",
              ".contract-term-section",
              ".contract-term-subsection",
              ".contract-term-paragraph",
            ],
          },
        })
        .from(clone)
        .toPdf();

      return (await worker.outputPdf("blob")) as Blob;
    } finally {
      container.remove();
    }
  }, [
    contractRef,
    contentWidthMm,
    margins,
    paper.heightMm,
    paper.widthMm,
    scale,
  ]);

  const generatePreview = useCallback(async () => {
    try {
      setIsGenerating(true);

      clearPreview();

      const blob = await buildBlob();

      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);

      setPreviewBlob(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error(error);

      toast.error("No se pudo generar el preview");
    } finally {
      setIsGenerating(false);
    }
  }, [buildBlob, clearPreview]);

  const download = useCallback(async () => {
    try {
      setIsDownloading(true);

      const blob = previewBlob ?? (await buildBlob());

      if (!blob) {
        return;
      }

      downloadBlob(
        blob,
        `Contrato_Instalacion_${documentNumber}_${paper.fileLabel}.pdf`,
      );
    } catch (error) {
      console.error(error);

      toast.error("No se pudo generar el PDF");
    } finally {
      setIsDownloading(false);
    }
  }, [buildBlob, documentNumber, paper.fileLabel, previewBlob]);

  const print = useCallback(() => {
    const iframe = iframeRef.current;

    if (!iframe?.contentWindow) {
      toast.error("Genera primero el preview");

      return;
    }

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, []);

  useEffect(() => {
    clearPreview();
  }, [clearPreview, contentWidthMm, margins, paper.fileLabel, scale]);

  useEffect(() => clearPreview, [clearPreview]);

  return {
    iframeRef,

    previewUrl,

    isGenerating,
    isDownloading,

    generatePreview,
    download,
    print,
  };
}
