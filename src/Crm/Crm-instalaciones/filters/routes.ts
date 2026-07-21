export const INSTALACIONES_ROUTES = {
  listado: "/crm/instalaciones",

  crear: "/crm/crear-instalacion",

  detalle: (instalacionId: number) => `/crm/instalacion/${instalacionId}`,

  editar: (instalacionId: number) =>
    `/crm/instalaciones/${instalacionId}/editar`,
} as const;
