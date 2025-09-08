// utils/numberInRangeTable.ts
import { FilterFn } from "@tanstack/react-table";

export type RangeValue = [number | null, number | null];

export const numberInRangeTable = <T>(): FilterFn<T> => {
  const fn: FilterFn<T> = (row, columnId, value: RangeValue) => {
    const [min, max] = Array.isArray(value) ? value : [null, null];

    const raw = row.getValue(columnId);
    const numero = typeof raw === "number" ? raw : Number(raw);
    if (Number.isNaN(numero)) return false;

    const minOK = min == null || numero >= min;
    const maxOK = max == null || numero <= max; // ← FIX
    return minOK && maxOK;
  };

  // Opcional: limpia el filtro si no hay valores
  fn.autoRemove = (val?: RangeValue) =>
    !val ||
    (Array.isArray(val) && val.every((v) => v == null || v.toString() === ""));

  return fn;
};
