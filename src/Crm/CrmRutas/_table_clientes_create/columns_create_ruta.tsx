// columnsClientesRutaCreate.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ClienteInternetFromCreateRuta } from "../rutas-types";
import { makeEsStringSort } from "@/utils/esStringSortCollatorTanstak";
import { textIncludesTable } from "@/utils/textIncludesTableTanstak";
import { numberInRangeTable } from "@/utils/numberInRangeTanstak";
import { SortCaret } from "@/Crm/Utils/Components/SortCaret";
import { formattMonedaGT } from "@/utils/formattMonedaGt";

const esStringSort = makeEsStringSort<ClienteInternetFromCreateRuta>();
const includesFilter = textIncludesTable<ClienteInternetFromCreateRuta>();
const numberInRange = numberInRangeTable<ClienteInternetFromCreateRuta>();

const HDR = {
  wrap: "flex flex-col gap-1 min-w-0",
  btn: "inline-flex items-center gap-1",
  input: "border px-2 py-0.5 text-xs h-7 w-full rounded-md bg-background",
  inputXXS:
    "border px-1.5 py-0.5 h-7 w-[56px] text-[11px] rounded-md bg-background text-right",
} as const;

const numericSort = (a: any, b: any, colId: string) =>
  Number(a.getValue(colId) ?? 0) - Number(b.getValue(colId) ?? 0);

export const columnsClientesRutaCreate: ColumnDef<ClienteInternetFromCreateRuta>[] =
  [
    {
      id: "nombre",
      accessorFn: (r) => `${r.nombre} · ${r.apellidos ?? "N/A"}`,
      size: 210,
      enableSorting: true,
      sortingFn: esStringSort,
      enableColumnFilter: true,
      filterFn: includesFilter,
      meta: { align: "left" },
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "");
        return (
          <span className="block truncate" title={v}>
            {v}
          </span>
        );
      },
      header: ({ column }) => (
        <div className={HDR.wrap}>
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={HDR.btn}
          >
            <span>Nombre</span>
            <SortCaret sorted={column.getIsSorted()} />
          </button>
          <input
            className={HDR.input}
            placeholder="Filtrar…"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },
    {
      accessorKey: "direccion",
      size: 270,
      enableSorting: true,
      sortingFn: esStringSort,
      enableColumnFilter: true,
      filterFn: includesFilter,
      meta: { align: "left" },
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "—");
        return (
          <span className="block truncate" title={v}>
            {v}
          </span>
        );
      },
      header: ({ column }) => (
        <div className={HDR.wrap}>
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={HDR.btn}
          >
            <span>Dirección</span>
            <SortCaret sorted={column.getIsSorted()} />
          </button>
          <input
            className={HDR.input}
            placeholder="Filtrar…"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },
    {
      accessorKey: "estadoCliente",
      size: 110,
      enableSorting: true,
      sortingFn: esStringSort,
      enableColumnFilter: true,
      filterFn: includesFilter,
      meta: { align: "left", serverSortKey: "estadoCliente" },
      cell: ({ getValue }) => (
        <span className="block truncate">{String(getValue() ?? "")}</span>
      ),
      header: ({ column }) => (
        <div className={HDR.wrap}>
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={HDR.btn}
          >
            <span>Estado</span>
            <SortCaret sorted={column.getIsSorted()} />
          </button>
          <input
            className={HDR.input}
            placeholder="Filtrar…"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },

    // 🔰 NUEVA columna principal: Facturas (conteo arriba) + saldo abajo
    {
      accessorKey: "facturasPendientes",
      size: 130,
      enableSorting: true,
      sortingFn: numericSort,
      enableColumnFilter: true,
      filterFn: numberInRange, // filtra por cantidad de facturas
      meta: { align: "right", serverSortKey: "facturasPendientes" },
      cell: ({ getValue, row }) => {
        const count = Number(getValue() ?? 0);
        const saldo = Number((row.original as any)?.saldoPendiente ?? 0);
        return (
          <div className="flex flex-col items-end gap-0.5 leading-tight">
            <span
              className="inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full border px-1.5
                       text-xs font-medium bg-amber-50 text-amber-700 border-amber-200
                       dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30"
              title={`${count} factura(s) pendiente(s)`}
            >
              {count}
            </span>
            <span className="text-[11px] opacity-70">
              {formattMonedaGT(saldo)}
            </span>
          </div>
        );
      },
      header: ({ column }) => {
        const [min, max] = (column.getFilterValue() as [
          number | null,
          number | null
        ]) ?? [null, null];
        return (
          <div className={HDR.wrap}>
            <button
              type="button"
              onClick={column.getToggleSortingHandler()}
              className={HDR.btn}
            >
              <span>F. Pendientes</span>
              <SortCaret sorted={column.getIsSorted()} />
            </button>
            <div className="w-full items-center gap-1">
              <input
                type="number"
                className="border px-1.5 py-0.5 h-7 w-full text-[11px] rounded-md bg-background text-right"
                placeholder="Min"
                value={min ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  column.setFilterValue([
                    v === "" ? null : Number(v),
                    max ?? null,
                  ]);
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        );
      },
    },

    {
      id: "sector",
      accessorFn: (row) => row.sector?.nombre ?? "—",
      size: 120,
      enableSorting: true,
      sortingFn: esStringSort,
      enableColumnFilter: true,
      filterFn: includesFilter,
      meta: { align: "left", serverSortKey: "sector.nombre" },
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "—");
        return (
          <span className="block truncate" title={v}>
            {v}
          </span>
        );
      },
      header: ({ column }) => (
        <div className={HDR.wrap}>
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={HDR.btn}
          >
            <span>Sector</span>
            <SortCaret sorted={column.getIsSorted()} />
          </button>
          <input
            className={HDR.input}
            placeholder="Filtrar…"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },
    {
      accessorKey: "zonaFacturacion",
      size: 130,
      enableSorting: true,
      sortingFn: esStringSort,
      enableColumnFilter: true,
      filterFn: includesFilter,
      meta: { align: "left", serverSortKey: "zonaFacturacion" },
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "—");
        return (
          <span className="block truncate" title={v}>
            {v}
          </span>
        );
      },
      header: ({ column }) => (
        <div className={HDR.wrap}>
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={HDR.btn}
          >
            <span>Z. Facturación</span>
            <SortCaret sorted={column.getIsSorted()} />
          </button>
          <input
            className={HDR.input}
            placeholder="Filtrar…"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      ),
    },
  ];
