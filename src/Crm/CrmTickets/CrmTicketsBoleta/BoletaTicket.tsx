"use client";

import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { Button } from "@/components/ui/button";

import { useGetBoletaTicket } from "@/Crm/CrmHooks/hooks/use-boleta-ticket/use-boleta-ticket";

import PrintableBoleta from "./boleta-pdf";

function BoletaTicket() {
  const { ticketId } = useParams();

  const boletaId = ticketId ? Number(ticketId) : 0;

  const { data: boleta, isLoading: loading } = useGetBoletaTicket(boletaId);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,

    documentTitle: `Boleta Soporte #${boletaId}`,
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  if (!boleta) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del ticket
        </h2>
      </div>
    );
  }

  return (
    <PageTransitionCrm titleHeader="Boleta de Soporte" variant="fade-pure">
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full justify-center">
          <Button size="sm" onClick={handlePrint}>
            Imprimir
          </Button>
        </div>

        <div className="flex w-full justify-center overflow-x-auto">
          <PrintableBoleta ref={contentRef} boleta={boleta} />
        </div>
      </div>
    </PageTransitionCrm>
  );
}

export default BoletaTicket;
