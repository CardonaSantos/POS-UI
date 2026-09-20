import { useQuery } from "@tanstack/react-query";

import { ticketConformidadPublicQkeys } from "./Qk";
import { TicketConformidadPublicResponse } from "../../types/conformidad-types.public";
import { ticketConformidadPublicClient } from "../../api/ticket-conformidad-public.client";
import { ticketConformidadPublicEndpoints } from "../../api/ticket-conformidad-public.endpoints";

async function getTicketConformidadPublica(
  token: string,
): Promise<TicketConformidadPublicResponse> {
  const response =
    await ticketConformidadPublicClient.get<TicketConformidadPublicResponse>(
      ticketConformidadPublicEndpoints.detalle(token),
    );

  return response.data;
}

export function useTicketConformidadPublica(token: string | undefined) {
  const normalizedToken = token?.trim() ?? "";

  const enabled = normalizedToken.length > 0;

  return useQuery({
    queryKey: ticketConformidadPublicQkeys.detalle(normalizedToken),

    queryFn: () => getTicketConformidadPublica(normalizedToken),

    enabled,

    retry: false,

    refetchOnWindowFocus: false,

    staleTime: 0,
  });
}
