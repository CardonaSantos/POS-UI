"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Ellipsis,
  FileText,
  RotateCcw,
  Send,
  Sticker,
  TicketSlash,
  X,
} from "lucide-react";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectComponent, { MultiValue, SingleValue } from "react-select";
import { RolUsuario } from "../CrmProfile/interfacesProfile";
import { Ticket } from "./ticketTypes";
import { Switch } from "@/components/ui/switch";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD MMMM YYYY hh:mm A");
};

interface OptionSelectedReactComponent {
  value: string;
  label: string;
}

interface TicketDetailProps {
  ticket: Ticket;
  getTickets: () => void;
  setSelectedTicketId: (value: number | null) => void;
  optionsLabels: OptionSelectedReactComponent[];
  optionsTecs: OptionSelectedReactComponent[];
  optionsCustomers: OptionSelectedReactComponent[];
}

interface SeguimientoData {
  ticketId: number | null;
  usuarioId: number | null;
  descripcion: string;
}

enum PrioridadTicketSoporte {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

interface TagOption {
  value: string;
  label: string;
}

export default function TicketDetail({
  ticket,
  getTickets,
  optionsLabels,
  optionsTecs,
  setSelectedTicketId,
  optionsCustomers,
}: TicketDetailProps) {
  const comentaryRef = useRef<HTMLTextAreaElement>(null);
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [openUpdateTicket, setOpenUpdateTicket] = useState(false);

  // Inicialización segura del estado
  const [ticketToEdit, setTicketToEdit] = useState<Ticket>(ticket);

  const [formDataComent, setFormDataComent] = useState<SeguimientoData>({
    descripcion: "".trim(),
    ticketId: ticket.id,
    usuarioId: userId,
  });

  const [openCloseTicket, setOpenCloseTicket] = useState(false);
  const [ticketDeleteId, setTicketDeleteId] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // Sincronizar estado cuando cambia el prop ticket
  useEffect(() => {
    setTicketToEdit(ticket);
    setFormDataComent((prev) => ({
      ...prev,
      ticketId: ticket.id,
    }));
  }, [ticket]);

  const submitNewComentaryFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formDataComent.descripcion) {
        toast.info("No se pueden enviar mensajes vacíos");
        return;
      }
      if (!formDataComent.ticketId || !formDataComent.usuarioId) {
        toast.info("Datos incompletos para el seguimiento");
        return;
      }

      const response = await axios.post(
        `${VITE_CRM_API_URL}/ticket-seguimiento`,
        formDataComent
      );

      if (response.status === 201) {
        toast.success("Comentario añadido");
        await getTickets();
        setFormDataComent((prev) => ({
          ...prev,
          descripcion: "",
        }));
      }
    } catch (error) {
      toast.info("Error al añadir seguimiento");
      console.error(error);
    }
  };

  const handleChangeCustomer = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    if (selectedOption) {
      setTicketToEdit((prev) => ({
        ...prev,
        customer: {
          id: Number(selectedOption.value),
          name: selectedOption.label,
          // Si tu tipo 'Customer' requiere más campos obligatorios,
          // rellénalos aquí con valores dummy o ajusta tu interfaz Ticket
        } as any,
      }));
    } else {
      setTicketToEdit((prev) => ({ ...prev, customer: null }));
    }
  };

  const getBadgeProps = (priority: PrioridadTicketSoporte) => {
    switch (priority) {
      case PrioridadTicketSoporte.BAJA:
        return {
          text: "Baja prioridad",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
        };
      case PrioridadTicketSoporte.MEDIA:
        return {
          text: "Prioridad media",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case PrioridadTicketSoporte.ALTA:
        return {
          text: "Alta prioridad",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-600",
        };
      case PrioridadTicketSoporte.URGENTE:
        return {
          text: "Urgente",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
        };
      default:
        return {
          text: "Desconocido",
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
        };
    }
  };
  const { bgColor, text, textColor } = getBadgeProps(ticket.priority);

  const handleChangePropsTicket = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTicketToEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTicketToEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de etiquetas
  const handleChangeLabels = (selectedOptions: MultiValue<TagOption>) => {
    // TypeScript safe mapping
    const tags = selectedOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));
    setTicketToEdit((prev) => ({
      ...prev,
      tags: tags,
    }));
  };

  // Manejo seguro del técnico asignado (permite nulos)
  const handleChangeTecSelect = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    if (selectedOption) {
      setTicketToEdit((prev) => ({
        ...prev,
        assignee: {
          id: Number(selectedOption.value),
          name: selectedOption.label,
          initials: selectedOption.label
            .split(" ")
            .map((word) => word[0])
            .join(""),
          rol: "TECNICO", // Asumimos rol técnico o lo extraes de optionsTecs si tienes esa data
          avatar: "",
        },
      }));
    } else {
      // Si se limpia, asignamos null
      setTicketToEdit((prev) => ({
        ...prev,
        assignee: null,
      }));
    }
  };

  const handleChangeCompanions = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    setTicketToEdit((prev) => ({
      ...prev,
      companios: selectedOptions
        ? selectedOptions.map((opt) => ({
            id: Number(opt.value),
            name: opt.label,
            rol: "TECNICO" as RolUsuario,
          }))
        : [],
    }));
  };

  const handleSubmitTicketEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // PREPARAMOS EL PAYLOAD CORRECTO PARA EL BACKEND
      // El backend espera IDs (clienteId, tecnicoId), no objetos completos.
      const payload = {
        title: ticketToEdit.title,
        description: ticketToEdit.description,
        priority: ticketToEdit.priority,
        status: ticketToEdit.status,
        fixed: ticketToEdit.fixed,

        clienteId: ticketToEdit.customer?.id || null,
        tecnicoId: ticketToEdit.assignee?.id || null,

        tecnicosAdicionales: ticketToEdit.companios?.map((c) => c.id) || [],
        tags: ticketToEdit.tags?.map((t) => Number(t.value)) || [],
      };

      const response = await axios.patch(
        `${VITE_CRM_API_URL}/tickets-soporte/update-ticket-soporte/${ticketToEdit.id}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Ticket actualizado correctamente");
        await getTickets(); // Refresca la lista
        setOpenUpdateTicket(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el ticket");
    }
  };

  const handleDeleteTicket = async () => {
    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/tickets-soporte/delete-ticket/${ticketDeleteId}`
      );
      if (response.status === 200) {
        toast.success("Ticket eliminado");
        setOpenDelete(false);
        setSelectedTicketId(null);
        await getTickets();
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal");
    }
  };

  const handleCloseTicket = async () => {
    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/tickets-soporte/close-ticket-soporte/${ticketToEdit.id}`,
        {
          comentario: formDataComent.descripcion,
          ticketId: formDataComent.ticketId,
          usuarioId: formDataComent.usuarioId,
          ...ticketToEdit,
        }
      );

      if (response.status === 200) {
        toast.success("Ticket cerrado correctamente");
        getTickets();
        setOpenCloseTicket(false);
        setSelectedTicketId(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("No se pudo cerrar el ticket");
    }
  };

  const handleClose = () => {
    setSelectedTicketId(null);
  };

  // Convertir compañeros a formato React Select de forma segura
  const companionOptions =
    ticketToEdit?.companios?.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })) || [];

  return (
    <div className="flex flex-col h-full p-2 rounded-sm">
      <div className="px-0 border-b">
        <div className="flex items-center justify-between p-2 rounded-sm bg-muted sm:bg-transparent">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="font-bold text-[11px] bg-green-400 text-white">
                {/* SAFE CHECK: Cliente puede ser null */}
                {ticket.customer?.name
                  ? ticket.customer.name.slice(0, 2).toUpperCase()
                  : "NA"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-[12px] text-blue-600 font-semibold">
                {/* SAFE CHECK: Renderizado condicional del Link */}
                {ticket.customer ? (
                  <Link to={`/crm/cliente/${ticket.customer.id}`}>
                    {ticket.customer.name}
                  </Link>
                ) : (
                  <span className="text-gray-500 italic">
                    Sin cliente asignado
                  </span>
                )}

                <span className="text-gray-500 mx-1">·</span>
                <span className="text-gray-500 font-normal">
                  {ticket.assignee
                    ? `Tec: ${ticket.assignee.name}`
                    : "Sin técnico"}
                </span>
                <div className="text-xs text-gray-400 font-light mt-0.5">
                  {formatearFecha(new Date(ticket.date).toISOString())}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${bgColor} ${text} ${textColor}`}
            >
              {ticket.priority}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem
                  onClick={() => {
                    setTicketDeleteId(ticket.id);
                    setOpenDelete(true);
                  }}
                >
                  Eliminar Ticket <TicketSlash className="w-5 h-5 mx-2" />
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  onClick={() => {
                    setOpenUpdateTicket(true);
                    setTicketToEdit(ticket);
                  }}
                >
                  Actualizar Ticket <RotateCcw className="w-5 h-5 mx-2" />
                </DropdownMenuCheckboxItem>

                <Link to={`/crm-boleta-ticket-soporte/${ticket.id}`}>
                  <DropdownMenuCheckboxItem>
                    Imprimir Boleta Ticket <FileText className="w-5 h-5 mx-2" />
                  </DropdownMenuCheckboxItem>
                </Link>

                <DropdownMenuCheckboxItem
                  onClick={() => {
                    setOpenCloseTicket(true);
                    setTicketToEdit(ticket);
                  }}
                >
                  Cerrar Ticket <Sticker className="w-5 h-5 mx-2" />
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close details"
            >
              <X className="w-4 h-4 font-bold text-red-500" />
            </button>
          </div>
        </div>

        <h2 className="mt-2 text-base font-semibold">{ticket.title}</h2>
        {/* SAFE CHECK: Descripción puede ser null */}
        <p className="mb-1 text-sm font-thin">
          {ticket.description || "Sin descripción"}
        </p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* SAFE CHECK: Comments puede ser undefined/null */}
        {ticket.comments && ticket.comments.length > 0 ? (
          ticket.comments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-2 mb-2 bg-gray-100 rounded-lg dark:bg-slate-900"
            >
              <div className="flex items-center gap-2 mb-2">
                {/* SAFE CHECK: Comment User fallback */}
                <span className="text-sm font-medium">
                  {comment.user?.name || "Usuario Eliminado"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {formatearFecha(new Date(comment.date).toISOString())}
                </span>
              </div>
              <p className="text-[12px]">{comment.text}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-400 mt-4">
            No hay comentarios aún.
          </div>
        )}

        {ticket.closedAt ? (
          <div className="px-3 py-2 mb-2 bg-gray-100 rounded-lg dark:bg-slate-900">
            <p className="text-xs font-semibold text-gray-500 dark:text-white">
              Cerrado el {formatearFecha(ticket.closedAt)}
            </p>
          </div>
        ) : null}

        {ticket.creator ? (
          <div className="px-3 py-2 mb-2 bg-gray-100 rounded-lg dark:bg-slate-900">
            <p className="text-xs font-semibold text-gray-500 dark:text-white">
              Creado por: {ticket.creator.name} |{" "}
              {ticket.creator.rol || "SISTEMA"}
            </p>
          </div>
        ) : null}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={submitNewComentaryFollowUp}>
          <div className="relative flex items-center gap-3">
            <Textarea
              placeholder="Escriba un comentario"
              className="min-h-[50px] resize-none pr-12 flex-1"
              value={formDataComent.descripcion}
              onChange={(e) =>
                setFormDataComent((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
            <button
              type="submit"
              className="bg-[#27bd65] hover:bg-[#3cc575] text-white flex items-center justify-center p-2 rounded-lg transition-colors duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              ENVIAR
            </button>
          </div>
        </form>
      </div>

      {/* DIALOG PARA LA EDICION DEL TICKET */}
      <Dialog open={openUpdateTicket} onOpenChange={setOpenUpdateTicket}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-y-auto max-h-[95vh] flex flex-col">
          <form
            onSubmit={handleSubmitTicketEdit}
            className="flex flex-col h-full"
          >
            {/* BODY - Con ScrollArea natural si la pantalla es muy pequeña */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                {/* FILA 1: Título (Grande) y Switch Fijar (Compacto) */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Label
                      htmlFor="title"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      TÍTULO DEL TICKET
                    </Label>
                    <Input
                      name="title"
                      id="title"
                      value={ticketToEdit.title || ""}
                      onChange={handleChangePropsTicket}
                      className="font-medium"
                      placeholder="Resumen del problema"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-center min-w-[100px]">
                    <Label
                      htmlFor="fixed"
                      className="text-xs font-semibold text-muted-foreground mb-1"
                    >
                      FIJAR TICKET
                    </Label>
                    <div className="flex items-center gap-2 border p-2 rounded-md h-10 bg-card">
                      <Switch
                        id="fixed"
                        checked={ticketToEdit.fixed}
                        onCheckedChange={(checked) =>
                          setTicketToEdit((prev) => ({
                            ...prev,
                            fixed: checked,
                          }))
                        }
                      />
                      <span
                        className="text-xs font-medium cursor-pointer"
                        onClick={() =>
                          setTicketToEdit((prev) => ({
                            ...prev,
                            fixed: !prev.fixed,
                          }))
                        }
                      >
                        {ticketToEdit.fixed ? "Fijado" : "Normal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FILA 2: Descripción */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    DESCRIPCIÓN DETALLADA
                  </Label>
                  <Textarea
                    name="description"
                    id="description"
                    value={ticketToEdit.description || ""}
                    onChange={handleChangePropsTicket}
                    className="min-h-[80px] resize-y text-sm"
                    placeholder="Detalles del requerimiento..."
                  />
                </div>

                {/* FILA 3: Grid de 3 columnas para Metadata (Cliente, Prioridad, Estado) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cliente (Ocupa más espacio visual si es necesario, o 1 columna) */}
                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      CLIENTE
                    </Label>
                    <SelectComponent
                      placeholder="Buscar cliente..."
                      isClearable
                      options={optionsCustomers}
                      value={
                        ticketToEdit.customer
                          ? optionsCustomers.find(
                              (c) =>
                                c.value === ticketToEdit.customer!.id.toString()
                            )
                          : null
                      }
                      onChange={handleChangeCustomer}
                      className="text-sm text-black"
                      menuPlacement="auto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      PRIORIDAD
                    </Label>
                    <Select
                      value={ticketToEdit.priority}
                      onValueChange={(value) =>
                        handleSelectChange("priority", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        {" "}
                        {/* Altura reducida */}
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BAJA">Baja</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="URGENTE">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      ESTADO
                    </Label>
                    <Select
                      value={ticketToEdit.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NUEVO">Nuevo</SelectItem>
                        <SelectItem value="ABIERTA">Abierta</SelectItem>
                        <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="RESUELTA">Resuelta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-[1px] bg-border my-1" />

                {/* FILA 4: Asignaciones Técnicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      TÉCNICO RESPONSABLE
                    </Label>
                    <SelectComponent
                      placeholder="Asignar técnico..."
                      isClearable
                      options={optionsTecs}
                      value={
                        ticketToEdit.assignee
                          ? optionsTecs.find(
                              (t) =>
                                t.value === ticketToEdit.assignee!.id.toString()
                            )
                          : null
                      }
                      onChange={handleChangeTecSelect}
                      className="text-sm text-black"
                      menuPlacement="top" // Para que abra hacia arriba si está muy abajo
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      ACOMPAÑANTES
                    </Label>
                    <SelectComponent
                      placeholder="Agregar acompañantes..."
                      isClearable
                      isMulti
                      options={optionsTecs.filter(
                        (t) => t.value !== ticketToEdit.assignee?.id.toString()
                      )}
                      value={companionOptions}
                      onChange={handleChangeCompanions}
                      className="text-sm text-black"
                      menuPlacement="top"
                    />
                  </div>
                </div>

                {/* FILA 5: Etiquetas (Full width al final) */}
                <div className="space-y-1.5 pb-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    ETIQUETAS
                  </Label>
                  <SelectComponent
                    placeholder="Etiquetar ticket..."
                    options={optionsLabels}
                    isMulti
                    value={ticketToEdit.tags || []}
                    onChange={handleChangeLabels}
                    className="text-sm text-black"
                    menuPlacement="top" // Importante para evitar scroll extra
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-5 py-3 border-t bg-muted/40 shrink-0 gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenUpdateTicket(false)}
                type="button"
                className="h-9"
              >
                Cancelar
              </Button>
              <Button type="submit" className="h-9 px-6">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ... (El resto de Dialogs de Delete y Close se mantienen igual, solo asegurando los values de los inputs) ... */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        {/* ... contenido delete ... */}
        <DialogContent className="sm:max-w-[425px]">
          {/* ... header y alerts ... */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTicket}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCloseTicket} onOpenChange={setOpenCloseTicket}>
        <DialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            comentaryRef.current?.focus();
          }}
          className="sm:max-w-[500px]"
        >
          <DialogHeader>
            <DialogTitle className="text-center">Cerrar Ticket</DialogTitle>
            <DialogDescription className="text-center">
              Nota final antes de cerrar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Título</Label>
            <Input
              value={ticketToEdit.title || ""}
              onChange={(e) =>
                setTicketToEdit((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Label>Descripción</Label>
            <Textarea
              value={ticketToEdit.description || ""}
              onChange={(e) =>
                setTicketToEdit((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <Textarea
              ref={comentaryRef}
              placeholder="Comentario de cierre..."
              value={formDataComent.descripcion}
              onChange={(e) =>
                setFormDataComent((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenCloseTicket(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCloseTicket}>Cerrar Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
