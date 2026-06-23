"use client";

import type { UseFormReturn } from "react-hook-form";
import { FileText, Save, Ticket } from "lucide-react";

import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";
import { useAppFormHandlers } from "@/components/app/handlers";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { CreateSolucionTicketDto } from "./zod";

interface TicketSolucionesFormProps {
  form: UseFormReturn<CreateSolucionTicketDto>;
  onSubmit: (data: CreateSolucionTicketDto) => void | Promise<void>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

function getFormCopy(mode: "create" | "edit") {
  if (mode === "edit") {
    return {
      title: "Editar solución",
      description: "Actualiza una solución rápida existente para tickets.",
      submitText: "Guardar cambios",
      loadingText: "Guardando...",
    };
  }

  return {
    title: "Nueva solución",
    description: "Registra una posible solución para reutilizarla en tickets.",
    submitText: "Guardar solución",
    loadingText: "Creando...",
  };
}

export function TicketSolucionesForm({
  form,
  onSubmit,
  isLoading,
  mode = "create",
}: TicketSolucionesFormProps) {
  const copy = getFormCopy(mode);
  const formHandlers = useAppFormHandlers(form);

  const submitHandler = formHandlers.toSubmitHandler(
    async (payload) => {
      await onSubmit(payload);
    },
    {
      trimStrings: true,
      removeUndefined: true,
    },
  );

  return (
    <AppCard variant="outline" size="sm" className="w-full">
      <AppStack gap="md">
        <AppInline align="center" gap="xs">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            <Ticket size={16} />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {copy.title}
            </h3>
            <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {copy.description}
            </p>
          </div>
        </AppInline>

        <AppForm form={form} onSubmit={submitHandler} className="space-y-4">
          <AppFormInput<CreateSolucionTicketDto>
            name="solucion"
            label="Título de la solución"
            description="Nombre corto para identificar la solución."
            placeholder="Ej: Reinicio de MikroTik"
            required
            size="xs"
            fieldWidth="full"
            leftIcon={<Ticket size={13} />}
            disabled={isLoading}
            autoComplete="off"
          />

          <AppFormTextarea<CreateSolucionTicketDto>
            name="descripcion"
            label="Descripción detallada"
            description="Describe paso a paso la solución aplicada para futuras referencias del equipo."
            placeholder="Describe paso a paso la solución aplicada..."
            required
            rows={4}
            size="xs"
            fieldWidth="full"
            disabled={isLoading}
            className="min-h-[100px] resize-y"
          />

          <AppAlert
            tone="info"
            size="xs"
            icon={<FileText size={14} />}
            title="Uso recomendado"
            description="Procura escribir soluciones claras, repetibles y útiles para otros técnicos."
          />

          <AppFormSubmit
            variant="primary"
            size="xs"
            width="full"
            leftIcon={<Save size={13} />}
            loading={isLoading}
            loadingText={copy.loadingText}
            disableWhenInvalid
          >
            {copy.submitText}
          </AppFormSubmit>
        </AppForm>
      </AppStack>
    </AppCard>
  );
}
