"use client";

import { Coins, FileText, Save } from "lucide-react";
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
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type { NuevoTipoServicio } from "../crm-service.types";
import type { ServicioFormState } from "./crm-service.helpers";
import { AppGrid } from "@/components/app/primitives/app-grid";

type SelectOption = {
  value: string;
  label: string;
};

const ESTADO_OPTIONS: SelectOption[] = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
];

interface ServicioFormFieldsProps {
  form: ServicioFormState;
  tipoOptions: SelectOption[];
  isLoading?: boolean;
  mode: "create" | "edit";
  onPatch: (patch: Partial<ServicioFormState>) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
}

interface TipoServicioFormFieldsProps {
  form: NuevoTipoServicio;
  isLoading?: boolean;
  onPatch: (patch: Partial<NuevoTipoServicio>) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
}

interface TipoServicioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: NuevoTipoServicio;
  isLoading?: boolean;
  onPatch: (patch: Partial<NuevoTipoServicio>) => void;
  onSubmit: () => void | Promise<void>;
}

interface ServicioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ServicioFormState;
  tipoOptions: SelectOption[];
  isLoading?: boolean;
  onPatch: (patch: Partial<ServicioFormState>) => void;
  onSubmit: () => void | Promise<void>;
}

function ServicioFormFields({
  form,
  tipoOptions,
  isLoading,
  mode,
  onPatch,
  onSubmit,
  onCancel,
}: ServicioFormFieldsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <AppStack gap="md">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppField
            label="Nombre"
            required
            description="Nombre comercial del servicio."
          >
            {(field) => (
              <AppInput
                id={field.id}
                value={form.nombre}
                onChange={(event) => onPatch({ nombre: event.target.value })}
                placeholder="Ej: Internet 24 Mbps"
                size="xs"
                fieldWidth="full"
                leftIcon={<FileText size={13} />}
                disabled={isLoading}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="off"
                required
              />
            )}
          </AppField>

          <AppField
            label="Precio"
            required
            description="Precio mensual del servicio."
          >
            {(field) => (
              <AppInput
                id={field.id}
                type="number"
                min="0"
                step="0.01"
                value={form.precio || ""}
                onChange={(event) =>
                  onPatch({
                    precio:
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value),
                  })
                }
                placeholder="0.00"
                size="xs"
                fieldWidth="full"
                leftIcon={<Coins size={13} />}
                disabled={isLoading}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                required
              />
            )}
          </AppField>

          <div className="md:col-span-2">
            <AppField
              label="Descripción"
              description="Detalle breve del servicio."
            >
              {(field) => (
                <AppTextarea
                  id={field.id}
                  value={form.descripcion ?? ""}
                  onChange={(event) =>
                    onPatch({ descripcion: event.target.value })
                  }
                  placeholder="Descripción del servicio"
                  size="xs"
                  fieldWidth="full"
                  disabled={isLoading}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                  className="min-h-[96px] resize-y"
                />
              )}
            </AppField>
          </div>

          <AppField
            label="Tipo de servicio"
            description="Opcional al crear. Requerido si tu backend lo exige."
          >
            {(field) => (
              <AppSingleSelect<string>
                inputId={field.id}
                value={form.tipoServicioId ?? null}
                onChange={(value) => onPatch({ tipoServicioId: value })}
                options={tipoOptions}
                placeholder="Seleccione un tipo"
                size="xs"
                fieldWidth="full"
                isDisabled={isLoading}
                invalid={field.invalid}
                portalToBody
                menuPosition="fixed"
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
              />
            )}
          </AppField>

          <AppField label="Estado">
            {(field) => (
              <AppSingleSelect<string>
                inputId={field.id}
                value={form.estado ?? "ACTIVO"}
                onChange={(value) =>
                  onPatch({ estado: (value ?? "ACTIVO") as never })
                }
                options={ESTADO_OPTIONS}
                placeholder="Seleccione un estado"
                size="xs"
                fieldWidth="full"
                isDisabled={isLoading}
                invalid={field.invalid}
                portalToBody
                menuPosition="fixed"
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
              />
            )}
          </AppField>
        </AppGrid>

        <AppInline align="center" justify="end" gap="xs" className="pt-2">
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
            loadingText={mode === "edit" ? "Guardando..." : "Creando..."}
            disabled={isLoading}
          >
            {mode === "edit" ? "Guardar cambios" : "Crear servicio"}
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}

function TipoServicioFormFields({
  form,
  isLoading,
  onPatch,
  onSubmit,
  onCancel,
}: TipoServicioFormFieldsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <AppStack gap="md">
        <AppField
          label="Nombre"
          required
          description="Nombre del tipo de servicio."
        >
          {(field) => (
            <AppInput
              id={field.id}
              value={form.nombre}
              onChange={(event) => onPatch({ nombre: event.target.value })}
              placeholder="Ej: Internet"
              size="xs"
              fieldWidth="full"
              leftIcon={<FileText size={13} />}
              disabled={isLoading}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="off"
              required
            />
          )}
        </AppField>

        <AppField
          label="Descripción"
          required
          description="Descripción corta del tipo de servicio."
        >
          {(field) => (
            <AppTextarea
              id={field.id}
              value={form.descripcion}
              onChange={(event) => onPatch({ descripcion: event.target.value })}
              placeholder="Descripción del tipo de servicio"
              size="xs"
              fieldWidth="full"
              disabled={isLoading}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              className="min-h-[86px] resize-y"
              required
            />
          )}
        </AppField>

        <AppField label="Estado">
          {(field) => (
            <AppSingleSelect<string>
              inputId={field.id}
              value={form.estado ?? "ACTIVO"}
              onChange={(value) =>
                onPatch({ estado: (value ?? "ACTIVO") as never })
              }
              options={ESTADO_OPTIONS}
              placeholder="Seleccione un estado"
              size="xs"
              fieldWidth="full"
              isDisabled={isLoading}
              invalid={field.invalid}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
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
            loadingText="Creando..."
            disabled={isLoading}
          >
            Crear tipo
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}

export function CreateServicioDialog({
  open,
  onOpenChange,
  form,
  tipoOptions,
  isLoading,
  onPatch,
  onSubmit,
}: ServicioDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[760px]">
        <AppDialogHeader>
          <AppDialogTitle>Crear servicio</AppDialogTitle>
          <AppDialogDescription>
            Complete la información para crear un nuevo servicio.
          </AppDialogDescription>
        </AppDialogHeader>

        <ServicioFormFields
          form={form}
          tipoOptions={tipoOptions}
          isLoading={isLoading}
          mode="create"
          onPatch={onPatch}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}

export function EditServicioDialog({
  open,
  onOpenChange,
  form,
  tipoOptions,
  isLoading,
  onPatch,
  onSubmit,
}: ServicioDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[540px]">
        <AppDialogHeader>
          <AppDialogTitle>Editar servicio</AppDialogTitle>
          <AppDialogDescription>
            Actualice la información del servicio seleccionado.
          </AppDialogDescription>
        </AppDialogHeader>

        <ServicioFormFields
          form={form}
          tipoOptions={tipoOptions}
          isLoading={isLoading}
          mode="edit"
          onPatch={onPatch}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}

export function CreateTipoServicioDialog({
  open,
  onOpenChange,
  form,
  isLoading,
  onPatch,
  onSubmit,
}: TipoServicioDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[500px]">
        <AppDialogHeader>
          <AppDialogTitle>Crear tipo de servicio</AppDialogTitle>
          <AppDialogDescription>
            Complete la información para crear una categoría de servicio.
          </AppDialogDescription>
        </AppDialogHeader>

        <TipoServicioFormFields
          form={form}
          isLoading={isLoading}
          onPatch={onPatch}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}
