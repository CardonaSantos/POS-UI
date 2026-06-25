"use client";

import type React from "react";
import {
  FileText,
  Map,
  MessageSquare,
  Save,
  Smartphone,
  Trash2,
  User,
  Wifi,
  X,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import { OptionSelected } from "../features/OptionSelected/OptionSelected";
import { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";
import {
  EstadoCliente,
  Sector,
  ServiciosInternet,
} from "../features/cliente-interfaces/cliente-types";
import { MikrotikRoutersResponse } from "../features/mikro-tiks/mikrotiks.interfaces";

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

export interface CustomerEditFormCardProps {
  formData: FormData;
  formDataContrato: ContratoID;
  fechaInstalacion: Date | null;

  depaSelected: number | null;
  muniSelected: number | null;
  sectorSelected: number | null;
  serviceSelected: number[];
  serviceWifiSelected: number | null;
  zonasFacturacionSelected: number | null;

  optionsDepartamentos: OptionSelected[];
  optionsMunis: OptionSelected[];
  optionsServices: OptionSelected[];
  optionsServicesWifi: OptionSelected[];
  optionsZonasFacturacion: OptionSelected[];
  optionsSectores: OptionSelected[];

  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  secureServiciosWifi: ServiciosInternet[];
  secureZonasFacturacion: FacturacionZona[];

  mikrotiks: MikrotikRoutersResponse[];
  optionsMikrotiks: OptionSelected[];
  mkSelected: number | null;

  isInstalation?: boolean;
  setOpenAuth?: () => void;
  setOpenUpdNet?: () => void;

  onChangeForm: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onChangeContrato: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectDepartamento: (option: OptionSelected | null) => void;
  onSelectMunicipio: (option: OptionSelected | null) => void;
  onSelectSector: (option: OptionSelected | null) => void;
  onSelectService: (options: readonly OptionSelected[] | null) => void;
  onSelectServiceWifi: (option: OptionSelected | null) => void;
  onSelectZonaFacturacion: (option: OptionSelected | null) => void;
  onChangeFechaInstalacion: (date: Date | null) => void;
  onSelectEstadoCliente: (estado: EstadoCliente) => void;
  handleEnviarRecordatorioChange: (checked: boolean) => void;
  handleSelectMk: (selectedOption: OptionSelected | null) => void;

  handleChangeDataContrato: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setFormDataContrato: React.Dispatch<React.SetStateAction<ContratoID>>;

  onClickDelete: () => void;
  onClickOpenConfirm: () => void;
}

const ESTADO_CLIENTE_OPTIONS: Array<{
  value: EstadoCliente;
  label: string;
}> = [
  { value: EstadoCliente.ACTIVO, label: "ACTIVO" },
  { value: EstadoCliente.ATRASADO, label: "ATRASADO" },
  { value: EstadoCliente.DESINSTALADO, label: "DESINSTALADO" },
  { value: EstadoCliente.EN_INSTALACION, label: "EN INSTALACIÓN" },
  { value: EstadoCliente.MOROSO, label: "MOROSO" },
  { value: EstadoCliente.PAGO_PENDIENTE, label: "PAGO PENDIENTE" },
  { value: EstadoCliente.PENDIENTE_ACTIVO, label: "PENDIENTE ACTIVO" },
  { value: EstadoCliente.SUSPENDIDO, label: "SUSPENDIDO" },
];

function findOptionByValue(
  options: OptionSelected[],
  value: number | string | null,
) {
  if (value === null || value === undefined) return null;

  return (
    options.find((option) => String(option.value) === String(value)) ?? null
  );
}

function toDateInputValue(date: Date | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDateTimeInputValue(date: Date | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateInput(value: string) {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseDateTimeInput(value: string) {
  if (!value) return null;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function SectionCard({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className={className}>
      <AppStack gap="sm">
        <AppInline align="center" gap="xs">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
              {title}
            </h3>

            {description ? (
              <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {description}
              </p>
            ) : null}
          </div>
        </AppInline>

        {children}
      </AppStack>
    </AppCard>
  );
}

function TextInputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  leftIcon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  leftIcon?: React.ReactNode;
}) {
  return (
    <AppField label={label} required={required}>
      {(field) => (
        <AppInput
          id={field.id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          size="xs"
          fieldWidth="full"
          leftIcon={leftIcon}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
          required={required}
        />
      )}
    </AppField>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <AppField label={label}>
      {(field) => (
        <AppTextarea
          id={field.id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          size="xs"
          fieldWidth="full"
          className="resize-y"
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        />
      )}
    </AppField>
  );
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
  optionsMikrotiks,
  handleSelectMk,
  handleChangeDataContrato,
  handleEnviarRecordatorioChange,
  isInstalation,
  setOpenAuth,
  setOpenUpdNet,
}: CustomerEditFormCardProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onClickOpenConfirm();
      }}
    >
      <AppCard variant="outline" size="xs" radius="md" className="p-2">
        <AppStack gap="md">
          <AppGrid cols={{ base: 1, xl: 12 }} gap="sm">
            <SectionCard
              icon={<User size={13} />}
              title="Información personal"
              description="Datos generales del cliente."
              className="xl:col-span-4"
            >
              <AppGrid cols={{ base: 1, sm: 2, xl: 1 }} gap="xs">
                <TextInputField
                  label="Nombres"
                  name="nombre"
                  value={formData.nombre}
                  onChange={onChangeForm}
                  placeholder="Nombre completo"
                  required
                />

                <TextInputField
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={onChangeForm}
                  placeholder="Apellidos"
                  required
                />

                <TextInputField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={onChangeForm}
                  placeholder="Teléfono"
                />

                <TextInputField
                  label="DPI"
                  name="dpi"
                  value={formData.dpi}
                  onChange={onChangeForm}
                  placeholder="DPI"
                />

                <div className="sm:col-span-2 xl:col-span-1">
                  <TextareaField
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={onChangeForm}
                    placeholder="Dirección"
                    rows={3}
                  />
                </div>
              </AppGrid>
            </SectionCard>

            <SectionCard
              icon={<Wifi size={13} />}
              title="Servicio y red"
              description="Plan, IP, WiFi y router."
              className="xl:col-span-4"
            >
              <AppGrid cols={{ base: 1, sm: 3 }} gap="xs">
                <TextInputField
                  label="IP"
                  name="ip"
                  value={formData.ip}
                  onChange={onChangeForm}
                  placeholder="IP"
                />

                <TextInputField
                  label="Gateway"
                  name="gateway"
                  value={formData.gateway}
                  onChange={onChangeForm}
                  placeholder="Opcional"
                />

                <TextInputField
                  label="Máscara"
                  name="mascara"
                  value={formData.mascara}
                  onChange={onChangeForm}
                  placeholder="Opcional"
                />

                <div className="sm:col-span-3">
                  <AppField label="Servicio WiFi" required>
                    {(field) => (
                      <AppSingleSelect<number>
                        inputId={field.id}
                        value={serviceWifiSelected}
                        options={optionsServicesWifi}
                        onChange={(value) =>
                          onSelectServiceWifi(
                            findOptionByValue(optionsServicesWifi, value),
                          )
                        }
                        placeholder="Seleccionar servicio"
                        size="xs"
                        fieldWidth="full"
                        isClearable
                        invalid={field.invalid}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>
                </div>

                <div className="sm:col-span-3">
                  <AppField label="Otros servicios">
                    {(field) => (
                      <AppMultiSelect<number>
                        inputId={field.id}
                        value={serviceSelected}
                        options={optionsServices}
                        onChange={(values) =>
                          onSelectService(
                            optionsServices.filter((option) =>
                              values.includes(Number(option.value)),
                            ),
                          )
                        }
                        placeholder="Seleccionar servicios"
                        size="xs"
                        fieldWidth="full"
                        invalid={field.invalid}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>
                </div>

                <div className="sm:col-span-3">
                  <TextInputField
                    label="Contraseña WiFi"
                    name="contrasenaWifi"
                    value={formData.contrasenaWifi}
                    onChange={onChangeForm}
                    placeholder="Contraseña WiFi"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <TextInputField
                    label="SSID"
                    name="ssidRouter"
                    value={formData.ssidRouter}
                    onChange={onChangeForm}
                    placeholder="SSID"
                  />
                </div>

                <div className="sm:col-span-3">
                  <AppField label="Mikrotik">
                    {(field) => (
                      <AppSingleSelect<number>
                        inputId={field.id}
                        value={mkSelected}
                        options={optionsMikrotiks}
                        onChange={(value) =>
                          handleSelectMk(
                            findOptionByValue(optionsMikrotiks, value),
                          )
                        }
                        placeholder="Seleccionar router"
                        size="xs"
                        fieldWidth="full"
                        isClearable
                        invalid={field.invalid}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>

                  {mkSelected ? (
                    <p className="mt-1 text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      Router seleccionado:{" "}
                      {mikrotiks.find((mk) => mk.id === mkSelected)?.nombre ??
                        "—"}
                    </p>
                  ) : null}
                </div>
              </AppGrid>
            </SectionCard>

            <SectionCard
              icon={<Map size={13} />}
              title="Ubicación y contacto"
              description="Departamento, municipio, sector y referencia."
              className="xl:col-span-4"
            >
              <AppGrid cols={{ base: 1, sm: 2, xl: 1 }} gap="xs">
                <div className="sm:col-span-2 xl:col-span-1">
                  <TextInputField
                    label="Ubicación Maps"
                    name="coordenadas"
                    value={formData.coordenadas}
                    onChange={onChangeForm}
                    placeholder="Latitud, longitud"
                  />
                </div>

                <AppField label="Departamento">
                  {(field) => (
                    <AppSingleSelect<number>
                      inputId={field.id}
                      value={depaSelected}
                      options={optionsDepartamentos}
                      onChange={(value) =>
                        onSelectDepartamento(
                          findOptionByValue(optionsDepartamentos, value),
                        )
                      }
                      placeholder="Departamento"
                      size="xs"
                      fieldWidth="full"
                      isClearable
                      invalid={field.invalid}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>

                <AppField label="Municipio">
                  {(field) => (
                    <AppSingleSelect<number>
                      inputId={field.id}
                      value={muniSelected}
                      options={optionsMunis}
                      onChange={(value) =>
                        onSelectMunicipio(
                          findOptionByValue(optionsMunis, value),
                        )
                      }
                      placeholder="Municipio"
                      size="xs"
                      fieldWidth="full"
                      isClearable
                      isDisabled={!depaSelected}
                      invalid={field.invalid}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>

                <AppField label="Sector">
                  {(field) => (
                    <AppSingleSelect<number>
                      inputId={field.id}
                      value={sectorSelected}
                      options={optionsSectores}
                      onChange={(value) =>
                        onSelectSector(
                          findOptionByValue(optionsSectores, value),
                        )
                      }
                      placeholder="Sector"
                      size="xs"
                      fieldWidth="full"
                      isClearable
                      invalid={field.invalid}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>

                <TextInputField
                  label="Nombre referencia"
                  name="contactoReferenciaNombre"
                  value={formData.contactoReferenciaNombre}
                  onChange={onChangeForm}
                  placeholder="Nombre referencia"
                />

                <TextInputField
                  label="Teléfono referencia"
                  name="contactoReferenciaTelefono"
                  value={formData.contactoReferenciaTelefono}
                  onChange={onChangeForm}
                  placeholder="Teléfono referencia"
                />
              </AppGrid>
            </SectionCard>
          </AppGrid>

          <SectionCard
            icon={<MessageSquare size={13} />}
            title="Estado, notificaciones y facturación"
            description="Estado del cliente, recordatorios, zona y fechas."
          >
            <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="xs">
              <AppField label="Estado del cliente">
                {(field) => (
                  <AppSingleSelect<EstadoCliente>
                    inputId={field.id}
                    value={formData.estado}
                    options={ESTADO_CLIENTE_OPTIONS}
                    onChange={(value) =>
                      onSelectEstadoCliente(value ?? EstadoCliente.ACTIVO)
                    }
                    placeholder="Estado"
                    size="xs"
                    fieldWidth="full"
                    isClearable={false}
                    invalid={field.invalid}
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                  />
                )}
              </AppField>

              <AppField label="Zona de facturación" required>
                {(field) => (
                  <AppSingleSelect<number>
                    inputId={field.id}
                    value={zonasFacturacionSelected}
                    options={optionsZonasFacturacion}
                    onChange={(value) =>
                      onSelectZonaFacturacion(
                        findOptionByValue(optionsZonasFacturacion, value),
                      )
                    }
                    placeholder="Zona de facturación"
                    size="xs"
                    fieldWidth="full"
                    isClearable
                    invalid={field.invalid}
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                  />
                )}
              </AppField>

              <AppField label="Fecha instalación">
                {(field) => (
                  <AppInput
                    id={field.id}
                    type="datetime-local"
                    value={toDateTimeInputValue(fechaInstalacion)}
                    onChange={(event) =>
                      onChangeFechaInstalacion(
                        parseDateTimeInput(event.target.value),
                      )
                    }
                    size="xs"
                    fieldWidth="full"
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                  />
                )}
              </AppField>

              <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.25] px-3 py-2">
                <AppInline align="center" justify="between" gap="sm">
                  <AppInline align="center" gap="xs" className="min-w-0">
                    <Smartphone
                      size={14}
                      className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                    />
                    <span className="truncate text-xs font-medium">
                      Notificar cobro por WhatsApp
                    </span>
                  </AppInline>

                  <AppSwitch
                    checked={formData.enviarRecordatorio}
                    onCheckedChange={handleEnviarRecordatorioChange}
                    size="sm"
                  />
                </AppInline>
              </div>
            </AppGrid>

            {setOpenAuth || setOpenUpdNet ? (
              <>
                <AppSeparator />

                <AppInline align="center" justify="end" gap="xs" wrap>
                  {setOpenUpdNet ? (
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="xs"
                      width="auto"
                      leftIcon={<KeyRound size={13} />}
                      onClick={setOpenUpdNet}
                    >
                      Actualizar red
                    </AppButton>
                  ) : null}

                  {setOpenAuth ? (
                    <AppButton
                      type="button"
                      variant={isInstalation ? "primary" : "secondary"}
                      size="xs"
                      width="auto"
                      leftIcon={<ShieldCheck size={13} />}
                      onClick={setOpenAuth}
                    >
                      Autorizar IP
                    </AppButton>
                  ) : null}
                </AppInline>
              </>
            ) : null}
          </SectionCard>

          <SectionCard
            icon={<FileText size={13} />}
            title="Detalles del contrato"
            description="Información contractual del cliente."
          >
            <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="xs">
              <TextInputField
                label="ID de contrato"
                name="idContrato"
                value={formDataContrato.idContrato}
                onChange={handleChangeDataContrato}
                placeholder="Ej: CONTRATO-910"
              />

              <TextInputField
                label="Archivo contrato"
                name="archivoContrato"
                value={formDataContrato.archivoContrato}
                onChange={handleChangeDataContrato}
                placeholder="Próximamente..."
              />

              <AppField label="Fecha firma">
                {(field) => (
                  <AppInput
                    id={field.id}
                    type="date"
                    value={toDateInputValue(formDataContrato.fechaFirma)}
                    onChange={(event) =>
                      setFormDataContrato((prevData) => ({
                        ...prevData,
                        fechaFirma: parseDateInput(event.target.value),
                      }))
                    }
                    size="xs"
                    fieldWidth="full"
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                  />
                )}
              </AppField>

              <div className="md:col-span-2 xl:col-span-1">
                <TextareaField
                  label="Observaciones contrato"
                  name="observaciones"
                  value={formDataContrato.observaciones}
                  onChange={handleChangeDataContrato}
                  placeholder="Detalles del contrato"
                  rows={2}
                />
              </div>
            </AppGrid>
          </SectionCard>

          <SectionCard
            icon={<MessageSquare size={13} />}
            title="Observaciones generales"
            description="Notas internas o comentarios adicionales."
          >
            <TextareaField
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={onChangeForm}
              placeholder="Observaciones adicionales"
              rows={3}
            />
          </SectionCard>

          <AppSeparator />

          <AppInline align="center" justify="between" gap="xs" wrap>
            <AppButton
              type="button"
              variant="danger"
              size="xs"
              width="auto"
              leftIcon={<Trash2 size={13} />}
              onClick={onClickDelete}
            >
              Eliminar
            </AppButton>

            <AppInline align="center" justify="end" gap="xs">
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="auto"
                leftIcon={<X size={13} />}
                onClick={() => window.history.back()}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                variant="primary"
                size="xs"
                width="auto"
                leftIcon={<Save size={13} />}
              >
                Guardar cambios
              </AppButton>
            </AppInline>
          </AppInline>
        </AppStack>
      </AppCard>
    </form>
  );
}
