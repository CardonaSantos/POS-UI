import { AutorizacionPendienteListItem } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";

export type AutorizacionDesinstalacionActionRequest =
  | {
      action: "aprobar";

      item: AutorizacionPendienteListItem;
    }
  | {
      action: "rechazar";

      item: AutorizacionPendienteListItem;
    };
