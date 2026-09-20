import { memo } from "react";
import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDatePicker,
  type AppDateRangeValue,
} from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

import {
  DESINSTALACION_ESTADO_OPTIONS,
  DESINSTALACION_MOTIVO_OPTIONS,
  DESINSTALACION_TIPO_OPTIONS,
} from "./filters/desinstalaciones-list.options";
import { DesinstalacionesListFiltersState } from "./filters/desinstalaciones-list-filters";

type DesinstalacionesFilterChangeHandler = <
  TKey extends keyof DesinstalacionesListFiltersState,
>(
  key: TKey,
  value: DesinstalacionesListFiltersState[TKey],
) => void;

type DesinstalacionesListFiltersProps = {
  search: string;

  filters: DesinstalacionesListFiltersState;

  isSearching?: boolean;

  hasActiveFilters?: boolean;

  onSearchChange: (value: string) => void;

  onDebouncedSearchChange: (value: string) => void;

  onFilterChange: DesinstalacionesFilterChangeHandler;

  onClear: () => void;
};

export const DesinstalacionesListFilters = memo(
  function DesinstalacionesListFilters({
    search,

    filters,

    isSearching = false,

    hasActiveFilters = false,

    onSearchChange,

    onDebouncedSearchChange,

    onFilterChange,

    onClear,
  }: DesinstalacionesListFiltersProps) {
    return (
      <AppStack gap="xs">
        {/*
         * ====================================================
         * FILTROS PRINCIPALES
         * ====================================================
         */}
        <AppGrid
          cols={{
            base: 1,
            md: 2,
            xl: 4,
          }}
          gap="xs"
          align="end"
        >
          <AppField label="Buscar">
            {(field) => (
              <AppSearchInput
                id={field.id}
                value={search}
                onValueChange={onSearchChange}
                onDebouncedChange={onDebouncedSearchChange}
                isSearching={isSearching}
                placeholder="Cliente, teléfono, dirección..."
                wrapperWidth="full"
                clearable
              />
            )}
          </AppField>

          <AppField label="Estado">
            {(field) => (
              <AppSingleSelect<EstadoDesinstalacionCliente>
                inputId={field.id}
                value={filters.estado}
                options={DESINSTALACION_ESTADO_OPTIONS}
                onChange={(value) => onFilterChange("estado", value)}
                placeholder="Todos los estados"
                density="compact"
                isSearchable={false}
                isClearable
              />
            )}
          </AppField>

          <AppField label="Tipo">
            {(field) => (
              <AppSingleSelect<TipoDesinstalacionCliente>
                inputId={field.id}
                value={filters.tipo}
                options={DESINSTALACION_TIPO_OPTIONS}
                onChange={(value) => onFilterChange("tipo", value)}
                placeholder="Todos los tipos"
                density="compact"
                isSearchable={false}
                isClearable
              />
            )}
          </AppField>

          <AppField label="Motivo">
            {(field) => (
              <AppSingleSelect<MotivoDesinstalacionCliente>
                inputId={field.id}
                value={filters.motivo}
                options={DESINSTALACION_MOTIVO_OPTIONS}
                onChange={(value) => onFilterChange("motivo", value)}
                placeholder="Todos los motivos"
                density="compact"
                isSearchable={false}
                isClearable
              />
            )}
          </AppField>
        </AppGrid>

        {/*
         * ====================================================
         * FILTROS DE FECHA
         * ====================================================
         */}
        <AppGrid
          cols={{
            base: 1,
            lg: 2,
          }}
          gap="xs"
          align="end"
        >
          <AppField label="Fecha programada">
            <AppDatePicker
              mode="range"
              value={filters.fechaProgramada}
              onChange={(value: AppDateRangeValue) =>
                onFilterChange("fechaProgramada", value)
              }
              outputFormat="iso"
              size="sm"
              fieldWidth="full"
            />
          </AppField>

          <AppField label="Fecha de finalización">
            <AppDatePicker
              mode="range"
              value={filters.fechaFinalizacion}
              onChange={(value: AppDateRangeValue) =>
                onFilterChange("fechaFinalizacion", value)
              }
              outputFormat="iso"
              size="sm"
              fieldWidth="full"
            />
          </AppField>
        </AppGrid>

        {/*
         * ====================================================
         * ACCIONES
         * ====================================================
         */}
        <AppInline justify="end" align="center" gap="xs">
          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            disabled={!hasActiveFilters}
            onClick={onClear}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Limpiar filtros
          </AppButton>
        </AppInline>
      </AppStack>
    );
  },
);
