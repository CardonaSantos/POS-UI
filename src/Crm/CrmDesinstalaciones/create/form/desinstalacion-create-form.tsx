import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormSwitch,
  AppFormTextarea,
  AppFormInput,
} from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import type { ContextoCreacionDesinstalacionResponse } from "@/Crm/features/desinstalaciones/contexto-creacion.interfaces";
import type {
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";
import { DesinstalacionClienteAccesoSection } from "./desinstalacion-cliente-acceso-section";
import { DesinstalacionTecnicosSection } from "./desinstalacion-tecnicos-section";
import { CrearDesinstalacionFormValues } from "../../schemas/crear-desinstalacion.schema";

type DesinstalacionCreateFormProps = {
  form: UseFormReturn<CrearDesinstalacionFormValues>;

  onSubmit: SubmitHandler<CrearDesinstalacionFormValues>;

  contexto?: ContextoCreacionDesinstalacionResponse;

  clienteOptions: AppSelectOption<number>[];

  accesoOptions: AppSelectOption<number>[];

  ticketOptions: AppSelectOption<number>[];

  tecnicoOptions: AppSelectOption<number>[];

  tipoOptions: AppSelectOption<TipoDesinstalacionCliente>[];

  motivoOptions: AppSelectOption<MotivoDesinstalacionCliente>[];

  isLoadingClientes?: boolean;

  isLoadingTecnicos?: boolean;

  isLoadingContexto?: boolean;

  isErrorContexto?: boolean;

  onRetryContexto?: () => void;
};

export function DesinstalacionCreateForm({
  form,
  onSubmit,

  contexto,

  clienteOptions,
  accesoOptions,
  ticketOptions,
  tecnicoOptions,
  tipoOptions,
  motivoOptions,

  isLoadingClientes = false,
  isLoadingTecnicos = false,
  isLoadingContexto = false,
  isErrorContexto = false,

  onRetryContexto,
}: DesinstalacionCreateFormProps) {
  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <div className="p-4 sm:p-5">
        <AppStack gap="md">
          {/* Cliente + acceso */}

          <DesinstalacionClienteAccesoSection
            contexto={contexto}
            clienteOptions={clienteOptions}
            accesoOptions={accesoOptions}
            ticketOptions={ticketOptions}
            isLoadingClientes={isLoadingClientes}
            isLoadingContexto={isLoadingContexto}
            isErrorContexto={isErrorContexto}
            onRetryContexto={onRetryContexto}
          />

          <AppSeparator />

          {/* Desinstalación */}

          <section aria-labelledby="desinstalacion-datos-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="desinstalacion-datos-title"
                  className="text-base font-medium"
                >
                  Desinstalación
                </h2>

                <p className="text-sm text-muted-foreground">
                  Defina el motivo, tipo y programación del retiro.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormSingleSelect<
                  CrearDesinstalacionFormValues,
                  TipoDesinstalacionCliente
                >
                  name="tipo"
                  label="Tipo de desinstalación"
                  options={tipoOptions}
                  placeholder="Seleccione el tipo"
                  density="compact"
                  required
                />

                <AppFormSingleSelect<
                  CrearDesinstalacionFormValues,
                  MotivoDesinstalacionCliente
                >
                  name="motivo"
                  label="Motivo"
                  options={motivoOptions}
                  placeholder="Seleccione el motivo"
                  density="compact"
                  required
                />

                <AppFormInput<CrearDesinstalacionFormValues>
                  name="fechaProgramada"
                  type="datetime-local"
                  label="Fecha programada"
                  hint="Fecha y hora previstas para el retiro físico."
                />

                <div className="flex items-end">
                  <AppFormSwitch<CrearDesinstalacionFormValues>
                    name="requiereRetiroEquipo"
                    fieldLabel="Equipos"
                    label="Requiere retiro de equipo"
                    description="Indica que durante la visita deberán recuperarse equipos instalados."
                  />
                </div>
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          {/* Técnicos */}

          <DesinstalacionTecnicosSection
            tecnicoOptions={tecnicoOptions}
            isLoadingTecnicos={isLoadingTecnicos}
          />

          <AppSeparator />

          {/* Observaciones */}

          <section aria-labelledby="desinstalacion-observaciones-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="desinstalacion-observaciones-title"
                  className="text-base font-medium"
                >
                  Observaciones
                </h2>

                <p className="text-sm text-muted-foreground">
                  Registre información adicional útil para el personal
                  encargado.
                </p>
              </div>

              <AppFormTextarea<CrearDesinstalacionFormValues>
                name="observaciones"
                label="Observaciones"
                placeholder="Ej. Cliente solicita retirar ONU y router durante la visita."
                rows={4}
                resizeMode="vertical"
              />
            </AppStack>
          </section>

          <AppSeparator />

          <AppInline collapseBelow="sm" justify="end" gap="sm" fullWidth>
            <AppFormSubmit
              loadingText="Creando desinstalación..."
              disableWhenInvalid
            >
              Crear desinstalación
            </AppFormSubmit>
          </AppInline>
        </AppStack>
      </div>
    </AppForm>
  );
}
