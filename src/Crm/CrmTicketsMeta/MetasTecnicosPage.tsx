import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ReactSelectcomponent from "react-select";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  type MetaTecnicoTicket,
  type CreateMetaTecnicoTicketPayload,
  type EstadoMetaTicket,
  type Tecnicos,
  type OptionSelected,
  EstadoMetaTicketEnum,
} from "./types";
import {
  getMetasTickets,
  createMetaTicket,
  updateMetaTickets,
  deleteMeta,
  getTecnicosMeta,
} from "./api";
import { formateDate } from "../Utils/FormateDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Metricas from "./Metricas";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
dayjs.extend(utc);
dayjs.extend(timezone);
// Mock data para técnicos (en un caso real vendría de otra API)
interface MetaFormData {
  tecnicoId: string;
  fechaInicio: string;
  fechaFin: string;
  metaTickets: string;
  titulo: string;
  estado: string;
}

export default function MetasTecnicosPage() {
  const userRol = useStoreCrm((state) => state.rol) ?? "";
  const [metas, setMetas] = useState<MetaTecnicoTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const fechaGuate = dayjs().tz("America/Guatemala").format("YYYY-MM-DD"); // → "2025-06-18"
  console.log("La fecha es, ", fechaGuate);

  // Estados para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [tecnicos, setTecnicos] = useState<Tecnicos[]>([]);
  // Estados para formularios
  const [formData, setFormData] = useState<MetaFormData>({
    tecnicoId: "",
    fechaInicio: "",
    fechaFin: "",
    metaTickets: "",
    titulo: "",
    estado: "",
  });
  const [editingMeta, setEditingMeta] = useState<MetaTecnicoTicket | null>(
    null
  );
  const [deletingMetaId, setDeletingMetaId] = useState<number | null>(null);

  console.log("La data es: ", formData);

  // Cargar metas al montar el componente
  useEffect(() => {
    loadMetas();
    loadTecnicos();
  }, []);

  const loadMetas = async () => {
    try {
      setLoading(true);
      const data = await getMetasTickets();
      setMetas(data);
    } catch (error) {
      toast.error("Error al cargar las metas");
      console.error("Error loading metas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTecnicos = async () => {
    try {
      const data = await getTecnicosMeta();
      setTecnicos(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error("Error loading usuarios:", error);
    } finally {
      console.log("usuarios para meta cargados");
    }
  };

  // Funciones de cálculo
  const calcularPorcentajeCumplido = (resueltos: number, meta: number) => {
    return meta > 0 ? Math.round((resueltos / meta) * 100) : 0;
  };

  const calcularTicketsFaltantes = (resueltos: number, meta: number) => {
    return Math.max(0, meta - resueltos);
  };

  const calcularDiasTranscurridos = (fechaInicio: string) => {
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularDiasTotales = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularPromedioTicketsPorDia = (
    resueltos: number,
    diasTranscurridos: number
  ) => {
    return diasTranscurridos > 0
      ? (resueltos / diasTranscurridos).toFixed(1)
      : "0.0";
  };

  const calcularProyeccionCumplimiento = (
    resueltos: number,
    diasTranscurridos: number,
    diasTotales: number
  ) => {
    if (diasTranscurridos === 0) return 0;
    const promedioDiario = resueltos / diasTranscurridos;
    return Math.round(promedioDiario * diasTotales);
  };

  console.log("Los registros son", metas);

  // Funciones CRUD
  const handleCreate = async () => {
    if (
      !formData.tecnicoId ||
      !formData.fechaInicio ||
      !formData.fechaFin ||
      !formData.metaTickets
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setOperationLoading(true);
      const payload: CreateMetaTecnicoTicketPayload = {
        tecnicoId: Number.parseInt(formData.tecnicoId),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        metaTickets: Number.parseInt(formData.metaTickets),
        titulo: formData.titulo || undefined,
      };

      await createMetaTicket(payload);
      toast.success("Meta creada exitosamente");
      setCreateDialogOpen(false);
      resetForm();
      loadMetas();
    } catch (error) {
      toast.error("Error al crear la meta");
      console.error("Error creating meta:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = async () => {
    if (
      !editingMeta ||
      !formData.tecnicoId ||
      !formData.fechaInicio ||
      !formData.fechaFin ||
      !formData.metaTickets
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setOperationLoading(true);
      const payload: Partial<CreateMetaTecnicoTicketPayload> = {
        tecnicoId: Number.parseInt(formData.tecnicoId),
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        metaTickets: Number.parseInt(formData.metaTickets),
        titulo: formData.titulo || undefined,
        estado: formData.estado || "ABIERTO",
      };

      await updateMetaTickets(editingMeta.id, payload);
      toast.success("Meta actualizada exitosamente");
      setEditDialogOpen(false);
      resetForm();
      setEditingMeta(null);
      loadMetas();
    } catch (error) {
      toast.error("Error al actualizar la meta");
      console.error("Error updating meta:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMetaId) return;

    try {
      setOperationLoading(true);
      await deleteMeta(deletingMetaId);
      toast.success("Meta eliminada exitosamente");
      setDeleteDialogOpen(false);
      setDeletingMetaId(null);
      loadMetas();
    } catch (error) {
      toast.error("Error al eliminar la meta");
      console.error("Error deleting meta:", error);
    } finally {
      setOperationLoading(false);
    }
  };

  // Funciones auxiliares
  const resetForm = () => {
    setFormData({
      tecnicoId: "",
      fechaInicio: "",
      fechaFin: "",
      metaTickets: "",
      titulo: "",
      estado: "ABIERTA",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const openEditDialog = (meta: MetaTecnicoTicket) => {
    setEditingMeta(meta);
    setFormData({
      tecnicoId: meta.tecnico.id.toString(),
      fechaInicio: new Date(meta.fechaInicio).toISOString().split("T")[0],
      fechaFin: new Date(meta.fechaFin).toISOString().split("T")[0],
      metaTickets: meta.metaTickets.toString(),
      titulo: meta.titulo || "",
      estado: meta.estado,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (id: number) => {
    setDeletingMetaId(id);
    setDeleteDialogOpen(true);
  };

  const getEstadoBadgeVariant = (estado: EstadoMetaTicket) => {
    switch (estado) {
      case "ABIERTO":
        return "default";
      case "FINALIZADO":
        return "secondary";
      case "CERRADO":
        return "outline";
      case "CANCELADO":
        return "destructive";
      default:
        return "default";
    }
  };

  const optionsUsers: OptionSelected[] = tecnicos.map((t) => ({
    label: t.nombre,
    value: t.id.toString(),
  }));

  const handleSelectTec = (option: OptionSelected | null) => {
    if (option) {
      setFormData((previaData) => ({
        ...previaData,
        tecnicoId: option.value,
      }));
    }
  };

  // Variables calculadas antes del return
  const totalMetas = metas.length;
  const metasActivas = metas.filter((m) => m.estado === "ABIERTO").length;
  const ticketsResueltos = metas.reduce(
    (acc, meta) => acc + meta.ticketsResueltos,
    0
  );
  const metaTotal = metas.reduce((acc, meta) => acc + meta.metaTickets, 0);

  const rolesPermitidos = ["ADMIN", "SUPER_ADMIN", "OFICINA"];

  const isAllowed = !rolesPermitidos.includes(userRol);

  interface Objreturn {
    total: number;
    cerradas: number;
    abiertas: number;
    finalizadas: number;
  }

  const summary = metas.reduce(
    (acc: Objreturn, meta) => {
      acc.total += meta.metaTickets;

      if (meta.estado === "ABIERTO") {
        acc.abiertas++;
      }

      if (meta.estado === "CERRADO") {
        acc.cerradas++;
      }
      if (meta.estado === "FINALIZADO") {
        acc.finalizadas++;
      }

      return acc;
    },
    {
      total: 0,
      cerradas: 0,
      abiertas: 0,
      finalizadas: 0,
    }
  );

  return (
    <PageTransitionCrm
      titleHeader="Metas Ticket"
      subtitle={`${totalMetas} Totales · ${summary.abiertas} Abiertas · ${summary.cerradas} Cerradas · ${summary.finalizadas} Finalizadas  `}
      variant="fade-pure"
    >
      <Tabs defaultValue="ticketsMeta">
        <div>
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="ticketsMeta">
              Metas Soporte
            </TabsTrigger>
            <TabsTrigger className="w-full" value="metricas">
              Metricas
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="ticketsMeta">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 mb-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Metas de Soportes</h2>
            </div>
            <Button onClick={openCreateDialog} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Meta
            </Button>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Total Metas
                    </p>
                    <div className="text-2xl font-bold">{totalMetas}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-transparent">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Metas Activas
                    </p>
                    <div className="text-2xl font-bold">{metasActivas}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-transparent">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Tickets Resueltos
                    </p>
                    <div className="text-2xl font-bold">{ticketsResueltos}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-transparent">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Meta Total
                    </p>
                    <div className="text-2xl font-bold">{metaTotal}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-transparent">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de metas */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>
                <h2 className="text-lg text-center">Metas Activas</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="h-10 px-3 text-xs font-medium">
                        Técnico
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium">
                        Período
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        Objetivo
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        Resueltos
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        % Cumplido
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        Faltantes
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        Promedio/Día
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium text-right">
                        Proyección
                      </TableHead>
                      <TableHead className="h-10 px-2 text-xs font-medium">
                        Estado
                      </TableHead>
                      <TableHead className="w-16 h-10 px-2 text-xs font-medium text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="h-12">
                          {Array.from({ length: 10 }).map((_, j) => (
                            <TableCell key={j} className="px-3 py-2">
                              <Skeleton className="w-full h-3" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : metas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Target className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              No hay metas registradas
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={openCreateDialog}
                            >
                              Crear primera meta
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      metas.map((meta) => {
                        const diasTranscurridos = calcularDiasTranscurridos(
                          meta.fechaInicio
                        );
                        const diasTotales = calcularDiasTotales(
                          meta.fechaInicio,
                          meta.fechaFin
                        );
                        const porcentajeCumplido = calcularPorcentajeCumplido(
                          meta.ticketsResueltos,
                          meta.metaTickets
                        );
                        const ticketsFaltantes = calcularTicketsFaltantes(
                          meta.ticketsResueltos,
                          meta.metaTickets
                        );
                        const promedioDiario = calcularPromedioTicketsPorDia(
                          meta.ticketsResueltos,
                          diasTranscurridos
                        );
                        const proyeccion = calcularProyeccionCumplimiento(
                          meta.ticketsResueltos,
                          diasTranscurridos,
                          diasTotales
                        );

                        return (
                          <TableRow
                            key={meta.id}
                            className="h-14 hover:bg-muted/50"
                          >
                            <TableCell className="px-3 py-2">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium leading-tight">
                                  {meta.tecnico.nombre}
                                </div>
                                <div className="text-xs leading-tight text-muted-foreground">
                                  {meta.titulo}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-2 py-2">
                              <div className="text-xs space-y-0.5">
                                <div className="leading-tight">
                                  {formateDate(meta.fechaInicio)}
                                </div>
                                <div className="leading-tight text-muted-foreground">
                                  {formateDate(meta.fechaFin)}
                                </div>
                                <div className="leading-tight text-muted-foreground">
                                  {diasTranscurridos}/{diasTotales} días
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span className="text-sm font-medium">
                                {meta.metaTickets}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span className="text-sm">
                                {meta.ticketsResueltos}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span
                                className={`font-medium text-sm ${
                                  porcentajeCumplido >= 100
                                    ? "text-green-600"
                                    : porcentajeCumplido >= 75
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {porcentajeCumplido}%
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span className="text-sm">
                                {ticketsFaltantes}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span className="text-sm">{promedioDiario}</span>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <span
                                className={`font-medium text-sm ${
                                  proyeccion >= meta.metaTickets
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {proyeccion}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2">
                              <Badge
                                variant={getEstadoBadgeVariant(meta.estado)}
                                className="text-xs px-2 py-0.5"
                              >
                                {meta.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-2 py-2 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  disabled={isAllowed}
                                  asChild
                                >
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-8 h-8 p-0 hover:bg-muted"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                    <span className="sr-only">Abrir menú</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  className="w-40"
                                  align="end"
                                  sideOffset={4}
                                >
                                  <DropdownMenuLabel className="text-xs font-medium">
                                    Acciones
                                  </DropdownMenuLabel>
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      className="text-xs cursor-pointer"
                                      onClick={() => openEditDialog(meta)}
                                      disabled={operationLoading}
                                    >
                                      <Edit className="h-3.5 w-3.5 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs text-red-600 cursor-pointer focus:text-red-600"
                                      onClick={() => openDeleteDialog(meta.id)}
                                      disabled={operationLoading}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metricas">
          <Metricas />
        </TabsContent>
      </Tabs>

      {/* Diálogo Crear Meta */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Meta</DialogTitle>
            <DialogDescription>
              Define una nueva meta de tickets para un técnico
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tecnico">Técnico</Label>
              <ReactSelectcomponent
                className="text-sm text-black"
                placeholder="Selecciona un usuario"
                onChange={handleSelectTec}
                options={optionsUsers}
                value={
                  formData.tecnicoId
                    ? {
                        value: formData.tecnicoId,
                        label:
                          tecnicos.find(
                            (t) => t.id.toString() === formData.tecnicoId
                          )?.nombre || "",
                      }
                    : null
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
                placeholder="Ej: Meta Enero 2025"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fechaInicio: dayjs(e.target.value)
                        .tz("America/Guatemala")
                        .format("YYYY-MM-DD"),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fechaFin: dayjs(e.target.value)
                        .tz("America/Guatemala")
                        .format("YYYY-MM-DD"),
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metaTickets">Meta de Tickets</Label>
              <Input
                id="metaTickets"
                type="number"
                min="1"
                value={formData.metaTickets}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTickets: e.target.value,
                  }))
                }
                placeholder="Número de tickets objetivo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={operationLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={operationLoading}>
              {operationLoading ? "Creando..." : "Crear Meta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Editar Meta */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription>
              Modifica los datos de la meta seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tecnico-edit">Técnico</Label>
              <ReactSelectcomponent
                isDisabled
                className="text-sm text-black"
                placeholder="Selecciona un usuario"
                onChange={handleSelectTec}
                options={optionsUsers}
                value={
                  formData.tecnicoId
                    ? {
                        value: formData.tecnicoId,
                        label:
                          tecnicos.find(
                            (t) => t.id.toString() === formData.tecnicoId
                          )?.nombre || "",
                      }
                    : null
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titulo-edit">Título (opcional)</Label>
              <Input
                id="titulo-edit"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
                placeholder="Ej: Meta Enero 2025"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio-edit">Fecha Inicio</Label>
                <Input
                  id="fechaInicio-edit"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fechaInicio: dayjs(e.target.value)
                        .tz("America/Guatemala")
                        .format("YYYY-MM-DD"),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin-edit">Fecha Fin</Label>
                <Input
                  id="fechaFin-edit"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fechaFin: dayjs(e.target.value)
                        .tz("America/Guatemala")
                        .format("YYYY-MM-DD"),
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metaTickets-edit">Meta de Tickets</Label>
              <Input
                id="metaTickets-edit"
                type="number"
                min="1"
                value={formData.metaTickets}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTickets: e.target.value,
                  }))
                }
                placeholder="Número de tickets objetivo"
              />
            </div>
            <div className="grid gap-2">
              <Select
                onValueChange={(value) => {
                  setFormData((previaData) => ({
                    ...previaData,
                    estado: value,
                  }));
                }}
                value={formData.estado}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado de meta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={EstadoMetaTicketEnum.ABIERTO}>
                      Abierto
                    </SelectItem>
                    <SelectItem value={EstadoMetaTicketEnum.CANCELADO}>
                      Cancelado
                    </SelectItem>
                    <SelectItem value={EstadoMetaTicketEnum.CERRADO}>
                      Cerrado
                    </SelectItem>
                    <SelectItem value={EstadoMetaTicketEnum.FINALIZADO}>
                      Finalizado
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={operationLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={operationLoading}>
              {operationLoading ? "Actualizando..." : "Actualizar Meta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Confirmar Eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La meta será eliminada
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            {/* Botón Cancelar */}
            <DialogClose asChild>
              <Button
                variant="secondary"
                disabled={operationLoading}
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
            </DialogClose>

            {/* Botón Eliminar */}
            <Button
              onClick={handleDelete}
              disabled={operationLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {operationLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransitionCrm>
  );
}
