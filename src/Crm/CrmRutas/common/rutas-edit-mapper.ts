import type {
  RutaEditDetail,
  UpdateRutaPayload,
} from "@/Crm/features/rutas/ruta-edit.types";
import { RutaEditFormValues } from "../schemas/rutas-edit.schema";

export function rutaEditDetailToFormValues(
  ruta: RutaEditDetail,
): RutaEditFormValues {
  return {
    nombreRuta: ruta.nombreRuta ?? "",

    cobradorId: ruta.cobradorId ? String(ruta.cobradorId) : null,

    estadoRuta: ruta.estadoRuta,

    observaciones: ruta.observaciones ?? "",

    clientes: ruta.clientes.map((cliente) => cliente.id).sort((a, b) => a - b),
  };
}

export function rutaEditFormToPayload(
  values: RutaEditFormValues,
  empresaId: number,
): UpdateRutaPayload {
  return {
    nombreRuta: values.nombreRuta?.trim() ?? "",
    cobradorId: values.cobradorId ? Number(values.cobradorId) : undefined,

    empresaId,

    estadoRuta: values.estadoRuta,

    observaciones: values.observaciones?.trim() || undefined,
    clientes: values.clientes,
  };
}
