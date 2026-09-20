import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";

import type {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";

import type { InstalacionesListFiltersState } from "./instalaciones-list.filters";
import {
  INSTALACION_ESTADO_OPTIONS,
  INSTALACION_TIPO_OPTIONS,
} from "./options";
type NumericSelectOption = {
  value: number;
  label: string;
};

type InstalacionesListFiltersProps = {
  search: string;

  filters: InstalacionesListFiltersState;

  asesorOptions: NumericSelectOption[];
  servicioOptions: NumericSelectOption[];

  isLoadingAsesores?: boolean;
  isLoadingServicios?: boolean;
  isSearching?: boolean;

  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onDebouncedSearchChange: (value: string) => void;

  onFilterChange: <TKey extends keyof InstalacionesListFiltersState>(
    key: TKey,
    value: InstalacionesListFiltersState[TKey],
  ) => void;

  onClear: () => void;
};

export function InstalacionesListFilters({
  search,
  filters,

  isSearching = false,
  hasActiveFilters,

  onSearchChange,
  onDebouncedSearchChange,
  onFilterChange,
  onClear,

  asesorOptions,
  servicioOptions,
  isLoadingAsesores,
  isLoadingServicios,
}: InstalacionesListFiltersProps) {
  return (
    <AppCard size="xs" variant="outline" className="p-2">
      <AppGrid
        cols={{
          base: 1,
          md: 2,
          xl: 6,
        }}
        gap="sm"
      >
        <div className="md:col-span-2">
          <AppSearchInput
            value={search}
            onValueChange={onSearchChange}
            onDebouncedChange={onDebouncedSearchChange}
            debounceMs={450}
            placeholder="Buscar por cliente, teléfono, DPI, dirección o referencia"
            aria-label="Buscar instalaciones"
            isSearching={isSearching}
            clearable
          />
        </div>

        <AppField label="Estado">
          {(fieldUi) => (
            <AppSingleSelect<EstadoInstalacionCliente>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.estado}
              options={INSTALACION_ESTADO_OPTIONS}
              onChange={(value) => onFilterChange("estado", value)}
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Tipo">
          {(fieldUi) => (
            <AppSingleSelect<TipoInstalacionCliente>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.tipo}
              options={INSTALACION_TIPO_OPTIONS}
              onChange={(value) => onFilterChange("tipo", value)}
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Servicio">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.servicioInternetId}
              options={servicioOptions}
              onChange={(value) => onFilterChange("servicioInternetId", value)}
              placeholder="Todos los servicios"
              noOptionsText="No hay servicios"
              isLoading={isLoadingServicios}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Asesor">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.asesorId}
              options={asesorOptions}
              onChange={(value) => onFilterChange("asesorId", value)}
              placeholder="Todos los asesores"
              noOptionsText="No hay usuarios"
              isLoading={isLoadingAsesores}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <div className="md:col-span-2 xl:col-span-3">
          <AppField label="Fecha programada">
            <AppDatePicker
              mode="range"
              value={filters.fechaProgramada}
              onChange={(value) => onFilterChange("fechaProgramada", value)}
              outputFormat="iso"
            />
          </AppField>
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <AppField label="Fecha de finalización">
            <AppDatePicker
              mode="range"
              value={filters.fechaFinalizacion}
              onChange={(value) => onFilterChange("fechaFinalizacion", value)}
              outputFormat="iso"
            />
          </AppField>
        </div>
      </AppGrid>

      <AppInline justify="end" gap="sm" fullWidth className="mt-2">
        <AppButton
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasActiveFilters}
          onClick={onClear}
        >
          Limpiar filtros
        </AppButton>
      </AppInline>
    </AppCard>
  );
}
