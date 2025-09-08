// Claves canónicas (sin espacios). ÚNICA fuente de verdad.
export const ESTADOS_CLIENTE_MAIN = [
  "ACTIVO",
  "DESINSTALADO",
  "ATRASADO",
  "EN_INSTALACION",
  "MOROSO",
  "PAGO_PENDIENTE",
  "PENDIENTE_ACTIVO",
  "SUSPENDIDO",
  "DESCONOCIDO",
] as const;

export type EstadoCliente = (typeof ESTADOS_CLIENTE_MAIN)[number];

// Label “bonito” (con espacios) si lo necesitas en UI
export const ESTADO_LABEL: Record<EstadoCliente, string> = {
  ACTIVO: "ACTIVO",
  DESINSTALADO: "DESINSTALADO",
  ATRASADO: "ATRASADO",
  EN_INSTALACION: "EN INSTALACION",
  MOROSO: "MOROSO",
  PAGO_PENDIENTE: "PAGO PENDIENTE",
  PENDIENTE_ACTIVO: "PENDIENTE ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  DESCONOCIDO: "DESCONOCIDO",
};

// Normalizador: string libre -> EstadoCliente canónico
const SET_ESTADOS = new Set<EstadoCliente>(ESTADOS_CLIENTE_MAIN);
export function toEstadoCliente(v: string): EstadoCliente {
  const norm = v
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/\s+/g, "_")
    .trim() as EstadoCliente;
  return SET_ESTADOS.has(norm) ? norm : "DESCONOCIDO";
}

//

export const getEstadoClienteLabel = (estado: EstadoCliente) =>
  ESTADO_LABEL[estado] ?? "DESCONOCIDO";
