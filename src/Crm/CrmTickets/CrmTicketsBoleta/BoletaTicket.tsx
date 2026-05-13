"use client";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetBoletaTicket } from "@/Crm/CrmHooks/hooks/use-boleta-ticket/use-boleta-ticket";
import { BoletaSoporteDto } from "@/Crm/features/boleta-ticket/boleta-ticket";
import PrintableBoleta from "./boleta-pdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

function BoletaTicket() {
  const { ticketId } = useParams();
  const boletaId = ticketId ? parseInt(ticketId) : 0;
  const { data: boletaRaw, isLoading: loading } = useGetBoletaTicket(boletaId);
  const boleta = boletaRaw ? boletaRaw : ({} as BoletaSoporteDto);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Factura #123",
    onBeforePrint: async () => {
      console.log("antes de imprimir");
    },
    onAfterPrint: () => {
      console.log("después de imprimir");
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!boleta) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del ticket
        </h2>
      </div>
    );
  }

  return (
    <PageTransitionCrm titleHeader="Boleta de Soporte" variant="fade-pure">
      <div className="flex flex-col items-center gap-4">
        {/* Botón centrado */}
        <div className="w-full flex justify-center">
          <Button size="sm" onClick={handlePrint}>
            Imprimir
          </Button>
        </div>

        {/* Contenido imprimible */}
        <div className="w-full flex justify-center">
          <div className="">
            {" "}
            {/* ancho tipo ticket */}
            <PrintableBoleta ref={contentRef} boleta={boleta} />
          </div>
        </div>
      </div>
    </PageTransitionCrm>
  );
}

export default BoletaTicket;
