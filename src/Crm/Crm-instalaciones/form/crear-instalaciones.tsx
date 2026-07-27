import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import {
  AppForm,
  AppFormDatePicker,
  AppFormInput,
  AppFormMultiSelect,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";
import { CrearInstalacionFormValues } from "../crear-instalaciones/zod.schema";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppInline } from "@/components/app/primitives/app-inline";

type NumberSelectOption = {
  value: number;
  label: string;
};

type StringSelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

type InstalacionCreateFormProps = {
  form: UseFormReturn<CrearInstalacionFormValues>;

  onSubmit: SubmitHandler<CrearInstalacionFormValues>;

  clienteOptions: NumberSelectOption[];

  servicioOptions: NumberSelectOption[];

  ticketOptions: NumberSelectOption[];

  tecnicoOptions: NumberSelectOption[];

  tecnicoResponsableOptions: NumberSelectOption[];

  tipoOptions: StringSelectOption[];

  estadoOptions: StringSelectOption[];

  isLoadingClientes?: boolean;

  isLoadingServicios?: boolean;

  isLoadingTickets?: boolean;

  isLoadingTecnicos?: boolean;
};

export function InstalacionCreateForm({
  form,
  onSubmit,

  clienteOptions,

  servicioOptions,

  ticketOptions,

  tecnicoOptions,

  tecnicoResponsableOptions,

  tipoOptions,

  estadoOptions,

  isLoadingClientes = false,

  isLoadingServicios = false,

  isLoadingTickets = false,

  isLoadingTecnicos = false,
}: InstalacionCreateFormProps) {
  const hasTecnicos = tecnicoResponsableOptions.length > 0;

  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <div className="p-2 sm:p-3">
        <AppStack gap="md">
          {/* Información general */}

          <section aria-labelledby="instalacion-general-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-general-title"
                  className="text-base font-medium"
                >
                  Datos de la instalación
                </h2>

                <p className="text-sm">
                  Defina el cliente, servicio, tipo y estado inicial.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="clienteId"
                  label="Cliente"
                  options={clienteOptions}
                  placeholder="Seleccione un cliente"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingClientes}
                  required
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="servicioInternetId"
                  label="Servicio de internet"
                  options={servicioOptions}
                  placeholder="Seleccione un servicio"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingServicios}
                  isClearable
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="ticketId"
                  label="Ticket relacionado"
                  options={ticketOptions}
                  placeholder="Sin ticket asignado"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingTickets}
                  isClearable
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, string>
                  name="tipo"
                  label="Tipo de instalación"
                  options={tipoOptions}
                  placeholder="Seleccione el tipo"
                  density="compact"
                  required
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, string>
                  name="estado"
                  label="Estado inicial"
                  options={estadoOptions}
                  placeholder="Seleccione un estado"
                  density="compact"
                  required
                />
              </AppGrid>

              <AppFormInput<CrearInstalacionFormValues>
                name="descripcion"
                label="Descripción de la instalación"
                placeholder="Ej. Instalación de servicio residencial Plan Q150"
                hint="Describa claramente qué se instalará."
                clearable
                required
              />

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="motivo"
                  label="Motivo"
                  placeholder="Ej. Solicitud de nueva conexión"
                  clearable
                />

                <AppFormTextarea<CrearInstalacionFormValues>
                  name="observaciones"
                  label="Observaciones"
                  placeholder="Detalles adicionales de la instalación"
                  rows={3}
                  resizeMode="vertical"
                />
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          {/* Programación */}

          <section aria-labelledby="instalacion-programacion-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-programacion-title"
                  className="text-base font-medium"
                >
                  Programación
                </h2>

                <p className="text-sm">
                  Defina cuándo se realizará y, cuando corresponda, cuándo
                  inicia.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormDatePicker<CrearInstalacionFormValues>
                  name="fechaProgramada"
                  label="Fecha programada"
                />

                <AppFormDatePicker<CrearInstalacionFormValues>
                  name="fechaInicio"
                  label="Fecha de inicio"
                />
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          {/* Ubicación */}

          <section aria-labelledby="instalacion-ubicacion-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-ubicacion-title"
                  className="text-base font-medium"
                >
                  Ubicación
                </h2>

                <p className="text-sm">
                  Registre la dirección y pegue las coordenadas directamente
                  desde Maps.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="direccionInstalacion"
                  label="Dirección de instalación"
                  placeholder="Ej. Barrio El Centro"
                  clearable
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="referenciaUbicacion"
                  label="Referencia"
                  placeholder="Ej. Casa de portón negro"
                  clearable
                />
              </AppGrid>

              <AppFormInput<CrearInstalacionFormValues>
                name="coordenadas"
                label="Coordenadas"
                placeholder="Ej. 15.668, -91.735"
                description="Pegue las coordenadas copiadas desde Google Maps."
                clearable
              />
            </AppStack>
          </section>

          <AppSeparator />

          {/* Técnicos */}

          <section aria-labelledby="instalacion-tecnicos-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-tecnicos-title"
                  className="text-base font-medium"
                >
                  Técnicos
                </h2>

                <p className="text-sm">
                  Asigne uno o varios técnicos y defina un responsable.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormMultiSelect<CrearInstalacionFormValues, number>
                  name="tecnicoIds"
                  label="Técnicos asignados"
                  options={tecnicoOptions}
                  placeholder="Seleccione técnicos"
                  density="compact"
                  isLoading={isLoadingTecnicos}
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="tecnicoResponsableId"
                  label="Técnico responsable"
                  options={tecnicoResponsableOptions}
                  placeholder={
                    hasTecnicos
                      ? "Seleccione un responsable"
                      : "Primero asigne técnicos"
                  }
                  density="compact"
                  isDisabled={!hasTecnicos}
                  isClearable
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="asesorId"
                  label="Assesor Responsable"
                  options={tecnicoOptions}
                  placeholder={"Seleccione un asesor responsable"}
                  density="compact"
                  isClearable
                />
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          {/* Costos */}

          <section aria-labelledby="instalacion-costos-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-costos-title"
                  className="text-base font-medium"
                >
                  Costos
                </h2>

                <p className="text-sm">
                  Registre únicamente los montos conocidos. Los campos vacíos no
                  se enviarán.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  sm: 2,
                  xl: 3,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoInstalacion"
                  label="Costo de instalación"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoMateriales"
                  label="Costo de materiales"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoManoObra"
                  label="Costo de mano de obra"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoOtros"
                  label="Otros costos"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.montoCobradoCliente"
                  label="Monto cobrado al cliente"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.saldoPendiente"
                  label="Saldo pendiente"
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </AppGrid>

              <AppFormTextarea<CrearInstalacionFormValues>
                name="costos.notas"
                label="Notas de costos"
                placeholder="Observaciones sobre materiales, cobros o gastos"
                rows={3}
                resizeMode="vertical"
              />
            </AppStack>
          </section>

          <AppSeparator />

          <AppInline collapseBelow="sm" justify="end" gap="sm" fullWidth>
            <AppFormSubmit
              loadingText="Creando instalación..."
              disableWhenInvalid
            >
              Crear instalación
            </AppFormSubmit>
          </AppInline>
        </AppStack>
      </div>
    </AppForm>
  );
}
