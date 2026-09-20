// pppoe-reintento-operacion.utils.ts

import { ReintentarPppoeOperacionPayload } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import type { InstalacionPppoeOperacionTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export function buildReintentarPppoeOperacionPayload(
  item: InstalacionPppoeOperacionTimelineItem,
): ReintentarPppoeOperacionPayload {
  const { operacion } = item;

  const errorContext = operacion.errorCodigo
    ? ` debido al error ${operacion.errorCodigo}`
    : "";

  return {
    empresaId: operacion.empresaId,

    claveIdempotencia: [
      "pppoe-reintento",
      operacion.id,
      crypto.randomUUID(),
    ].join(":"),

    motivo:
      `Reintento de la operación ${operacion.tipo} ` +
      `#${operacion.id}${errorContext}.`,
  };
}
