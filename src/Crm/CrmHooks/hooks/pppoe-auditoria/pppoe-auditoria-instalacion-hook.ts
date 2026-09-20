import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import type { FiltrarAuditoriaPppoeInstalacionParams } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.filters";
import type { InstalacionPppoeAuditoriaResponse } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import { pppoeAuditoriaInstalacionQkeys } from "./qk";

export function useGetAuditoriaPppoeInstalacion(
  instalacionId: number,
  query: FiltrarAuditoriaPppoeInstalacionParams,
  enabled = true,
) {
  return crm.useQueryApi<InstalacionPppoeAuditoriaResponse>(
    pppoeAuditoriaInstalacionQkeys.timeline(instalacionId, query),
    crm_endpoints.pppoe.get_auditoria_instalacion(instalacionId),
    {
      params: query,
    },
    {
      enabled:
        enabled &&
        Number.isInteger(instalacionId) &&
        instalacionId > 0,
    },
  );
}
