"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  User,
  Users,
  Calendar,
  Play,
  Eye,
  Edit,
  Trash2,
  MapPinned,
  UserCheck,
  Phone,
  Info,
  AlertCircle,
  Loader2,
  BookmarkX,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { RutasSkeleton } from "./RutasSkeleton";
import { EstadoRuta, PagedResponse, type Ruta } from "./rutas-types";
import { downloadExcelRutaCobro } from "./api";
import {
  useApiMutation,
  useApiQuery,
} from "@/hooks/genericoCall/genericoCallHook";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { getEstadoBadgeColorRutaList } from "./_Utils/utilsBadge";
import { getEstadoIconRutaList } from "./_Utils/getEstadoIconRutaList";
import { AdvancedDialogCRM } from "../_Utils/AdvancedDialogCRM";
import { formattShortFecha } from "@/utils/formattFechas";
import MiniPerfilClienteCard from "./_subcomponents/MiniPerfilClienteCard";

export function RutasCobroList() {
  const [searchRuta, setSearchRuta] = useState("");
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState<number | null>(null);

  const [rutaClose, setRutaClose] = useState<number | null>(null);
  const [openCloseRuta, setOpenCloseRuta] = useState(false);
  //API CALLS
  const {
    data: rutasRes,
    isFetching: isLoadingRutas,
    refetch: fetchRutas,
    error: rutasError,
    isError: isErrorRutas,
  } = useApiQuery<PagedResponse<Ruta>>(
    ["rutas"],
    "/ruta-cobro/get-rutas-cobros",
    undefined,
    {
      initialData: { items: [], total: 0 }, // ← importante
      retry: 1,
    }
  );

  const list = rutasRes?.items ?? [];

  const closeRuta = useApiMutation<void, void>(
    "patch",
    `/ruta-cobro/close-one-ruta/${rutaClose}`
  );

  const deleteRuta = useApiMutation<void, void>(
    "delete",
    rutaToDelete
      ? `/ruta-cobro/delete-one-ruta/${rutaToDelete}`
      : "/ruta-cobro/delete-one-ruta"
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
      await closeRuta.mutateAsync();
      toast.success("Ruta de cobro cerrada exitosamente");
      await fetchRutas();
      setRutaClose(null);
      setOpenCloseRuta(false);
    } catch (error) {
      console.log("Error generado en close ruta: ", error);
      toast.error(getApiErrorMessageAxios(error));
      return;
    }
  };

  const handleConfirmDelete = async () => {
    if (!rutaToDelete) {
      toast.warning("Ruta para eliminar no válida");
      return;
    }
    try {
      await deleteRuta.mutateAsync();
      toast.success("Ruta eliminada correctamente");
      await fetchRutas?.();
      setRutaToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.log("El error generado al eliminar ruta es: ", error);
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  //eliminacion
  const isDeleting = deleteRuta.isPending;
  const hasErrorDeleting = deleteRuta.isError;
  const errorDeleting = deleteRuta.error;
  //cerrando
  const isClosing = closeRuta.isPending;
  const hasErrorClosingRutas = closeRuta.isError;
  const errorClosingRuta = closeRuta.error;

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

  const filteredRutas = list.filter(
    (ruta) =>
      ruta.nombreRuta.toLowerCase().includes(searchRuta.toLowerCase()) ||
      (ruta.cobrador &&
        `${ruta.cobrador.nombre} ${ruta.cobrador.apellidos ?? ""}`
          .toLowerCase()
          .includes(searchRuta.toLowerCase())) ||
      ruta.observaciones?.toLowerCase().includes(searchRuta.toLowerCase())
  );

  //FALLBACKS ERRORS
  {
    isErrorRutas && (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar rutas</AlertTitle>
        <AlertDescription>
          {getApiErrorMessageAxios(rutasError)}
        </AlertDescription>
      </Alert>
    );
  }

  {
    hasErrorDeleting && (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar rutas</AlertTitle>
        <AlertDescription>
          {getApiErrorMessageAxios(errorDeleting)}
        </AlertDescription>
      </Alert>
    );
  }

  {
    hasErrorClosingRutas && (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar rutas</AlertTitle>
        <AlertDescription>
          {getApiErrorMessageAxios(errorClosingRuta)}
        </AlertDescription>
      </Alert>
    );
  }

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
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingRutas ? (
          <RutasSkeleton />
        ) : filteredRutas.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sin rutas</AlertTitle>
            <AlertDescription>
              No hay rutas de cobro registradas.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Cobrador
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Clientes
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Estado
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRutas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-6"
                      >
                        No se encontraron resultados para "{searchRuta}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRutas.map((ruta) => (
                      <TableRow key={ruta.id} className="group">
                        <TableCell>
                          <div className="text-xs font-medium">
                            {ruta.nombreRuta}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Creada: {formattShortFecha(ruta.fechaCreacion)}
                          </div>
                          <div className="md:hidden mt-1">
                            <Badge
                              className={`${getEstadoBadgeColorRutaList(
                                ruta.estadoRuta
                              )} flex items-center text-xs`}
                            >
                              {getEstadoIconRutaList(ruta.estadoRuta)}
                              {ruta.estadoRuta}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {ruta.cobrador ? (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs">
                                {ruta.cobrador.nombre}{" "}
                                {ruta.cobrador.apellidos || ""}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Sin asignar
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{ruta.clientes.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            className={`${getEstadoBadgeColorRutaList(
                              ruta.estadoRuta
                            )} flex items-center`}
                          >
                            {getEstadoIconRutaList(ruta.estadoRuta)}
                            {ruta.estadoRuta}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Abrir menú</span>
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                {/* Ver detalles */}
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handleViewRuta(ruta)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Ver detalles</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownloadExcelRutaCobro(ruta.id)
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Printer className="h-4 w-4" />
                                  <span>Imprimir ruta</span>
                                </DropdownMenuItem>

                                {/* Opciones visibles solo si la ruta no está cerrada */}
                                {ruta.estadoRuta !== EstadoRuta.CERRADO && (
                                  <>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      asChild
                                    >
                                      <Link
                                        to={`/crm/cobros-en-ruta/${ruta.id}`}
                                      >
                                        <Play className="h-4 w-4" />
                                        <span>Iniciar Ruta</span>
                                      </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      asChild
                                    >
                                      <Link
                                        to={`/crm/rutas-cobro/edit/${ruta.id}`}
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                      </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      onClick={() => handleCloseRuta(ruta.id)}
                                    >
                                      <BookmarkX className="h-4 w-4" />
                                      <span>Cerrar Ruta</span>
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {/* Eliminar (siempre disponible) */}
                                <DropdownMenuItem
                                  className="flex items-center gap-2 text-destructive"
                                  onClick={() => handleDeleteClick(ruta.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
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
                            selectedRuta.estadoRuta
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
