import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";
import {
  ESTADO_CLIENTE_RUTA_OPTIONS,
  ESTADO_COBRANZA_RUTA_OPTIONS,
  RUTAS_SORT_OPTIONS,
} from "./rutas_create_constants";

export type RutasCreateFiltersState = {
  search: string;
  estado: string;
  estadoCobranza: string;
  zonasFacturacionIDs: string[];
  sectorIDs: string[];
  sort: string;
};

export type RutasCreateFiltersOptions = {
  zonas: AppOption[];
  sectores: AppOption[];
};

interface Props {
  filters: RutasCreateFiltersState;
  options: RutasCreateFiltersOptions;
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

export function RutasCreateFilters({
  filters,
  options,
  isFetching,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onEstadoCobranzaChange,
  onZonasChange,
  onSectoresChange,
  onSortChange,
  onClearFilters,
  onRefetch,
}: Props) {
  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="md"
      className="overflow-visible p-2"
    >
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" wrap>
          <div className="w-full max-w-md">
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
          </div>

          <AppInline gap="xs" align="center" justify="end" wrap>
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              loading={isFetching}
              loadingText="Actualizando..."
              onClick={onRefetch}
            >
              Refrescar
            </AppButton>

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
          cols={{ base: 1, sm: 2, lg: 5 }}
          gap="xs"
          className="overflow-visible"
        >
          <AppSingleSelect<string>
            value={filters.estado}
            options={ESTADO_CLIENTE_RUTA_OPTIONS}
            onChange={(value) => onEstadoChange(value ?? "TODOS")}
            placeholder="Estado cliente"
            size="sm"
            fieldWidth="full"
            isClearable={false}
          />

          <AppSingleSelect<string>
            value={filters.estadoCobranza}
            options={ESTADO_COBRANZA_RUTA_OPTIONS}
            onChange={(value) => onEstadoCobranzaChange(value ?? null)}
            placeholder="Estado cobranza"
            size="sm"
            fieldWidth="full"
            isClearable={false}
          />

          <AppMultiSelect<string>
            value={filters.zonasFacturacionIDs}
            options={options.zonas}
            onChange={(values) => onZonasChange(values)}
            placeholder="Zonas fact."
            size="sm"
            fieldWidth="full"
            portalToBody={true}
          />

          <AppMultiSelect<string>
            value={filters.sectorIDs}
            options={options.sectores}
            onChange={(values) => onSectoresChange(values)}
            placeholder="Sectores"
            size="sm"
            fieldWidth="full"
            portalToBody={true}
          />

          <AppSingleSelect<string>
            value={filters.sort}
            options={RUTAS_SORT_OPTIONS}
            onChange={(value) => onSortChange(value)}
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
