import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  User,
  AlertCircle,
  Clock,
  FileText,
  Tag,
  Calendar,
  Settings,
} from "lucide-react";

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
  fechaCreacion?: string;
  cliente?: string;
}

enum PrioridadTicketSoporte {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

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

const getPrioridadIcon = (prioridad: PrioridadTicketSoporte) => {
  switch (prioridad) {
    case PrioridadTicketSoporte.URGENTE:
    case PrioridadTicketSoporte.ALTA:
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "EN_PROCESO":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "PENDIENTE":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "COMPLETADO":
      return "bg-green-50 text-green-700 border-green-200";
    case "CANCELADO":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

interface StyledTicketDialogProps {
  ticket: TicketMoment;
  children: React.ReactNode;
  onTicketSelect: (ticket: TicketMoment) => void;
}

export default function StyledTicketDialog({
  ticket,
  children,
  onTicketSelect,
}: StyledTicketDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div onClick={() => onTicketSelect(ticket)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span>Ticket #{ticket.id}</span>
                </div>
              </DialogTitle>
              <DialogDescription className="text-base">
                Información detallada del ticket de soporte
              </DialogDescription>
            </div>
            <Badge
              variant={getPrioridadColor(ticket.prioridad)}
              className="text-sm px-3 py-1 flex items-center gap-2"
            >
              {getPrioridadIcon(ticket.prioridad)}
              {ticket.prioridad}
            </Badge>
          </div>
        </DialogHeader>

        <Separator className="my-6" />

        <div className="space-y-6">
          {/* Título y Descripción */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-lg">
                    Información Principal
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Título
                    </label>
                    <p className="text-base font-medium mt-1 leading-relaxed">
                      {ticket.titulo}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Descripción
                    </label>
                    <p className="text-sm leading-relaxed mt-1 text-muted-foreground">
                      {ticket.descripcion || (
                        <span className="italic">
                          Sin descripción proporcionada
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado y Asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Estado</h3>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${getEstadoColor(
                    ticket.estado
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {ticket.estado.replace("_", " ")}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Técnico Asignado</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {ticket?.tecnico?.nombre || (
                        <span className="text-muted-foreground italic">
                          Sin asignar
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket?.tecnico?.nombre
                        ? "Técnico responsable"
                        : "Pendiente de asignación"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Información Adicional</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <label className="font-medium text-muted-foreground">
                    ID del Ticket
                  </label>
                  <p className="font-mono text-base">#{ticket.id}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-muted-foreground">
                    Fecha de Creación
                  </label>
                  <p>
                    {ticket.fechaCreacion || new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-muted-foreground">
                    Cliente
                  </label>
                  <p>{ticket.cliente || "No especificado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer con acciones rápidas */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última actualización: Hace 2 horas</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Ver historial
              </Badge>
              <Badge variant="outline" className="text-xs">
                Editar ticket
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
