import { TipoMedia } from "@/Crm/CrmCustomer/API/payload.interfaces";

import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";

export interface SubirEvidenciaDesinstalacionResponse {
  evidencia: {
    id: number;

    desinstalacionId: number;

    mediaId: number;

    tipo: TipoEvidenciaClienteOperacion;

    descripcion: string | null;

    orden: number;

    creadoEn: string;
  };

  media: {
    id: number;

    key: string;

    cdnUrl: string | null;

    tipo: TipoMedia;
  };
}
