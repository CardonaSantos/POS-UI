"use client";

import { useState } from "react";
import {
  Ticket,
  AlertCircle,
  CheckCircle,
  Clock3,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { TicketDetailsDialog } from "./ticket-details-dialog";
import { TicketSoporte } from "@/Crm/features/cliente-interfaces/cliente-types";

// Importar el nuevo componente de diálogo

// Asegúrate de que esta interfaz coincida con la estructura de tu ticket

interface ClienteDetailsDto {
  ticketSoporte: TicketSoporte[];
}

interface TicketsTabProps {
  cliente: ClienteDetailsDto;
}

const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD/MM/YYYY");
};

export function TicketsTab({ cliente }: TicketsTabProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketSoporte | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Función para obtener el color de la insignia según el estado del ticket
  const getTicketEstadoColor = (estado: string) => {
    switch (estado) {
      case "ABIERTA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "EN_PROCESO":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "PENDIENTE":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "CERRADA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Función para obtener el color de la insignia según la prioridad del ticket
  const getTicketPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "BAJA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "ALTA":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "URGENTE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Función para obtener el icono según el estado del ticket
  const getTicketEstadoIcon = (estado: string) => {
    switch (estado) {
      case "ABIERTA":
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "EN_PROCESO":
        return <Clock3 className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "PENDIENTE":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "CERRADA":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const handleRowClick = (ticket: TicketSoporte) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  console.log("Los tickets de soporte son: ", cliente.ticketSoporte);

  return (
    <div className="space-y-4">
      {" "}
      {/* Añadido padding general */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          {" "}
          {/* Ajustado padding-bottom */}
          <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
            {" "}
            {/* Título más grande y con color */}
            <Ticket className="h-4 w-4 mr-2 text-primary dark:text-white" />
            Tickets de Soporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cliente.ticketSoporte && cliente.ticketSoporte.length > 0 ? (
            <div className="overflow-x-auto">
              <ScrollArea className="h-[400px] w-full">
                {" "}
                {/* Asegura que ScrollArea ocupe el 100% del ancho */}
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">ID</TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Título
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Estado
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Prioridad
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Fecha Apertura
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Fecha Cierre
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cliente.ticketSoporte.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        onClick={() => handleRowClick(ticket)} // Añadido onClick a la fila
                        className="cursor-pointer hover:bg-muted/50 transition-colors text-xs sm:text-sm" // Estilos para clickeable
                      >
                        <TableCell className="font-medium">
                          #{ticket.id}
                        </TableCell>
                        <TableCell className="max-w-[150px] sm:max-w-[200px] truncate">
                          {ticket.titulo}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "flex items-center w-fit gap-1 text-xs",
                              getTicketEstadoColor(ticket.estado)
                            )}
                          >
                            {getTicketEstadoIcon(ticket.estado)}
                            <span className="hidden sm:inline">
                              {ticket.estado}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getTicketPrioridadColor(ticket.prioridad)
                            )}
                          >
                            <span className="hidden sm:inline">
                              {ticket.prioridad}
                            </span>
                            <span className="sm:hidden">
                              {ticket.prioridad.charAt(0)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatearFecha(ticket.fechaCreacion)}
                        </TableCell>
                        <TableCell>
                          {ticket.fechaCierre
                            ? formatearFecha(ticket.fechaCierre)
                            : "Sin cerrar"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                          >
                            {" "}
                            {/* Ajustado tamaño de botón */}
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />{" "}
                            {/* Ajustado tamaño de icono */}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          ) : (
            <div className="text-center py-8">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />{" "}
              {/* Icono más grande y margen */}
              <p className="mt-2 text-base text-muted-foreground">
                No hay tickets de soporte registrados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Diálogo de detalles del ticket */}
      <TicketDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
}
