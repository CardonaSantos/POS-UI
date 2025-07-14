"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Text,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "./utils";
import { Badge } from "@/components/ui/badge";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) =>
  dayjs(fecha).format("DD/MM/YYYY hh:mm A");

interface MyTicketsProps {
  getEnProceso: () => void;
  getEnProcesoStatus: () => void;

  tickets: FormattedTicket[];
}

interface DialogDetailsProps {
  ticket: FormattedTicket | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  getEnProceso: () => void;
  getEnProcesoStatus: () => void;
}

export default function MyTickets({
  tickets,
  getEnProceso,
  getEnProcesoStatus,
}: MyTicketsProps) {
  const [selectedTicket, setSelectedTicket] = useState<FormattedTicket | null>(
    null
  );
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  return (
    <>
      <Card className="w-full bg-white border border-gray-200 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mis Tickets
            </CardTitle>
            <Link
              to="tickets"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver todos
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {tickets.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No tienes tickets disponibles</p>
            </div>
          ) : (
            <div className="pr-2 space-y-3 overflow-y-auto max-h-80">
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
                    <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex items-center flex-1 min-w-0 gap-2">
                        <User className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 truncate dark:text-gray-100">
                          {ticket.clientName}
                        </span>
                      </div>
                      <div className="flex items-center flex-shrink-0 gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(ticket.openedAt)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            #{ticket.id} - {ticket.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>

                        <Badge variant={"destructive"}>{ticket.status}</Badge>
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
        getEnProcesoStatus={getEnProcesoStatus}
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
  getEnProcesoStatus,
}: DialogDetailsProps) {
  const [updatingTicket, setUpdatingTicket] = useState<FormattedTicket | null>(
    ticket
  );
  console.log("El actualizando es: ", updatingTicket);
  useEffect(() => {
    setUpdatingTicket(ticket);
  }, [ticket]);

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
        await getEnProceso();
        await getEnProcesoStatus();
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal...");
    } finally {
      getEnProceso();
    }
  };

  const isDisableReference: boolean = ticket.referenceContact ? false : true;
  const isDisableContact: boolean = ticket.clientPhone ? false : true;

  const handleOpenWhatsapp = (number: string) => {
    const cleaned = number.replace(/[\s\-().]/g, "");
    return `https://wa.me/502${cleaned}`;
  };

  const handleCall = (number: string) => {
    const cleaned = number.replace(/[\s\-().]/g, "");
    return `tel:+502${cleaned}`;
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

        <div className="py-4 space-y-6">
          {/* Datos básicos */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <Link
                      to={`/crm/cliente/${ticket.clientId}`}
                      className="text-blue-500 underline"
                    >
                      {ticket.clientName}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                {/* Bloque Teléfono */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Teléfono
                    </p>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {ticket.clientPhone ?? "N/A"}
                        </p>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            window.open(
                              handleOpenWhatsapp(ticket.clientPhone ?? ""),
                              "_blank"
                            )
                          }
                          disabled={isDisableContact}
                        >
                          Abrir en Whatsapp
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            (window.location.href = handleCall(
                              ticket.clientPhone ?? ""
                            ))
                          }
                          disabled={isDisableContact}
                        >
                          Abrir en llamada
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          disabled={isDisableContact}
                          onClick={() =>
                            copyToClipboard(
                              ticket?.clientPhone ?? "No disponible"
                            )
                          }
                        >
                          Copiar
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Bloque Contacto de referencia */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contacto ref.
                    </p>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {ticket.referenceContact ?? "N/A"}
                        </p>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem disabled={isDisableReference}>
                          Abrir en Whatsapp
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem disabled={isDisableReference}>
                          Abrir en llamada
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          disabled={isDisableReference}
                          onClick={() =>
                            copyToClipboard(
                              ticket?.referenceContact ?? "No disponible"
                            )
                          }
                        >
                          Copiar
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {ticket.direction && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </p>
                <div className="flex gap-2">
                  <Text className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {ticket.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ubicación */}
          {(ticket.direction ||
            (ticket.location?.lat && ticket.location?.lng)) && (
            <div className="pt-4 space-y-3 border-t">
              <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver en Google Maps
                </Button>
              )}
            </div>
          )}

          {/* Actualizar estado */}
          <div className="pt-4 space-y-3 border-t">
            <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                  <SelectItem value="PENDIENTE_REVISION">
                    Pendiente Revisión
                  </SelectItem>

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

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline" className="order-2 sm:order-1">
              Cerrar
            </Button>
          </DialogClose>
          <Button onClick={updateStatusTicket} className="order-1 sm:order-2">
            <Clock className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
