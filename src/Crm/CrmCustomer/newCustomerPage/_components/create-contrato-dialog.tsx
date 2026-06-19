"use client";

import * as React from "react";
import { Banknote, CalendarDays, FileText, Save, X } from "lucide-react";

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
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

export interface Contrato {
  clienteId: number;
  fechaInstalacionProgramada: string;
  costoInstalacion: number;
  fechaPago: string;
  observaciones: string;
  ssid: string;
  wifiPassword: string;
}

type SetContratoField = <K extends keyof Contrato>(
  key: K,
  value: Contrato[K],
) => void;

interface CreateContratoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataContrato: Contrato;
  setContratoField: SetContratoField;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateContratoDialog({
  open,
  onOpenChange,
  dataContrato,
  setContratoField,
  isLoading,
  onSubmit,
}: CreateContratoDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="lg" viewport="default" padding="sm">
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <AppDialogHeader divider>
            <AppDialogTitle className="flex items-center gap-2">
              <FileText size={16} />
              Crear nuevo contrato
            </AppDialogTitle>

            <AppDialogDescription>
              Complete la información para generar un contrato para este
              cliente.
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody padding="sm">
            <AppStack gap="sm">
              <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                <AppField label="Fecha de instalación" required>
                  {(field) => (
                    <AppInput
                      id={field.id}
                      type="date"
                      value={dataContrato.fechaInstalacionProgramada}
                      onChange={(event) =>
                        setContratoField(
                          "fechaInstalacionProgramada",
                          event.target.value,
                        )
                      }
                      leftIcon={<CalendarDays size={14} />}
                      size="sm"
                      fieldWidth="full"
                      invalid={field.invalid}
                      aria-invalid={field.invalid}
                      aria-describedby={field.describedBy}
                      required
                    />
                  )}
                </AppField>

                <AppField label="Fecha de pago" required>
                  {(field) => (
                    <AppInput
                      id={field.id}
                      type="date"
                      value={dataContrato.fechaPago}
                      onChange={(event) =>
                        setContratoField("fechaPago", event.target.value)
                      }
                      leftIcon={<CalendarDays size={14} />}
                      size="sm"
                      fieldWidth="full"
                      invalid={field.invalid}
                      aria-invalid={field.invalid}
                      aria-describedby={field.describedBy}
                      required
                    />
                  )}
                </AppField>
              </AppGrid>

              <AppField label="Costo de instalación" required>
                {(field) => (
                  <AppInput
                    id={field.id}
                    type="number"
                    min={0}
                    step="0.01"
                    value={dataContrato.costoInstalacion}
                    onChange={(event) =>
                      setContratoField(
                        "costoInstalacion",
                        Number(event.target.value || 0),
                      )
                    }
                    leftIcon={<Banknote size={14} />}
                    placeholder="0.00"
                    size="sm"
                    fieldWidth="full"
                    invalid={field.invalid}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    required
                  />
                )}
              </AppField>

              <AppField label="Observaciones">
                {(field) => (
                  <AppTextarea
                    id={field.id}
                    value={dataContrato.observaciones}
                    onChange={(event) =>
                      setContratoField("observaciones", event.target.value)
                    }
                    placeholder="Observaciones adicionales sobre el contrato..."
                    rows={3}
                    size="sm"
                    fieldWidth="full"
                    invalid={field.invalid}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                  />
                )}
              </AppField>
            </AppStack>
          </AppDialogBody>

          <AppDialogFooter divider>
            <AppInline gap="xs" justify="end" className="w-full">
              <AppButton
                type="button"
                variant="secondary"
                size="sm"
                width="auto"
                leftIcon={<X size={14} />}
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                variant="primary"
                size="sm"
                width="auto"
                leftIcon={<Save size={14} />}
                loading={isLoading}
                loadingText="Creando..."
              >
                Crear contrato
              </AppButton>
            </AppInline>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
