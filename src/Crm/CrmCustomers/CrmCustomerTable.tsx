"use client";
import { useDebounce } from "use-debounce";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import {
  Archive,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  Option,
  Search,
  Sheet,
  Trash2,
  X,
} from "lucide-react";
import { ClienteTableDto } from "./CustomerTable";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import ReactSelectComponent from "react-select";
import { useWindowScrollPosition } from "../Utils/useWindow";
import { ClientTableSkeleton } from "./SkeletonTable";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useGetMunicipios } from "../CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetDepartamentos } from "../CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { useGetZonasFacturacion } from "../CrmHooks/hooks/Zonas-facturacion/useGetZonasFacturacion";
import {
  GetCustomersQueryDto,
  useGetCustomersInTable,
} from "../CrmHooks/hooks/use-get-customers-table/useGetCustomerTable";
import CustomersTable from "./components/map-table";
import { ColumnToggle } from "./components/column-toggle";
import { clienteTableColumns } from "./components/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  downloadFile,
  FiltersProps,
  useGenerateHistorialPagos,
  useGenerateInfoReport,
  useGenerateReportCobranza,
} from "../CrmHooks/hooks/use-reports/use-reports";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { Label } from "@/components/ui/label";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

interface OptionSelected {
  value: string;
  label: string;
}

const estadosConDescripcion = [
  { value: "ACTIVO", label: "ACTIVO " },
  { value: "PENDIENTE_ACTIVO", label: "PENDIENTE ACTIVO " },
  { value: "PAGO_PENDIENTE", label: "PAGO PENDIENTE " },
  { value: "MOROSO", label: "MOROSO " },
  { value: "ATRASADO", label: "ATRASADO " },
  { value: "SUSPENDIDO", label: "SUSPENDIDO " },
  { value: "DESINSTALADO", label: "DESINSTALADO" },
  { value: "EN_INSTALACION", label: "EN INSTALACION" },
];

export default function ClientesTable() {
  const [searchParam] = useSearchParams();
  const estadoFromUrl = searchParam.get("estado");
  const atBottom = useWindowScrollPosition(); // Asumo que este hook existe
  const inputRef = useRef<HTMLInputElement>(null);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    direccion: false,
    creadoEn: false,
    sector: false,
    clasificacionCredito: false,
  });

  // -- Estado de Filtros (UI) --
  const [search, setSearch] = useState(""); // Input de texto
  const [depaSelected, setDepaSelected] = useState<string | null>("8"); // Default: 8
  const [muniSelected, setMuniSelected] = useState<string | null>(null);
  const [sectorSelected, setSectorSelected] = useState<string | null>(null);
  const [zonaFactSelected, setZonaFactSelected] = useState<string | null>(null);
  const [estadoSelected, setEstadoSelected] = useState<string | null>(
    estadoFromUrl || null,
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const { data: departamentos = [] } = useGetDepartamentos();
  const { data: sectores = [] } = useGetSectores();
  const { data: zonasFacturacion = [] } = useGetZonasFacturacion();

  const { data: municipios = [] } = useGetMunicipios(
    depaSelected ? parseInt(depaSelected) : 0,
  );

  const optionsDepartamentos = useMemo(
    () =>
      departamentos.map((d) => ({
        value: d.id.toString(),
        label: d.nombre,
      })),
    [departamentos],
  );

  const optionsMunicipios = useMemo(
    () =>
      municipios.map((m) => ({
        value: m.id.toString(),
        label: m.nombre,
      })),
    [municipios],
  );

  const optionsSectores = useMemo(
    () =>
      sectores.map((s) => ({
        value: s.id.toString(),
        label: `${s.nombre} (${s.clientes?.length ?? 0})`,
      })),
    [sectores],
  );

  const optionsZonasFacturacion = useMemo(
    () =>
      zonasFacturacion
        .slice()
        .sort((a, b) => {
          const na = parseInt(a.nombre.match(/\d+/)?.[0] ?? "0");
          const nb = parseInt(b.nombre.match(/\d+/)?.[0] ?? "0");
          return na - nb;
        })
        .map((z) => ({
          value: z.id.toString(),
          label: `${z.nombre} (${z.clientesCount})`,
        })),
    [zonasFacturacion],
  );

  const [debouncedSearch] = useDebounce(search, 500);

  const queryDto: GetCustomersQueryDto = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limite: pagination.pageSize,
      paramSearch: debouncedSearch || undefined,
      depaSelected: depaSelected ? Number(depaSelected) : undefined,
      muniSelected: muniSelected ? Number(muniSelected) : undefined,
      sectorSelected: sectorSelected ? Number(sectorSelected) : undefined,
      zonasFacturacionSelected: zonaFactSelected
        ? Number(zonaFactSelected)
        : undefined,
      estadoSelected: estadoSelected || undefined,
    }),
    [
      pagination,
      debouncedSearch,
      depaSelected,
      muniSelected,
      sectorSelected,
      zonaFactSelected,
      estadoSelected,
    ],
  );

  const { data: responseTable, isPending: isSearching } =
    useGetCustomersInTable(queryDto);

  const clientes = responseTable?.data || [];
  const summary = responseTable?.summary || {
    activo: 0,
    atrasado: 0,
    moroso: 0,
    pendiente_activo: 0,
  };
  const totalCount = responseTable?.totalCount || 0;

  // -- Handlers de Selects --
  const handleSelectDepartamento = (opt: OptionSelected | null) => {
    setDepaSelected(opt?.value ?? null);
    setMuniSelected(null); // Resetear municipio al cambiar departamento
  };

  const handleSelectMunicipio = (opt: OptionSelected | null) =>
    setMuniSelected(opt?.value ?? null);

  const handleSelectSector = (opt: OptionSelected | null) =>
    setSectorSelected(opt?.value ?? null);

  const handleSelectZonaFacturacion = (opt: OptionSelected | null) =>
    setZonaFactSelected(opt?.value ?? null);

  const handleSelectEstado = (opt: OptionSelected | null) =>
    setEstadoSelected(opt?.value ?? null);

  const handleToggleScroll = () => {
    window.scrollTo({
      top: atBottom ? 0 : document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // -- Handler de Ordenamiento --
  const fieldMapping: Record<string, keyof ClienteTableDto> = {
    ip: "direccionIp",
    nombre: "nombreCompleto",
    fechapago: "creadoEn",
  };

  const sortOptions: OptionSelected[] = [
    { label: "Ordenar por IP (asc)", value: "ip-asc" },
    { label: "Ordenar por IP (desc)", value: "ip-desc" },
    { label: "Ordenar por Nombre (asc)", value: "nombre-asc" },
    { label: "Ordenar por Nombre (desc)", value: "nombre-desc" },
    { label: "Ordenar por Fecha Creación (asc)", value: "fechapago-asc" },
    { label: "Ordenar por Fecha Creación (desc)", value: "fechapago-desc" },
  ];

  const handleSortChange = (option: OptionSelected | null) => {
    if (!option) {
      setSorting([]);
      return;
    }
    const [key, dir] = option.value.split("-");
    const columnId = fieldMapping[key];

    if (columnId) {
      setSorting([{ id: columnId as string, desc: dir === "desc" }]);
    }
  };

  const table = useReactTable({
    data: clientes,
    columns: clienteTableColumns,
    pageCount: Math.ceil(totalCount / pagination.pageSize) || 0,
    manualPagination: true,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    getRowId: (row) => row.id.toString(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const compactSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "32px", // Altura reducida
      height: "32px",
      fontSize: "0.75rem", // text-xs
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: "0 8px",
      height: "30px",
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: "30px",
    }),
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const selectedIds = Object.keys(table.getState().rowSelection);

  console.log("Los ids de los clientes seleccionados son: ", selectedIds);

  return (
    <PageTransitionCrm
      titleHeader="Lista de clientes"
      subtitle={`${summary.activo} Activos · ${summary.atrasado} Atrasados · ${summary.moroso} Morosos · ${summary.pendiente_activo} Pendiente Activo`}
      variant="fade-pure"
    >
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          {/* Campo de Búsqueda */}
          <div className="relative w-full max-w-sm pb-1">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar (Nombre, Tel, DPI, IP)..."
              className="h-6 w-full pl-8 pr-8 text-xs  "
            />
            {/* 2. Botón Limpiar (A la derecha, solo si hay texto) */}
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
                aria-label="Limpiar"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between p-2 rounded-lg border border-gray-100 ">
            {/* Controles de filtrado */}
            <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:w-auto xl:flex-1">
              {/* Departamento */}
              <ReactSelectComponent
                placeholder="Departamento"
                isClearable
                options={optionsDepartamentos}
                styles={compactSelectStyles} // Aplicamos estilo compacto
                value={
                  depaSelected
                    ? {
                        value: depaSelected,
                        label:
                          departamentos.find(
                            (d) => d.id.toString() === depaSelected,
                          )?.nombre || "",
                      }
                    : null
                }
                onChange={handleSelectDepartamento}
                className="text-xs text-black min-w-[140px]"
              />

              {/* Municipio */}
              <ReactSelectComponent
                placeholder="Municipio"
                isClearable
                options={optionsMunicipios}
                styles={compactSelectStyles}
                onChange={handleSelectMunicipio}
                value={
                  muniSelected
                    ? {
                        value: muniSelected,
                        label:
                          municipios.find(
                            (m) => m.id.toString() === muniSelected,
                          )?.nombre || "",
                      }
                    : null
                }
                className="text-xs text-black min-w-[140px]"
              />

              {/* Sector */}
              <ReactSelectComponent
                placeholder="Sector"
                isClearable
                options={optionsSectores}
                styles={compactSelectStyles}
                onChange={handleSelectSector}
                value={
                  sectorSelected
                    ? {
                        value: sectorSelected,
                        label:
                          sectores.find(
                            (s) => s.id.toString() === sectorSelected,
                          )?.nombre || "",
                      }
                    : null
                }
                className="text-xs text-black min-w-[140px]"
              />

              {/* Estado */}
              <ReactSelectComponent
                placeholder="Estado"
                options={estadosConDescripcion}
                styles={compactSelectStyles}
                onChange={handleSelectEstado}
                value={
                  estadosConDescripcion.find(
                    (opt) => opt.value === estadoSelected,
                  ) || null
                }
                isClearable
                className="text-xs text-black min-w-[120px]"
              />

              {/* Zona Facturación */}
              <ReactSelectComponent
                isClearable
                placeholder="Zona Fact."
                styles={compactSelectStyles}
                className="text-xs text-black min-w-[120px]"
                options={optionsZonasFacturacion}
                onChange={handleSelectZonaFacturacion}
                value={
                  zonaFactSelected
                    ? {
                        value: zonaFactSelected,
                        label:
                          zonasFacturacion.find(
                            (z) => z.id.toString() === zonaFactSelected,
                          )?.nombre || "",
                      }
                    : null
                }
              />
            </div>

            {/* BLOQUE 2: Herramientas de Vista (Derecha) */}
            <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
              {/* Ordenar */}
              <div className="w-full sm:w-[120px]">
                <ReactSelectComponent
                  className="text-xs text-black"
                  styles={compactSelectStyles}
                  options={sortOptions}
                  isClearable
                  onChange={handleSortChange}
                  placeholder="Ordenar"
                />
              </div>

              {/* Items por página (Shadcn Select optimizado) */}
              <div className="w-[80px]">
                <Select
                  onValueChange={(value) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(value),
                    }))
                  }
                  defaultValue={String(pagination.pageSize)}
                >
                  <SelectTrigger className="h-8 text-xs  border-gray-300">
                    <SelectValue placeholder="Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 filas</SelectItem>
                    <SelectItem value="10">10 filas</SelectItem>
                    <SelectItem value="20">20 filas</SelectItem>
                    <SelectItem value="50">50 filas</SelectItem>
                    <SelectItem value="100">100 filas</SelectItem>
                    <SelectItem value="200">200 filas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Column Toggle (Tu componente nuevo) */}
              <div className="">
                <ColumnToggle table={table} />
              </div>

              {selectedIds.length > 0 ? (
                <OptionsSelectedMenu selectedIds={selectedIds} />
              ) : null}

              <OptionsReportsCobros />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto border border-gray-200 rounded-md">
            {isSearching ? (
              <ClientTableSkeleton />
            ) : (
              <CustomersTable table={table} />
            )}
          </div>

          {/* Controles de Paginación */}
          <div className="flex items-center justify-between px-3 py-2 mt-0 text-xs border-t rounded-b-md dark:text-white">
            <Button
              variant="outline"
              onClick={() => table.previousPage?.()}
              disabled={!table.getCanPreviousPage?.()}
              className="h-7 px-3 text-xs"
            >
              Anterior
            </Button>

            <span className="text-xs text-gray-700 dark:text-white">
              Página{" "}
              <span className="font-medium">{pagination.pageIndex + 1}</span> de{" "}
              <span className="font-medium">{table.getPageCount?.() || 1}</span>
            </span>

            <Button
              variant="outline"
              onClick={() => table.nextPage?.()}
              disabled={!table.getCanNextPage?.()}
              className="h-7 px-3 text-xs"
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botón scroll flotante */}
      <button
        onClick={handleToggleScroll}
        className="fixed z-50 flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bottom-6 right-6 bg-gray-800 hover:bg-gray-900 border border-gray-700"
        aria-label={atBottom ? "Ir al tope" : "Ir al final"}
      >
        {atBottom ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
    </PageTransitionCrm>
  );
}
interface PropsMenu {
  selectedIds: Array<string>;
  onClearSelection?: () => void; // Opcional: para limpiar selección al terminar
}

const OptionsSelectedMenu = ({ selectedIds, onClearSelection }: PropsMenu) => {
  // 1. Inicializamos los Hooks
  const exportInfoMutation = useGenerateInfoReport();
  const exportPagosMutation = useGenerateHistorialPagos();

  // Helper para procesar la descarga
  const handleExportInfo = () => {
    // Convertimos IDs de string a number para el DTO
    const idsNumericos = selectedIds.map((id) => Number(id));

    exportInfoMutation.mutateAsync(
      { ids: idsNumericos },
      {
        onSuccess: (data: any) => {
          // 'data' aquí es el Blob que retorna axios
          downloadFile(data, `Reporte_Clientes_${Date.now()}.xlsx`);
          toast.success("Reporte de información descargado");
          onClearSelection?.();
        },
        onError: () => {
          toast.error("Error al generar el reporte de información");
        },
      },
    );
  };

  const handleExportPagos = () => {
    const idsNumericos = selectedIds.map((id) => Number(id));

    exportPagosMutation.mutateAsync(
      { ids: idsNumericos },
      {
        onSuccess: (data: any) => {
          downloadFile(data, `Historial_Pagos_${Date.now()}.xlsx`);
          toast.success("Historial de pagos descargado");
          onClearSelection?.();
        },
        onError: () => {
          toast.error("Error al generar el historial");
        },
      },
    );
  };

  const isLoading =
    exportInfoMutation.isPending || exportPagosMutation.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="ml-2 gap-1.5 px-2.5"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Option className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline text-xs">
            Acciones ({selectedIds.length})
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          {selectedIds.length} seleccionados
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Acción 1: Historial Pagos */}
        <DropdownMenuItem
          onClick={handleExportPagos}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {exportPagosMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sheet className="mr-2 h-4 w-4 text-green-600" />
          )}
          Exportar historial pagos
        </DropdownMenuItem>

        {/* Acción 2: Info Clientes */}
        <DropdownMenuItem
          onClick={handleExportInfo}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {exportInfoMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sheet className="mr-2 h-4 w-4 text-blue-600" />
          )}
          Exportar info. completa
        </DropdownMenuItem>

        {/* Acción 3: Tickets (Deshabilitada) */}
        <DropdownMenuItem disabled className="opacity-50">
          <Archive className="mr-2 h-4 w-4" />
          Historial de tickets
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Acción Destructiva */}
        <DropdownMenuItem
          onClick={() => {
            // Tu lógica de eliminar
            console.log("Eliminar", selectedIds);
          }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar seleccionados
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function OptionsReportsCobros() {
  const { data: rawUsers } = useGetUsersToSelect();
  const users = rawUsers || [];

  const [filters, setFilters] = useState<FiltersProps>({
    startDate: undefined,
    endDate: null,

    startDateG: undefined,
    endDateG: null,

    userId: null,
    estados: [],
  });

  const createReportCobranza = useGenerateReportCobranza();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectState = (val: Array<string>) => {
    setFilters((previa) => ({
      ...previa,
      estados: val,
    }));
  };

  const options: OptionSelected[] = users.map((u) => ({
    label: u.nombre,
    value: u.id.toString(),
  }));

  const selectedUserOption = filters.userId
    ? options.find((opt) => opt.value === filters.userId?.toString()) || null
    : null;

  const handleSelectUser = (option: OptionSelected | null) => {
    setFilters((prev) => ({
      ...prev,
      userId: option ? parseInt(option.value) : null,
    }));
  };

  const handleChangeDates = (side: "start" | "end", date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [side === "start" ? "startDate" : "endDate"]: date,
    }));
  };

  const handleChangeDatesG = (side: "start" | "end", date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [side === "start" ? "startDateG" : "endDateG"]: date,
    }));
  };

  const handleClear = () => {
    setFilters({
      startDate: undefined,
      endDate: null,
      userId: null,
      endDateG: null,
      startDateG: undefined,
      estados: [],
    });
  };

  const handleGenerateReport = async () => {
    setIsOpen(false);
    toast.promise(createReportCobranza.mutateAsync(filters), {
      loading: "Generando reporte...",
      success: (data: any) => {
        downloadFile(data, `Reporte_Pagos_${Date.now()}.xlsx`);
        setIsOpen(false);
        return "Reporte generado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  console.log("Los estados seleccionados: ", filters);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="ml-2 h-8 w-8 text-slate-700 dark:text-slate-300"
          title="Filtros de Reporte"
        >
          <Sheet className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg text-center">
            Reporte de Cobranzas
          </DialogTitle>
        </DialogHeader>

        {/* Contenedor principal con espaciado uniforme */}
        <div className="space-y-4">
          {/* RANGO DE PAGO */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Rango de Fecha Pagada
            </Label>
            <div className="flex items-center rounded-md border border-input bg-background h-8 shadow-sm focus-within:ring-1 focus-within:ring-ring overflow-hidden">
              <div className="px-2.5 flex items-center justify-center border-r border-border h-full bg-muted/30">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <DatePicker
                locale={es}
                selected={filters.startDate}
                onChange={(date) => handleChangeDates("start", date)} // Ojo aquí, lee la nota abajo
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                placeholderText="Desde"
                className="w-full h-full border-none text-xs text-center focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
              <span className="text-muted-foreground/50 text-xs px-1">-</span>
              <DatePicker
                locale={es}
                selected={filters.endDate}
                onChange={(date) => handleChangeDates("end", date)}
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate}
                placeholderText="Hasta"
                className="w-full h-full border-none text-xs text-center focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
            </div>
          </div>

          {/* RANGO DE GENERACIÓN */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Rango de Fecha Generada
            </Label>
            <div className="flex items-center rounded-md border border-input bg-background h-8 shadow-sm focus-within:ring-1 focus-within:ring-ring overflow-hidden">
              <div className="px-2.5 flex items-center justify-center border-r border-border h-full bg-muted/30">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <DatePicker
                locale={es}
                selected={filters.startDateG}
                onChange={(date) => handleChangeDatesG("start", date)} // Asumo que creaste una función diferente para la fecha G
                selectsStart
                startDate={filters.startDateG}
                endDate={filters.endDateG}
                placeholderText="Desde"
                className="w-full h-full border-none text-xs text-center focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
              <span className="text-muted-foreground/50 text-xs px-1">-</span>
              <DatePicker
                locale={es}
                selected={filters.endDateG}
                onChange={(date) => handleChangeDatesG("end", date)}
                selectsEnd
                startDate={filters.startDateG}
                endDate={filters.endDateG}
                minDate={filters.startDateG}
                placeholderText="Hasta"
                className="w-full h-full border-none text-xs text-center focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
            </div>
          </div>

          {/* ESTADO DE FACTURA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Estado de la Factura
            </Label>
            <ToggleGroup
              type="multiple"
              value={filters.estados}
              onValueChange={handleSelectState}
              className="flex flex-wrap justify-start gap-1"
            >
              <ToggleGroupItem
                value="PAGADA"
                className="h-7 px-2 text-[10px] sm:text-xs"
              >
                PAGADA
              </ToggleGroupItem>
              <ToggleGroupItem
                value="PENDIENTE"
                className="h-7 px-2 text-[10px] sm:text-xs"
              >
                PENDIENTE
              </ToggleGroupItem>
              <ToggleGroupItem
                value="PARCIAL"
                className="h-7 px-2 text-[10px] sm:text-xs"
              >
                PARCIAL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="VENCIDA"
                className="h-7 px-2 text-[10px] sm:text-xs"
              >
                VENCIDA
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* COBRADOR */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Cobrador
            </Label>
            <ReactSelectComponent
              className="text-black text-xs" // Ajustado a text-xs para mantener el estilo compacto
              options={options}
              onChange={handleSelectUser}
              value={selectedUserOption}
              placeholder="Seleccionar cobrador..."
              isClearable
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-xs h-8 text-muted-foreground"
          >
            Limpiar Filtros
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto h-8 text-xs"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto h-8 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Generar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
