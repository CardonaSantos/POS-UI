"use client";

import * as React from "react";
import { IdCard, MapPinned, Phone, User } from "lucide-react";

import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import type { PersonalInfoSectionProps } from "./customer-form-types";

function PersonalSectionHeader() {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <User size={15} className="text-[hsl(var(--app-primary))]" />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Información personal
        </h3>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Datos principales de identificación y contacto.
        </p>
      </div>
    </AppInline>
  );
}

export function PersonalInfoSection({
  formData,
  onChangeForm,
}: PersonalInfoSectionProps) {
  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeForm(event);
    },
    [onChangeForm],
  );

  const handleTextareaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeForm(event);
    },
    [onChangeForm],
  );

  return (
    <AppStack gap="sm">
      <PersonalSectionHeader />

      <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
        <AppField label="Nombres" required>
          {(field) => (
            <AppInput
              id={field.id}
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombres"
              size="xs"
              fieldWidth="full"
              leftIcon={<User size={13} />}
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="given-name"
            />
          )}
        </AppField>

        <AppField label="Apellidos" required>
          {(field) => (
            <AppInput
              id={field.id}
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Apellidos"
              size="xs"
              fieldWidth="full"
              leftIcon={<User size={13} />}
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="family-name"
            />
          )}
        </AppField>

        <AppField label="Teléfono">
          {(field) => (
            <AppInput
              id={field.id}
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono"
              type="tel"
              size="xs"
              fieldWidth="full"
              leftIcon={<Phone size={13} />}
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              autoComplete="tel"
            />
          )}
        </AppField>

        <AppField label="DPI">
          {(field) => (
            <AppInput
              id={field.id}
              name="dpi"
              value={formData.dpi}
              onChange={handleInputChange}
              placeholder="DPI"
              size="xs"
              fieldWidth="full"
              leftIcon={<IdCard size={13} />}
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
              inputMode="numeric"
            />
          )}
        </AppField>

        <div className="sm:col-span-2">
          <AppField label="Dirección">
            {(field) => (
              <AppTextarea
                id={field.id}
                name="direccion"
                value={formData.direccion}
                onChange={handleTextareaChange}
                placeholder="Dirección completa"
                rows={2}
                size="xs"
                fieldWidth="full"
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                className="min-h-[58px] resize-none"
              />
            )}
          </AppField>
        </div>

        <div className="sm:col-span-2 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.16)] px-3 py-2">
          <AppInline
            align="center"
            gap="xs"
            className="text-[10.5px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          >
            <MapPinned size={13} className="shrink-0" />
            <span>
              La dirección se complementará con coordenadas, sector y referencia
              en la sección de ubicación.
            </span>
          </AppInline>
        </div>
      </AppGrid>
    </AppStack>
  );
}
