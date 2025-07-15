import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Hash,
} from "lucide-react";
import dayjs from "dayjs";
import { TicketSoporte } from "./types";

// Asegúrate de que esta interfaz coincida con la estructura de tu ticket

interface TicketDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketSoporte | null;
}

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

const getTicketEstadoIcon = (estado: string) => {
  switch (estado) {
    case "ABIERTA":
      return <AlertCircle className="h-4 w-4" />;
    case "EN_PROCESO":
      return <Clock3 className="h-4 w-4" />;
    case "PENDIENTE":
      return <Clock className="h-4 w-4" />;
    case "CERRADA":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const formatearFecha = (fecha?: string | null) => {
  return fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "N/A";
};

export function TicketDetailsDialog({
  isOpen,
  onClose,
  ticket,
}: TicketDetailsDialogProps) {
  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold flex items-center gap-1">
            <Hash className="h-4 w-4 text-primary" />
            Ticket #{ticket.id}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Detalles completos del ticket de soporte.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2 text-xs">
          <div className="grid grid-cols-2 items-center gap-1">
            <span className="font-medium text-muted-foreground">Título:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-50">
              {ticket.titulo}
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-1">
            <span className="font-medium text-muted-foreground">Estado:</span>
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 text-xs",
                getTicketEstadoColor(ticket.estado)
              )}
            >
              {getTicketEstadoIcon(ticket.estado)}
              {ticket.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-2 items-center gap-1">
            <span className="font-medium text-muted-foreground">
              Prioridad:
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                getTicketPrioridadColor(ticket.prioridad)
              )}
            >
              {ticket.prioridad}
            </Badge>
          </div>

          <Separator className="my-1" />

          <div className="grid grid-cols-2 items-center gap-1">
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Creación:
            </span>
            <span className="text-gray-900 dark:text-gray-50">
              {formatearFecha(ticket.fechaCreacion)}
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-1">
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Cierre:
            </span>
            <span className="text-gray-900 dark:text-gray-50">
              {formatearFecha(ticket.fechaCierre)}
            </span>
          </div>

          <Separator className="my-1" />

          <div className="grid grid-cols-1 gap-1">
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Descripción:
            </span>
            <p className="text-gray-900 dark:text-gray-50 leading-relaxed whitespace-pre-wrap">
              {ticket.descripcion || "No hay descripción."}
            </p>
          </div>

          <Separator className="my-1" />

          {ticket.tecnico && (
            <div className="grid grid-cols-2 items-center gap-1">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" /> Técnico:
              </span>
              <span className="text-gray-900 dark:text-gray-50">
                {ticket.tecnico.nombre}
              </span>
            </div>
          )}

          {ticket.acompanantes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-muted-foreground flex items-center gap-1 text-xs">
                <User className="h-4 w-4" /> Técnicos:
              </span>
              {ticket.acompanantes.map((tec, i) => (
                <span
                  key={i}
                  className="text-gray-900 dark:text-gray-50 text-xs bg-muted-light px-1 py-0.5 rounded"
                >
                  {tec.nombre}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
