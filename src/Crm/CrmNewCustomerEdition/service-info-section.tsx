"use client";

import * as React from "react";
import { BadgeCheck, Wifi } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import type { ServiceInfoSectionProps } from "./customer-form-types";

function ServiceSectionHeader() {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <Wifi size={15} className="text-[hsl(var(--app-primary))]" />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Información del servicio
        </h3>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Plan principal de internet y servicios adicionales.
        </p>
      </div>
    </AppInline>
  );
}

function normalizeOptions(
  options: ServiceInfoSectionProps["optionsServices"],
): Array<AppSelectOption<number>> {
  return options.map((option) => ({
    value: Number(option.value),
    label: option.label,
  }));
}

export function ServiceInfoSection({
  serviceSelected,
  serviceWifiSelected,
  optionsServices,
  optionsServicesWifi,
  onSelectService,
  onSelectServiceWifi,
}: ServiceInfoSectionProps) {
  const mainServiceOptions = React.useMemo(
    () => normalizeOptions(optionsServicesWifi),
    [optionsServicesWifi],
  );

  const additionalServiceOptions = React.useMemo(
    () => normalizeOptions(optionsServices),
    [optionsServices],
  );

  const handleMainServiceChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectServiceWifi(option ? { ...option } : null);
    },
    [onSelectServiceWifi],
  );

  const handleAdditionalServicesChange = React.useCallback(
    (_values: number[], selectedOptions: Array<AppSelectOption<number>>) => {
      onSelectService(selectedOptions.map((option) => ({ ...option })));
    },
    [onSelectService],
  );

  return (
    <AppStack gap="sm">
      <ServiceSectionHeader />

      <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
        <AppField
          label="Servicio principal"
          required
          description="Plan base de internet del cliente."
        >
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={serviceWifiSelected}
              options={mainServiceOptions}
              onChange={handleMainServiceChange}
              placeholder="Seleccionar plan..."
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

        <AppField
          label="Servicios adicionales"
          description="Servicios extra asociados al cliente."
        >
          {(field) => (
            <AppMultiSelect<number>
              inputId={field.id}
              value={serviceSelected}
              options={additionalServiceOptions}
              onChange={handleAdditionalServicesChange}
              placeholder="Seleccionar servicios..."
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

        <div className="sm:col-span-2">
          <AppAlert
            tone={serviceWifiSelected ? "success" : "warning"}
            size="xs"
            title={
              serviceWifiSelected
                ? "Servicio principal seleccionado"
                : "Servicio principal pendiente"
            }
            description={
              serviceWifiSelected
                ? `Servicios adicionales seleccionados: ${serviceSelected.length}.`
                : "Seleccione un plan principal antes de crear el cliente."
            }
            icon={<BadgeCheck size={14} />}
          />
        </div>
      </AppGrid>
    </AppStack>
  );
}
