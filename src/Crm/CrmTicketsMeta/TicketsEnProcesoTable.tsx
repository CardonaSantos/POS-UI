"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  User,
  AlertCircle,
  Eye,
  Settings,
  CheckCircle2,
  Timer,
} from "lucide-react";

interface Acompañantes {
  id: number;
  nombre: string;
}
// Types
interface TicketMoment {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: PrioridadTicketSoporte;
  tecnico?: {
    nombre: string;
  };
  acompanantes: Acompañantes[];
  cliente: {
    id: number;
    nombre: string;
    apellidos: string;
  };
}

enum PrioridadTicketSoporte {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

// Función para obtener el color del badge según la prioridad
const getPrioridadColor = (prioridad: PrioridadTicketSoporte) => {
  switch (prioridad) {
    case PrioridadTicketSoporte.URGENTE:
      return "destructive";
    case PrioridadTicketSoporte.ALTA:
      return "destructive";
    case PrioridadTicketSoporte.MEDIA:
      return "default";
    case PrioridadTicketSoporte.BAJA:
      return "secondary";
    default:
      return "secondary";
  }
};

// Función para obtener el ícono según la prioridad
const getPrioridadIcon = (prioridad: PrioridadTicketSoporte) => {
  switch (prioridad) {
    case PrioridadTicketSoporte.URGENTE:
    case PrioridadTicketSoporte.ALTA:
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

// Función para obtener el color del estado
const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "EN_PROCESO":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "PENDIENTE_REVISION":
      return "bg-amber-50 border-amber-200 text-amber-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

// Función para obtener el ícono del estado
const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "EN_PROCESO":
      return <Settings className="h-4 w-4 animate-spin" />;
    case "PENDIENTE_REVISION":
      return <Eye className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const TicketRow = ({
  ticket,
  onSelect,
}: {
  ticket: TicketMoment;
  onSelect: (ticket: TicketMoment) => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableRow
            onClick={() => onSelect(ticket)}
            className="cursor-pointer hover:bg-muted/50 border-b border-border/50 transition-all duration-200 hover:shadow-sm"
          >
            {/* ID */}
            <TableCell className="w-[60px] px-3 text-center">
              <span className="font-mono text-xs text-muted-foreground">
                #{ticket.id}
              </span>
            </TableCell>

            {/* Información del Ticket */}
            <TableCell className="px-3 min-w-0">
              <div className="flex flex-col gap-1">
                <p
                  className="font-medium truncate text-sm"
                  title={ticket.titulo}
                >
                  {ticket.titulo}
                </p>
                {ticket.descripcion && (
                  <p
                    className="text-xs text-muted-foreground truncate max-w-[300px]"
                    title={ticket.descripcion}
                  >
                    {ticket.descripcion}
                  </p>
                )}
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border w-fit ${getEstadoColor(
                    ticket.estado
                  )}`}
                >
                  {getEstadoIcon(ticket.estado)}
                  <span className="capitalize">
                    {ticket.estado.replace("_", " ").toLowerCase()}
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Cliente */}
            <TableCell className="px-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {ticket.cliente.nombre} {ticket.cliente.apellidos}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ID: {ticket.cliente.id}
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Prioridad */}
            <TableCell className="px-3 text-center">
              <Badge
                variant={getPrioridadColor(ticket.prioridad)}
                className="gap-1 text-[10px] font-medium"
              >
                {getPrioridadIcon(ticket.prioridad)}
                {ticket.prioridad}
              </Badge>
            </TableCell>

            {/* Técnico */}
            <TableCell className="px-3">
              {ticket.tecnico?.nombre ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100  rounded-full flex items-center justify-center shrink-0">
                    <User className="h-3 w-3 text-green-600 " />
                  </div>
                  <span
                    className="text-sm text-foreground dark:text-gray-200 truncate max-w-[120px]"
                    title={ticket.tecnico.nombre}
                  >
                    {ticket.tecnico.nombre}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  </div>
                  <span className="text-sm italic text-muted-foreground dark:text-gray-500">
                    Sin asignar
                  </span>
                </div>
              )}
            </TableCell>

            <TableCell className="px-3">
              {ticket.acompanantes && ticket.acompanantes.length > 0 ? (
                <div className="flex items-center gap-2">
                  {/* Icono fijo */}
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-3 w-3 text-green-600" />
                  </div>
                  {/* Listado de nombres (con truncado si es muy largo) */}
                  <span
                    className="text-sm text-foreground dark:text-gray-200 truncate max-w-[160px]"
                    title={ticket.acompanantes.map((a) => a.nombre).join(", ")}
                  >
                    {ticket.acompanantes.map((a) => a.nombre).join(", ")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                    {/* Puedes usar un icono diferente, por ejemplo UserX */}
                    <User className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  </div>
                  <span className="text-sm italic text-gray-400 dark:text-gray-500">
                    No acompañantes
                  </span>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-2">
            <p className="font-medium text-sm">{ticket.titulo}</p>
            <div className="flex items-center gap-2">
              <Badge
                variant={getPrioridadColor(ticket.prioridad)}
                className="text-xs"
              >
                {ticket.prioridad}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {ticket.tecnico?.nombre ?? "Sin asignar"}
              </span>
            </div>
            {ticket.descripcion && (
              <p className="text-xs text-muted-foreground">
                {ticket.descripcion}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function ImprovedTicketsComponent({
  data,
}: {
  data: TicketMoment[];
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketMoment | null>(
    null
  );
  console.log("Los tickets en procesos son: ", data);

  // Separar tickets por estado
  const { ticketsEnProceso, ticketsPendientes } = useMemo(() => {
    const enProceso = data.filter((ticket) => ticket.estado === "EN_PROCESO");
    const pendientes = data.filter(
      (ticket) => ticket.estado === "PENDIENTE_REVISION"
    );

    return {
      ticketsEnProceso: enProceso,
      ticketsPendientes: pendientes,
    };
  }, [data]);

  const TicketTable = ({
    tickets,
    emptyMessage,
  }: {
    tickets: TicketMoment[];
    emptyMessage: string;
  }) => (
    <>
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground p-6">
          <Clock className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0  backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 bg-transparent">
              <TableRow className="border-b">
                <TableHead className="w-[60px] px-3 text-center text-xs">
                  #
                </TableHead>
                <TableHead className="px-3 text-left text-xs">Ticket</TableHead>
                <TableHead className="px-3 text-left text-xs">
                  Cliente
                </TableHead>
                <TableHead className="w-[100px] px-3 text-center text-xs">
                  Prioridad
                </TableHead>
                <TableHead className="w-[120px] px-3 text-left text-xs">
                  Técnico
                </TableHead>

                <TableHead className="w-[120px] px-3 text-left text-xs">
                  Acompañantes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <Dialog key={ticket.id}>
                  <DialogTrigger asChild>
                    <TicketRow ticket={ticket} onSelect={setSelectedTicket} />
                  </DialogTrigger>

                  {selectedTicket?.id === ticket.id && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span>Ticket #{ticket.id}</span>
                          <Badge
                            variant={getPrioridadColor(ticket.prioridad)}
                            className="text-xs gap-1"
                          >
                            {getPrioridadIcon(ticket.prioridad)}
                            {ticket.prioridad}
                          </Badge>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                              ticket.estado
                            )}`}
                          >
                            {getEstadoIcon(ticket.estado)}
                            <span className="capitalize">
                              {ticket.estado.replace("_", " ").toLowerCase()}
                            </span>
                          </div>
                        </DialogTitle>
                        <DialogDescription>
                          Detalles completos del ticket
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 mt-4">
                        {/* Información principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <section>
                              <h4 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                                Título
                              </h4>
                              <p className="text-sm">{ticket.titulo}</p>
                            </section>

                            <section>
                              <h4 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                                Descripción
                              </h4>
                              <p className="text-sm">
                                {ticket.descripcion ?? (
                                  <span className="italic text-muted-foreground">
                                    Sin descripción
                                  </span>
                                )}
                              </p>
                            </section>
                          </div>

                          <div className="space-y-4">
                            <section>
                              <h4 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                                Cliente
                              </h4>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {ticket.cliente.nombre.charAt(0)}
                                  {ticket.cliente.apellidos.charAt(0)}
                                </div>

                                <div>
                                  <p className="font-medium">
                                    {ticket.cliente.nombre}{" "}
                                    {ticket.cliente.apellidos}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {ticket.cliente.id}
                                  </p>
                                </div>
                              </div>
                            </section>

                            <section>
                              <h4 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                                Técnico Asignado
                              </h4>
                              {ticket.tecnico?.nombre ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-600" />
                                  </div>
                                  <span>{ticket.tecnico.nombre}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <span className="italic text-muted-foreground">
                                    Sin asignar
                                  </span>
                                </div>
                              )}
                            </section>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );

  return (
    <Card
      className="shadow-lg w-full border-0
    bg-transparent
  "
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Tickets En Proceso</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {data.length} ticket{data.length !== 1 ? "s" : ""} activo
              {data.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <Timer className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-medium">
                {ticketsEnProceso.length}
              </span>
              <span className="text-blue-600">En proceso</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full">
              <Eye className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 font-medium">
                {ticketsPendientes.length}
              </span>
              <span className="text-amber-600">Pendientes</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="todos" className="w-full">
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Todos ({data.length})
              </TabsTrigger>
              <TabsTrigger value="proceso" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                En Proceso ({ticketsEnProceso.length})
              </TabsTrigger>
              <TabsTrigger
                value="pendientes"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Pendientes ({ticketsPendientes.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="todos" className="mt-0">
            <TicketTable tickets={data} emptyMessage="No hay tickets activos" />
          </TabsContent>

          <TabsContent value="proceso" className="mt-0">
            <TicketTable
              tickets={ticketsEnProceso}
              emptyMessage="No hay tickets en proceso"
            />
          </TabsContent>

          <TabsContent value="pendientes" className="mt-0">
            <TicketTable
              tickets={ticketsPendientes}
              emptyMessage="No hay tickets pendientes de revisión"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
