import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";

export interface SubirEvidenciaInstalacionFormData {
  file: File;
  tipo: TipoEvidenciaClienteOperacion;
  descripcion?: string | null;
  orden?: number;
}

export type EvidenciaUploadStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

export type EvidenciaInstalacionDraft = {
  id: string;
  file: File;
  previewUrl: string;

  tipo: TipoEvidenciaClienteOperacion | null;
  descripcion: string;
  orden: number;

  status: EvidenciaUploadStatus;
};

export type SubirEvidenciaInstalacionPayload = {
  file: File;
  tipo: TipoEvidenciaClienteOperacion;
  descripcion?: string | null;
  orden?: number;
};

export function buildEvidenciaInstalacionFormData(
  payload: SubirEvidenciaInstalacionPayload,
): FormData {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("tipo", payload.tipo);
  formData.append("orden", String(payload.orden ?? 0));

  const descripcion = payload.descripcion?.trim();

  if (descripcion) {
    formData.append("descripcion", descripcion);
  }

  return formData;
}
