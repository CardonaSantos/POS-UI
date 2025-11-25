"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Wifi,
  Map,
  MessageSquare,
  Save,
  X,
  Smartphone,
  FileText,
} from "lucide-react";
import ReactSelectComponent from "react-select";

import { OptionSelected } from "../features/OptionSelected/OptionSelected";
import { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

import type { MultiValue } from "react-select";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";
import {
  EstadoCliente,
  Sector,
  ServiciosInternet,
} from "../features/cliente-interfaces/cliente-types";
import DatePicker from "react-datepicker";
import { Switch } from "@/components/ui/switch";
import { MikrotikRoutersResponse } from "../features/mikro-tiks/mikrotiks.interfaces";

// ========= Tipos que ya tienes en el padre ========= USAR UNO SOLO
interface FormData {
  nombre: string;
  coordenadas: string;
  ip: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  asesorId: string | null;
  servicioId: string | null;
  municipioId: string | null;
  departamentoId: string | null;
  empresaId: string;
  mascara: string;
  gateway: string;
  estado: EstadoCliente;
  enviarRecordatorio: boolean;
}

interface ContratoID {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

// ========= Props del componente hijo =========
export interface CustomerEditFormCardProps {
  formData: FormData;
  formDataContrato: ContratoID;
  fechaInstalacion: Date | null;

  // selects actuales
  depaSelected: number | null;
  muniSelected: number | null;
  sectorSelected: number | null;
  serviceSelected: number[];
  serviceWifiSelected: number | null;
  zonasFacturacionSelected: number | null;
  // options para react-select
  optionsDepartamentos: OptionSelected[];
  optionsMunis: OptionSelected[];
  optionsServices: OptionSelected[];
  optionsServicesWifi: OptionSelected[];
  optionsZonasFacturacion: OptionSelected[];
  optionsSectores: OptionSelected[];
  // data “secure” para obtener labels
  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  secureServiciosWifi: ServiciosInternet[];
  secureZonasFacturacion: FacturacionZona[];

  mikrotiks: MikrotikRoutersResponse[];
  optionsMikrotiks: OptionSelected[];
  // handlers de inputs
  onChangeForm: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeContrato: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectDepartamento: (option: OptionSelected | null) => void;
  onSelectMunicipio: (option: OptionSelected | null) => void;
  onSelectSector: (option: OptionSelected | null) => void;
  onSelectService: (options: MultiValue<OptionSelected> | null) => void;
  onSelectServiceWifi: (option: OptionSelected | null) => void;
  onSelectZonaFacturacion: (option: OptionSelected | null) => void;
  onChangeFechaInstalacion: (date: Date | null) => void;
  onSelectEstadoCliente: (estado: EstadoCliente) => void;
  handleEnviarRecordatorioChange: (checked: boolean) => void;
  handleSelectMk: (selectedOption: OptionSelected | null) => void;

  //hanlerss
  handleChangeDataContrato: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormDataContrato: React.Dispatch<React.SetStateAction<ContratoID>>;
  // botones footer
  onClickDelete: () => void;
  onClickOpenConfirm: () => void;
  mkSelected: number | null;
}

export function CustomerEditFormCard({
  formData,
  formDataContrato,
  fechaInstalacion,
  depaSelected,
  muniSelected,
  sectorSelected,
  serviceSelected,
  serviceWifiSelected,
  zonasFacturacionSelected,
  optionsDepartamentos,
  optionsMunis,
  optionsServices,
  optionsServicesWifi,
  optionsZonasFacturacion,
  optionsSectores,
  secureDepartamentos,
  secureMunicipios,
  secureSectores,
  secureServiciosWifi,
  secureZonasFacturacion,
  onChangeForm,
  onSelectDepartamento,
  onSelectMunicipio,
  onSelectSector,
  onSelectService,
  onSelectServiceWifi,
  onSelectZonaFacturacion,
  onChangeFechaInstalacion,
  onSelectEstadoCliente,
  onClickDelete,
  onClickOpenConfirm,
  setFormDataContrato,
  mkSelected,
  mikrotiks,
  // mikrotiks,
  optionsMikrotiks,
  handleSelectMk,

  // handlers
  handleChangeDataContrato,
  handleEnviarRecordatorioChange,
}: CustomerEditFormCardProps) {
  console.log("El form data es: ", formData);

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          {/* ============================
              SECCIÓN 1: DATOS PRINCIPALES
              ============================ */}
          <section
            aria-labelledby="section-datos-principales"
            className="space-y-4"
          >
            <div id="section-datos-principales" className="sr-only">
              Datos personales, servicio y ubicación
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Información personal */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary dark:text-white" />
                  Información Personal
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <Label htmlFor="nombre-all">
                      Nombres <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombre-all"
                      name="nombre"
                      value={formData.nombre}
                      onChange={onChangeForm}
                      placeholder="Nombre completo"
                      required
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="apellidos-all">
                      Apellidos <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="apellidos-all"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={onChangeForm}
                      placeholder="Apellidos"
                      required
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="telefono-all">Teléfono</Label>
                    <Input
                      id="telefono-all"
                      name="telefono"
                      value={formData.telefono}
                      onChange={onChangeForm}
                      placeholder="Teléfono"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="dpi-all">DPI</Label>
                    <Input
                      id="dpi-all"
                      name="dpi"
                      value={formData.dpi}
                      onChange={onChangeForm}
                      placeholder="DPI"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="direccion-all">Dirección</Label>
                    <Textarea
                      id="direccion-all"
                      name="direccion"
                      value={formData.direccion}
                      onChange={onChangeForm}
                      placeholder="Dirección"
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Información del servicio */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <Wifi className="h-4 w-4 text-primary dark:text-white" />
                  Información del Servicio
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="ip">IP</Label>
                        <Input
                          id="ip"
                          name="ip"
                          value={formData.ip}
                          onChange={onChangeForm}
                          placeholder="IP"
                          required
                          className="h-9"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="gateway">Gateway</Label>
                        <Input
                          id="gateway"
                          name="gateway"
                          value={formData.gateway}
                          onChange={onChangeForm}
                          placeholder="(opcional)"
                          className="h-9"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="mascara">Subnet Mask</Label>
                        <Input
                          id="mascara"
                          name="mascara"
                          value={formData.mascara}
                          onChange={onChangeForm}
                          placeholder="(opcional)"
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="servicioWifiId-all">
                      Servicio Wifi <span className="text-destructive">*</span>
                    </Label>
                    <ReactSelectComponent
                      options={optionsServicesWifi}
                      onChange={onSelectServiceWifi}
                      value={
                        serviceWifiSelected !== null
                          ? {
                              value: serviceWifiSelected,
                              label:
                                secureServiciosWifi.find(
                                  (s) => s.id === serviceWifiSelected
                                )?.nombre || "",
                            }
                          : null
                      }
                      className="text-sm text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="servicioId-all">
                      Otros Servicios{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <ReactSelectComponent
                      isMulti
                      options={optionsServices}
                      onChange={onSelectService}
                      value={optionsServices.filter((option) =>
                        serviceSelected.includes(option.value)
                      )}
                      className="text-sm text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contrasenaWifi-all">
                      Contraseña WiFi{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contrasenaWifi-all"
                      name="contrasenaWifi"
                      value={formData.contrasenaWifi}
                      onChange={onChangeForm}
                      placeholder="Contraseña WiFi"
                      required
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="ssidRouter-all">SSID</Label>
                    <Input
                      id="ssidRouter-all"
                      name="ssidRouter"
                      value={formData.ssidRouter}
                      onChange={onChangeForm}
                      placeholder="SSID"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación y contacto */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <Map className="h-4 w-4 text-primary dark:text-white" />
                  Ubicación y Contacto
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <Label htmlFor="coordenadas">Ubicación Maps</Label>
                    <Input
                      id="coordenadas"
                      name="coordenadas"
                      value={formData.coordenadas}
                      onChange={onChangeForm}
                      placeholder="Coordenadas"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="departamentoId-all">Departamento</Label>
                    <ReactSelectComponent
                      options={optionsDepartamentos}
                      value={
                        depaSelected !== null
                          ? {
                              value: depaSelected,
                              label:
                                secureDepartamentos.find(
                                  (d) => d.id === depaSelected
                                )?.nombre || "",
                            }
                          : null
                      }
                      onChange={onSelectDepartamento}
                      className="text-sm text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="municipioId-all">Municipio</Label>
                    <ReactSelectComponent
                      options={optionsMunis}
                      onChange={onSelectMunicipio}
                      value={
                        muniSelected !== null
                          ? {
                              value: muniSelected,
                              label:
                                secureMunicipios.find(
                                  (m) => m.id === muniSelected
                                )?.nombre || "",
                            }
                          : null
                      }
                      className="text-sm text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="sectorId-all">Sectores</Label>
                    <ReactSelectComponent
                      isClearable
                      options={optionsSectores}
                      onChange={onSelectSector}
                      value={
                        sectorSelected !== null
                          ? {
                              value: sectorSelected,
                              label:
                                secureSectores.find(
                                  (sector) => sector.id === sectorSelected
                                )?.nombre || "",
                            }
                          : null
                      }
                      className="text-xs text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contactoReferenciaNombre-all">
                      Nombre Referencia
                    </Label>
                    <Input
                      id="contactoReferenciaNombre-all"
                      name="contactoReferenciaNombre"
                      value={formData.contactoReferenciaNombre}
                      onChange={onChangeForm}
                      placeholder="Nombre referencia"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contactoReferenciaTelefono-all">
                      Teléfono Referencia
                    </Label>
                    <Input
                      id="contactoReferenciaTelefono-all"
                      name="contactoReferenciaTelefono"
                      value={formData.contactoReferenciaTelefono}
                      onChange={onChangeForm}
                      placeholder="Teléfono referencia"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================
              SECCIÓN 2: ESTADO + WHATSAPP + FACTURACIÓN
              ========================================== */}
          <section
            aria-labelledby="section-estado-notificaciones"
            className="space-y-4"
          >
            <h3
              id="section-estado-notificaciones"
              className="font-medium flex items-center gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4 text-primary dark:text-white" />
              Estado, notificaciones y facturación
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
              {/* Estado + WhatsApp */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="estadoCliente" className="font-medium">
                    Estado del cliente
                  </Label>
                  <Select
                    value={formData.estado}
                    onValueChange={onSelectEstadoCliente}
                  >
                    <SelectTrigger id="estadoCliente" className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Estados disponibles</SelectLabel>
                        <SelectItem value={EstadoCliente.ACTIVO}>
                          ACTIVO
                        </SelectItem>
                        <SelectItem value={EstadoCliente.ATRASADO}>
                          ATRASADO
                        </SelectItem>
                        <SelectItem value={EstadoCliente.DESINSTALADO}>
                          DESINSTALADO
                        </SelectItem>
                        <SelectItem value={EstadoCliente.EN_INSTALACION}>
                          EN INSTALACIÓN
                        </SelectItem>
                        <SelectItem value={EstadoCliente.MOROSO}>
                          MOROSO
                        </SelectItem>
                        <SelectItem value={EstadoCliente.PAGO_PENDIENTE}>
                          PAGO PENDIENTE
                        </SelectItem>
                        <SelectItem value={EstadoCliente.PENDIENTE_ACTIVO}>
                          PENDIENTE ACTIVO
                        </SelectItem>
                        <SelectItem value={EstadoCliente.SUSPENDIDO}>
                          SUSPENDIDO
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggle WhatsApp */}
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <Label
                    htmlFor="whatsapp"
                    className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    Notificar cobro por WhatsApp
                    <Smartphone className="w-4 h-4" />
                  </Label>

                  <Switch
                    id="whatsapp"
                    checked={formData.enviarRecordatorio}
                    onCheckedChange={handleEnviarRecordatorioChange}
                  />
                </div>
              </div>

              {/* Zona facturación */}
              <div className="space-y-2">
                <Label htmlFor="zonasFacturacion-all">
                  Zonas de Facturación{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <ReactSelectComponent
                  options={optionsZonasFacturacion}
                  onChange={onSelectZonaFacturacion}
                  value={
                    zonasFacturacionSelected !== null
                      ? {
                          value: zonasFacturacionSelected,
                          label:
                            secureZonasFacturacion.find(
                              (s) => s.id === zonasFacturacionSelected
                            )?.nombre || "",
                        }
                      : null
                  }
                  className="text-sm text-black"
                />
              </div>

              {/* Fecha instalación */}
              <div className="space-y-2">
                <Label htmlFor="fechaInstalacion-all" className="font-medium">
                  Fecha Instalación
                </Label>
                <DatePicker
                  className="w-full p-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  selected={fechaInstalacion}
                  onChange={(date) => onChangeFechaInstalacion(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  aria-label="Fecha de instalación"
                  id="fechaInstalacion-all"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="space-y-1">
              <Label htmlFor="servicioWifiId-all">
                MIKROTIK <span className="text-destructive">*</span>
              </Label>
              <ReactSelectComponent
                placeholder="Selecciona un Router Mk"
                isClearable
                options={optionsMikrotiks}
                onChange={handleSelectMk}
                value={
                  mkSelected !== null
                    ? {
                        value: mkSelected,
                        label:
                          mikrotiks.find((s) => s.id === mkSelected)?.nombre ||
                          "",
                      }
                    : null
                }
                className="text-sm text-black"
              />
            </div>
          </section>

          {/* ========================
              SECCIÓN 3: CONTRATO
              ======================== */}
          <section aria-labelledby="section-contrato" className="space-y-4">
            <h3
              id="section-contrato"
              className="font-medium flex items-center gap-2 text-sm"
            >
              <FileText className="h-4 w-4 text-primary dark:text-white" />
              Detalles del contrato
            </h3>

            <Accordion
              type="single"
              collapsible
              className="w-full border rounded-lg shadow-sm"
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-medium text-sm">
                  Información de contrato
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-3">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-4 pb-2">
                      <CardTitle className="text-base">
                        Datos del contrato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="space-y-1 w-full">
                          <Label htmlFor="idcontrato" className="font-medium">
                            ID de Contrato
                          </Label>
                          <Input
                            type="text"
                            id="idcontrato"
                            value={formDataContrato.idContrato}
                            onChange={handleChangeDataContrato}
                            name="idContrato"
                            placeholder="ejem: CONTRATO-910"
                            aria-label="ID de contrato"
                            className="w-full h-9"
                          />
                        </div>

                        <div className="space-y-1 w-full">
                          <Label
                            htmlFor="archivoContrato"
                            className="font-medium"
                          >
                            Archivo contrato
                          </Label>
                          <Input
                            type="text"
                            id="archivoContrato"
                            value={formDataContrato.archivoContrato}
                            onChange={handleChangeDataContrato}
                            name="archivoContrato"
                            placeholder="Próximamente..."
                            aria-label="Archivo de contrato"
                            className="w-full h-9"
                          />
                        </div>

                        <div className="space-y-1 w-full">
                          <Label htmlFor="fechaFirma" className="font-medium">
                            Fecha Firma
                          </Label>
                          <DatePicker
                            className="w-full p-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            selected={formDataContrato.fechaFirma}
                            onChange={(date) => {
                              setFormDataContrato((prevData) => ({
                                ...prevData,
                                fechaFirma: date,
                              }));
                            }}
                            aria-label="Fecha de firma"
                            id="fechaFirma"
                          />
                        </div>

                        <div className="space-y-1 w-full">
                          <Label
                            htmlFor="observaciones-contrato"
                            className="font-medium"
                          >
                            Observaciones
                          </Label>
                          <Textarea
                            id="observaciones-contrato"
                            value={formDataContrato.observaciones}
                            onChange={handleChangeDataContrato}
                            name="observaciones"
                            placeholder="Detalles de mi contrato"
                            aria-label="Observaciones del contrato"
                            className="w-full min-h-[80px] resize-y text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* ========================
              SECCIÓN 4: OBSERVACIONES
              ======================== */}
          <section
            aria-labelledby="section-observaciones"
            className="space-y-2"
          >
            <h3
              id="section-observaciones"
              className="font-medium flex items-center gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4 text-primary dark:text-white" />
              Observaciones generales
            </h3>
            <Textarea
              id="observaciones-all"
              name="observaciones"
              value={formData.observaciones}
              onChange={onChangeForm}
              placeholder="Observaciones adicionales"
              className="min-h-[80px] text-sm"
            />
          </section>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button type="button" variant="destructive" onClick={onClickDelete}>
          <X className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
        <Button
          type="button"
          onClick={onClickOpenConfirm}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
