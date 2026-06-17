import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
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
    <AppCard variant="ghost" size="sm" radius="sm" className="overflow-visible">
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" wrap>
          <div className="w-full max-w-md">
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
              minWidth="lg"
            />
          </div>

          <AppInline gap="xs" align="center" justify="end" wrap>
            {rightActions}

            <AppButton
              type="button"
              variant="ghost"
              size="xs"
              leftIcon={<RotateCcw size={14} />}
              onClick={onClearFilters}
            >
              Limpiar
            </AppButton>
          </AppInline>
        </AppInline>

        <AppGrid
          cols={{ base: 1, sm: 2, md: 3, xl: 7 }}
          gap="xs"
          className="overflow-visible pb-1"
        >
          <AppSingleSelect<string>
            value={filters.departamentoId}
            options={options.departamentos}
            onChange={onDepartamentoChange}
            placeholder="Departamento"
            size="sm"
            fieldWidth="full"
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.municipioId}
            options={options.municipios}
            onChange={onMunicipioChange}
            placeholder="Municipio"
            size="sm"
            fieldWidth="full"
            isDisabled={!filters.departamentoId}
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.sectorId}
            options={options.sectores}
            onChange={onSectorChange}
            placeholder="Sector"
            size="sm"
            fieldWidth="full"
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.estado}
            options={ESTADOS_CLIENTE_OPTIONS}
            onChange={onEstadoChange}
            placeholder="Operativo"
            size="sm"
            fieldWidth="full"
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.estadoCobranza}
            options={ESTADOS_COBRANZA_OPTIONS}
            onChange={onEstadoCobranzaChange}
            placeholder="Cobranza"
            size="sm"
            fieldWidth="full"
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.zonaFacturacionId}
            options={options.zonasFacturacion}
            onChange={onZonaFacturacionChange}
            placeholder="Zona fact."
            size="sm"
            fieldWidth="full"
            isClearable
          />

          <AppSingleSelect<string>
            value={filters.sort}
            options={CUSTOMER_SORT_OPTIONS}
            onChange={onSortChange}
            placeholder="Ordenar"
            size="sm"
            fieldWidth="full"
            isClearable
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
