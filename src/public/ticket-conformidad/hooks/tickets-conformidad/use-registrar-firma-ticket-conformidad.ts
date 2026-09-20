import { useMutation } from "@tanstack/react-query";

import { ticketConformidadPublicQkeys } from "./Qk";
import {
  RegistrarFirmaTicketConformidadPayload,
  RegistrarFirmaTicketConformidadResponse,
} from "../../types/ticket-conformidad-public.types";
import { ticketConformidadPublicClient } from "../../api/ticket-conformidad-public.client";
import { ticketConformidadPublicEndpoints } from "../../api/ticket-conformidad-public.endpoints";

async function registrarFirmaTicketConformidad(
  token: string,
  payload: RegistrarFirmaTicketConformidadPayload,
): Promise<RegistrarFirmaTicketConformidadResponse> {
  const formData = new FormData();

  formData.append("nombreFirmante", payload.nombreFirmante.trim());

  formData.append("telefonoFirmante", payload.telefonoFirmante.trim());

  formData.append("firma", payload.firma);

  const response =
    await ticketConformidadPublicClient.post<RegistrarFirmaTicketConformidadResponse>(
      ticketConformidadPublicEndpoints.firma(token),
      formData,
    );

  return response.data;
}

export function useRegistrarFirmaTicketConformidad(token: string) {
  return useMutation({
    mutationKey: ticketConformidadPublicQkeys.firma(token),

    mutationFn: (payload: RegistrarFirmaTicketConformidadPayload) =>
      registrarFirmaTicketConformidad(token, payload),
  });
}
