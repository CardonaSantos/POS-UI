import type { FiltrarAuditoriaPppoeInstalacionParams } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.filters";

export const pppoeAuditoriaInstalacionQkeys = {
  all: ["pppoe-auditoria-instalacion"] as const,

  byInstalacion: (instalacionId: number) =>
    [...pppoeAuditoriaInstalacionQkeys.all, instalacionId] as const,

  timeline: (
    instalacionId: number,
    query: FiltrarAuditoriaPppoeInstalacionParams,
  ) =>
    [
      ...pppoeAuditoriaInstalacionQkeys.byInstalacion(instalacionId),
      "timeline",
      query,
    ] as const,
};
