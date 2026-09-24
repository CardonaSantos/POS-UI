import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import {
  AppSingleSelect,
  type AppSelectOption,
} from "@/components/app/primitives/app-single-select";

import type { EstadoTrackingTecnico } from "@/Crm/features/real-time-location/tracking.interfaces";
import type { TrackingHistoryFiltersState } from "@/Crm/features/real-time-location/tracking.filters";

const ESTADO_OPTIONS: Array<AppSelectOption<EstadoTrackingTecnico>> = [
  { value: "ACTIVA", label: "Con sesión activa" },
  { value: "FINALIZADA", label: "Con sesión finalizada" },
  { value: "EXPIRADA", label: "Con sesión expirada" },
];

type TecnicoOption = AppSelectOption<number>;

type TrackingHistoryFiltersProps = {
  search: string;
  filters: TrackingHistoryFiltersState;
  tecnicoOptions: TecnicoOption[];
  isLoadingTecnicos?: boolean;
  isSearching?: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onDebouncedSearchChange: (value: string) => void;
  onFilterChange: <TKey extends keyof TrackingHistoryFiltersState>(
    key: TKey,
    value: TrackingHistoryFiltersState[TKey],
  ) => void;
  onClear: () => void;
};

export function TrackingHistoryFilters({
  search,
  filters,
  tecnicoOptions,
  isLoadingTecnicos = false,
  isSearching = false,
  hasActiveFilters,
  onSearchChange,
  onDebouncedSearchChange,
  onFilterChange,
  onClear,
}: TrackingHistoryFiltersProps) {
  return (
    <AppCard size="xs" variant="outline" className="p-2">
      <AppGrid cols={{ base: 1, md: 2, xl: 6 }} gap="sm">
        <div className="md:col-span-2">
          <AppSearchInput
            value={search}
            onValueChange={onSearchChange}
            onDebouncedChange={onDebouncedSearchChange}
            debounceMs={450}
            placeholder="Buscar técnico por nombre, correo o teléfono"
            aria-label="Buscar jornadas de técnicos"
            isSearching={isSearching}
            clearable
          />
        </div>

        <AppField label="Técnico">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.tecnicoId}
              options={tecnicoOptions}
              onChange={(value) => onFilterChange("tecnicoId", value)}
              placeholder="Todos"
              noOptionsText="Sin técnicos"
              isLoading={isLoadingTecnicos}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Estado de sesión">
          {(fieldUi) => (
            <AppSingleSelect<EstadoTrackingTecnico>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.estadoSesion}
              options={ESTADO_OPTIONS}
              onChange={(value) => onFilterChange("estadoSesion", value)}
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <div className="md:col-span-2">
          <AppField label="Fecha de jornada">
            <AppDatePicker
              mode="range"
              value={filters.fecha}
              onChange={(value) => onFilterChange("fecha", value)}
              outputFormat="YYYY-MM-DD"
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
