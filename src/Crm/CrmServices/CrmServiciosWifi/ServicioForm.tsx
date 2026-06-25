"use client";

import * as React from "react";
import { DollarSign, Gauge, Save, Wifi } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppStateHandlers } from "@/components/app/handlers";

import type { ServicioFormProps } from "./servicio-internet.types";

export default function ServicioForm({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
  empresaId,
  onCancel,
}: ServicioFormProps) {
  const form = useAppStateHandlers({
    ...initialData,
    empresaId,
  });

  React.useEffect(() => {
    form.setState({
      ...initialData,
      empresaId,
    });
  }, [initialData, empresaId]);

  const handleChange = React.useCallback(
    (name: string, value: string) => {
      if (name === "precio") {
        form.setField(
          name as never,
          (value === "" ? 0 : Number(value)) as never,
        );
        return;
      }

      form.setField(name as never, value as never);
    },
    [form],
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void onSubmit(form.state);
    },
    [form.state, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <AppStack gap="md">
        <AppField
          label="Nombre del plan"
          required
          description="Nombre comercial del plan de internet."
        >
          {(field) => (
            <AppInput
              id={field.id}
              name="nombre"
              value={form.state.nombre ?? ""}
              onChange={(event) => handleChange("nombre", event.target.value)}
              placeholder="Ej: Plan básico internet"
              size="xs"
              fieldWidth="full"
              leftIcon={<Wifi size={13} />}
              disabled={isLoading}
              invalid={field.invalid}
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
              name="velocidad"
              value={form.state.velocidad ?? ""}
              onChange={(event) =>
                handleChange("velocidad", event.target.value)
              }
              placeholder="Ej: 20 Mbps"
              size="xs"
              fieldWidth="full"
              leftIcon={<Gauge size={13} />}
              disabled={isLoading}
              invalid={field.invalid}
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
              name="precio"
              type="number"
              step="0.01"
              min="0"
              value={form.state.precio ?? ""}
              onChange={(event) => handleChange("precio", event.target.value)}
              placeholder="0.00"
              size="xs"
              fieldWidth="full"
              leftIcon={<DollarSign size={13} />}
              disabled={isLoading}
              invalid={field.invalid}
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
            leftIcon={isEditing ? <Save size={13} /> : <Wifi size={13} />}
            loading={isLoading}
            loadingText={isEditing ? "Guardando..." : "Creando..."}
            disabled={isLoading}
          >
            {isEditing ? "Guardar cambios" : "Crear plan"}
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}
