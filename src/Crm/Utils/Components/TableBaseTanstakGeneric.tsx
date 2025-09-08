// TableBaseGeneric.tsx
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { makeFadeSlide } from "@/animations/tableAnimation1";
import { SortCaret } from "./SortCaret";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from "lucide-react";

// Animaciones / densidad
const cellVariant = makeFadeSlide("up", 8);
const headerVariant = makeFadeSlide("down", 6);
const rowTransition: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 20,
} as const;

type Density = "compact" | "normal" | "spacious";
const densityMap: Record<
  Density,
  { th: string; td: string; input: string; row: string }
> = {
  compact: {
    th: "px-2 py-1 text-xs",
    td: "px-2 py-1 text-xs",
    input: "h-7 px-2 py-0.5 text-xs",
    row: "h-9",
  },
  normal: {
    th: "px-3 py-2 text-sm",
    td: "px-3 py-2 text-sm",
    input: "h-9 px-3 py-1.5 text-sm",
    row: "h-11",
  },
  spacious: {
    th: "px-4 py-3",
    td: "px-4 py-3",
    input: "h-10 px-3 py-2",
    row: "h-12",
  },
};

type TableBaseProps<T extends { id?: number | string }> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  serverPagination?: boolean;
  total?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onRefetch?: () => void;
  isFetching?: boolean;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  getRowId?: (row: T, index: number) => string;

  // Apariencia
  density?: Density; // default 'compact'
  enforceColWidths?: boolean; // default true
  colWidthDefault?: number; // default 140
  tableLayout?: "fixed" | "auto"; // default 'fixed'
  stickyHeader?: boolean; // default true

  // Selección
  enableRowSelection?: boolean; // default false
  rowSelection?: RowSelectionState; // controlado (opcional)
  onRowSelectionChange?: (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;
  getRowCanSelect?: (row: T) => boolean; // ej. deshabilitar si no tiene facturas
};

// --- Columna de selección (factory genérica y tipada) ---
function makeSelectionColumn<T>(opts: {
  getRowCanSelect?: (row: T) => boolean;
}): ColumnDef<T, unknown> {
  const { getRowCanSelect } = opts;
  return {
    id: "_select",
    size: 36,
    meta: { align: "center", label: "" },
    enableHiding: false, // <- no se puede ocultar
    enableSorting: false,
    enableColumnFilter: false,
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      const some = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          className="h-4 w-4"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Seleccionar página"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        className="h-4 w-4"
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        disabled={getRowCanSelect ? !getRowCanSelect(row.original as T) : false}
        aria-label="Seleccionar fila"
      />
    ),
  };
}

export function TableBaseGeneric<T extends { id?: number | string }>(
  props: TableBaseProps<T>
) {
  const {
    columns,
    data,
    serverPagination = false,
    total,
    pageIndex: extPageIndex,
    pageSize: extPageSize,
    onPageChange,
    pageSizeOptions = [10, 20, 50, 100],
    isLoading,
    getRowId,

    isFetching,
    onRefetch,

    density = "compact",
    enforceColWidths = true,
    colWidthDefault = 140,
    tableLayout = "fixed",
    stickyHeader = true,

    enableRowSelection = false,
    rowSelection: extRowSel,
    onRowSelectionChange,
    getRowCanSelect,
  } = props;

  const D = densityMap[density];
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // 🔸 helper: resuelve Updater -> objeto plano
  const resolveRowSel = React.useCallback(
    (u: Updater<RowSelectionState>): RowSelectionState =>
      typeof u === "function"
        ? (u as (old: RowSelectionState) => RowSelectionState)(
            extRowSel ?? rowSelection
          )
        : (u as RowSelectionState),
    [extRowSel, rowSelection]
  );

  // Estado controlado/no controlado
  const [pagination, setPagination] = React.useState({
    pageIndex: extPageIndex ?? 0,
    pageSize: extPageSize ?? pageSizeOptions[0],
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    if (extPageIndex !== undefined || extPageSize !== undefined) {
      setPagination((p) => ({
        pageIndex: extPageIndex ?? p.pageIndex,
        pageSize: extPageSize ?? p.pageSize,
      }));
    }
  }, [extPageIndex, extPageSize]);

  const pageCount = React.useMemo(() => {
    if (!serverPagination) return undefined;
    const totalSafe = total ?? 0;
    return Math.max(1, Math.ceil(totalSafe / (pagination.pageSize || 1)));
  }, [serverPagination, total, pagination.pageSize]);

  // Columna de selección (opcional) e inyección
  const selectionCol = React.useMemo<ColumnDef<T, unknown> | null>(
    () =>
      enableRowSelection ? makeSelectionColumn<T>({ getRowCanSelect }) : null,
    [enableRowSelection, getRowCanSelect]
  );

  const innerColumns = React.useMemo<ColumnDef<T, any>[]>(() => {
    const base = columns as ColumnDef<T, any>[];
    return selectionCol ? [selectionCol as ColumnDef<T, any>, ...base] : base;
  }, [selectionCol, columns]);

  // Tabla tipada
  const table = useReactTable<T>({
    data,
    columns: innerColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      ...(enableRowSelection && { rowSelection: extRowSel ?? rowSelection }),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const next = typeof updater === "function" ? updater(old) : updater;
        onPageChange?.(next.pageIndex, next.pageSize);
        return next;
      });
    },

    ...(enableRowSelection && {
      enableRowSelection: true,
      // 🔸 normalizamos SIEMPRE a objeto y propagamos
      onRowSelectionChange: (u) => {
        const next = resolveRowSel(u);
        setRowSelection(next);
        onRowSelectionChange?.(next);
      },
      getRowCanSelect: (row: any) =>
        getRowCanSelect ? !!getRowCanSelect(row.original as T) : true,
    }),

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),
    manualPagination: !!serverPagination,
    manualSorting: false,
    manualFiltering: false,
    pageCount,

    getRowId: getRowId ?? ((row, idx) => String((row as any).id ?? idx)),
  });

  const getAlign = (meta?: any) =>
    meta?.align === "right"
      ? "text-right"
      : meta?.align === "center"
      ? "text-center"
      : "text-left";

  // 👇 Diferenciamos todas vs visibles
  const allLeafCols = table.getAllLeafColumns();
  const visibleLeafCols = table.getVisibleLeafColumns();

  // Señal para re-animar celdas
  const sig = JSON.stringify({
    s: table.getState().sorting,
    f: table.getState().columnFilters,
    p: table.getState().pagination,
  });

  return (
    <div className="w-full">
      {onRefetch && (
        <div className="flex justify-end mb-2">
          <Button
            type="button"
            onClick={onRefetch}
            aria-busy={!!isFetching}
            disabled={!!isFetching}
            className="h-8 gap-2 text-xs"
          >
            Refrescar datos
            <RotateCcw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      )}

      {/* Toggles de visibilidad (todas, pero solo las que se pueden ocultar) */}
      <div className="flex flex-wrap gap-3 mb-2">
        {allLeafCols
          .filter((c) => c.getCanHide())
          .map((col) => {
            const label =
              (col.columnDef as any)?.meta?.label ??
              (typeof col.columnDef.header === "string"
                ? col.columnDef.header
                : col.id);
            const id = `col-vis-${col.id}`;
            return (
              <div
                key={col.id}
                className="inline-flex items-center gap-2 text-xs"
              >
                <Checkbox
                  id={id}
                  className="h-4 w-4"
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                />
                <label htmlFor={id} className="cursor-pointer select-none">
                  {label}
                </label>
              </div>
            );
          })}
      </div>

      <div className="overflow-x-hidden">
        <table
          className={`w-full ${
            tableLayout === "fixed" ? "table-fixed" : "table-auto"
          } border-collapse`}
        >
          {/* Anchos solo para columnas VISIBLES */}
          <colgroup>
            {visibleLeafCols.map((col) => {
              const defSize = (col.columnDef as any)?.size as
                | number
                | undefined;
              const width = defSize ?? colWidthDefault;
              return (
                <col
                  key={col.id}
                  style={enforceColWidths ? { width: `${width}px` } : undefined}
                />
              );
            })}
          </colgroup>

          <thead
            className={stickyHeader ? "sticky top-0 bg-background z-10" : ""}
          >
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className={D.row}>
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted();
                  const ariaSort =
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                      ? "descending"
                      : "none";
                  return (
                    <th
                      key={h.id}
                      scope="col"
                      aria-sort={ariaSort as any}
                      className={`${D.th} font-semibold ${getAlign(
                        h.column.columnDef.meta
                      )} whitespace-nowrap`}
                    >
                      {h.isPlaceholder ? null : typeof h.column.columnDef
                          .header === "function" ? (
                        flexRender(h.column.columnDef.header, h.getContext())
                      ) : h.column.getCanSort() ? (
                        <motion.button
                          type="button"
                          variants={headerVariant}
                          initial="hidden"
                          animate="visible"
                          onClick={h.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1"
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                          <SortCaret sorted={h.column.getIsSorted()} />
                        </motion.button>
                      ) : (
                        <motion.div
                          variants={headerVariant}
                          initial="hidden"
                          animate="visible"
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                        </motion.div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td className={D.td} colSpan={visibleLeafCols.length}>
                  Cargando…
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout
                  transition={rowTransition}
                  className={`border-t ${D.row}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`${D.td} ${getAlign(
                        cell.column.columnDef.meta
                      )}`}
                    >
                      <motion.div
                        key={sig + cell.id}
                        variants={cellVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full truncate"
                        title={String(cell.getValue() ?? "")}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </motion.div>
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td className={D.td} colSpan={visibleLeafCols.length}>
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación compacta */}
      <div className="flex items-center gap-2 py-2 text-xs">
        <button
          className=" hover:cursor-pointer"
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          className=" hover:cursor-pointer "
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span>
          Página <b>{table.getState().pagination.pageIndex + 1}</b> de{" "}
          <b>{table.getPageCount() || 1}</b>
        </span>
        <button
          className=" hover:cursor-pointer "
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          className=" hover:cursor-pointer "
          type="button"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            const ps = Number(e.target.value);
            setPagination(() => {
              const next = { pageIndex: 0, pageSize: ps };
              onPageChange?.(next.pageIndex, next.pageSize);
              return next;
            });
          }}
          className="ml-2 h-9 text-black"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s} / pág
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
