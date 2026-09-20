import { useFormContext } from "react-hook-form";
import {
  AppFormInput,
  AppFormSingleSelect,
  AppFormTextarea,
} from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import type { TipoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import { EditarInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/editar-stalacion.schema";

type Props = {
  tipoOptions: AppSelectOption<TipoInstalacionCliente>[];

  ticketOptions: AppSelectOption<number>[];

  isLoadingTickets?: boolean;

  canEditPlanning: boolean;
};

export function InstalacionEditGeneralSection({
  tipoOptions,
  ticketOptions,
  isLoadingTickets = false,
  canEditPlanning,
}: Props) {
  useFormContext<EditarInstalacionFormValues>();

  return (
    <section aria-labelledby="instalacion-edicion-general-title">
      <AppStack gap="sm">
        <div>
          <h2
            id="instalacion-edicion-general-title"
            className="text-base font-medium"
          >
            Datos de la instalación
          </h2>

          <p className="text-sm text-muted-foreground">
            Modifique la información administrativa y operativa permitida.
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
            EditarInstalacionFormValues,
            TipoInstalacionCliente
          >
            name="tipo"
            label="Tipo de instalación"
            options={tipoOptions}
            placeholder="Seleccione el tipo"
            density="compact"
            isDisabled={!canEditPlanning}
            required
          />

          <AppFormSingleSelect<EditarInstalacionFormValues, number>
            name="ticketId"
            label="Ticket relacionado"
            options={ticketOptions}
            placeholder="Sin ticket asignado"
            density="compact"
            isSearchable
            isLoading={isLoadingTickets}
            isClearable
          />
        </AppGrid>

        <AppFormInput<EditarInstalacionFormValues>
          name="descripcion"
          label="Descripción de la instalación"
          placeholder="Descripción del trabajo"
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
          <AppFormInput<EditarInstalacionFormValues>
            name="motivo"
            label="Motivo"
            placeholder="Motivo de la instalación"
            clearable
          />

          <AppFormTextarea<EditarInstalacionFormValues>
            name="observaciones"
            label="Observaciones"
            placeholder="Detalles adicionales"
            rows={3}
            resizeMode="vertical"
          />
        </AppGrid>
      </AppStack>
    </section>
  );
}
