"use client";

import * as React from "react";
import {
  CalendarClock,
  CircleDot,
  MessageSquare,
  Smartphone,
  WalletCards,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "../features/cliente-interfaces/cliente-types";
import type { StatusBillingSectionProps } from "./customer-form-types";

function toDateTimeLocalValue(value: Date | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60_000;
  const localDate = new Date(date.getTime() - offsetMs);

  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function formatEstadoClienteLabel(value: string) {
  return value.replace(/_/g, " ");
}

function normalizeOptions(
  options: StatusBillingSectionProps["optionsZonasFacturacion"],
): Array<AppSelectOption<number>> {
  return options.map((option) => ({
    value: Number(option.value),
    label: option.label,
  }));
}

const ESTADO_CLIENTE_OPTIONS: Array<AppSelectOption<EstadoCliente>> =
  Object.values(EstadoCliente).map((estado) => ({
    value: estado,
    label: formatEstadoClienteLabel(estado),
  }));

const ESTADO_COBRANZA_OPTIONS: Array<AppSelectOption<EstadoCobranzaCliente>> =
  Object.values(EstadoCobranzaCliente).map((estado) => ({
    value: estado,
    label: formatEstadoClienteLabel(estado),
  }));

function StatusBillingSectionHeader() {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <MessageSquare size={15} className="text-[hsl(var(--app-primary))]" />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Estado, notificaciones y facturación
        </h3>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Estado inicial, fecha de instalación y zona de cobro.
        </p>
      </div>
    </AppInline>
  );
}

function WhatsAppReminderPanel({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="h-full rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.16)] px-3 py-2">
      <AppInline align="center" justify="between" gap="sm" className="h-full">
        <AppInline align="center" gap="xs" className="min-w-0">
          <Smartphone
            size={14}
            className="shrink-0 text-[hsl(var(--app-primary))]"
          />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              Notificar por WhatsApp
            </p>
            <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Enviar recordatorio automático.
            </p>
          </div>
        </AppInline>

        <AppSwitch
          checked={checked}
          onCheckedChange={onChange}
          size="sm"
          aria-label="Notificar por WhatsApp"
        />
      </AppInline>
    </div>
  );
}

export function StatusBillingSection({
  formData,
  fechaInstalacion,
  zonasFacturacionSelected,
  optionsZonasFacturacion,
  onSelectEstadoCliente,
  onEnviarRecordatorioChange,
  onSelectZonaFacturacion,
  onChangeFechaInstalacion,
  onSelectEstadoCobranza,
}: StatusBillingSectionProps) {
  const zonaFacturacionOptions = React.useMemo(
    () => normalizeOptions(optionsZonasFacturacion),
    [optionsZonasFacturacion],
  );

  const fechaInstalacionValue = React.useMemo(
    () => toDateTimeLocalValue(fechaInstalacion),
    [fechaInstalacion],
  );

  const handleEstadoChange = React.useCallback(
    (value: EstadoCliente | null) => {
      if (!value) return;
      onSelectEstadoCliente(value);
    },
    [onSelectEstadoCliente],
  );

  const handleEstadoCobranzaChange = React.useCallback(
    (value: EstadoCobranzaCliente | null) => {
      if (!value) return;
      onSelectEstadoCobranza(value);
    },
    [onSelectEstadoCobranza],
  );

  const handleZonaFacturacionChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectZonaFacturacion(option ? { ...option } : null);
    },
    [onSelectZonaFacturacion],
  );

  const handleFechaInstalacionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFechaInstalacion(fromDateTimeLocalValue(event.target.value));
    },
    [onChangeFechaInstalacion],
  );

  const hasZonaFacturacion = Boolean(zonasFacturacionSelected);

  return (
    <AppStack gap="sm">
      <StatusBillingSectionHeader />

      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppField label="Estado Operativo del cliente">
          {(field) => (
            <AppSingleSelect<EstadoCliente>
              inputId={field.id}
              value={formData.estado}
              options={ESTADO_CLIENTE_OPTIONS}
              onChange={handleEstadoChange}
              placeholder="Seleccionar estado..."
              isClearable={false}
              isSearchable={false}
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

        <AppField label="Estado Cobranza">
          {(field) => (
            <AppSingleSelect<EstadoCobranzaCliente>
              inputId={field.id}
              value={formData.estadoCobranza}
              options={ESTADO_COBRANZA_OPTIONS}
              onChange={handleEstadoCobranzaChange}
              placeholder="Seleccionar estado..."
              isClearable={false}
              isSearchable={false}
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
          label="Zona de facturación"
          required
          description="Zona o ruta de cobro asignada."
        >
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={zonasFacturacionSelected}
              options={zonaFacturacionOptions}
              onChange={handleZonaFacturacionChange}
              placeholder="Seleccionar zona..."
              isClearable
              isSearchable
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

        <AppField label="Fecha instalación">
          {(field) => (
            <AppInput
              id={field.id}
              type="datetime-local"
              value={fechaInstalacionValue}
              onChange={handleFechaInstalacionChange}
              size="xs"
              fieldWidth="full"
              leftIcon={<CalendarClock size={13} />}
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>

        <div className="flex min-h-[58px] items-end">
          <WhatsAppReminderPanel
            checked={Boolean(formData.enviarRecordatorio)}
            onChange={onEnviarRecordatorioChange}
          />
        </div>
      </AppGrid>

      <AppAlert
        tone={hasZonaFacturacion ? "success" : "warning"}
        size="xs"
        icon={
          hasZonaFacturacion ? (
            <WalletCards size={14} />
          ) : (
            <CircleDot size={14} />
          )
        }
        title={
          hasZonaFacturacion
            ? "Facturación configurada"
            : "Zona de facturación pendiente"
        }
        description={
          hasZonaFacturacion
            ? "El cliente quedará asociado a una zona de cobro."
            : "Seleccione una zona antes de crear el cliente."
        }
      />
    </AppStack>
  );
}
