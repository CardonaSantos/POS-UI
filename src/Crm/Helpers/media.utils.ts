// src/Crm/Helpers/media.utils.ts

import { SubirMediaBatchPayload } from "../CrmCustomer/API/payload.interfaces";

export function buildMediaFormData(payload: SubirMediaBatchPayload) {
  const formData = new FormData();

  // Archivos: cada item.file → "files"
  payload.items.forEach((item) => {
    formData.append("files", item.file);
  });

  // Metadatos por archivo (titulo/descripcion/etiqueta)
  formData.append(
    "items",
    JSON.stringify(
      payload.items.map((item) => ({
        titulo: item.titulo ?? "",
        descripcion: item.descripcion ?? "",
        etiqueta: item.etiqueta ?? "",
      }))
    )
  );

  // Campos generales
  formData.append("empresaId", String(payload.empresaId));
  formData.append("clienteId", String(payload.clienteId));

  if (payload.albumId != null) {
    formData.append("albumId", String(payload.albumId));
  }
  if (payload.subidoPorId != null) {
    formData.append("subidoPorId", String(payload.subidoPorId));
  }
  if (typeof payload.publico === "boolean") {
    formData.append("publico", payload.publico ? "true" : "false");
  }

  formData.append("categoria", payload.categoria);

  if (payload.tipo) {
    formData.append("tipo", payload.tipo); // enum TipoMedia se serializa como string
  }

  if (payload.basePrefix) {
    formData.append("basePrefix", payload.basePrefix);
  }

  return formData;
}
