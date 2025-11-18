"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import {
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Coins,
  AlertCircle,
  RefreshCw,
  FileText,
} from "lucide-react";

// 🔹 Tipos centralizados del módulo de servicios
import {
  // type Servicio,
  // type TipoServicio,
  // type NuevoServicio,
  // type NuevoTipoServicio,
  // type EstadoServicio,
  formatearMoneda,
  NuevoServicio,
  NuevoTipoServicio,
  ServicioServiceManage,
  TipoServicio,
} from "./crm-service.types";
import { EstadoServicio } from "./CrmServiciosWifi/servicio-internet.types";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

const CrmServiceManage = () => {
  const empresaID = useStoreCrm((state) => state.empresaId) ?? 0;

  const [servicios, setServicios] = useState<ServicioServiceManage[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nuevoServicio, setNuevoServicio] = useState<NuevoServicio>({
    nombre: "",
    descripcion: "",
    precio: 0,
    estado: "ACTIVO",
    tipoServicioId: null,
    empresaId: empresaID,
  });

  const [nuevoTipoServicio, setNuevoTipoServicio] = useState<NuevoTipoServicio>(
    {
      nombre: "",
      descripcion: "",
      estado: "ACTIVO",
    }
  );

  const [serviceEdit, setServiceEdit] = useState<NuevoServicio | null>(null);

  const [searchServicio, setSearchServicio] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateServicio, setOpenCreateServicio] = useState(false);
  const [openCreateTipoServicio, setOpenCreateTipoServicio] = useState(false);
  const [serviceDeleteId, setServiceDeleteId] = useState<number | null>(null);

  const getTiposServicio = async () => {
    try {
      const response = await axios.get<TipoServicio[]>(
        `${VITE_CRM_API_URL}/tipo-servicio`
      );

      if (response.status === 200) {
        const tipos = response.data;
        setTiposServicio(tipos);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener tipos de servicios");
    }
  };

  const getServicios = async () => {
    try {
      const response = await axios.get<ServicioServiceManage[]>(
        `${VITE_CRM_API_URL}/servicio`
      );

      if (response.status === 200) {
        const data = response.data;
        setServicios(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener servicios");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([getTiposServicio(), getServicios()]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleServicioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNuevoServicio((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleServicioEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setServiceEdit((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "precio" ? Number.parseFloat(value) || 0 : value,
          }
        : null
    );
  };

  const handleTipoServicioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNuevoTipoServicio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEstadoTipoServicioSelect = (value: string) => {
    setNuevoTipoServicio((prev) => ({
      ...prev,
      estado: value as EstadoServicio,
    }));
  };

  const resetFormServicio = () => {
    setNuevoServicio({
      nombre: "",
      descripcion: "",
      precio: 0,
      estado: "ACTIVO",
      tipoServicioId: null,
      empresaId: empresaID,
    });
  };

  const resetFormTipoServicio = () => {
    setNuevoTipoServicio({
      nombre: "",
      descripcion: "",
      estado: "ACTIVO",
    });
  };

  const handleSubmitServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoServicio.precio || nuevoServicio.precio <= 0) {
      toast.info("Seleccione un precio válido para el servicio");
      return;
    }

    if (!nuevoServicio.nombre.trim()) {
      toast.info("Añada un nombre para su servicio");
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      nombre: nuevoServicio.nombre.trim(),
      descripcion: nuevoServicio.descripcion.trim(),
      precio: nuevoServicio.precio,
      estado: nuevoServicio.estado,
      // Si luego usas tipoServicioId, aquí haces parseo:
      // tipoServicioId: nuevoServicio.tipoServicioId
      //   ? Number.parseInt(nuevoServicio.tipoServicioId)
      //   : null,
      empresaId: Number(nuevoServicio.empresaId),
    };

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/servicio`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Servicio creado exitosamente");
        await getServicios();
        resetFormServicio();
        setOpenCreateServicio(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTipoServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoTipoServicio.nombre.trim()) {
      toast.info("Ingrese un nombre válido");
      return;
    }

    if (!nuevoTipoServicio.descripcion.trim()) {
      toast.info("Ingrese una descripción válida");
      return;
    }

    setIsLoading(true);

    const dataToSend: NuevoTipoServicio = {
      nombre: nuevoTipoServicio.nombre.trim(),
      descripcion: nuevoTipoServicio.descripcion.trim(),
      estado: nuevoTipoServicio.estado,
    };

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/tipo-servicio`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Nuevo tipo de servicio creado");
        resetFormTipoServicio();
        await getTiposServicio();
        setOpenCreateTipoServicio(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear tipo de servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceEdit) return;

    if (!serviceEdit.tipoServicioId) {
      toast.info("Seleccione un tipo para el servicio");
      return;
    }

    if (!serviceEdit.precio || serviceEdit.precio <= 0) {
      toast.info("Seleccione un precio válido para el servicio");
      return;
    }

    if (!serviceEdit.nombre.trim()) {
      toast.info("Añada un nombre para su servicio");
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      nombre: serviceEdit.nombre.trim(),
      descripcion: serviceEdit.descripcion.trim(),
      precio: serviceEdit.precio,
      estado: serviceEdit.estado,
      tipoServicioId: Number.parseInt(serviceEdit.tipoServicioId),
      empresaId: Number(serviceEdit.empresaId),
    };

    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/servicio/update-servicio/${serviceEdit.id}`,
        dataToSend
      );

      if (response.status === 200) {
        toast.success("Servicio actualizado exitosamente");
        await getServicios();
        setOpenEdit(false);
        setServiceEdit(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteServicio = async () => {
    if (!serviceDeleteId) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/servicio/delete-servicio/${serviceDeleteId}`
      );

      if (response.status === 200) {
        toast.success("Servicio eliminado exitosamente");
        await getServicios();
        setOpenDelete(false);
        setServiceDeleteId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar servicio");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================
  // DERIVADOS / HELPERS
  // ==========================
  const filteredServicios = servicios.filter((servicio) => {
    const term = searchServicio.toLowerCase();
    return (
      servicio.nombre.toLowerCase().includes(term) ||
      servicio.descripcion?.toLowerCase().includes(term)
    );
  });

  const getTipoServicioNombre = (id: number) => {
    const tipo = tiposServicio.find((t) => t.id === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <PageTransitionCrm
      titleHeader="Servicios Adicionales"
      subtitle={``}
      variant="fade-pure"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicios..."
              className="pl-8 w-full md:w-[250px]"
              value={searchServicio}
              onChange={(e) => setSearchServicio(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            title="Actualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-1" onClick={() => setOpenCreateServicio(true)}>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden md:inline">Nuevo Servicio</span>
            <span className="md:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Tabla de servicios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Servicios Existentes</CardTitle>
            <CardDescription>
              Lista de servicios disponibles en el sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Estado
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Clientes
                    </TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-6"
                      >
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Cargando servicios...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredServicios.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-6"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
                          <p>No se encontraron servicios</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setOpenCreateServicio(true)}
                          >
                            Crear nuevo servicio
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServicios.map((servicio) => (
                      <TableRow key={servicio.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{servicio.nombre}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              {getTipoServicioNombre(servicio.tipoServicioId)}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px] hidden sm:block">
                              {servicio.descripcion}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {formatearMoneda(servicio.precio)}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              servicio.estado === "ACTIVO"
                                ? "default"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {servicio.estado === "ACTIVO" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {servicio.estado}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{servicio.clientesCount ?? 0}</span>
                          </div>
                        </TableCell>

                        <TableCell>
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setServiceEdit({
                                    id: servicio.id,
                                    descripcion: servicio.descripcion,
                                    empresaId: servicio.empresaId,
                                    estado: servicio.estado,
                                    nombre: servicio.nombre,
                                    precio: servicio.precio,
                                    tipoServicioId: String(
                                      servicio.tipoServicioId
                                    ),
                                  });
                                  setOpenEdit(true);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setServiceDeleteId(servicio.id);
                                  setOpenDelete(true);
                                }}
                                className="flex items-center gap-2 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Crear servicio */}
      <Dialog
        open={openCreateServicio}
        onOpenChange={(open) => {
          setOpenCreateServicio(open);
          if (!open) resetFormServicio();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Servicio</DialogTitle>
            <DialogDescription>
              Complete la información para crear un nuevo servicio
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitServicio}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Internet 24 Mbps"
                  value={nuevoServicio.nombre}
                  onChange={handleServicioChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción del servicio"
                  rows={2}
                  className="h-[60px] resize-none"
                  value={nuevoServicio.descripcion}
                  onChange={handleServicioChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <div className="relative">
                  <Coins className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    className="pl-8"
                    placeholder="0.00"
                    value={nuevoServicio.precio || ""}
                    onChange={handleServicioChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateServicio(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Servicio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Crear tipo de servicio */}
      <Dialog
        open={openCreateTipoServicio}
        onOpenChange={(open) => {
          setOpenCreateTipoServicio(open);
          if (!open) resetFormTipoServicio();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tipo de Servicio</DialogTitle>
            <DialogDescription>
              Complete la información para crear un nuevo tipo de servicio
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitTipoServicio}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipoNombre">Nombre</Label>
                <Input
                  id="tipoNombre"
                  name="nombre"
                  placeholder="Ej: Internet"
                  value={nuevoTipoServicio.nombre}
                  onChange={handleTipoServicioChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoDescripcion">Descripción</Label>
                <Textarea
                  id="tipoDescripcion"
                  name="descripcion"
                  placeholder="Descripción del tipo de servicio"
                  value={nuevoTipoServicio.descripcion}
                  onChange={handleTipoServicioChange}
                  className="h-[60px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEstado">Estado</Label>
                <Select
                  onValueChange={handleEstadoTipoServicioSelect}
                  defaultValue={nuevoTipoServicio.estado}
                >
                  <SelectTrigger id="tipoEstado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateTipoServicio(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Tipo de Servicio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar servicio */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Actualice la información del servicio
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateServicio}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  name="nombre"
                  placeholder="Ej: Internet 24 Mbps"
                  value={serviceEdit?.nombre ?? ""}
                  onChange={handleServicioEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  name="descripcion"
                  placeholder="Descripción del servicio"
                  rows={2}
                  className="h-[60px] resize-none"
                  value={serviceEdit?.descripcion ?? ""}
                  onChange={handleServicioEditChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-precio">Precio</Label>
                <div className="relative">
                  <Coins className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-precio"
                    name="precio"
                    type="number"
                    className="pl-8"
                    placeholder="0.00"
                    value={serviceEdit?.precio ?? ""}
                    onChange={handleServicioEditChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  onValueChange={(value) =>
                    setServiceEdit((prev) =>
                      prev
                        ? {
                            ...prev,
                            estado: value as EstadoServicio,
                          }
                        : prev
                    )
                  }
                  defaultValue={serviceEdit?.estado ?? "ACTIVO"}
                >
                  <SelectTrigger id="edit-estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar eliminación */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Está seguro que desea eliminar este servicio? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center items-center">
            <Alert className="border-destructive" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Si hay clientes asociados a este servicio, se perderá la
                relación con ellos.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setOpenDelete(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleDeleteServicio}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransitionCrm>
  );
};

export default CrmServiceManage;
