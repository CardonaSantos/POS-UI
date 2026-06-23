"use client";

import * as React from "react";
import { ClipboardEdit, Hash, Target } from "lucide-react";

import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import { EstadoMetaTicketEnum, type EstadoMetaTicket } from "./types";
import type { MetaTicketFormState } from "./metas-tecnicos.helpers";

type MetaTicketDialogMode = "create" | "edit";

interface MetaTicketDialogProps {
  mode: MetaTicketDialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  formData: MetaTicketFormState;
  tecnicoOptions: Array<AppSelectOption<number>>;

  isLoading?: boolean;
  disableTecnico?: boolean;

  onChangeField: <K extends keyof MetaTicketFormState>(
    field: K,
    value: MetaTicketFormState[K],
  ) => void;

  //   onSubmit: () => void | Promise<void>;
  onSubmit: () => Promise<void | null>;
}

const ESTADO_META_OPTIONS: Array<AppSelectOption<EstadoMetaTicket>> =
  Object.values(EstadoMetaTicketEnum).map((estado) => ({
    value: estado,
    label: estado.replace(/_/g, " "),
  }));

function getDialogCopy(mode: MetaTicketDialogMode) {
  if (mode === "edit") {
    return {
      title: "Editar meta",
      description: "Modifica los datos de la meta seleccionada.",
      submitText: "Actualizar meta",
      loadingText: "Actualizando...",
    };
  }

  return {
    title: "Crear nueva meta",
    description: "Define una nueva meta de tickets para un técnico.",
    submitText: "Crear meta",
    loadingText: "Creando...",
  };
}

export function MetaTicketDialog({
  mode,
  open,
  onOpenChange,
  formData,
  tecnicoOptions,
  isLoading,
  disableTecnico,
  onChangeField,
  onSubmit,
}: MetaTicketDialogProps) {
  const copy = getDialogCopy(mode);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void onSubmit();
    },
    [onSubmit],
  );

  const handleTecnicoChange = React.useCallback(
    (value: number | null) => {
      onChangeField("tecnicoId", value);
    },
    [onChangeField],
  );

  const handleTituloChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeField("titulo", event.target.value);
    },
    [onChangeField],
  );

  const handleMetaTicketsChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeField("metaTickets", event.target.value);
    },
    [onChangeField],
  );

  const handleEstadoChange = React.useCallback(
    (value: EstadoMetaTicket | null) => {
      if (!value) return;
      onChangeField("estado", value);
    },
    [onChangeField],
  );

  const handleDateRangeChange = React.useCallback(
    (value: { start?: string | null; end?: string | null }) => {
      onChangeField("fechaInicio", value.start ?? "");
      onChangeField("fechaFin", value.end ?? "");
    },
    [onChangeField],
  );

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[460px]">
        <AppDialogHeader>
          <AppDialogTitle>{copy.title}</AppDialogTitle>
          <AppDialogDescription>{copy.description}</AppDialogDescription>
        </AppDialogHeader>

        <form onSubmit={handleSubmit}>
          <AppStack gap="md">
            <AppField
              label="Técnico"
              required
              description={
                disableTecnico
                  ? "El técnico no puede modificarse al editar una meta."
                  : "Usuario técnico al que se asignará el objetivo."
              }
            >
              {(field) => (
                <AppSingleSelect<number>
                  inputId={field.id}
                  value={formData.tecnicoId}
                  options={tecnicoOptions}
                  onChange={handleTecnicoChange}
                  placeholder="Seleccionar técnico..."
                  isClearable={!disableTecnico}
                  isSearchable
                  isDisabled={disableTecnico || isLoading}
                  size="xs"
                  density="compact"
                  fieldWidth="full"
                  invalid={field.invalid}
                  portalToBody
                  menuPosition="fixed"
                  menuPlacement="auto"
                  menuShouldScrollIntoView={false}
                />
              )}
            </AppField>

            <AppField
              label="Título"
              description="Nombre descriptivo de la meta. Opcional."
            >
              {(field) => (
                <AppInput
                  id={field.id}
                  value={formData.titulo}
                  onChange={handleTituloChange}
                  placeholder="Ej: Meta enero 2026"
                  size="xs"
                  fieldWidth="full"
                  leftIcon={<ClipboardEdit size={13} />}
                  disabled={isLoading}
                  invalid={field.invalid}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                />
              )}
            </AppField>

            <AppField
              label="Período"
              required
              description="Rango de fechas en que se medirá la meta."
            >
              {() => (
                <AppDatePicker
                  mode="range"
                  value={{
                    start: formData.fechaInicio,
                    end: formData.fechaFin,
                  }}
                  onChange={handleDateRangeChange}
                  outputFormat="date"
                  disabled={isLoading}
                />
              )}
            </AppField>

            <AppGrid cols={{ base: 1, sm: mode === "edit" ? 2 : 1 }} gap="sm">
              <AppField
                label="Meta de tickets"
                required
                description="Cantidad objetivo de tickets resueltos."
              >
                {(field) => (
                  <AppInput
                    id={field.id}
                    type="number"
                    min={1}
                    value={formData.metaTickets}
                    onChange={handleMetaTicketsChange}
                    placeholder="Número de tickets objetivo"
                    size="xs"
                    fieldWidth="full"
                    leftIcon={<Hash size={13} />}
                    disabled={isLoading}
                    invalid={field.invalid}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                  />
                )}
              </AppField>

              {mode === "edit" ? (
                <AppField label="Estado de meta">
                  {(field) => (
                    <AppSingleSelect<EstadoMetaTicket>
                      inputId={field.id}
                      value={formData.estado}
                      options={ESTADO_META_OPTIONS}
                      onChange={handleEstadoChange}
                      placeholder="Estado..."
                      isClearable={false}
                      isSearchable={false}
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isLoading}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>
              ) : null}
            </AppGrid>

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
                  leftIcon={<Target size={13} />}
                  loading={isLoading}
                  loadingText={copy.loadingText}
                  disabled={isLoading}
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
