export const contratoQkeys = {
  all: ["contrato"] as const,
  specific: (id: number) => ["contrato", id] as const,
};

export const PlantillaQkeys = {
  all: ["plantillas"] as const,
  specific: (id: number) => ["plantillas", id] as const,
};
