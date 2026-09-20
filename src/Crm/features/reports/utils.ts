import type { ReporteServicioOptionSource } from "./reportes-catalogos.interfaces";

export interface ReporteSelectOption<TValue extends string | number> {
  value: TValue;

  label: string;
}

export function toReporteSelectOptions<
  T extends {
    id: number;
    nombre: string;
  },
>(items: readonly T[] | undefined): ReporteSelectOption<number>[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    value: item.id,

    label: item.nombre,
  }));
}

export function toReporteServicioOptions(
  items: readonly ReporteServicioOptionSource[] | undefined,
): ReporteSelectOption<number>[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    value: item.id,

    label: item.velocidad ? `${item.nombre} · ${item.velocidad}` : item.nombre,
  }));
}
