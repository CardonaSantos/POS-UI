export const contratoQkeys = {
  all: ["contrato"] as const,

  instalacion: (instalacionId: number, plantillaId: number) =>
    [...contratoQkeys.all, "instalacion", instalacionId, plantillaId] as const,
};

export const PlantillaQkeys = {
  all: ["plantillas"] as const,
  specific: (id: number) => ["plantillas", id] as const,
};
