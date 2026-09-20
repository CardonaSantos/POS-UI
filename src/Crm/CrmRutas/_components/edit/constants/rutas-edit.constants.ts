import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";

export const RUTA_EDIT_ESTADO_OPTIONS: AppSelectOption<EstadoRuta>[] = [
  {
    value: EstadoRuta.ACTIVO,
    label: "Activo",
  },
  {
    value: EstadoRuta.ASIGNADA,
    label: "Asignada",
  },
  {
    value: EstadoRuta.EN_CURSO,
    label: "En curso",
  },
  {
    value: EstadoRuta.PENDIENTE,
    label: "Pendiente",
  },
  {
    value: EstadoRuta.CERRADO,
    label: "Cerrada",
  },
  {
    value: EstadoRuta.COMPLETADO,
    label: "Completada",
  },
  {
    value: EstadoRuta.INACTIVO,
    label: "Inactiva",
  },
];

export const RUTA_EDIT_ESTADO_LABELS: Record<EstadoRuta, string> = {
  [EstadoRuta.ACTIVO]: "Activo",
  [EstadoRuta.ASIGNADA]: "Asignada",
  [EstadoRuta.EN_CURSO]: "En curso",
  [EstadoRuta.PENDIENTE]: "Pendiente",
  [EstadoRuta.CERRADO]: "Cerrada",
  [EstadoRuta.COMPLETADO]: "Completada",
  [EstadoRuta.INACTIVO]: "Inactiva",
};
