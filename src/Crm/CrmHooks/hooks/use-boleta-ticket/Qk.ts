export const boletaTicketQkeys = {
  specific: (id: number) => ["boleta", id] as const,
  all: ["boleta"] as const,
};
