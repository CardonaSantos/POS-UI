// ServicioInternetDialog.tsx
"use client";

import * as React from "react";
import { DollarSign, Gauge, Save, Wifi } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppStateHandlers } from "@/components/app/handlers";
import {
  NuevoServicioInternet,
  ServicioInternet,
} from "../CrmServiciosWifi/servicio-internet.types";

type InternetFormState = NuevoServicioInternet;

interface CreateServicioInternetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NuevoServicioInternet;
  empresaId: number;
  isLoading?: boolean;
  onSubmit: (payload: NuevoServicioInternet) => void | Promise<void>;
}

interface EditServicioInternetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicio: ServicioInternet | null;
  isLoading?: boolean;
  onSave: (payload: ServicioInternet) => void | Promise<void>;
}

function normalizePrecio(value: string) {
  return value === "" ? 0 : Number(value);
}

function InternetPlanForm({
  form,
  isLoading,
  submitText,
  loadingText,
  onPatch,
  onSubmit,
  onCancel,
}: {
  form: InternetFormState;
  isLoading?: boolean;
  submitText: string;
  loadingText: string;
  onPatch: (patch: Partial<InternetFormState>) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <AppStack gap="md">
        <AppField
          label="Nombre del plan"
          required
          description="Nombre comercial del plan de internet."
        >
          {(field) => (
            <AppInput
              id={field.id}
              value={form.nombre}
              onChange={(event) => onPatch({ nombre: event.target.value })}
              placeholder="Ej: Plan básico internet"
              size="xs"
              fieldWidth="full"
              leftIcon={<Wifi size={13} />}
              disabled={isLoading}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="off"
              required
            />
          )}
        </AppField>

        <AppField
          label="Velocidad"
          description="Especifique la velocidad del plan. Opcional."
        >
          {(field) => (
            <AppInput
              id={field.id}
              value={form.velocidad ?? ""}
              onChange={(event) => onPatch({ velocidad: event.target.value })}
              placeholder="Ej: 20 Mbps"
              size="xs"
              fieldWidth="full"
              leftIcon={<Gauge size={13} />}
              disabled={isLoading}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="off"
            />
          )}
        </AppField>

        <AppField
          label="Precio"
          required
          description="Precio mensual del plan."
        >
          {(field) => (
            <AppInput
              id={field.id}
              type="number"
              min="0"
              step="0.01"
              value={form.precio || ""}
              onChange={(event) =>
                onPatch({ precio: normalizePrecio(event.target.value) })
              }
              placeholder="0.00"
              size="xs"
              fieldWidth="full"
              leftIcon={<DollarSign size={13} />}
              disabled={isLoading}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              required
            />
          )}
        </AppField>

        <AppInline align="center" justify="end" gap="xs" className="pt-1">
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancelar
          </AppButton>

          <AppButton
            type="submit"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<Save size={13} />}
            loading={isLoading}
            loadingText={loadingText}
            disabled={isLoading}
          >
            {submitText}
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}

export function CreateServicioInternetDialog({
  open,
  onOpenChange,
  initialData,
  empresaId,
  isLoading,
  onSubmit,
}: CreateServicioInternetDialogProps) {
  const form = useAppStateHandlers<InternetFormState>({
    ...initialData,
    empresaId,
  });

  React.useEffect(() => {
    if (!open) return;

    form.setState({
      ...initialData,
      empresaId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, empresaId]);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[520px]">
        <AppDialogHeader>
          <AppDialogTitle>Nuevo plan de internet</AppDialogTitle>
          <AppDialogDescription>
            Complete los datos para crear un nuevo plan.
          </AppDialogDescription>
        </AppDialogHeader>

        <InternetPlanForm
          form={form.state}
          isLoading={isLoading}
          submitText="Crear plan"
          loadingText="Creando..."
          onPatch={form.patch}
          onCancel={() => onOpenChange(false)}
          onSubmit={() => onSubmit(form.state)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}

export function EditServicioInternetDialog({
  open,
  onOpenChange,
  servicio,
  isLoading,
  onSave,
}: EditServicioInternetDialogProps) {
  const form = useAppStateHandlers<InternetFormState>({
    nombre: "",
    velocidad: "",
    precio: 0,
    estado: "ACTIVO",
    empresaId: 0,
  });

  React.useEffect(() => {
    if (!open || !servicio) return;

    form.setState({
      nombre: servicio.nombre ?? "",
      velocidad: servicio.velocidad ?? "",
      precio: Number(servicio.precio ?? 0),
      estado: servicio.estado ?? "ACTIVO",
      empresaId: servicio.empresaId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, servicio]);

  if (!servicio) return null;

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[520px]">
        <AppDialogHeader>
          <AppDialogTitle>Editar plan de internet</AppDialogTitle>
          <AppDialogDescription>
            Modifique los datos del plan y guarde los cambios.
          </AppDialogDescription>
        </AppDialogHeader>

        <InternetPlanForm
          form={form.state}
          isLoading={isLoading}
          submitText="Guardar cambios"
          loadingText="Guardando..."
          onPatch={form.patch}
          onCancel={() => onOpenChange(false)}
          onSubmit={() =>
            onSave({
              ...servicio,
              ...form.state,
              precio: Number(form.state.precio ?? 0),
            })
          }
        />
      </AppDialogContent>
    </AppDialog>
  );
}
