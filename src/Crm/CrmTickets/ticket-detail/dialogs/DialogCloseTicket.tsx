"use client";

import * as React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { CheckCircle2, Save, X } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import type { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";

export interface TicketResumenSchemaType {
  ticketId: number;
  solucionId: number | null;
  resueltoComo: string | null;
  notasInternas: string | null;
}

interface DialogCloseTicketProps {
  open: boolean;
  ticketId: number;
  soluciones: SolucionTicketItem[];
  form: UseFormReturn<TicketResumenSchemaType>;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketResumenSchemaType) => void;
}

function getFieldError(error: { message?: unknown } | undefined) {
  return typeof error?.message === "string" ? error.message : undefined;
}

export function DialogCloseTicket({
  open,
  ticketId,
  soluciones,
  form,
  isPending = false,
  onOpenChange,
  onSubmit,
}: DialogCloseTicketProps) {
  const errors = form.formState.errors;

  const optionsSoluciones = React.useMemo<Array<AppSelectOption<number>>>(
    () =>
      soluciones.map((solucion) => ({
        label: solucion.solucion,
        value: solucion.id,
      })),
    [soluciones],
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (isPending) return;
      onOpenChange(nextOpen);
    },
    [isPending, onOpenChange],
  );

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="md" viewport="default" padding="none">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <AppDialogHeader divider className="px-4 py-3">
            <AppDialogTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} />
              Cerrar ticket #{ticketId}
            </AppDialogTitle>

            <AppDialogDescription>
              Registre la solución aplicada y las notas finales del ticket.
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody
            padding="none"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <AppStack gap="sm" className="px-4 py-3">
              <input
                type="hidden"
                {...form.register("ticketId", { valueAsNumber: true })}
              />

              <AppAlert
                tone="info"
                size="sm"
                icon={<CheckCircle2 size={15} />}
                title="Cierre de ticket"
              >
                Al confirmar, el ticket quedará registrado como cerrado con el
                resumen de solución indicado.
              </AppAlert>

              <Controller
                control={form.control}
                name="solucionId"
                render={({ field }) => (
                  <AppField
                    label="Tipo de solución"
                    error={getFieldError(errors.solucionId)}
                  >
                    {(appField) => (
                      <AppSingleSelect<number>
                        inputId={appField.id}
                        value={field.value ?? null}
                        options={optionsSoluciones}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        placeholder="Selecciona una solución…"
                        isClearable
                        isSearchable
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={appField.invalid}
                        isDisabled={isPending}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>
                )}
              />

              <Controller
                control={form.control}
                name="resueltoComo"
                render={({ field }) => (
                  <AppField
                    label="Resumen de solución"
                    description="Visible en el reporte final."
                    error={getFieldError(errors.resueltoComo)}
                  >
                    {(appField) => (
                      <AppTextarea
                        id={appField.id}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        rows={3}
                        placeholder="Ej: Se reinició el router y se validó la IP…"
                        size="xs"
                        fieldWidth="full"
                        invalid={appField.invalid}
                        aria-invalid={appField.invalid}
                        aria-describedby={appField.describedBy}
                        disabled={isPending}
                        className="resize-none"
                      />
                    )}
                  </AppField>
                )}
              />

              <Controller
                control={form.control}
                name="notasInternas"
                render={({ field }) => (
                  <AppField
                    label="Notas internas"
                    description="Información técnica solo para el equipo."
                    error={getFieldError(errors.notasInternas)}
                  >
                    {(appField) => (
                      <AppTextarea
                        id={appField.id}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        rows={2}
                        placeholder="Detalles técnicos solo para el equipo…"
                        size="xs"
                        fieldWidth="full"
                        invalid={appField.invalid}
                        aria-invalid={appField.invalid}
                        aria-describedby={appField.describedBy}
                        disabled={isPending}
                        className="resize-none"
                      />
                    )}
                  </AppField>
                )}
              />
            </AppStack>
          </AppDialogBody>

          <AppDialogFooter divider className="px-4 py-2.5">
            <AppInline justify="end" gap="xs" className="w-full">
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="auto"
                leftIcon={<X size={14} />}
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                variant="primary"
                size="xs"
                width="auto"
                leftIcon={<Save size={14} />}
                loading={isPending}
                loadingText="Cerrando..."
              >
                Confirmar cierre
              </AppButton>
            </AppInline>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
