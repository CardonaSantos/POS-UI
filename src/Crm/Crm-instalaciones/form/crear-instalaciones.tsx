import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";

import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  EstadoInstalacionCliente,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";

import type { PerfilHomologacionSelectMeta } from "@/Crm/features/pppoe-homologaciones/intefaces";

import type { CrearInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/schema";

import { InstalacionAccesoSection } from "./instalacion-acceso-section";
import { InstalacionCostosSection } from "./instalacion-costos-section";
import { InstalacionProgramacionSection } from "./instalacion-programacion-section";
import { InstalacionTecnicosSection } from "./instalacion-tecnicos-section";
import { InstalacionUbicacionSection } from "./instalacion-ubicacion-section";

type InstalacionCreateFormProps = {
  form: UseFormReturn<CrearInstalacionFormValues>;

  onSubmit: SubmitHandler<CrearInstalacionFormValues>;

  clienteOptions: AppSelectOption<number>[];

  servicioOptions: AppSelectOption<number>[];

  ticketOptions: AppSelectOption<number>[];

  tecnicoOptions: AppSelectOption<number>[];

  tipoOptions: AppSelectOption<TipoInstalacionCliente>[];

  estadoOptions: AppSelectOption<EstadoInstalacionCliente>[];

  tecnologiaOptions: AppSelectOption<TecnologiaAccesoInternet>[];

  metodoAutenticacionOptions: AppSelectOption<MetodoAutenticacionInternet>[];

  homologacionOptions: AppSelectOption<number, PerfilHomologacionSelectMeta>[];

  isLoadingClientes?: boolean;

  isLoadingServicios?: boolean;

  isLoadingTickets?: boolean;

  isLoadingTecnicos?: boolean;

  isLoadingHomologaciones?: boolean;
};

export function InstalacionCreateForm({
  form,
  onSubmit,

  clienteOptions,

  servicioOptions,

  ticketOptions,

  tecnicoOptions,

  tipoOptions,

  estadoOptions,

  tecnologiaOptions,

  metodoAutenticacionOptions,

  homologacionOptions,

  isLoadingClientes = false,

  isLoadingServicios = false,

  isLoadingTickets = false,

  isLoadingTecnicos = false,

  isLoadingHomologaciones = false,
}: InstalacionCreateFormProps) {
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
                  placeholder="Derivado de la homologación"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingServicios}
                  isClearable
                  isDisabled
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

                <AppFormSingleSelect<
                  CrearInstalacionFormValues,
                  TipoInstalacionCliente
                >
                  name="tipo"
                  label="Tipo de instalación"
                  options={tipoOptions}
                  placeholder="Seleccione el tipo"
                  density="compact"
                  required
                />

                <AppFormSingleSelect<
                  CrearInstalacionFormValues,
                  EstadoInstalacionCliente
                >
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

          {/* Acceso */}

          <InstalacionAccesoSection
            tecnologiaOptions={tecnologiaOptions}
            metodoAutenticacionOptions={metodoAutenticacionOptions}
            homologacionOptions={homologacionOptions}
            isLoadingHomologaciones={isLoadingHomologaciones}
          />

          <AppSeparator />

          {/* Programación */}

          <InstalacionProgramacionSection showFechaInicio />

          <AppSeparator />

          {/* Ubicación */}

          <InstalacionUbicacionSection />

          <AppSeparator />

          {/* Técnicos */}

          <InstalacionTecnicosSection
            tecnicoOptions={tecnicoOptions}
            isLoadingTecnicos={isLoadingTecnicos}
          />

          <AppSeparator />

          {/* Costos */}

          <InstalacionCostosSection />

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
