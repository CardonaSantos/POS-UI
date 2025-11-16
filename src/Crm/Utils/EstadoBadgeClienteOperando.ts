// src/Crm/Utils/cliente-estado-badge.ts

import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
const ESTADO_BADGE: Record<EstadoCliente | "DESCONOCIDO", string> = {
  [EstadoCliente.ACTIVO]:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  [EstadoCliente.DESINSTALADO]:
    "bg-gray-200 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  [EstadoCliente.ATRASADO]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  [EstadoCliente.EN_INSTALACION]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  [EstadoCliente.MOROSO]:
    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  [EstadoCliente.PAGO_PENDIENTE]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  [EstadoCliente.PENDIENTE_ACTIVO]:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
  [EstadoCliente.SUSPENDIDO]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  DESCONOCIDO:
    "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
};

// Convierte strings “ACTIVO”, “PENDIENTE ACTIVO”, “pendiente_activo”, etc. → enum key
const toEnumKey = (s: string): EstadoCliente | "DESCONOCIDO" => {
  const t = s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/\s+/g, "_")
    .trim();
  return t in ESTADO_BADGE ? (t as EstadoCliente) : "DESCONOCIDO";
};

// API: acepta enum o string legacy
export function getClienteEstadoBadgeClass(estado: EstadoCliente | string) {
  const key = typeof estado === "string" ? toEnumKey(estado) : estado;
  return ESTADO_BADGE[key] ?? ESTADO_BADGE.DESCONOCIDO;
}
