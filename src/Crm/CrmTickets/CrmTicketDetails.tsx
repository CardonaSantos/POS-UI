"use client";
import React, { useEffect,  useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Send,
} from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
import { TicketHeader } from "./TicketDetail/TicketHeader";
import { TicketTimeline } from "./TicketDetail/TicketTimeline";
import { SolucionTicketItem } from "../features/ticket-soluciones/ticket-soluciones.interface";
import { useCreateTicketResumen } from "../CrmHooks/hooks/use-ticket-resumen/useTicketResumen";
import { useForm } from "react-hook-form";
import { ticketResumenSchema, TicketResumenSchemaType } from "./CrmCloseTickets/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");



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
  soluciones: SolucionTicketItem[]
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
  soluciones,
}: TicketDetailProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [openUpdateTicket, setOpenUpdateTicket] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket>(ticket);

  const [formDataComent, setFormDataComent] = useState<SeguimientoData>({
    descripcion: "".trim(),
    ticketId: ticket.id,
    usuarioId: userId,
  });

  const [openCloseTicket, setOpenCloseTicket] = useState(false);
  const [ticketDeleteId, setTicketDeleteId] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const createTicketResumen = useCreateTicketResumen();

  const formCloseTicket = useForm<TicketResumenSchemaType>({
     resolver: zodResolver(ticketResumenSchema),
     defaultValues: {
       ticketId: ticket.id,
       solucionId: 1, 
       resueltoComo: "",
       notasInternas: "",
     }
  });

    const onSubmitClose = (data: TicketResumenSchemaType) => {
      const payload = {
          ...data, 
          ticketId: ticket.id, 
          resueltoComo: data.resueltoComo || null, 
          notasInternas: data.notasInternas || null,
          reabierto: false, 
          intentos: 1,
      };

      toast.promise(
        createTicketResumen.mutateAsync(payload), 
        {
          loading: "Cerrando ticket...",
          success: () => {
              setOpenCloseTicket(false); 
              getTickets(); 
              formCloseTicket.reset({
                notasInternas: "",
                resueltoComo: "",
                solucionId: null,
                ticketId: ticket.id
              })
              return "Ticket cerrado y resumen creado";
          },
          error:(error)=> getApiErrorMessageAxios(error)
        }
      );
    }

  const optionsSoluciones:Array<OptionSelectedReactComponent> = soluciones.map((s)=>({
    label: s.solucion,
    value: s.id.toString(),
  }))

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

  const handleChangeLabels = (selectedOptions: MultiValue<TagOption>) => {
    const tags = selectedOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));
    setTicketToEdit((prev) => ({
      ...prev,
      tags: tags,
    }));
  };

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
          rol: "TECNICO", 
          avatar: "",
        },
      }));
    } else {
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

  const handleClose = () => {
    setSelectedTicketId(null);
  };

  const companionOptions =
    ticketToEdit?.companios?.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })) || [];

    const metricas = ticket.metrics

  return (
    <div className="flex flex-col h-full rounded-sm overflow-hidden shadow-sm border ">
    <div className="flex-none z-20 shadow-sm"> 
      <TicketHeader 
        ticket={ticket}
        badgeProps={{ bgColor, text, textColor }}
        onCloseView={handleClose}
        onEdit={() => { setTicketToEdit(ticket); setOpenUpdateTicket(true); }}
        onDelete={() => { setTicketDeleteId(ticket.id); setOpenDelete(true); }}
        onCloseTicket={() => { setTicketToEdit(ticket); setOpenCloseTicket(true); }}
      />
    </div>

    {/* 2. TIMELINE (Scrollable) */}
    <TicketTimeline 
      metricas={metricas}
      comments={ticket.comments}
      creator={ticket.creator}
      closedAt={ticket.closedAt}
    />

    {/* 3. INPUT AREA (Fijo abajo) */}
    <div className="flex-none p-3 ">
      <form onSubmit={submitNewComentaryFollowUp} className="relative flex items-end gap-2">
          <Textarea
            placeholder="Escribe un seguimiento..."
            className=""
            value={formDataComent.descripcion}
            onChange={(e) => setFormDataComent(prev => ({ ...prev, descripcion: e.target.value }))}
            onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 submitNewComentaryFollowUp(e);
               }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 shrink-0 rounded-lg shadow-sm"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
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
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Cerrar Ticket #{ticket.id}</DialogTitle>
          </DialogHeader>

          <Form {...formCloseTicket}>
            <form onSubmit={formCloseTicket.handleSubmit(onSubmitClose)} className="space-y-4 py-2">
              
              <input type="hidden" {...formCloseTicket.register("ticketId", { valueAsNumber: true })} />
              
          <FormField
            control={formCloseTicket.control}
            name="solucionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Solución</FormLabel>
                <FormControl>
                  <SelectComponent
                    placeholder="Selecciona una solución..."
                    options={optionsSoluciones}
                    isClearable
                    value={
                      field.value 
                      ? optionsSoluciones.find(opt => Number(opt.value) === field.value) 
                      : null
                    }
                    onChange={(option: SingleValue<{ label: string, value: string }>) => {
                      field.onChange(option ? Number(option.value) : null);
                    }}
                    className="text-sm text-black"
                    menuPlacement="auto"
                  />
                  </FormControl>
                  
                  {/* Mensaje de error automático de Zod (ej: "Seleccione una solución") */}
                  <FormMessage />
                </FormItem>
              )}
            />
              
              <FormField
                control={formCloseTicket.control}
                name="resueltoComo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumen de Solución (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ej: Se reinició el router y se validó la IP..." 
                        className="resize-none min-h-[80px]"
                        {...field} 
                        value={field.value || ""} // Manejo seguro de null
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Información visible para el reporte final.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formCloseTicket.control}
                name="notasInternas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Internas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles técnicos solo para el equipo..." 
                        className="resize-none min-h-[60px]"
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenCloseTicket(false)}
                  disabled={createTicketResumen.isPending}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={createTicketResumen.isPending}
                >
                  {createTicketResumen.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar Cierre
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
