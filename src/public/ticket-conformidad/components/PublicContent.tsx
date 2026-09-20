import { useState } from "react";

import { AppStack } from "@/components/app/primitives/app-stack";

import { useTicketConformidadCountdown } from "../hooks/tickets-conformidad/use-ticket-conformidad-countdown";

import { TicketConformidadPublicShell } from "./TicketConformidadPublicShell";
import { TicketConformidadCountdown } from "./TicketConformidadCountdown";
import { TicketConformidadFirmaForm } from "../form/TicketConformidadFirmaForm";
import { TicketConformidadSuccess } from "./TicketConformidadSuccess";

import type { RegistrarFirmaTicketConformidadResponse } from "../types/ticket-conformidad-public.types";

interface PublicContentProps {
  token: string;

  data: {
    ticket: {
      id: number;
      titulo: string | null;
      descripcion: string | null;
    };

    cliente: {
      nombreCompleto: string;
      telefono: string | null;
    } | null;

    conformidad: {
      expiraEn: string;
    };
  };
}

export function PublicContent({ data, token }: PublicContentProps) {
  const [firmaResponse, setFirmaResponse] =
    useState<RegistrarFirmaTicketConformidadResponse | null>(null);

  const countdown = useTicketConformidadCountdown(data.conformidad.expiraEn);

  const canRespond = countdown.validDate && !countdown.expired;

  const handleFirmaCompleted = (
    response: RegistrarFirmaTicketConformidadResponse,
  ) => {
    setFirmaResponse(response);
  };

  const firmaCompletada = firmaResponse !== null;

  return (
    <TicketConformidadPublicShell>
      <AppStack gap="md">
        {/* TU HEADER ACTUAL */}

        {/* TU CARD DE TICKET ACTUAL */}

        {!firmaCompletada && (
          <TicketConformidadCountdown expiraEn={data.conformidad.expiraEn} />
        )}

        {canRespond && !firmaCompletada && (
          <TicketConformidadFirmaForm
            onBack={() => {}}
            token={token}
            nombreInicial={data.cliente?.nombreCompleto}
            telefonoInicial={data.cliente?.telefono}
            onCompleted={handleFirmaCompleted}
          />
        )}

        {firmaCompletada && (
          <TicketConformidadSuccess ticketId={data.ticket.id} />
        )}
      </AppStack>
    </TicketConformidadPublicShell>
  );
}
