export const zonasFQkeys = {
  all: ["zonas-facturacion"] as const,

  specific: (id: number) => [...zonasFQkeys.all, id] as const,
};
