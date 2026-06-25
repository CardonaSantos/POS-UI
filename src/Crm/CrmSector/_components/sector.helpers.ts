import type {
  Municipio,
  Sector,
} from "../../features/cliente-interfaces/cliente-types";
import type { Departamentos } from "../../features/locations-interfaces/municipios_departamentos.interfaces";

export type SectorFormState = {
  id?: number;
  nombre: string;
  descripcion: string;
  municipioId: string;
  departamentoId: string | null;
};

export type SectorPayload = Omit<
  Sector,
  "id" | "creadoEn" | "actualizadoEn" | "clientes"
>;

export type AppOption = {
  value: string;
  label: string;
};

export const DEFAULT_DEPARTAMENTO_ID = "8";

export function createEmptySectorForm(): SectorFormState {
  return {
    nombre: "",
    descripcion: "",
    municipioId: "",
    departamentoId: DEFAULT_DEPARTAMENTO_ID,
  };
}

export function getSectorDepartamentoId(sector: Sector): string | null {
  const municipio = sector.municipio as
    | (Municipio & { departamentoId?: number | string | null })
    | undefined;

  if (municipio?.departamentoId) {
    return String(municipio.departamentoId);
  }

  return DEFAULT_DEPARTAMENTO_ID;
}

export function sectorToForm(sector: Sector): SectorFormState {
  return {
    id: sector.id,
    nombre: sector.nombre ?? "",
    descripcion: sector.descripcion ?? "",
    municipioId: sector.municipioId ? String(sector.municipioId) : "",
    departamentoId: getSectorDepartamentoId(sector),
  };
}

export function buildSectorPayload(form: SectorFormState): SectorPayload {
  return {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim() || null,
    municipioId: Number(form.municipioId),
  } as SectorPayload;
}

export function validateSectorForm(form: SectorFormState) {
  if (!form.nombre.trim()) {
    return "El nombre del sector es obligatorio.";
  }

  if (!form.municipioId) {
    return "Debe seleccionar un municipio.";
  }

  return null;
}

export function normalizeSectoresResponse(raw: unknown): Sector[] {
  if (Array.isArray(raw)) return raw as Sector[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Sector[];
    if (Array.isArray(record.items)) return record.items as Sector[];
    if (Array.isArray(record.sectors)) return record.sectors as Sector[];
    if (Array.isArray(record.sectores)) return record.sectores as Sector[];
  }

  return [];
}

export function normalizeDepartamentosResponse(raw: unknown): Departamentos[] {
  if (Array.isArray(raw)) return raw as Departamentos[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Departamentos[];
    if (Array.isArray(record.items)) return record.items as Departamentos[];
    if (Array.isArray(record.departamentos)) {
      return record.departamentos as Departamentos[];
    }
  }

  return [];
}

export function normalizeMunicipiosResponse(raw: unknown): Municipio[] {
  if (Array.isArray(raw)) return raw as Municipio[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Municipio[];
    if (Array.isArray(record.items)) return record.items as Municipio[];
    if (Array.isArray(record.municipios))
      return record.municipios as Municipio[];
  }

  return [];
}

export function filterSectores(
  sectores: Sector[],
  municipios: Municipio[],
  search: string,
) {
  const term = search.trim().toLowerCase();

  if (!term) return sectores;

  return sectores.filter((sector) => {
    const municipioNombre =
      sector.municipio?.nombre ??
      municipios.find((municipio) => municipio.id === sector.municipioId)
        ?.nombre ??
      "";

    return (
      sector.nombre.toLowerCase().includes(term) ||
      sector.descripcion?.toLowerCase().includes(term) ||
      municipioNombre.toLowerCase().includes(term) ||
      String(sector.id).includes(term)
    );
  });
}

export function getSectorStats(sectores: Sector[]) {
  const totalClientes = sectores.reduce(
    (acc, sector) => acc + (sector.clientes?.length ?? 0),
    0,
  );

  const municipiosIds = new Set(
    sectores
      .map((sector) => sector.municipioId)
      .filter((municipioId): municipioId is number => Boolean(municipioId)),
  );

  return {
    totalSectores: sectores.length,
    totalClientes,
    totalMunicipios: municipiosIds.size,
  };
}

export function toDepartamentoOptions(
  departamentos: Departamentos[],
): AppOption[] {
  return departamentos.map((departamento) => ({
    value: String(departamento.id),
    label: departamento.nombre,
  }));
}

export function toMunicipioOptions(municipios: Municipio[]): AppOption[] {
  return municipios.map((municipio) => ({
    value: String(municipio.id),
    label: municipio.nombre,
  }));
}
