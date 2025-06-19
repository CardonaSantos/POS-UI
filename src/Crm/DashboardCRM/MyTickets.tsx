"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";
import type { EstadoTicketSoporte, FormattedTicket } from "./types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Clock,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) =>
  dayjs(fecha).format("DD/MM/YYYY hh:mm A");

interface MyTicketsProps {
  getEnProceso: () => void;
  tickets: FormattedTicket[];
}

interface DialogDetailsProps {
  ticket: FormattedTicket | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  getEnProceso: () => void;
}

export default function MyTickets({ tickets, getEnProceso }: MyTicketsProps) {
  const [selectedTicket, setSelectedTicket] = useState<FormattedTicket | null>(
    null
  );
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  return (
    <>
      <Card className="w-full shadow-sm border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mis Tickets
            </CardTitle>
            <Link
              to="tickets"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Ver todos
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No tienes tickets disponibles</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setOpenDetail(true);
                  }}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 hover:scale-[1.01]"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate">
                          {ticket.clientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        <Calendar className="h-4 w-4" />
                        <span>{formatearFecha(ticket.openedAt)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            #{ticket.id} - {ticket.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DialogDetails
        getEnProceso={getEnProceso}
        ticket={selectedTicket}
        open={openDetail}
        setOpen={setOpenDetail}
      />
    </>
  );
}

function DialogDetails({
  ticket,
  open,
  setOpen,
  getEnProceso,
}: DialogDetailsProps) {
  const [updatingTicket, setUpdatingTicket] = useState<FormattedTicket | null>(
    ticket
  );
  console.log("El actualizando es: ", updatingTicket);
  useEffect(() => {
    // Sincronizamos el state interno cuando cambia la prop "ticket"
    setUpdatingTicket(ticket);
  }, [ticket]);

  // 2️⃣ Guard clause tras los hooks
  if (!ticket) return null;

  const handleSelectChange = (status: EstadoTicketSoporte) => {
    setUpdatingTicket((prev) => (prev ? { ...prev, status } : prev));
  };

  const updateStatusTicket = async () => {
    if (!ticket) return;
    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/tickets-soporte/update-status-ticket/${ticket.id}`,
        { estado: updatingTicket?.status }
      );
      if (response.status === 200) {
        toast.success("Ticket actualizado");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal...");
    } finally {
      getEnProceso();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Detalle del Ticket #{ticket.id}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Información completa del ticket y cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Datos básicos */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Título
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {ticket.title || "Sin título"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {ticket.clientName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {ticket.clientPhone ?? "N/A"}
                  </p>
                </div>
              </div>

              {ticket.referenceContact && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contacto ref.
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {ticket.referenceContact}
                    </p>
                  </div>
                </div>
              )}

              {ticket.direction && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección.
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {ticket.direction}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Abierto el
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatearFecha(ticket.openedAt)}
                  </p>
                </div>
              </div>
            </div>

            {ticket.description && (
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {ticket.description}
                </p>
              </div>
            )}
          </div>

          {/* Ubicación */}
          {(ticket.direction ||
            (ticket.location?.lat && ticket.location?.lng)) && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Ubicación
              </h4>
              {ticket.direction && (
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {ticket.direction}
                </p>
              )}
              {ticket.location?.lat && ticket.location?.lng && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${ticket.location.lat},${ticket.location.lng}`,
                      "_blank"
                    )
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver en Google Maps
                </Button>
              )}
            </div>
          )}

          {/* Actualizar estado */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Actualizar Estado
            </h4>
            <div className="pl-6">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Estado del ticket
              </Label>
              <Select
                defaultValue="EN_PROCESO"
                value={updatingTicket?.status}
                onValueChange={(value) =>
                  handleSelectChange(value as EstadoTicketSoporte)
                }
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUEVO">Nuevo</SelectItem>
                  <SelectItem value="ABIERTA">Abierta</SelectItem>
                  <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PENDIENTE_CLIENTE">
                    Pendiente Cliente
                  </SelectItem>
                  <SelectItem value="PENDIENTE_TECNICO">
                    Pendiente Técnico
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="order-2 sm:order-1">
              Cerrar
            </Button>
          </DialogClose>
          <Button onClick={updateStatusTicket} className="order-1 sm:order-2">
            <Clock className="h-4 w-4 mr-2" />
            Actualizar Estado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
