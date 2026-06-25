// components/facturacion-zona-dialogs.tsx
"use client";

import { Bell, CalendarDays, Save, Settings, Wifi } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";

import type { ZonaFormState } from "./facturacion-zona.helpers";

interface ZonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ZonaFormState;
  isLoading?: boolean;
  onPatch: (patch: Partial<ZonaFormState>) => void;
  onSubmit: () => void | Promise<void>;
}

interface ZonaFormFieldsProps extends ZonaDialogProps {
  mode: "create" | "edit";
}

function toNumber(value: string) {
  return value === "" ? 0 : Number(value);
}

function toOptionalNumber(value: string) {
  return value === "" ? null : Number(value);
}

function NumberField({
  label,
  description,
  value,
  required,
  min = 1,
  max = 31,
  onChange,
}: {
  label: string;
  description?: string;
  value: number | null | undefined;
  required?: boolean;
  min?: number;
  max?: number;
  onChange: (value: number | null) => void;
}) {
  return (
    <AppField label={label} description={description} required={required}>
      {(field) => (
        <AppInput
          id={field.id}
          type="number"
          min={min}
          max={max}
          value={value ?? ""}
          onChange={(event) => onChange(toOptionalNumber(event.target.value))}
          placeholder="Día"
          size="xs"
          fieldWidth="full"
          leftIcon={<CalendarDays size={13} />}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
          required={required}
        />
      )}
    </AppField>
  );
}

function SwitchRow({
  checked,
  label,
  description,
  disabled,
  onChange,
}: {
  checked: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <AppSwitch
      checked={checked}
      onCheckedChange={onChange}
      label={label}
      description={description}
      disabled={disabled}
      size="sm"
    />
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AppStack
      gap="sm"
      className="rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] p-3"
    >
      <AppInline align="center" gap="xs">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
          {icon}
        </span>

        <p className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          {title}
        </p>
      </AppInline>

      {children}
    </AppStack>
  );
}

function ZonaFormFields({
  // open,
  onOpenChange,
  form,
  isLoading,
  onPatch,
  onSubmit,
  mode,
}: ZonaFormFieldsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <AppStack gap="md">
        <FormSection icon={<Settings size={13} />} title="Datos generales">
          <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
            <div className="md:col-span-2">
              <AppField
                label="Nombre de la zona"
                description="Nombre visible para identificar esta zona de facturación."
                required
              >
                {(field) => (
                  <AppInput
                    id={field.id}
                    value={form.nombre}
                    onChange={(event) =>
                      onPatch({ nombre: event.target.value })
                    }
                    placeholder="Ej: Zona Centro"
                    size="xs"
                    fieldWidth="full"
                    leftIcon={<Wifi size={13} />}
                    disabled={isLoading}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    autoComplete="off"
                    required
                  />
                )}
              </AppField>
            </div>

            <NumberField
              label="Día de corte"
              description="Día del mes en que se realiza el corte."
              value={form.diaCorte}
              onChange={(value) => onPatch({ diaCorte: value })}
            />

            <NumberField
              label="Suspender tras facturas"
              description="Facturas pendientes antes de suspender."
              value={form.suspenderTrasFacturas}
              min={1}
              max={12}
              onChange={(value) => onPatch({ suspenderTrasFacturas: value })}
            />
          </AppGrid>
        </FormSection>

        <FormSection icon={<CalendarDays size={13} />} title="Ciclo de cobro">
          <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
            <NumberField
              label="Generación de factura"
              description="Día en que se genera la factura."
              value={form.diaGeneracionFactura}
              required
              onChange={(value) =>
                onPatch({ diaGeneracionFactura: toNumber(String(value ?? "")) })
              }
            />

            <SwitchRow
              checked={Boolean(form.enviarRecordatorioGeneracion)}
              label="Aviso de generación"
              description="Enviar aviso cuando se genere la factura."
              disabled={isLoading}
              onChange={(checked) =>
                onPatch({ enviarRecordatorioGeneracion: checked })
              }
            />

            <NumberField
              label="Día de pago"
              description="Día límite o esperado de pago."
              value={form.diaPago}
              required
              onChange={(value) =>
                onPatch({ diaPago: toNumber(String(value ?? "")) })
              }
            />

            <SwitchRow
              checked={Boolean(form.enviarAvisoPago)}
              label="Aviso de pago"
              description="Enviar recordatorio de pago."
              disabled={isLoading}
              onChange={(checked) => onPatch({ enviarAvisoPago: checked })}
            />

            <NumberField
              label="Primer recordatorio"
              description="Día del primer recordatorio."
              value={form.diaRecordatorio}
              required
              onChange={(value) =>
                onPatch({ diaRecordatorio: toNumber(String(value ?? "")) })
              }
            />

            <SwitchRow
              checked={Boolean(form.enviarRecordatorio1)}
              label="Enviar primer recordatorio"
              disabled={isLoading}
              onChange={(checked) => onPatch({ enviarRecordatorio1: checked })}
            />

            <NumberField
              label="Segundo recordatorio"
              description="Día del segundo recordatorio."
              value={form.diaSegundoRecordatorio}
              required
              onChange={(value) =>
                onPatch({
                  diaSegundoRecordatorio: toNumber(String(value ?? "")),
                })
              }
            />

            <SwitchRow
              checked={Boolean(form.enviarRecordatorio2)}
              label="Enviar segundo recordatorio"
              disabled={isLoading}
              onChange={(checked) => onPatch({ enviarRecordatorio2: checked })}
            />
          </AppGrid>
        </FormSection>

        <FormSection icon={<Bell size={13} />} title="Canales y recordatorios">
          <AppGrid cols={{ base: 1, sm: 2, md: 3 }} gap="sm">
            <SwitchRow
              checked={Boolean(form.enviarRecordatorio)}
              label="Recordatorios activos"
              description="Control general de recordatorios."
              disabled={isLoading}
              onChange={(checked) => onPatch({ enviarRecordatorio: checked })}
            />

            <SwitchRow
              checked={Boolean(form.whatsapp)}
              label="WhatsApp"
              disabled={isLoading}
              onChange={(checked) => onPatch({ whatsapp: checked })}
            />

            <SwitchRow
              checked={Boolean(form.email)}
              label="Email"
              disabled={isLoading}
              onChange={(checked) => onPatch({ email: checked })}
            />

            <SwitchRow
              checked={Boolean(form.sms)}
              label="SMS"
              disabled={isLoading}
              onChange={(checked) => onPatch({ sms: checked })}
            />

            <SwitchRow
              checked={Boolean(form.llamada)}
              label="Llamada"
              disabled={isLoading}
              onChange={(checked) => onPatch({ llamada: checked })}
            />

            <SwitchRow
              checked={Boolean(form.telegram)}
              label="Telegram"
              disabled={isLoading}
              onChange={(checked) => onPatch({ telegram: checked })}
            />
          </AppGrid>
        </FormSection>

        <AppInline align="center" justify="end" gap="xs" className="pt-1">
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
            loadingText={mode === "edit" ? "Guardando..." : "Creando..."}
            disabled={isLoading}
          >
            {mode === "edit" ? "Guardar cambios" : "Crear zona"}
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}

export function CreateZonaDialog({
  open,
  onOpenChange,
  form,
  isLoading,
  onPatch,
  onSubmit,
}: ZonaDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[860px]">
        <AppDialogHeader>
          <AppDialogTitle>Nueva zona de facturación</AppDialogTitle>
          <AppDialogDescription>
            Configure los parámetros de cobro, recordatorios y canales de aviso.
          </AppDialogDescription>
        </AppDialogHeader>

        <ZonaFormFields
          open={open}
          onOpenChange={onOpenChange}
          form={form}
          isLoading={isLoading}
          onPatch={onPatch}
          onSubmit={onSubmit}
          mode="create"
        />
      </AppDialogContent>
    </AppDialog>
  );
}

export function EditZonaDialog({
  open,
  onOpenChange,
  form,
  isLoading,
  onPatch,
  onSubmit,
}: ZonaDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[860px]">
        <AppDialogHeader>
          <AppDialogTitle>Editar zona de facturación</AppDialogTitle>
          <AppDialogDescription>
            Modifique los parámetros de la zona seleccionada.
          </AppDialogDescription>
        </AppDialogHeader>

        <ZonaFormFields
          open={open}
          onOpenChange={onOpenChange}
          form={form}
          isLoading={isLoading}
          onPatch={onPatch}
          onSubmit={onSubmit}
          mode="edit"
        />
      </AppDialogContent>
    </AppDialog>
  );
}
