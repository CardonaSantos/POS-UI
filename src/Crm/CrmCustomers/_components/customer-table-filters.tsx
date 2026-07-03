import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  AppOption,
  CUSTOMER_SORT_OPTIONS,
  ESTADOS_CLIENTE_OPTIONS,
  ESTADOS_COBRANZA_OPTIONS,
} from "../customer-table.constants";

export type CustomerFiltersState = {
  search: string;
  serverSearch: string;
  departamentoId: string | null;
  municipioId: string | null;
  sectorId: string | null;
  zonaFacturacionId: string | null;
  estado: string | null;
  estadoCobranza: string | null;
  sort: string | null;
};

export type CustomerFiltersOptions = {
  departamentos: AppOption[];
  municipios: AppOption[];
  sectores: AppOption[];
  zonasFacturacion: AppOption[];
};

interface Props {
  filters: CustomerFiltersState;
  options: CustomerFiltersOptions;
  isSearching?: boolean;
  rightActions?: React.ReactNode;

  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onClearSearch: () => void;

  onDepartamentoChange: (value: string | null) => void;
  onMunicipioChange: (value: string | null) => void;
  onSectorChange: (value: string | null) => void;
  onZonaFacturacionChange: (value: string | null) => void;
  onEstadoChange: (value: string | null) => void;
  onEstadoCobranzaChange: (value: string | null) => void;
  onSortChange: (value: string | null) => void;
  onClearFilters: () => void;
}

export function CustomerTableFilters({
  filters,
  options,
  isSearching,
  rightActions,
  onSearchChange,
  onSearchDebouncedChange,
  onClearSearch,
  onDepartamentoChange,
  onMunicipioChange,
  onSectorChange,
  onZonaFacturacionChange,
  onEstadoChange,
  onEstadoCobranzaChange,
  onSortChange,
  onClearFilters,
}: Props) {
  return (
    <AppCard
      variant="ghost"
      size="xs"
      radius="sm"
      className="overflow-visible py-1"
    >
      <AppStack gap="xs">
        {/* Barra superior */}
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-[420px]">
            <AppSearchInput
              value={filters.search}
              onValueChange={onSearchChange}
              onDebouncedChange={onSearchDebouncedChange}
              onClear={onClearSearch}
              debounceMs={500}
              clearable
              isSearching={isSearching}
              placeholder="Buscar por nombre, teléfono, DPI o IP..."
              wrapperWidth="full"
              minWidth="sm"
            />
          </div>

          <div className="flex items-center justify-end gap-1">
            {rightActions}

            <AppButton
              type="button"
              variant="ghost"
              size="xs"
              leftIcon={<RotateCcw size={13} />}
              onClick={onClearFilters}
              className="h-7 px-2 text-[11px]"
            >
              Limpiar
            </AppButton>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
          <AppSingleSelect<string>
            value={filters.departamentoId}
            options={options.departamentos}
            onChange={onDepartamentoChange}
            placeholder="Depto."
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.municipioId}
            options={options.municipios}
            onChange={onMunicipioChange}
            placeholder="Municipio"
            size="xs"
            density="compact"
            fieldWidth="full"
            isDisabled={!filters.departamentoId}
            isClearable
            isSearchable
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.sectorId}
            options={options.sectores}
            onChange={onSectorChange}
            placeholder="Sector"
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.estado}
            options={ESTADOS_CLIENTE_OPTIONS}
            onChange={onEstadoChange}
            placeholder="Operativo"
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable={false}
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.estadoCobranza}
            options={ESTADOS_COBRANZA_OPTIONS}
            onChange={onEstadoCobranzaChange}
            placeholder="Cobranza"
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable={false}
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.zonaFacturacionId}
            options={options.zonasFacturacion}
            onChange={onZonaFacturacionChange}
            placeholder="Zona fact."
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />

          <AppSingleSelect<string>
            value={filters.sort}
            options={CUSTOMER_SORT_OPTIONS}
            onChange={onSortChange}
            placeholder="Ordenar"
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isSearchable={false}
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />
        </div>
      </AppStack>
    </AppCard>
  );
}
