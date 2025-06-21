"use client";

import { useState } from "react";
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
import { Clock, User, AlertCircle } from "lucide-react";

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

export default function TicketsEnProcesoCardFixed({
  data,
}: {
  data: TicketMoment[];
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketMoment | null>(
    null
  );
  console.log("Ticket seleccionado: ", selectedTicket);

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Tickets en Proceso
            </CardTitle>
            <CardDescription>
              {data.length} ticket{data.length !== 1 ? "s" : ""} activo
              {data.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{data.length}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground p-6">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No hay tickets en proceso</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <Table className="min-w-full text-sm">
              {/* Encabezado */}
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                <TableRow className="border-b">
                  <TableHead className="w-[60px] px-3 text-center text-xs">
                    #
                  </TableHead>
                  <TableHead className="px-3 text-left text-xs">
                    Ticket
                  </TableHead>
                  <TableHead className="px-3 text-left text-xs">
                    Cliente
                  </TableHead>
                  <TableHead className="w-[100px] px-3 text-center text-xs">
                    Prioridad
                  </TableHead>
                  <TableHead className="w-[120px] px-3 text-left text-xs">
                    Técnico
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Filas de datos */}
              <TableBody>
                {data.map((ticket) => (
                  <TooltipProvider key={ticket.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          {/* --- Fila clicable --- */}
                          <DialogTrigger asChild>
                            <TableRow
                              onClick={() => setSelectedTicket(ticket)}
                              className="cursor-pointer hover:bg-muted/50 border-b border-border/50 transition-colors"
                            >
                              {/* # */}
                              <TableCell className="w-[60px] px-3 text-center font-mono text-xs text-muted-foreground">
                                #{ticket.id}
                              </TableCell>

                              {/* Ticket */}
                              <TableCell className="px-3">
                                <p
                                  className="font-medium truncate"
                                  title={ticket.titulo}
                                >
                                  {ticket.titulo}
                                </p>
                                {ticket.descripcion && (
                                  <p
                                    className="text-xs text-muted-foreground truncate max-w-[22ch]"
                                    title={ticket.descripcion}
                                  >
                                    {ticket.descripcion}
                                  </p>
                                )}
                              </TableCell>

                              {/* Cliente */}
                              <TableCell className="px-3 truncate font-medium text-xs">
                                {ticket.cliente.nombre}{" "}
                                {ticket.cliente.apellidos}
                              </TableCell>

                              {/* Prioridad */}
                              <TableCell className="px-3 text-center">
                                <Badge
                                  variant={getPrioridadColor(ticket.prioridad)}
                                  className="gap-1 text-[10px] mx-auto"
                                >
                                  {getPrioridadIcon(ticket.prioridad)}
                                  {ticket.prioridad}
                                </Badge>
                              </TableCell>

                              {/* Técnico */}
                              <TableCell className="px-3 truncate">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-muted-foreground shrink-0" />
                                  {ticket.tecnico?.nombre ?? (
                                    <span className="italic text-muted-foreground">
                                      Sin asignar
                                    </span>
                                  )}
                                </span>
                              </TableCell>
                            </TableRow>
                          </DialogTrigger>

                          {/* --- Diálogo de detalle --- */}
                          {selectedTicket?.id === ticket.id && (
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Ticket #{ticket.id}
                                  <Badge
                                    variant={getPrioridadColor(
                                      ticket.prioridad
                                    )}
                                    className="text-xs gap-1"
                                  >
                                    {getPrioridadIcon(ticket.prioridad)}
                                    {ticket.prioridad}
                                  </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  Detalles del ticket en proceso
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 mt-4">
                                {/* Título */}
                                <section>
                                  <h4 className="text-sm font-medium text-muted-foreground uppercase">
                                    Título
                                  </h4>
                                  <p>{ticket.titulo}</p>
                                </section>

                                {/* Descripción */}
                                <section>
                                  <h4 className="text-sm font-medium text-muted-foreground uppercase">
                                    Descripción
                                  </h4>
                                  <p>
                                    {ticket.descripcion ?? (
                                      <span className="italic text-muted-foreground">
                                        Sin descripción
                                      </span>
                                    )}
                                  </p>
                                </section>

                                {/* Estado & Técnico */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                                      Estado
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {ticket.estado}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                                      Técnico
                                    </h4>
                                    <span className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      {ticket.tecnico?.nombre ?? (
                                        <span className="italic text-muted-foreground">
                                          Sin asignar
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      </TooltipTrigger>

                      {/* --- Tooltip --- */}
                      <TooltipContent side="top" className="max-w-sm">
                        <p className="font-medium text-sm">{ticket.titulo}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge
                            variant={getPrioridadColor(ticket.prioridad)}
                            className="text-xs"
                          >
                            {ticket.prioridad}
                          </Badge>
                          <span className="text-muted-foreground">
                            {ticket.tecnico?.nombre ?? "Sin asignar"}
                          </span>
                        </div>
                        {ticket.descripcion && (
                          <p className="text-xs text-muted-foreground">
                            {ticket.descripcion}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
