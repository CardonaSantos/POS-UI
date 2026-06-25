"use client";

import * as React from "react";
import {
  Building2,
  Calendar,
  Clock,
  Info,
  MapPin,
  Save,
  Users,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
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
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type {
  Municipio,
  Sector,
} from "../../features/cliente-interfaces/cliente-types";
import type { AppOption, SectorFormState } from "./sector.helpers";
import { formattShortFecha } from "@/utils/formattFechas";

interface SectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: SectorFormState;
  departamentoOptions: AppOption[];
  municipioOptions: AppOption[];
  isLoading?: boolean;
  onPatch: (patch: Partial<SectorFormState>) => void;
  onDepartamentoChange: (departamentoId: string | null) => void | Promise<void>;
  onMunicipioChange: (municipioId: string | null) => void;
  onSubmit: () => void | Promise<void>;
}

interface SectorFormFieldsProps extends SectorDialogProps {
  mode: "create" | "edit";
}

interface SectorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sector: Sector | null;
  municipio?: Municipio | null;
}

function FormSection({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppCard variant="outline" size="xs" className={className}>
      <AppStack gap="sm">
        <AppInline align="center" gap="xs">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
              {title}
            </p>

            {description ? (
              <p className="text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {description}
              </p>
            ) : null}
          </div>
        </AppInline>

        {children}
      </AppStack>
    </AppCard>
  );
}

function SectorFormFields({
  form,
  departamentoOptions,
  municipioOptions,
  isLoading,
  onOpenChange,
  onPatch,
  onDepartamentoChange,
  onMunicipioChange,
  onSubmit,
  mode,
}: SectorFormFieldsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <AppStack gap="md">
        <AppGrid cols={{ base: 1, lg: 12 }} gap="sm">
          <FormSection
            icon={<MapPin size={13} />}
            title="Datos del sector"
            description="Nombre y descripción interna."
            className="p-3 lg:col-span-7"
          >
            <AppStack gap="sm">
              <AppField
                label="Nombre"
                description="Nombre comercial o interno del sector."
                required
              >
                {(field) => (
                  <AppInput
                    id={field.id}
                    value={form.nombre}
                    onChange={(event) =>
                      onPatch({ nombre: event.target.value })
                    }
                    placeholder="Ej: Sector Norte"
                    size="xs"
                    fieldWidth="full"
                    leftIcon={<MapPin size={13} />}
                    disabled={isLoading}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    autoComplete="off"
                    required
                  />
                )}
              </AppField>

              <AppField
                label="Descripción"
                description="Detalle opcional para identificar mejor el sector."
              >
                {(field) => (
                  <AppTextarea
                    id={field.id}
                    value={form.descripcion ?? ""}
                    onChange={(event) =>
                      onPatch({ descripcion: event.target.value })
                    }
                    placeholder="Descripción del sector"
                    size="xs"
                    fieldWidth="full"
                    disabled={isLoading}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    className="min-h-[132px] resize-y"
                  />
                )}
              </AppField>
            </AppStack>
          </FormSection>

          <FormSection
            icon={<Building2 size={13} />}
            title="Ubicación"
            description="Departamento y municipio asociado."
            className="p-3 lg:col-span-5"
          >
            <AppStack gap="sm">
              <AppField
                label="Departamento"
                description="Seleccione el departamento para cargar municipios."
              >
                {(field) => (
                  <AppSingleSelect<string>
                    inputId={field.id}
                    value={form.departamentoId ?? null}
                    options={departamentoOptions}
                    onChange={(value) => {
                      void onDepartamentoChange(value ?? null);
                    }}
                    placeholder="Seleccione un departamento"
                    size="xs"
                    fieldWidth="full"
                    isClearable
                    isDisabled={isLoading}
                    invalid={field.invalid}
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                  />
                )}
              </AppField>

              <AppField
                label="Municipio"
                description="Municipio al que pertenece el sector."
                required
              >
                {(field) => (
                  <AppSingleSelect<string>
                    inputId={field.id}
                    value={form.municipioId || null}
                    options={municipioOptions}
                    onChange={(value) => onMunicipioChange(value ?? null)}
                    placeholder={
                      form.departamentoId
                        ? "Seleccione un municipio"
                        : "Seleccione primero un departamento"
                    }
                    size="xs"
                    fieldWidth="full"
                    isDisabled={isLoading || !form.departamentoId}
                    invalid={field.invalid}
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                  />
                )}
              </AppField>

              <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.25] p-3 text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Al cambiar el departamento, se limpia el municipio seleccionado
                y se recargan las opciones.
              </div>
            </AppStack>
          </FormSection>
        </AppGrid>

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
            {mode === "edit" ? "Guardar cambios" : "Crear sector"}
          </AppButton>
        </AppInline>
      </AppStack>
    </form>
  );
}

export function CreateSectorDialog({
  open,
  onOpenChange,
  form,
  departamentoOptions,
  municipioOptions,
  isLoading,
  onPatch,
  onDepartamentoChange,
  onMunicipioChange,
  onSubmit,
}: SectorDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[920px]">
        <AppDialogHeader>
          <AppDialogTitle>Crear nuevo sector</AppDialogTitle>
          <AppDialogDescription>
            Registre un sector y asígnelo a un municipio.
          </AppDialogDescription>
        </AppDialogHeader>

        <SectorFormFields
          open={open}
          onOpenChange={onOpenChange}
          form={form}
          departamentoOptions={departamentoOptions}
          municipioOptions={municipioOptions}
          isLoading={isLoading}
          onPatch={onPatch}
          onDepartamentoChange={onDepartamentoChange}
          onMunicipioChange={onMunicipioChange}
          onSubmit={onSubmit}
          mode="create"
        />
      </AppDialogContent>
    </AppDialog>
  );
}

export function EditSectorDialog({
  open,
  onOpenChange,
  form,
  departamentoOptions,
  municipioOptions,
  isLoading,
  onPatch,
  onDepartamentoChange,
  onMunicipioChange,
  onSubmit,
}: SectorDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[760px]">
        <AppDialogHeader>
          <AppDialogTitle>Editar sector</AppDialogTitle>
          <AppDialogDescription>
            Actualice la información del sector seleccionado.
          </AppDialogDescription>
        </AppDialogHeader>

        <SectorFormFields
          open={open}
          onOpenChange={onOpenChange}
          form={form}
          departamentoOptions={departamentoOptions}
          municipioOptions={municipioOptions}
          isLoading={isLoading}
          onPatch={onPatch}
          onDepartamentoChange={onDepartamentoChange}
          onMunicipioChange={onMunicipioChange}
          onSubmit={onSubmit}
          mode="edit"
        />
      </AppDialogContent>
    </AppDialog>
  );
}

function DetailInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <AppCard variant="outline" size="xs" className="p-3">
      <AppStack gap="xs">
        <AppInline align="center" gap="xs">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {icon}
          </span>

          <p className="text-[11px] font-medium leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </p>
        </AppInline>

        <div className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          {value}
        </div>
      </AppStack>
    </AppCard>
  );
}

export function SectorDetailsDialog({
  open,
  onOpenChange,
  sector,
  municipio,
}: SectorDetailsDialogProps) {
  if (!sector) return null;

  const municipioNombre =
    sector.municipio?.nombre ?? municipio?.nombre ?? "Sin municipio";

  const clientes = sector.clientes ?? [];

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[820px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline align="center" gap="xs">
              <MapPin size={16} />
              <span>{sector.nombre}</span>
            </AppInline>
          </AppDialogTitle>
          <AppDialogDescription>
            Detalle del sector, ubicación y clientes asociados.
          </AppDialogDescription>
        </AppDialogHeader>
        <AppStack gap="md">
          <AppGrid cols={{ base: 1, lg: 12 }} gap="sm">
            <FormSection
              icon={<Info size={13} />}
              title="Resumen"
              description="Identificación y ubicación del sector."
              className="p-3 lg:col-span-5"
            >
              <AppStack gap="sm">
                <AppInline align="center" gap="xs" wrap>
                  <AppBadge tone="neutral" appearance="soft" size="xs">
                    ID: {sector.id}
                  </AppBadge>

                  <AppBadge tone="info" appearance="soft" size="xs">
                    <Building2 size={12} />
                    {municipioNombre}
                  </AppBadge>

                  <AppBadge tone="primary" appearance="soft" size="xs">
                    <Users size={12} />
                    {clientes.length} clientes
                  </AppBadge>
                </AppInline>

                <div className="rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))/0.35] p-3 text-xs leading-5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {sector.descripcion ||
                    "No hay descripción disponible para este sector."}
                </div>
              </AppStack>
            </FormSection>

            <FormSection
              icon={<Calendar size={13} />}
              title="Fechas"
              description="Historial de creación y actualización."
              className="p-3 lg:col-span-7"
            >
              <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                <DetailInfoCard
                  icon={<Calendar size={13} />}
                  label="Fecha de creación"
                  value={formattShortFecha(sector.creadoEn)}
                />

                <DetailInfoCard
                  icon={<Clock size={13} />}
                  label="Última actualización"
                  value={formattShortFecha(sector.actualizadoEn)}
                />
              </AppGrid>
            </FormSection>

            <FormSection
              icon={<Users size={13} />}
              title="Clientes en este sector"
              description={
                clientes.length > 0
                  ? "Clientes asociados actualmente."
                  : "No hay clientes asociados."
              }
              className="p-3 lg:col-span-12"
            >
              {clientes.length > 0 ? (
                <div className="overflow-x-auto rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))]">
                  <table className="w-full min-w-[520px] text-xs">
                    <thead className="bg-[hsl(var(--app-muted,var(--muted)))/0.45]">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                          Nombre
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                          Dirección
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[hsl(var(--app-border,var(--border)))]">
                      {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                          <td className="px-3 py-2 tabular-nums text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                            {cliente.id}
                          </td>
                          <td className="px-3 py-2 font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
                            {cliente.nombre}
                          </td>
                          <td className="px-3 py-2 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                            {cliente.direccion ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-6 text-center text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  Este sector todavía no tiene clientes asignados.
                </div>
              )}
            </FormSection>
          </AppGrid>

          <AppInline align="center" justify="end">
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </AppButton>
          </AppInline>
        </AppStack>
      </AppDialogContent>
    </AppDialog>
  );
}
