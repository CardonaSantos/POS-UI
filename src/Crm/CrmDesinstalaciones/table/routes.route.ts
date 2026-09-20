export const DESINSTALACIONES_ROUTES = {
  listado: "/crm/desinstalaciones",

  crear: "/crm/crear-desinstalacion",

  autorizaciones: "/crm/desinstalacion-auth",

  detalle: (desinstalacionId: number) =>
    `/crm/desinstalacion/${desinstalacionId}`,
} as const;
