import { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";
import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";
import type { VisibilityState } from "@tanstack/react-table";

export const RUTAS_LIST_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export const INITIAL_RUTAS_LIST_COLUMN_VISIBILITY: VisibilityState = {
  observaciones: false,
};

export const ESTADO_RUTA_OPTIONS: AppOption[] = [
  { value: "TODOS", label: "Todos" },
  { value: EstadoRuta.ACTIVO, label: "Activo" },
  { value: EstadoRuta.ASIGNADA, label: "Asignada" },
  { value: EstadoRuta.EN_CURSO, label: "En curso" },
  { value: EstadoRuta.PENDIENTE, label: "Pendiente" },
  { value: EstadoRuta.CERRADO, label: "Cerrada" },
  { value: EstadoRuta.COMPLETADO, label: "Completada" },
  { value: EstadoRuta.INACTIVO, label: "Inactiva" },
];

export const ESTADO_RUTA_LABELS: Record<string, string> = {
  ACTIVO: "Activo",
  EN_CURSO: "En curso",
  CERRADO: "Cerrada",
  ASIGNADA: "Asignada",
  PENDIENTE: "Pendiente",
  COMPLETADO: "Completada",
  INACTIVO: "Inactiva",
};

export function formatGTQ(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
