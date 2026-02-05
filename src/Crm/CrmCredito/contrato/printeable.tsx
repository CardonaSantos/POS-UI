"use client";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { Button } from "@/components/ui/button";
import { useGetHtml } from "@/Crm/CrmHooks/hooks/use-contrato/use-contrato";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";

export default function PrinteablePlantilla() {
  const params = useParams();
  const plantillaId = Number(params.plantillaId);
  const creditoId = Number(params.creditoId);
  const { data, isLoading, isError } = useGetHtml(plantillaId, creditoId);

  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;
  if (isError || !data)
    return <div className="p-8 text-center text-red-500">Error</div>;

  return (
    <PageTransitionCrm
      titleHeader="Contrato"
      subtitle="Vista de impresión"
      variant="fade-pure"
    >
      <div className="print:hidden mb-6 flex justify-end gap-4 px-4 sm:px-0">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimir Contrato
        </Button>
      </div>

      <div className="flex justify-center bg-gray-100/50 p-4 sm:p-8 print:p-0 print:bg-white">
        {/* TAMAÑO CARTA REAL (8.5in x 11in) */}
        <div
          id="hoja-contrato"
          className="bg-white shadow-xl print:shadow-none p-[2.5cm] max-w-[21.59cm] min-h-[27.94cm] w-full text-black"
        >
          <div
            className="contrato-content"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        </div>
      </div>

      <style>{`
        /* 1. Estilos de visualización (Tipografía legible para Carta) */
        .contrato-content h1 { font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; }
        .contrato-content h2 { font-size: 18px; font-weight: bold; margin-bottom: 14px; }
        .contrato-content h3 { font-size: 14px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; text-transform: uppercase; }
        /* Fuente 11pt o 12pt es estándar para contratos en Carta */
        .contrato-content p { margin-bottom: 12px; line-height: 1.5; font-size: 11pt; text-align: justify; }
        .contrato-content strong { font-weight: bold; }
        .contrato-content ul { list-style-type: disc; margin-left: 24px; margin-bottom: 12px; }
        .contrato-content hr { margin: 18px 0; border-top: 1px solid #000; }

        /* 2. Reglas de Impresión Estrictas */
        @media print {
          @page {
            size: letter; /* Forzamos hoja Carta */
            margin: 0;    /* Sin margen de navegador, usamos el padding del div */
          }

          body {
            background-color: white;
            visibility: hidden; /* Ocultamos la interfaz de la app */
            height: auto;
          }

          #hoja-contrato {
            visibility: visible; /* Mostramos solo el contrato */
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2.5cm !important; /* Margen estándar legal (aprox 1 pulgada) */
            
            /* Asegurar tinta negra real */
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #hoja-contrato * {
            visibility: visible;
          }
        }
      `}</style>
    </PageTransitionCrm>
  );
}
