"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Ticket,
  User,
  AlertCircle,
  Calendar,
  Tag,
  MessageSquare,
  Save,
  // Search,
  Clock,
  Flag,
  Loader,
  Users,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SelectComponent from "react-select";
import axios from "axios";
import { toast } from "sonner";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { MultiSelect } from "./MultiSelect";
import { TechSelect } from "./TechSelect";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
// Tipos
interface CreateTicketProps {
  openCreatT: boolean;
  setOpenCreateT: (open: boolean) => void;
  getTickets: () => void;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
}

interface OptionSelectedReactComponent {
  value: string;
  label: string;
}

interface Etiqueta {
  id: number;
  nombre: string;
}
interface FormData {
  clienteId: number | null;
  tecnicoId: number | null;
  tecnicosAdicionales: number[];

  telefonoTemporal: string;

  titulo: "";
  descripcion: "";
  estado: "NUEVO";
  prioridad: "MEDIA";
  etiquetas: number[];
  userId: number;
  empresaId: number;
}

function CrmCreateTicket({
  openCreatT,
  setOpenCreateT,
  getTickets,
}: CreateTicketProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labelsSelecteds, setLabelsSelecteds] = useState<number[]>([]);

  // Estados para los campos del formulario
  const [formData, setFormData] = useState<FormData>({
    clienteId: 0,
    tecnicoId: 0,
    titulo: "",
    descripcion: "",
    estado: "NUEVO",
    prioridad: "MEDIA",
    etiquetas: [] as number[],
    userId: userId,
    empresaId: empresaId,
    tecnicosAdicionales: [],
    telefonoTemporal: "",
  });

  const clearFormData = () => {
    setFormData({
      clienteId: 0,
      tecnicoId: 0,
      titulo: "",
      descripcion: "",
      estado: "NUEVO",
      prioridad: "MEDIA",
      etiquetas: [],
      userId: userId,
      empresaId: empresaId,
      tecnicosAdicionales: [],
      telefonoTemporal: "",
    });
    setLabelsSelecteds([]);
  };

  // Datos simulados
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [tecnicos, setTecnicos] = useState<Usuario[]>([
    { id: 1, nombre: "Técnico 1" },
    { id: 2, nombre: "Técnico 2" },
    { id: 3, nombre: "Técnico 3" },
  ]);

  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  const getClientes = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customers-to-ticket`,
      );
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los clientes");
    }
  };
  const getTecs = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/user/get-users-to-create-tickets`,
      );
      if (response.status === 200) {
        setTecnicos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los clientes");
    }
  };

  const getEtiquetas = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/tags-ticket/get-tags-to-ticket`,
      );
      if (response.status === 200) {
        setEtiquetas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir tags");
    }
  };

  useEffect(() => {
    getClientes();
    getTecs();
    getEtiquetas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${VITE_CRM_API_URL}/tickets-soporte`, {
        ...formData,
        etiquetas: labelsSelecteds,
        tecnicoId:
          formData.tecnicoId !== null && formData.tecnicoId !== undefined
            ? Number(formData.tecnicoId)
            : null,
      });

      if (response.status === 201) {
        toast.success("Ticket Creado");
        clearFormData();
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al crear ticket");
    } finally {
      setIsSubmitting(false);
    }

    getTickets();
    setOpenCreateT(false);
  };

  const handleChangeCustomerSelect = (
    selectedOption: OptionSelectedReactComponent | null,
  ) => {
    const newCustomerId = selectedOption
      ? parseInt(selectedOption.value, 10)
      : null;
    setFormData((prev) => ({ ...prev, clienteId: newCustomerId }));
  };

  const optionsCustomers = clientes.map((cliente) => ({
    value: cliente.id.toString(),
    label: cliente.nombre,
  }));

  const optionsTecs = tecnicos.map((tec) => ({
    value: tec.id.toString(),
    label: tec.nombre,
  }));

  const optionsLabels = etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  }));

  const tecnicoSelected = formData.tecnicoId ? false : true;

  console.log("El form data es: ", formData);

  return (
    <Dialog open={openCreatT} onOpenChange={setOpenCreateT}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] max-h-[98vh]  flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            Crear Nuevo Ticket de Soporte
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="info"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Detalles
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="info" className="mt-0 space-y-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
                {/* COLUMNA IZQUIERDA - Cliente y Asignaciones */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                      Cliente y Asignaciones
                    </h3>

                    {/* Cliente */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cliente"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Cliente <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative" style={{ zIndex: 50 }}>
                        <SelectComponent
                          placeholder="Seleccione un cliente"
                          isClearable
                          className="text-black text-sm"
                          options={optionsCustomers}
                          value={
                            optionsCustomers.find(
                              (option) =>
                                option.value === formData.clienteId?.toString(),
                            ) || null
                          }
                          onChange={handleChangeCustomerSelect}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="titulo"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        Tel. Temporal (Opcional)
                      </Label>
                      <Input
                        id="telefonoTemporal"
                        name="telefonoTemporal"
                        value={formData.telefonoTemporal}
                        onChange={handleChange}
                        placeholder="12345678"
                        required
                        type="tel"
                        className="text-sm"
                      />
                    </div>

                    {/* Técnico Asignado */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="tecnicoId"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Técnico Asignado
                      </Label>
                      <div className="relative" style={{ zIndex: 40 }}>
                        <TechSelect
                          options={optionsTecs.filter(
                            (o) =>
                              !formData.tecnicosAdicionales.includes(
                                Number(o.value),
                              ),
                          )}
                          value={
                            optionsTecs.find(
                              (tec) =>
                                tec.value === formData.tecnicoId?.toString(),
                            ) || null
                          }
                          onChange={(opt) => {
                            handleSelectChange("tecnicoId", opt?.value ?? null);
                          }}
                          placeholder="Seleccione un técnico"
                        />
                      </div>
                    </div>

                    {/* Acompañantes */}
                    <div className="space-y-2 pb-10">
                      <Label
                        htmlFor="acompanantes"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Users className="h-4 w-4 text-muted-foreground" />
                        Acompañantes
                      </Label>
                      <div className="relative">
                        <MultiSelect
                          disabled={tecnicoSelected}
                          options={optionsTecs.filter(
                            (t) => t.value !== formData.tecnicoId?.toString(),
                          )}
                          value={optionsTecs.filter((t) =>
                            formData.tecnicosAdicionales.includes(+t.value),
                          )}
                          onChange={(opts) =>
                            setFormData({
                              ...formData,
                              tecnicosAdicionales: opts.map((o) => +o.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA - Estado y Prioridad */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                      Estado y Configuración
                    </h3>

                    {/* Estado */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="estado"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                        Estado
                      </Label>
                      <Select
                        value={formData.estado}
                        onValueChange={(value) =>
                          handleSelectChange("estado", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          <SelectItem value="NUEVO">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                              <span>Nuevo</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ABIERTA">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                              <span>Abierta</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="EN_PROCESO">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-600"></span>
                              <span>En Proceso</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="PENDIENTE">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                              <span>Pendiente</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="PENDIENTE_CLIENTE">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-pink-600"></span>
                              <span>Pendiente Cliente</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="PENDIENTE_TECNICO">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-teal-600"></span>
                              <span>Pendiente Técnico</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="prioridad"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Flag className="h-4 w-4 text-red-500" />
                        Prioridad
                      </Label>
                      <Select
                        value={formData.prioridad}
                        onValueChange={(value) =>
                          handleSelectChange("prioridad", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent className="z-[60]">
                          <SelectItem
                            value="BAJA"
                            className="flex items-center"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                              <span>Baja</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="MEDIA">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500"></span>
                              <span>Media</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ALTA">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                              <span>Alta</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="URGENTE">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500"></span>
                              <span>Urgente</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 space-y-6 p-1">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label
                    htmlFor="titulo"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Título descriptivo del problema"
                    required
                    className="text-sm"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label
                    htmlFor="descripcion"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describa detalladamente el problema o solicitud"
                    className="min-h-[90px] text-sm"
                  />
                </div>

                {/* Etiquetas */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Etiquetas
                  </Label>
                  <div className="relative" style={{ zIndex: 30 }}>
                    <MultiSelect
                      options={optionsLabels}
                      value={optionsLabels.filter((o) =>
                        labelsSelecteds.includes(Number(o.value)),
                      )}
                      onChange={(opts) =>
                        setLabelsSelecteds(opts.map((o) => Number(o.value)))
                      }
                      placeholder="Seleccione etiquetas (opcional)"
                      // disabled={true} // cámbialo a true si quieres bloquearlo
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator className="my-4" />

        {/* FOOTER CORREGIDO */}
        <div className="flex sm:justify-between gap-2 pt-2 pb-4">
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Fecha de creación: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setOpenCreateT(false)}
              className="flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Ticket
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CrmCreateTicket;
