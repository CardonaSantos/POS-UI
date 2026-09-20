import { AutorizacionesPendientesQueryParams } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";

export const desinstalacionesQkeys = {
  all: ["desinstalaciones"] as const,

  lists: () => [...desinstalacionesQkeys.all, "list"] as const,

  list: (query: unknown) => [...desinstalacionesQkeys.lists(), query] as const,

  details: () => [...desinstalacionesQkeys.all, "detail"] as const,

  specific: (desinstalacionId: number) =>
    [...desinstalacionesQkeys.details(), desinstalacionId] as const,

  contexts: () => [...desinstalacionesQkeys.all, "contexto-creacion"] as const,

  contextoCreacion: (clienteId: number) =>
    [...desinstalacionesQkeys.contexts(), clienteId] as const,

  autorizaciones: () =>
    [...desinstalacionesQkeys.all, "autorizaciones"] as const,

  autorizacionesPendientesRoot: () =>
    [...desinstalacionesQkeys.autorizaciones(), "pendientes"] as const,

  autorizacionesPendientes: (params: AutorizacionesPendientesQueryParams) =>
    [...desinstalacionesQkeys.autorizacionesPendientesRoot(), params] as const,
};
