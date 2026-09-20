import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import { AppForm, AppFormSubmit } from "@/components/app/form";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import type { TipoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import { InstalacionTecnicosSection } from "./instalacion-tecnicos-section";
import { InstalacionProgramacionSection } from "./instalacion-programacion-section";
import { InstalacionUbicacionSection } from "./instalacion-ubicacion-section";
import { InstalacionCostosSection } from "./instalacion-costos-section";
import { InstalacionEditContext } from "./instalacion-edit-context";
import { InstalacionEditGeneralSection } from "./instalacion-edit-general-section";
import { EditarInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/editar-stalacion.schema";
import { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";

type Props = {
  form: UseFormReturn<EditarInstalacionFormValues>;

  detalle: ClienteInstalacionDetalle;

  onSubmit: SubmitHandler<EditarInstalacionFormValues>;

  tipoOptions: AppSelectOption<TipoInstalacionCliente>[];

  ticketOptions: AppSelectOption<number>[];

  tecnicoOptions: AppSelectOption<number>[];

  isLoadingTickets?: boolean;

  isLoadingTecnicos?: boolean;

  canEditPlanning: boolean;
};

export function InstalacionEditForm({
  form,
  detalle,
  onSubmit,

  tipoOptions,

  ticketOptions,

  tecnicoOptions,

  isLoadingTickets = false,

  isLoadingTecnicos = false,

  canEditPlanning,
}: Props) {
  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <div className="p-2 sm:p-3">
        <AppStack gap="md">
          <InstalacionEditContext detalle={detalle} />

          <AppSeparator />

          <InstalacionEditGeneralSection
            tipoOptions={tipoOptions}
            ticketOptions={ticketOptions}
            isLoadingTickets={isLoadingTickets}
            canEditPlanning={canEditPlanning}
          />

          <AppSeparator />

          {canEditPlanning ? (
            <>
              <InstalacionProgramacionSection />

              <AppSeparator />
            </>
          ) : null}

          <InstalacionUbicacionSection />

          <AppSeparator />

          <InstalacionTecnicosSection
            tecnicoOptions={tecnicoOptions}
            isLoadingTecnicos={isLoadingTecnicos}
          />

          <AppSeparator />

          <InstalacionCostosSection showMontoCobradoCliente />

          <AppSeparator />

          <AppInline collapseBelow="sm" justify="end" gap="sm" fullWidth>
            <AppFormSubmit
              loadingText="Guardando cambios..."
              disableWhenInvalid
            >
              Guardar cambios
            </AppFormSubmit>
          </AppInline>
        </AppStack>
      </div>
    </AppForm>
  );
}
