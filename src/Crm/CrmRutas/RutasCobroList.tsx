"use client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Calendar,
  MapPinned,
  UserCheck,
  Phone,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { RutasSkeleton } from "./RutasSkeleton";
import { downloadExcelRutaCobro } from "./api";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { getEstadoBadgeColorRutaList } from "./_Utils/utilsBadge";
import { getEstadoIconRutaList } from "./_Utils/getEstadoIconRutaList";
import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { formattShortFecha } from "@/utils/formattFechas";
import MiniPerfilClienteCard from "./_subcomponents/MiniPerfilClienteCard";
import { EstadoRuta, Ruta } from "../features/rutas/rutas.interfaces";
import {
  useCloseRuta,
  useDeleteRuta,
  useGetRutas,
} from "../CrmHooks/hooks/use-rutas/use-rutas";
import { QueryRutasDto } from "../CrmHooks/hooks/use-rutas/Qk";
import DataTable from "../_Utils/components/table/data-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getRutasColumns } from "./table/columns";
import { useDebounce } from "use-debounce";
import { TablePagination } from "../_Utils/components/table/table-pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { OptionSelectedStrings } from "../features/OptionSelected/OptionSelected";
import ReactSelectComponent from "react-select";
export function RutasCobroList() {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchRuta, setSearchRuta] = useState("");
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState<number | null>(null);
  // const [rowSelection, setRowSelection] = useState({});
  const [rutaClose, setRutaClose] = useState<number | null>(null);
  const [openCloseRuta, setOpenCloseRuta] = useState(false);

  const [debouncedSearch] = useDebounce(searchRuta, 500);

  const [cobradorSelected, setCobradorSelected] = useState<number | null>(null);

  const [estadoRuta, setEstadoRuta] = useState<EstadoRuta | null>(null);

  const queryDto: QueryRutasDto = useMemo(
    () => ({
      page: pageIndex + 1,
      limit: pageSize,
      nombreRuta: debouncedSearch || undefined,
      cobrador: cobradorSelected ?? undefined,
      estado: estadoRuta,
    }),
    [pageIndex, pageSize, debouncedSearch, cobradorSelected, estadoRuta],
  );

  const handleSelectCobrador = (option: OptionSelectedStrings | null) => {
    setCobradorSelected(option ? Number(option.value) : null);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const {
    data: rawRutasResponse = {
      data: [],
      meta: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 1,
        totalCount: 1,
      },
    },
    isFetching: isLoadingRutas,
  } = useGetRutas(queryDto);

  const list = Array.isArray(rawRutasResponse?.data)
    ? rawRutasResponse.data
    : Array.isArray(rawRutasResponse)
      ? rawRutasResponse
      : [];
  const meta = rawRutasResponse.meta;
  const closeRuta = useCloseRuta(rutaClose ?? 0);
  const deleteRuta = useDeleteRuta(rutaToDelete ?? 0);

  const { data: rawUsers } = useGetUsersToSelect();
  const users = rawUsers ? rawUsers : [];

  const options: Array<OptionSelectedStrings> = useMemo(
    () =>
      users.map((d) => ({
        value: d.id.toString(),
        label: d.nombre,
      })),
    [users],
  );

  const handleViewRuta = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (rutaId: number) => {
    setRutaToDelete(rutaId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseRuta = (rutaId: number) => {
    setRutaClose(rutaId);
    setOpenCloseRuta(true);
  };

  const handleCloseRutaCobro = async () => {
    if (!rutaClose) {
      toast.info("Seleccione una ruta a cerrar");
      return;
    }
    try {
      toast.promise(closeRuta.mutateAsync(), {
        loading: "Cerrando ruta...",
        success: () => {
          setRutaClose(null);
          setOpenCloseRuta(false);
          return "Ruta cerrada";
        },
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log("Error generado en close ruta: ", error);
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!rutaToDelete) {
      toast.warning("Ruta para eliminar no válida");
      return;
    }
    try {
      toast.promise(deleteRuta.mutateAsync(), {
        loading: "Eliminando ruta...",
        success: () => {
          setRutaToDelete(null);
          setIsDeleteDialogOpen(false);
          return "Registro eliminado";
        },
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log("Error generado en delete ruta: ", error);
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  const isDeleting = deleteRuta.isPending;
  const isClosing = closeRuta.isPending;

  const handleDownloadExcelRutaCobro = async (rutaId: number) => {
    try {
      const response = await downloadExcelRutaCobro(rutaId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ruta_${rutaId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("¡Descarga exitosa!");
    } catch (error) {
      toast.error(getApiErrorMessageAxios(error));
      console.error(error);
    }
  };

  const tableData = useMemo(() => {
    if (Array.isArray(rawRutasResponse?.data)) return rawRutasResponse.data;
    if (Array.isArray(rawRutasResponse)) return rawRutasResponse;
    return [];
  }, [rawRutasResponse]);

  const columns = useMemo(
    () =>
      getRutasColumns({
        handleViewRuta,
        handleDeleteClick,
        handleCloseRuta,
        handleDownloadExcelRutaCobro,
      }),
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    pageCount: meta.pageCount,
    state: {
      // rowSelection,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
  });

  const handleSelecEstado = (value: EstadoRuta) => {
    setEstadoRuta(value);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar rutas..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchRuta}
              onChange={(e) => setSearchRuta(e.target.value)}
            />
          </div>

          <div className="">
            <Select onValueChange={handleSelecEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado ruta" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(EstadoRuta).map((estado) => (
                    <SelectItem value={estado}>{estado}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className=" ">
            <ReactSelectComponent
              options={options}
              isClearable
              onChange={handleSelectCobrador}
              value={
                cobradorSelected
                  ? options.find(
                      (opt) =>
                        opt.value.toString() === cobradorSelected.toString(),
                    )
                  : null
              }
              className="w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingRutas ? (
          <RutasSkeleton />
        ) : list.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sin rutas</AlertTitle>
            <AlertDescription>
              {searchRuta
                ? `No se encontraron resultados para "${searchRuta}"`
                : "No hay rutas de cobro registradas."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <DataTable
              table={table}
              headerExtra={
                <div className="w-[80px]">
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) =>
                      setPagination((prev) => ({
                        ...prev,
                        pageSize: Number(value),
                        pageIndex: 0,
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs  border-gray-300">
                      <SelectValue placeholder="Items" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 filas</SelectItem>
                      <SelectItem value="10">10 filas</SelectItem>
                      <SelectItem value="20">20 filas</SelectItem>
                      <SelectItem value="50">50 filas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
            />

            <TablePagination table={table} totalCount={meta.totalCount} />
          </>
        )}
      </CardContent>

      {/* Diálogo de detalles de ruta */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-primary dark:text-white" />
              {selectedRuta?.nombreRuta}
            </DialogTitle>
            <DialogDescription>Detalles de la ruta de cobro</DialogDescription>
          </DialogHeader>
          {selectedRuta && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Información General
                    </h3>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getEstadoBadgeColorRutaList(
                            selectedRuta.estadoRuta,
                          )} flex items-center`}
                        >
                          {getEstadoIconRutaList(selectedRuta.estadoRuta)}
                          {selectedRuta.estadoRuta}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary dark:text-white" />
                        <span>
                          Creada:{" "}
                          {formattShortFecha(selectedRuta.fechaCreacion)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary dark:text-white" />
                        <span>
                          Actualizada:{" "}
                          {formattShortFecha(selectedRuta.fechaActualizacion)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Cobrador Asignado
                    </h3>
                    {selectedRuta.cobrador ? (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary dark:text-white" />
                          <span className="text-xs">
                            {selectedRuta.cobrador.nombre}{" "}
                            {selectedRuta.cobrador.apellidos || ""}
                          </span>
                        </div>
                        {selectedRuta.cobrador.telefono && (
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground dark:text-white " />
                            <span>{selectedRuta.cobrador.telefono}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Info className="h-3.5 w-3.5 text-muted-foreground dark:text-white" />
                          <span>{selectedRuta.cobrador.email}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-muted-foreground">
                        No hay cobrador asignado a esta ruta
                      </div>
                    )}
                  </div>

                  {selectedRuta.observaciones && (
                    <>
                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Observaciones
                        </h3>
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          {selectedRuta.observaciones}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedRuta.clientes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          No hay clientes en esta ruta
                        </div>
                      ) : (
                        selectedRuta.clientes.map((cliente, index) => (
                          <MiniPerfilClienteCard
                            cliente={cliente}
                            key={index}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdvancedDialogCRM
        type="warning"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirmar eliminación de ruta"
        description="¿Está seguro que desea eliminar esta ruta de cobro? Esta acción no
              se puede deshacer."
        confirmButton={{
          label: "Si, continuar y eliminar ruta",
          loading: isDeleting,
          loadingText: "Eliminando...",
          disabled: isDeleting,
          onClick: () => handleConfirmDelete(),
          variant: "destructive",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: isDeleting,
          loadingText: "Cancelando...",
          variant: "outline",
        }}
      />

      {/* DIALOG DE CIERRE DE RUTA */}
      <Dialog open={openCloseRuta} onOpenChange={setOpenCloseRuta}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Cierre de Ruta</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cerrar esta ruta de cobro? Una vez cerrada,
              ya no estará disponible para realizar más cobros.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Esta acción cerrará la ruta. No se eliminarán los registros
                históricos, pero no podrá reactivarse para cobros futuros.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCloseRuta(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseRutaCobro}
              disabled={isClosing}
            >
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Cerrar Ruta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
