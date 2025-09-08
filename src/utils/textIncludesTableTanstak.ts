import { FilterFn } from "@tanstack/react-table";

const norm = (s: string) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const textIncludesTable = <TDataGenerico>(): FilterFn<TDataGenerico> => {
  const fn: FilterFn<TDataGenerico> = (row, columnID, value) => {
    const cell = norm(row.getValue(columnID));

    const query = norm(value);
    return cell.includes(query);
  };

  (fn as any).autoRemove = (val: unknown) => {
    !val || String(val).trim() === "";
  };

  return fn;
};
