import type { SolicitarAutorizacionDesinstalacionPayload } from "@/Crm/features/desinstalaciones/solicitar-autorizacion-desinstalacion.payload";
import { SolicitarAutorizacionDesinstalacionFormValues } from "../schemas/solicitar-autorizacion-desinstalacion.schema";

export function toSolicitarAutorizacionDesinstalacionPayload(
  values: SolicitarAutorizacionDesinstalacionFormValues,
): SolicitarAutorizacionDesinstalacionPayload {
  const motivoSolicitud = values.motivoSolicitud.trim();

  return {
    ...(motivoSolicitud
      ? {
          motivoSolicitud,
        }
      : {}),
  };
}
