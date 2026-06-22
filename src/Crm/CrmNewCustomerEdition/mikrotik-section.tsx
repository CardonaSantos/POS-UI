"use client";

import * as React from "react";
import { Router, Server, Wifi } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import type { MkConfigSectionProps } from "./customer-form-types";

function normalizeOptions(
  options: MkConfigSectionProps["optionsMikrotiks"],
): Array<AppSelectOption<number>> {
  return options.map((option) => ({
    value: Number(option.value),
    label: option.label,
  }));
}

function getMikrotikName(mikrotik: any) {
  return (
    mikrotik?.nombre ??
    mikrotik?.name ??
    mikrotik?.host ??
    mikrotik?.ip ??
    "MikroTik seleccionado"
  );
}

function MikrotikSectionHeader({ selected }: { selected: boolean }) {
  return (
    <AppInline
      align="center"
      justify="between"
      gap="sm"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <AppInline align="center" gap="xs" className="min-w-0">
        <Router size={15} className="text-[hsl(var(--app-primary))]" />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            Router MikroTik
          </h3>
          <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Router donde se registrará o sincronizará la IP del cliente.
          </p>
        </div>
      </AppInline>

      <AppBadge
        tone={selected ? "success" : "warning"}
        appearance="soft"
        size="xs"
      >
        {selected ? "Asignado" : "Pendiente"}
      </AppBadge>
    </AppInline>
  );
}

function SelectedMikrotikSummary({
  selectedMikrotik,
}: {
  selectedMikrotik: any | null;
}) {
  if (!selectedMikrotik) {
    return (
      <AppAlert
        tone="warning"
        size="xs"
        icon={<Wifi size={14} />}
        title="MikroTik pendiente"
        description="Seleccione un router antes de activar la sincronización de IP."
      />
    );
  }

  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.14)] px-3 py-2">
      <AppInline align="center" gap="xs">
        <Server size={14} className="shrink-0 text-[hsl(var(--app-primary))]" />

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {getMikrotikName(selectedMikrotik)}
          </p>
          <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Router listo para asociar configuración de red.
          </p>
        </div>
      </AppInline>
    </div>
  );
}

export function MikrotikSection({
  mkSelected,
  mikrotiks,
  optionsMikrotiks,
  onSelectMk,
}: MkConfigSectionProps) {
  const mikrotikOptions = React.useMemo(
    () => normalizeOptions(optionsMikrotiks),
    [optionsMikrotiks],
  );

  const selectedMikrotik = React.useMemo(() => {
    if (mkSelected === null || mkSelected === undefined) return null;

    return (
      mikrotiks.find((mikrotik: any) => Number(mikrotik.id) === mkSelected) ??
      null
    );
  }, [mikrotiks, mkSelected]);

  const handleMikrotikChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectMk(option ? { ...option } : null);
    },
    [onSelectMk],
  );

  return (
    <AppCard variant="outline" size="xs" className="h-full">
      <AppStack gap="sm">
        <MikrotikSectionHeader selected={Boolean(mkSelected)} />

        <AppField
          label="MikroTik asignado"
          required
          description="Seleccione el router que administrará la IP del cliente."
        >
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={mkSelected}
              options={mikrotikOptions}
              onChange={handleMikrotikChange}
              placeholder="Seleccionar router..."
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

        <SelectedMikrotikSummary selectedMikrotik={selectedMikrotik} />
      </AppStack>
    </AppCard>
  );
}
