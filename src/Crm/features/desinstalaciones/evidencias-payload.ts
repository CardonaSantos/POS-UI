import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";

export interface SubirEvidenciaDesinstalacionFormData {
  file: File;

  tipo: TipoEvidenciaClienteOperacion;

  descripcion?: string | null;

  orden?: number;
}

export type EvidenciaDesinstalacionUploadStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

export type EvidenciaDesinstalacionDraft = {
  id: string;

  file: File;

  previewUrl: string;

  tipo: TipoEvidenciaClienteOperacion | null;

  descripcion: string;

  orden: number;

  status: EvidenciaDesinstalacionUploadStatus;
};

export type SubirEvidenciaDesinstalacionPayload = {
  file: File;

  tipo?: TipoEvidenciaClienteOperacion | null;

  descripcion?: string | null;

  orden?: number;
};

export function buildEvidenciaDesinstalacionFormData({
  file,
  tipo,
  descripcion,
  orden,
}: SubirEvidenciaDesinstalacionPayload) {
  const formData = new FormData();

  formData.append("file", file);

  if (tipo) {
    formData.append("tipo", tipo);
  }

  const descripcionNormalizada = descripcion?.trim();

  if (descripcionNormalizada) {
    formData.append("descripcion", descripcionNormalizada);
  }

  if (typeof orden === "number") {
    formData.append("orden", String(orden));
  }

  return formData;
}
