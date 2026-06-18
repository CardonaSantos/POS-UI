import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";
import { ESTADO_RUTA_OPTIONS } from "./rutas_list_consts_";

export type RutasListFiltersState = {
  search: string;
  serverSearch: string;
  estadoRuta: string | null;
  cobradorId: string | null;
};

interface Props {
  filters: RutasListFiltersState;
  cobradorOptions: AppOption[];
  isFetching?: boolean;

  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onEstadoChange: (value: string | null) => void;
  onCobradorChange: (value: string | null) => void;
  onClearFilters: () => void;
}

export function RutasListFilters({
  filters,
  cobradorOptions,
  isFetching,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onCobradorChange,
  onClearFilters,
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
              placeholder="Buscar rutas..."
              wrapperWidth="full"
              clearable
              isSearching={isFetching}
            />
          </div>

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

        <AppGrid cols={{ base: 1, sm: 2, lg: 3 }} gap="xs">
          <AppSingleSelect<string>
            value={filters.estadoRuta ?? "TODOS"}
            options={ESTADO_RUTA_OPTIONS}
            onChange={(value) => onEstadoChange(value ?? "TODOS")}
            placeholder="Estado ruta"
            size="sm"
            fieldWidth="full"
            isClearable={false}
          />

          <AppSingleSelect<string>
            value={filters.cobradorId}
            options={cobradorOptions}
            onChange={(value) => onCobradorChange(value)}
            placeholder="Cobrador"
            size="sm"
            fieldWidth="full"
            isClearable
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
