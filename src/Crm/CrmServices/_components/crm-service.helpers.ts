import { EstadoServicioMikrotik } from "@/Crm/features/cliente-interfaces/cliente-types";
import type {
  NuevoServicio,
  NuevoTipoServicio,
  ServicioServiceManage,
  TipoServicio,
} from "../crm-service.types";

export type ServicioFormState = NuevoServicio & {
  id?: number;
  tipoServicioId: string | null;
};

export type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export function createEmptyServicio(empresaId: number): ServicioFormState {
  return {
    nombre: "",
    descripcion: "",
    precio: 0,
    estado: "ACTIVO",
    tipoServicioId: null,
    empresaId,
  };
}

export function createEmptyTipoServicio(): NuevoTipoServicio {
  return {
    nombre: "",
    descripcion: "",
    estado: "ACTIVO",
  };
}

export function servicioToForm(
  servicio: ServicioServiceManage,
): ServicioFormState {
  return {
    id: servicio.id,
    nombre: servicio.nombre ?? "",
    descripcion: servicio.descripcion ?? "",
    precio: Number(servicio.precio ?? 0),
    estado: servicio.estado ?? "ACTIVO",
    tipoServicioId: servicio.tipoServicioId
      ? String(servicio.tipoServicioId)
      : null,
    empresaId: servicio.empresaId,
  };
}

export function buildServicioPayload(form: ServicioFormState) {
  return {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion?.trim() ?? "",
    precio: Number(form.precio ?? 0),
    estado: form.estado,
    tipoServicioId: form.tipoServicioId ? Number(form.tipoServicioId) : null,
    empresaId: Number(form.empresaId),
  };
}

export function buildTipoServicioPayload(form: NuevoTipoServicio) {
  return {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    estado: form.estado,
  };
}

export function normalizeServiciosResponse(
  raw: unknown,
): ServicioServiceManage[] {
  if (Array.isArray(raw)) return raw as ServicioServiceManage[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data))
      return record.data as ServicioServiceManage[];
    if (Array.isArray(record.items))
      return record.items as ServicioServiceManage[];
    if (Array.isArray(record.servicios)) {
      return record.servicios as ServicioServiceManage[];
    }
  }

  return [];
}

export function normalizeTiposServicioResponse(raw: unknown): TipoServicio[] {
  if (Array.isArray(raw)) return raw as TipoServicio[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as TipoServicio[];
    if (Array.isArray(record.items)) return record.items as TipoServicio[];
    if (Array.isArray(record.tipos)) return record.tipos as TipoServicio[];
  }

  return [];
}

export function filterServicios(
  servicios: ServicioServiceManage[],
  search: string,
) {
  const term = search.trim().toLowerCase();

  if (!term) return servicios;

  return servicios.filter((servicio) => {
    return (
      servicio.nombre.toLowerCase().includes(term) ||
      servicio.descripcion?.toLowerCase().includes(term)
    );
  });
}

export function getTipoServicioNombre(
  tipos: TipoServicio[],
  id?: number | null,
) {
  const tipo = tipos.find((item) => item.id === id);

  return tipo?.nombre ?? "Desconocido";
}

export function getEstadoServicioTone(estado?: string): AppBadgeTone {
  if (estado === EstadoServicioMikrotik.ACTIVO || estado === "ACTIVO") {
    return "success";
  }

  if (estado === EstadoServicioMikrotik.SUSPENDIDO || estado === "INACTIVO") {
    return "danger";
  }

  return "neutral";
}

export function validateServicioForm(form: ServicioFormState) {
  if (!form.nombre.trim()) {
    return "Añada un nombre para su servicio.";
  }

  if (!form.precio || Number(form.precio) <= 0) {
    return "Seleccione un precio válido para el servicio.";
  }

  return null;
}

export function validateTipoServicioForm(form: NuevoTipoServicio) {
  if (!form.nombre.trim()) {
    return "Ingrese un nombre válido.";
  }

  if (!form.descripcion.trim()) {
    return "Ingrese una descripción válida.";
  }

  return null;
}
