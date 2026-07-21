import { TipoEvidenciaClienteOperacion } from "./enums";

export interface SubirEvidenciaInstalacionFormData {
  file: File;
  tipo: TipoEvidenciaClienteOperacion;
  descripcion?: string | null;
  orden?: number;
}
