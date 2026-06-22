"use client";

import * as React from "react";
import { MessageSquare, StickyNote } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type { ObservationsSectionProps } from "./customer-form-types";

function ObservationsSectionHeader() {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <MessageSquare size={15} className="text-[hsl(var(--app-primary))]" />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Observaciones generales
        </h3>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Notas internas sobre el cliente, instalación o condiciones especiales.
        </p>
      </div>
    </AppInline>
  );
}

export function ObservationsSection({
  observaciones,
  onChangeForm,
}: ObservationsSectionProps) {
  const handleTextareaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeForm(event);
    },
    [onChangeForm],
  );

  const hasObservations = Boolean(observaciones?.trim());

  return (
    <AppStack gap="sm">
      <ObservationsSectionHeader />

      <AppField
        label="Observaciones"
        description="Este campo puede incluir referencias, notas de soporte, indicaciones técnicas o acuerdos con el cliente."
      >
        {(field) => (
          <AppTextarea
            id={field.id}
            name="observaciones"
            value={observaciones}
            onChange={handleTextareaChange}
            placeholder="Observaciones adicionales"
            rows={4}
            size="xs"
            fieldWidth="full"
            invalid={field.invalid}
            aria-invalid={field.invalid}
            aria-describedby={field.describedBy}
            className="min-h-[88px] resize-y"
          />
        )}
      </AppField>

      <AppAlert
        tone={hasObservations ? "info" : "neutral"}
        size="xs"
        icon={<StickyNote size={14} />}
        title={
          hasObservations
            ? "Observaciones agregadas"
            : "Sin observaciones adicionales"
        }
        description={
          hasObservations
            ? "Estas notas quedarán guardadas junto al registro del cliente."
            : "Puede dejar este campo vacío si no hay información extra."
        }
      />
    </AppStack>
  );
}
