import { FindRutasAsignadasResult } from "./rutas-asignadas.type";

export type RutaAsignadaRow = FindRutasAsignadasResult["rutas"][number];

export function getRutasAsignadasInitialData(): FindRutasAsignadasResult {
  return {
    rutas: [],
    totales: {
      totalClientes: 0,
      totalRutas: 0,
    },
  };
}

export function normalizeRutasAsignadas(
  raw: FindRutasAsignadasResult | undefined,
): FindRutasAsignadasResult {
  if (!raw) return getRutasAsignadasInitialData();

  return {
    rutas: Array.isArray(raw.rutas) ? raw.rutas : [],
    totales: {
      totalClientes: raw.totales?.totalClientes ?? 0,
      totalRutas: raw.totales?.totalRutas ?? 0,
    },
  };
}

export function getCobradorNombre(ruta: RutaAsignadaRow) {
  const nombre = ruta.cobrador?.nombre ?? "Sin cobrador";
  const rol = ruta.cobrador?.rol;

  return rol ? `${nombre} · ${rol}` : nombre;
}
