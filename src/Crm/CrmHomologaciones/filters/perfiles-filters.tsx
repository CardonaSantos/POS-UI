import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { PerfilHomologacionFilters } from "../../features/pppoe-homologaciones/intefaces";

type Option = { value: number; label: string };

interface PerfilesFiltersProps {
  search: string;
  filters: PerfilHomologacionFilters;
  routerOptions: Option[];
  servicioOptions: Option[];
  isSearching: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onDebouncedSearchChange: (value: string) => void;
  onFilterChange: <K extends keyof PerfilHomologacionFilters>(
    key: K,
    value: PerfilHomologacionFilters[K],
  ) => void;
  onClear: () => void;
}

const ESTADO_OPTIONS = [
  { value: "true", label: "Activas" },
  { value: "false", label: "Inactivas" },
];

export function PerfilesFilters(props: PerfilesFiltersProps) {
  return (
    <AppCard size="xs" variant="outline" className="p-2">
      <AppGrid
        cols={{
          base: 1,
          md: 2,
          xl: 4,
        }}
        gap="sm"
      >
        <AppField label="Buscar">
          {(field) => (
            <AppSearchInput
              id={field.id}
              value={props.search}
              onValueChange={props.onSearchChange}
              onDebouncedChange={props.onDebouncedSearchChange}
              debounceMs={400}
              placeholder="Buscar plan, código, router o host"
              aria-label="Buscar homologaciones"
              isSearching={props.isSearching}
              clearable
            />
          )}
        </AppField>

        <AppField label="Estado">
          {(field) => (
            <AppSingleSelect<string>
              inputId={field.id}
              value={
                props.filters.activo === null
                  ? null
                  : String(props.filters.activo)
              }
              options={ESTADO_OPTIONS}
              onChange={(value) =>
                props.onFilterChange(
                  "activo",
                  value === null ? null : value === "true",
                )
              }
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Router">
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={props.filters.mikrotikRouterId}
              options={props.routerOptions}
              onChange={(value) =>
                props.onFilterChange("mikrotikRouterId", value)
              }
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Plan">
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={props.filters.servicioInternetId}
              options={props.servicioOptions}
              onChange={(value) =>
                props.onFilterChange("servicioInternetId", value)
              }
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>
      </AppGrid>

      <AppInline justify="end" fullWidth className="mt-2">
        <AppButton
          type="button"
          variant="outline"
          size="xs"
          disabled={!props.hasActiveFilters}
          onClick={props.onClear}
        >
          Limpiar filtros
        </AppButton>
      </AppInline>
    </AppCard>
  );
}
