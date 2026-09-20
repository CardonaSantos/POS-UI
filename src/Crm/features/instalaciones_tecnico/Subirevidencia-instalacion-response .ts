import { TipoMedia } from "@/Crm/CrmCustomer/API/payload.interfaces";
import { TipoEvidenciaClienteOperacion } from "../instalaciones/enums";

export interface SubirEvidenciaInstalacionResponse {
  evidencia: {
    id: number;
    instalacionId: number;
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
    mimeType: string | null;
    titulo: string | null;
  };
}
