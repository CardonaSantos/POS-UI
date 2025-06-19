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
import { TicketMoment } from "./types";

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

// Componente principal - Ahora recibe directamente el array de tickets
export default function TicketsEnProcesoCard({
  data,
}: {
  data: TicketMoment[];
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketMoment | null>(
    null
  );
  console.log("El ticket seleccionado: ", selectedTicket);

  return (
    <Card className="col-span-1 shadow-md">
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
      <CardContent className="p-0 max-h-60 overflow-y-auto">
        {data.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay tickets en proceso</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-16 px-3 text-xs font-medium">
                    #
                  </TableHead>
                  <TableHead className="px-3 text-xs font-medium">
                    Ticket
                  </TableHead>
                  <TableHead className="w-20 px-3 text-xs font-medium text-center">
                    Prioridad
                  </TableHead>
                  <TableHead className="w-28 px-3 text-xs font-medium">
                    Técnico
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((ticket) => (
                  <TooltipProvider key={ticket.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <TableRow
                              className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <TableCell className="px-3 py-3 font-mono text-xs text-muted-foreground">
                                #{ticket.id}
                              </TableCell>
                              <TableCell className="px-3 py-3">
                                <div className="space-y-1">
                                  <div
                                    className="font-medium text-sm truncate"
                                    title={ticket.titulo}
                                  >
                                    {ticket.titulo}
                                  </div>
                                  {ticket.descripcion && (
                                    <div
                                      className="text-xs text-muted-foreground truncate max-w-xs"
                                      title={ticket.descripcion}
                                    >
                                      {ticket.descripcion.length > 60
                                        ? `${ticket.descripcion.substring(
                                            0,
                                            60
                                          )}...`
                                        : ticket.descripcion}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="px-3 py-3 text-center">
                                <Badge
                                  variant={getPrioridadColor(ticket.prioridad)}
                                  className="text-xs flex items-center justify-center gap-1 w-fit mx-auto"
                                >
                                  {getPrioridadIcon(ticket.prioridad)}
                                  {ticket.prioridad}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-shrink-0">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <span
                                    className="text-xs truncate"
                                    title={
                                      ticket?.tecnico?.nombre || "Sin asignar"
                                    }
                                  >
                                    {ticket?.tecnico?.nombre || (
                                      <span className="text-muted-foreground italic">
                                        Sin asignar
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-lg">
                                Ticket #{ticket.id}
                                <Badge
                                  variant={getPrioridadColor(ticket.prioridad)}
                                  className="text-xs"
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
                              <div>
                                <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                                  Título
                                </h4>
                                <p className="text-sm font-medium">
                                  {ticket.titulo}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                                  Descripción
                                </h4>
                                <p className="text-sm leading-relaxed">
                                  {ticket.descripcion || (
                                    <span className="text-muted-foreground italic">
                                      Sin descripción
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                                    Estado
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {ticket.estado}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                                    Técnico
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {ticket?.tecnico?.nombre || (
                                        <span className="text-muted-foreground italic">
                                          Sin asignar
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm">
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{ticket.titulo}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge
                              variant={getPrioridadColor(ticket.prioridad)}
                              className="text-xs"
                            >
                              {ticket.prioridad}
                            </Badge>
                            <span className="text-muted-foreground">
                              {ticket?.tecnico?.nombre || "Sin asignar"}
                            </span>
                          </div>
                          {ticket.descripcion && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {ticket.descripcion.length > 120
                                ? `${ticket.descripcion.substring(0, 120)}...`
                                : ticket.descripcion}
                            </p>
                          )}
                        </div>
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
