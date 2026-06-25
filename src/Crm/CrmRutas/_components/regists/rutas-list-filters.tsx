import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
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
      size="xs"
      radius="md"
      className="overflow-visible px-2 py-2"
    >
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs" className="items-end">
        <div className="md:col-span-5">
          <AppField label="Buscar">
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
          </AppField>
        </div>

        <div className="md:col-span-3">
          <AppField label="Estado">
            <AppSingleSelect<string>
              value={filters.estadoRuta ?? "TODOS"}
              options={ESTADO_RUTA_OPTIONS}
              onChange={(value) =>
                onEstadoChange(value === "TODOS" ? null : (value ?? null))
              }
              placeholder="Estado ruta"
              size="xs"
              menuDensity="compact"
              fieldWidth="full"
              isClearable={false}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
              isDisabled={isFetching}
            />
          </AppField>
        </div>

        <div className="md:col-span-3">
          <AppField label="Cobrador">
            <AppSingleSelect<string>
              value={filters.cobradorId}
              options={cobradorOptions}
              onChange={(value) => onCobradorChange(value ?? null)}
              placeholder="Cobrador"
              fieldWidth="full"
              isClearable
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              size="xs"
              menuDensity="compact"
              menuShouldScrollIntoView={false}
              isDisabled={isFetching}
            />
          </AppField>
        </div>

        <div className="md:col-span-1">
          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            width="full"
            leftIcon={<RotateCcw size={13} />}
            onClick={onClearFilters}
            disabled={isFetching}
            className="md:px-2"
          >
            <span className="md:sr-only lg:not-sr-only">Limpiar</span>
          </AppButton>
        </div>
      </AppGrid>
    </AppCard>
  );
}
