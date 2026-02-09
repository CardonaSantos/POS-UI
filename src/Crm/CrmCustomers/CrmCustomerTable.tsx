"use client";
import { useDebounce } from "use-debounce";
import { useState, useRef, useMemo } from "react";
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
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { ClienteTableDto } from "./CustomerTable";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import ReactSelectComponent from "react-select";
import { Label } from "@/components/ui/label";
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
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  console.log("Los clientes son: ", clientes);

  return (
    <PageTransitionCrm
      titleHeader="Lista de clientes"
      subtitle={`${summary.activo} Activos · ${summary.atrasado} Atrasados · ${summary.moroso} Morosos · ${summary.pendiente_activo} Pendiente Activo`}
      variant="fade-pure"
    >
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          {/* Campo de Búsqueda */}
          <div className="relative mb-3">
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                type="button"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar por Nombre, Teléfono, Dirección, DPI o IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`text-xs border-gray-200 transition-all ${
                search ? "pl-8 pr-2" : "px-2"
              }`}
            />
          </div>

          {/* Controles de filtrado */}
          <div className="mb-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Departamento */}
              <div className="space-y-1">
                <Label
                  htmlFor="departamentoId-all"
                  className="text-xs text-gray-700 dark:text-white"
                >
                  Departamento
                </Label>
                <ReactSelectComponent
                  placeholder="Seleccione un departamento"
                  isClearable
                  options={optionsDepartamentos}
                  value={
                    depaSelected
                      ? {
                          value: depaSelected,
                          label:
                            departamentos.find(
                              (depa) => depa.id.toString() === depaSelected,
                            )?.nombre || "",
                        }
                      : null
                  }
                  onChange={handleSelectDepartamento}
                  className="text-xs text-black"
                />
              </div>

              {/* Municipio */}
              <div className="space-y-1">
                <Label
                  htmlFor="municipioId-all"
                  className="text-xs text-gray-700 dark:text-white"
                >
                  Municipio
                </Label>
                <ReactSelectComponent
                  placeholder="Seleccione un municipio"
                  isClearable
                  options={optionsMunicipios}
                  onChange={handleSelectMunicipio}
                  value={
                    muniSelected
                      ? {
                          value: muniSelected,
                          label:
                            municipios.find(
                              (muni) => muni.id.toString() === muniSelected,
                            )?.nombre || "",
                        }
                      : null
                  }
                  className="text-xs text-black"
                />
              </div>

              {/* Sector */}
              <div className="space-y-1">
                <Label
                  htmlFor="sectorId-all"
                  className="text-xs text-gray-700 dark:text-white"
                >
                  Sector
                </Label>
                <ReactSelectComponent
                  placeholder="Seleccione un sector"
                  isClearable
                  options={optionsSectores}
                  onChange={handleSelectSector}
                  value={
                    sectorSelected
                      ? {
                          value: sectorSelected,
                          label:
                            sectores.find(
                              (muni) => muni.id.toString() === sectorSelected,
                            )?.nombre || "",
                        }
                      : null
                  }
                  className="text-xs text-black"
                />
              </div>

              {/* Estado cliente */}
              <div className="space-y-1">
                <Label
                  htmlFor="estadoId-all"
                  className="text-xs text-gray-700 dark:text-white"
                >
                  Estado
                </Label>
                <ReactSelectComponent
                  placeholder="Seleccione un estado"
                  options={estadosConDescripcion}
                  onChange={handleSelectEstado}
                  value={
                    estadosConDescripcion.find(
                      (opt) => opt.value === estadoSelected,
                    ) || null
                  }
                  isClearable
                  className="text-xs text-black"
                />
              </div>

              {/* Zona de Facturación */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-700 dark:text-white">
                  Zona de Facturación
                </Label>
                <ReactSelectComponent
                  isClearable
                  placeholder="Zona de facturación"
                  className="text-xs text-black"
                  options={optionsZonasFacturacion}
                  onChange={handleSelectZonaFacturacion}
                  value={
                    zonaFactSelected
                      ? {
                          value: zonaFactSelected,
                          label:
                            zonasFacturacion.find(
                              (s) => s.id.toString() === zonaFactSelected,
                            )?.nombre || "",
                        }
                      : null
                  }
                />
              </div>

              {/* Ordenamiento */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-700 dark:text-white">
                  Ordenar por
                </Label>
                <ReactSelectComponent
                  className="text-xs text-black"
                  options={sortOptions}
                  isClearable
                  onChange={handleSortChange}
                  placeholder="Ordenar por..."
                />
              </div>

              {/* Items por página */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-700 dark:text-white">
                  Items por página
                </Label>
                <Select
                  onValueChange={(value) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(value),
                    }))
                  }
                  defaultValue={String(pagination.pageSize)}
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Column Toggle */}
              <div className="space-y-1 justify-center items-center">
                <ColumnToggle table={table} />
              </div>
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
