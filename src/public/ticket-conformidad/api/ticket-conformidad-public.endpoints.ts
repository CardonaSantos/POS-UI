const BASE = "/ticket-soporte-conformidad/public";

export const ticketConformidadPublicEndpoints = {
  detalle: (token: string) => `${BASE}/${encodeURIComponent(token)}`,

  retrabajo: (token: string) =>
    `${BASE}/${encodeURIComponent(token)}/retrabajo`,

  firma: (token: string) => `${BASE}/${encodeURIComponent(token)}/firma`,
} as const;
