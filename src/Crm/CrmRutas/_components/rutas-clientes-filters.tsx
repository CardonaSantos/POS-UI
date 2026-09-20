import { RefreshCw, RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid, AppGridItem } from "@/components/app/primitives/app-grid";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";

import type { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";

import {
  ESTADO_CLIENTE_RUTA_OPTIONS,
  ESTADO_COBRANZA_RUTA_OPTIONS,
  RUTAS_SORT_OPTIONS,
} from "./rutas_create_constants";

export type RutasClientesFiltersState = {
  search: string;
  estado: string;
  estadoCobranza: string;
  zonasFacturacionIDs: string[];
  sectorIDs: string[];
  sort: string;
};

export type RutasClientesFiltersOptions = {
  zonas: AppOption[];
  sectores: AppOption[];
};

interface RutasClientesFiltersProps {
  filters: RutasClientesFiltersState;
  options: RutasClientesFiltersOptions;

  isFetching?: boolean;

  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;

  onEstadoChange: (value: string | null) => void;
  onEstadoCobranzaChange: (value: string | null) => void;

  onZonasChange: (values: string[]) => void;
  onSectoresChange: (values: string[]) => void;

  onSortChange: (value: string | null) => void;

  onClearFilters: () => void;
  onRefetch: () => void;
}

export function RutasClientesFilters({
  filters,
  options,
  isFetching = false,

  onSearchChange,
  onSearchDebouncedChange,

  onEstadoChange,
  onEstadoCobranzaChange,

  onZonasChange,
  onSectoresChange,

  onSortChange,

  onClearFilters,
  onRefetch,
}: RutasClientesFiltersProps) {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="overflow-visible"
    >
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs" align="end" className="p-2">
        <AppGridItem span={{ base: "full", md: 4 }}>
          <AppField label="Buscar">
            <AppSearchInput
              value={filters.search}
              onValueChange={onSearchChange}
              onDebouncedChange={onSearchDebouncedChange}
              debounceMs={500}
              placeholder="Buscar cliente, teléfono o dirección..."
              wrapperWidth="full"
              clearable
              isSearching={isFetching}
            />
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 2 }}>
          <AppField label="Estado cliente">
            <AppSingleSelect<string>
              value={filters.estado || "TODOS"}
              options={ESTADO_CLIENTE_RUTA_OPTIONS}
              onChange={(value) => onEstadoChange(value ?? "TODOS")}
              placeholder="Estado cliente"
              size="xs"
              density="compact"
              fieldWidth="full"
              isClearable={false}
              isDisabled={isFetching}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 2 }}>
          <AppField label="Cobranza">
            <AppSingleSelect<string>
              value={filters.estadoCobranza || "TODOS"}
              options={ESTADO_COBRANZA_RUTA_OPTIONS}
              onChange={(value) => onEstadoCobranzaChange(value ?? "TODOS")}
              placeholder="Estado cobranza"
              size="xs"
              density="compact"
              fieldWidth="full"
              isClearable={false}
              isDisabled={isFetching}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 2 }}>
          <AppField label="Ordenar">
            <AppSingleSelect<string>
              value={filters.sort || null}
              options={RUTAS_SORT_OPTIONS}
              onChange={(value) => onSortChange(value ?? null)}
              placeholder="Ordenar"
              size="xs"
              density="compact"
              fieldWidth="full"
              isClearable
              isDisabled={isFetching}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 2 }}>
          <AppField label="Acciones">
            <div className="grid grid-cols-2 gap-1">
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="full"
                leftIcon={<RefreshCw size={13} />}
                loading={isFetching}
                loadingText="..."
                disabled={isFetching}
                onClick={onRefetch}
              >
                Refrescar
              </AppButton>

              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="full"
                leftIcon={<RotateCcw size={13} />}
                disabled={isFetching}
                onClick={onClearFilters}
              >
                Limpiar
              </AppButton>
            </div>
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 6 }}>
          <AppField label="Zonas de facturación">
            <AppMultiSelect<string>
              value={filters.zonasFacturacionIDs}
              options={options.zonas}
              onChange={(values) => onZonasChange(values ?? [])}
              placeholder="Seleccionar zonas..."
              size="xs"
              density="compact"
              fieldWidth="full"
              isDisabled={isFetching}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 6 }}>
          <AppField label="Sectores">
            <AppMultiSelect<string>
              value={filters.sectorIDs}
              options={options.sectores}
              onChange={(values) => onSectoresChange(values ?? [])}
              placeholder="Seleccionar sectores..."
              size="xs"
              density="compact"
              fieldWidth="full"
              isDisabled={isFetching}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </AppGridItem>
      </AppGrid>
    </AppCard>
  );
}
