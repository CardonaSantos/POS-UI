export const ticketConformidadQkeys = {
  all: ["ticket-soporte-conformidad"] as const,

  actualByTicket: (ticketId: number) =>
    [...ticketConformidadQkeys.all, "ticket", ticketId, "actual"] as const,

  detalle: (conformidadId: number) =>
    [...ticketConformidadQkeys.all, "detalle", conformidadId] as const,

  publicByToken: (token: string) =>
    [...ticketConformidadQkeys.all, "public", token] as const,
};
