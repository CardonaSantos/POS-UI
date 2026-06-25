"use client";

import * as React from "react";
import type { MultiValue, SingleValue } from "react-select";
import { Pen, Pin, Save, X } from "lucide-react";

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
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type { SelectOption } from "../ticket-detail.types";
import type { Ticket } from "../../ticketTypes";

interface DialogEditTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
  optionsLabels: SelectOption[];
  optionsTecs: SelectOption[];
  optionsCustomers: SelectOption[];
  onSubmit: (event: React.FormEvent) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onChangeCustomer: (option: SingleValue<SelectOption>) => void;
  onChangeTec: (option: SingleValue<SelectOption>) => void;
  onChangeCompanions: (options: MultiValue<SelectOption>) => void;
  onChangeLabels: (options: MultiValue<SelectOption>) => void;
  isPending?: boolean;
}

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "URGENTE", label: "Urgente" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "ABIERTA", label: "Abierta" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PENDIENTE_CLIENTE", label: "Pendiente cliente" },
  { value: "PENDIENTE_TECNICO", label: "Pendiente técnico" },
  { value: "PENDIENTE_REVISION", label: "Pendiente revisión" },
  { value: "RESUELTA", label: "Resuelta" },
  { value: "CERRADO", label: "Cerrado" },
  { value: "CANCELADA", label: "Cancelada" },
  { value: "ARCHIVADA", label: "Archivada" },
];

function findOption(options: SelectOption[], value?: string | number | null) {
  if (value === null || value === undefined) return null;

  return options.find((option) => option.value === String(value)) ?? null;
}

function getCompanionValues(ticket: Ticket) {
  return ticket.companios?.map((companion) => String(companion.id)) ?? [];
}

function getTagValues(ticket: Ticket) {
  return ticket.tags?.map((tag) => String(tag.value)) ?? [];
}

export function DialogEditTicket({
  open,
  onOpenChange,
  ticket,
  optionsLabels,
  optionsTecs,
  optionsCustomers,
  onSubmit,
  onChange,
  onSelectChange,
  onChangeCustomer,
  onChangeTec,
  onChangeCompanions,
  onChangeLabels,
  isPending,
}: DialogEditTicketProps) {
  const customerValue = ticket.customer?.id ? String(ticket.customer.id) : null;
  const assigneeValue = ticket.assignee?.id ? String(ticket.assignee.id) : null;

  const companionValues = React.useMemo(
    () => getCompanionValues(ticket),
    [ticket],
  );

  const tagValues = React.useMemo(() => getTagValues(ticket), [ticket]);

  const technicianOptions = React.useMemo(
    () =>
      optionsTecs.filter(
        (option) => option.value !== ticket.assignee?.id?.toString(),
      ),
    [optionsTecs, ticket.assignee?.id],
  );

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="2xl" viewport="tall" padding="none">
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <AppDialogHeader divider className="px-4 py-3">
            <AppDialogTitle className="flex items-center gap-2 text-sm">
              <Pen size={16} />
              Editar ticket #{ticket.id}
            </AppDialogTitle>

            <AppDialogDescription>
              Actualice la información principal, asignación, prioridad, estado
              y etiquetas del ticket.
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody
            padding="none"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <AppStack gap="sm" className="px-4 py-3">
              <AppGrid cols={{ base: 1, sm: 12 }} gap="sm">
                <div className="sm:col-span-9">
                  <AppField label="Título" required>
                    {(field) => (
                      <AppInput
                        id={field.id}
                        name="title"
                        value={ticket.title ?? ""}
                        onChange={onChange}
                        placeholder="Resumen del problema"
                        size="xs"
                        fieldWidth="full"
                        invalid={field.invalid}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        disabled={isPending}
                      />
                    )}
                  </AppField>
                </div>

                <div className="sm:col-span-3">
                  <AppField label="Fijar">
                    {(field) => (
                      <div
                        id={field.id}
                        className="flex h-8 items-center justify-between gap-2 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-2"
                      >
                        <AppInline align="center" gap="xs">
                          <Pin
                            size={13}
                            className={
                              ticket.fixed
                                ? "text-[hsl(var(--app-warning))]"
                                : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                            }
                          />
                          <span className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                            {ticket.fixed ? "Fijado" : "Normal"}
                          </span>
                        </AppInline>

                        <AppSwitch
                          checked={Boolean(ticket.fixed)}
                          onCheckedChange={(checked) =>
                            onSelectChange("fixed", String(checked))
                          }
                          disabled={isPending}
                        />
                      </div>
                    )}
                  </AppField>
                </div>
              </AppGrid>

              <AppField label="Descripción">
                {(field) => (
                  <AppTextarea
                    id={field.id}
                    name="description"
                    value={ticket.description ?? ""}
                    onChange={onChange}
                    rows={3}
                    placeholder="Detalles del requerimiento…"
                    size="xs"
                    fieldWidth="full"
                    invalid={field.invalid}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    disabled={isPending}
                    className="resize-y"
                  />
                )}
              </AppField>

              <AppGrid cols={{ base: 1, sm: 3 }} gap="sm">
                <AppField label="Cliente">
                  {(field) => (
                    <AppSingleSelect<string>
                      inputId={field.id}
                      value={customerValue}
                      selectedOption={findOption(
                        optionsCustomers,
                        customerValue,
                      )}
                      options={optionsCustomers}
                      onChange={(_, option) => onChangeCustomer(option)}
                      placeholder="Buscar cliente…"
                      isClearable
                      isSearchable
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isPending}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>

                <AppField label="Prioridad">
                  {(field) => (
                    <AppSingleSelect<string>
                      inputId={field.id}
                      value={String(ticket.priority)}
                      selectedOption={findOption(
                        PRIORITY_OPTIONS,
                        String(ticket.priority),
                      )}
                      options={PRIORITY_OPTIONS}
                      onChange={(value) => {
                        if (value) onSelectChange("priority", value);
                      }}
                      placeholder="Seleccionar"
                      isClearable={false}
                      isSearchable={false}
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isPending}
                      portalToBody
                      menuPosition="fixed"
                    />
                  )}
                </AppField>

                <AppField label="Estado">
                  {(field) => (
                    <AppSingleSelect<string>
                      inputId={field.id}
                      value={String(ticket.status)}
                      selectedOption={findOption(
                        STATUS_OPTIONS,
                        String(ticket.status),
                      )}
                      options={STATUS_OPTIONS}
                      onChange={(value) => {
                        if (value) onSelectChange("status", value);
                      }}
                      placeholder="Seleccionar"
                      isClearable={false}
                      isSearchable={false}
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isPending}
                      portalToBody
                      menuPosition="fixed"
                    />
                  )}
                </AppField>
              </AppGrid>

              <div className="h-px bg-[hsl(var(--app-border,var(--border)))]" />

              <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                <AppField label="Técnico">
                  {(field) => (
                    <AppSingleSelect<string>
                      inputId={field.id}
                      value={assigneeValue}
                      selectedOption={findOption(optionsTecs, assigneeValue)}
                      options={optionsTecs}
                      onChange={(_, option) => onChangeTec(option)}
                      placeholder="Asignar técnico…"
                      isClearable
                      isSearchable
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isPending}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="top"
                    />
                  )}
                </AppField>

                <AppField label="Acompañantes">
                  {(field) => (
                    <AppMultiSelect<string>
                      inputId={field.id}
                      value={companionValues}
                      selectedOptions={technicianOptions.filter((option) =>
                        companionValues.includes(option.value),
                      )}
                      options={technicianOptions}
                      onChange={(_, options) => onChangeCompanions(options)}
                      placeholder="Agregar…"
                      isClearable
                      isSearchable
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isPending}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="top"
                    />
                  )}
                </AppField>
              </AppGrid>

              <AppField label="Etiquetas">
                {(field) => (
                  <AppMultiSelect<string>
                    inputId={field.id}
                    value={tagValues}
                    selectedOptions={optionsLabels.filter((option) =>
                      tagValues.includes(option.value),
                    )}
                    options={optionsLabels}
                    onChange={(_, options) => onChangeLabels(options)}
                    placeholder="Etiquetar ticket…"
                    isClearable
                    isSearchable
                    size="xs"
                    density="compact"
                    fieldWidth="full"
                    invalid={field.invalid}
                    isDisabled={isPending}
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="top"
                  />
                )}
              </AppField>
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
                loadingText="Guardando..."
              >
                Guardar cambios
              </AppButton>
            </AppInline>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
