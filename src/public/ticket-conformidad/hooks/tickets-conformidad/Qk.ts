export const ticketConformidadPublicQkeys = {
  all: ["ticket-conformidad-public"] as const,

  detalle: (token: string) =>
    [...ticketConformidadPublicQkeys.all, "detalle", token] as const,

  firma: (token: string) =>
    [...ticketConformidadPublicQkeys.all, "firma", token] as const,
};
