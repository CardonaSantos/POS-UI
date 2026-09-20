import type { ReactNode } from "react";
import { FilterX, RefreshCw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeAuditoriaFilters } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.filters";
import type {
  AccionAuditoriaPppoe,
  EstadoOperacionPppoe,
  OrigenOperacionPppoe,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  ACCION_AUDITORIA_OPTIONS,
  ESTADO_OPERACION_OPTIONS,
  ORDEN_OPTIONS,
  ORIGEN_OPERACION_OPTIONS,
  PAGE_SIZE_OPTIONS,
  TIPO_OPERACION_OPTIONS,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.constants";

type Props = {
  filters: InstalacionPppoeAuditoriaFilters;
  isFetching: boolean;
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;

  onTipoOperacionChange: (
    value: InstalacionPppoeAuditoriaFilters["tipoOperacion"],
  ) => void;

  onEstadoOperacionChange: (
    value: InstalacionPppoeAuditoriaFilters["estadoOperacion"],
  ) => void;

  onAccionChange: (
    value: InstalacionPppoeAuditoriaFilters["accion"],
  ) => void;

  onOrigenChange: (
    value: InstalacionPppoeAuditoriaFilters["origen"],
  ) => void;

  onFechaChange: (
    value: InstalacionPppoeAuditoriaFilters["fecha"],
  ) => void;

  onOrdenChange: (
    value: InstalacionPppoeAuditoriaFilters["ordenDireccion"],
  ) => void;

  onLimitChange: (value: number) => void;
  onClear: () => void;
  onRefresh: () => void;
};

function FilterLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AuditoriaFilters({
  filters,
  isFetching,
  hasActiveFilters,
  onSearchChange,
  onSearchDebouncedChange,
  onTipoOperacionChange,
  onEstadoOperacionChange,
  onAccionChange,
  onOrigenChange,
  onFechaChange,
  onOrdenChange,
  onLimitChange,
  onClear,
  onRefresh,
}: Props) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline
          justify="between"
          align="center"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div>
            <p className="text-xs font-semibold">Filtros de auditoría</p>
            <p className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
              La consulta se ejecuta en el servidor y reinicia la página al
              cambiar un criterio.
            </p>
          </div>

          <AppInline gap="xs" wrap>
            <AppButton
              type="button"
              variant="outline"
              size="xs"
              disabled={!hasActiveFilters}
              onClick={onClear}
            >
              <FilterX aria-hidden="true" />
              Limpiar
            </AppButton>

            <AppButton
              type="button"
              variant="outline"
              size="xs"
              loading={isFetching}
              loadingText="Actualizando..."
              onClick={onRefresh}
            >
              <RefreshCw aria-hidden="true" />
              Actualizar
            </AppButton>
          </AppInline>
        </AppInline>

        <AppSearchInput
          value={filters.search}
          onValueChange={onSearchChange}
          onDebouncedChange={onSearchDebouncedChange}
          debounceMs={400}
          isSearching={isFetching}
          placeholder="Buscar usuario, perfil, router, operador, error o descripción..."
          size="sm"
        />

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <FilterLabel label="Tipo de operación">
            <AppSingleSelect<TipoOperacionPppoe>
              value={filters.tipoOperacion}
              options={TIPO_OPERACION_OPTIONS}
              onChange={onTipoOperacionChange}
              placeholder="Todos"
              density="compact"
              size="xs"
              isSearchable={false}
            />
          </FilterLabel>

          <FilterLabel label="Estado de operación">
            <AppSingleSelect<EstadoOperacionPppoe>
              value={filters.estadoOperacion}
              options={ESTADO_OPERACION_OPTIONS}
              onChange={onEstadoOperacionChange}
              placeholder="Todos"
              density="compact"
              size="xs"
              isSearchable={false}
            />
          </FilterLabel>

          <FilterLabel label="Acción de auditoría">
            <AppSingleSelect<AccionAuditoriaPppoe>
              value={filters.accion}
              options={ACCION_AUDITORIA_OPTIONS}
              onChange={onAccionChange}
              placeholder="Todas"
              density="compact"
              size="xs"
            />
          </FilterLabel>

          <FilterLabel label="Origen">
            <AppSingleSelect<OrigenOperacionPppoe>
              value={filters.origen}
              options={ORIGEN_OPERACION_OPTIONS}
              onChange={onOrigenChange}
              placeholder="Todos"
              density="compact"
              size="xs"
              isSearchable={false}
            />
          </FilterLabel>

          <FilterLabel label="Rango de fechas">
            <AppDatePicker
              mode="range"
              value={filters.fecha}
              onChange={onFechaChange}
              outputFormat="iso"
              size="xs"
            />
          </FilterLabel>

          <FilterLabel label="Orden">
            <AppSingleSelect<"asc" | "desc">
              value={filters.ordenDireccion}
              options={ORDEN_OPTIONS}
              onChange={(value) => onOrdenChange(value ?? "desc")}
              density="compact"
              size="xs"
              isClearable={false}
              isSearchable={false}
            />
          </FilterLabel>

          <FilterLabel label="Tamaño de página">
            <AppSingleSelect<number>
              value={filters.limit}
              options={PAGE_SIZE_OPTIONS}
              onChange={(value) => onLimitChange(value ?? 10)}
              density="compact"
              size="xs"
              isClearable={false}
              isSearchable={false}
            />
          </FilterLabel>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
