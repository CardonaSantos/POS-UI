"use client";

import * as React from "react";
import { Save, Tag } from "lucide-react";

import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";

interface EtiquetaTicketDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombre: string;
  isLoading?: boolean;
  onNombreChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
}

function getDialogCopy(mode: "create" | "edit") {
  if (mode === "edit") {
    return {
      title: "Editar etiqueta",
      description: "Modifique el nombre de la etiqueta y guarde los cambios.",
      submitText: "Guardar cambios",
      loadingText: "Guardando...",
    };
  }

  return {
    title: "Crear nueva etiqueta",
    description: "Ingrese un nombre único para la nueva etiqueta de tickets.",
    submitText: "Crear etiqueta",
    loadingText: "Creando...",
  };
}

export function EtiquetaTicketDialog({
  mode,
  open,
  onOpenChange,
  nombre,
  isLoading,
  onNombreChange,
  onSubmit,
}: EtiquetaTicketDialogProps) {
  const copy = getDialogCopy(mode);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void onSubmit();
    },
    [onSubmit],
  );

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[430px]">
        <AppDialogHeader>
          <AppDialogTitle>{copy.title}</AppDialogTitle>
          <AppDialogDescription>{copy.description}</AppDialogDescription>
        </AppDialogHeader>

        <form onSubmit={handleSubmit}>
          <AppStack gap="md">
            <AppField
              label="Nombre de la etiqueta"
              required
              description="Debe ser único y descriptivo para clasificar tickets."
            >
              {(field) => (
                <AppInput
                  id={field.id}
                  name="nombre"
                  value={nombre}
                  onChange={(event) => onNombreChange(event.target.value)}
                  placeholder="Ej: Soporte técnico"
                  size="xs"
                  fieldWidth="full"
                  leftIcon={<Tag size={13} />}
                  disabled={isLoading}
                  invalid={field.invalid}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                  autoComplete="off"
                />
              )}
            </AppField>

            <AppDialogFooter>
              <AppInline
                align="center"
                justify="end"
                gap="xs"
                className="w-full"
              >
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  disabled={isLoading}
                  onClick={() => onOpenChange(false)}
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
                  loadingText={copy.loadingText}
                  disabled={isLoading || !nombre.trim()}
                >
                  {copy.submitText}
                </AppButton>
              </AppInline>
            </AppDialogFooter>
          </AppStack>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
