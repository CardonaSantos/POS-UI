import { SortingFn } from "@tanstack/react-table";
//FUNCION VANILLA TS
const esCollator = new Intl.Collator("es", {
  usage: "sort",
  sensitivity: "base",
  numeric: true,
  ignorePunctuation: true,
});
//ALGORITMO DE ORDENAMIENTO POR NOMBRE PARA TANSTAKTABLE
export const makeEsStringSort =
  <TDataGenerico>(): SortingFn<TDataGenerico> =>
  (rowA, rowB, columnID) => {
    const a = String(rowA.getValue(columnID) ?? "");
    const b = String(rowB.getValue(columnID) ?? "");
    return esCollator.compare(a, b);
  };
