import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { CrearPerfilHomologacionFormValues } from "../schema/schema";

type Option = {
  value: number;
  label: string;
};

interface PerfilHomologacionFormProps {
  form: UseFormReturn<CrearPerfilHomologacionFormValues>;

  routerOptions: Option[];

  servicioOptions: Option[];

  isLoadingOptions?: boolean;

  isPending?: boolean;

  onCancel?: () => void;

  onSubmit: SubmitHandler<CrearPerfilHomologacionFormValues>;
}

export function PerfilHomologacionForm({
  form,
  routerOptions,
  servicioOptions,
  isLoadingOptions = false,
  isPending = false,
  onCancel,
  onSubmit,
}: PerfilHomologacionFormProps) {
  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <AppStack gap="sm">
        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppFormSingleSelect<CrearPerfilHomologacionFormValues, number>
            name="mikrotikRouterId"
            label="Router MikroTik"
            options={routerOptions}
            placeholder="Seleccione un router"
            density="compact"
            isLoading={isLoadingOptions}
            required
          />

          <AppFormSingleSelect<CrearPerfilHomologacionFormValues, number>
            name="servicioInternetId"
            label="Plan de internet"
            options={servicioOptions}
            placeholder="Seleccione un plan"
            density="compact"
            isLoading={isLoadingOptions}
            required
          />

          <div className="md:col-span-2">
            <AppFormInput<CrearPerfilHomologacionFormValues>
              name="codigoPerfil"
              label="Código del perfil"
              placeholder="Ej. PLAN_20M"
              maxLength={100}
              autoComplete="off"
              required
            />
          </div>
        </AppGrid>

        <AppInline justify="end" gap="xs" fullWidth>
          {onCancel ? (
            <AppButton
              type="button"
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={onCancel}
            >
              Cancelar
            </AppButton>
          ) : null}

          <AppFormSubmit<CrearPerfilHomologacionFormValues>
            size="sm"
            loadingText="Registrando..."
            disableWhenInvalid
          >
            Registrar homologación
          </AppFormSubmit>
        </AppInline>
      </AppStack>
    </AppForm>
  );
}
