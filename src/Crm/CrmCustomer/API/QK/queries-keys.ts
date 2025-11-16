// customer-profile.queries.ts (o en un archivo aparte de keys)
export const clienteKeys = {
  all: ["cliente"] as const,
  details: (clienteId: number) => ["cliente", "details", clienteId] as const,
  plantillasContrato: ["cliente", "plantillas-contrato"] as const,
  media: (clienteId: number) => ["cliente", "media", clienteId] as const,
};
