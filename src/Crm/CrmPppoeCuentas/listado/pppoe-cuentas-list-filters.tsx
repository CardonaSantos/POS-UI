import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";

import {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

import type { OrigenCuentaPppoe } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.interfaces";

import type { PppoeCuentasListFiltersState } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.filters";

type NumericSelectOption = {
  value: number;

  label: string;
};

type EnumSelectOption<TValue extends string> = {
  value: TValue;

  label: string;
};

const ESTADO_CUENTA_OPTIONS: EnumSelectOption<EstadoCuentaPppoe>[] = [
  {
    value: EstadoCuentaPppoe.PENDIENTE_CREACION,
    label: "Pendiente creación",
  },
  {
    value: EstadoCuentaPppoe.EN_INSTALACION,
    label: "En instalación",
  },
  {
    value: EstadoCuentaPppoe.PENDIENTE_ACTIVACION,
    label: "Pendiente activación",
  },
  {
    value: EstadoCuentaPppoe.EN_ACTIVACION,
    label: "En activación",
  },
  {
    value: EstadoCuentaPppoe.ACTIVA,
    label: "Activa",
  },
  {
    value: EstadoCuentaPppoe.EN_SUSPENSION,
    label: "En suspensión",
  },
  {
    value: EstadoCuentaPppoe.SUSPENDIDA,
    label: "Suspendida",
  },
  {
    value: EstadoCuentaPppoe.EN_DESINSTALACION,
    label: "En desinstalación",
  },
  {
    value: EstadoCuentaPppoe.ELIMINADA,
    label: "Eliminada",
  },
  {
    value: EstadoCuentaPppoe.CANCELADA,
    label: "Cancelada",
  },
  {
    value: EstadoCuentaPppoe.ERROR,
    label: "Error",
  },
];

const ESTADO_ACCESO_OPTIONS: EnumSelectOption<EstadoAccesoInternet>[] = [
  {
    value: EstadoAccesoInternet.PENDIENTE,
    label: "Pendiente",
  },
  {
    value: EstadoAccesoInternet.CONFIGURANDO,
    label: "Configurando",
  },
  {
    value: EstadoAccesoInternet.ACTIVO,
    label: "Activo",
  },
  {
    value: EstadoAccesoInternet.SUSPENDIDO,
    label: "Suspendido",
  },
  {
    value: EstadoAccesoInternet.BAJA,
    label: "Baja",
  },
];

const ORIGEN_OPTIONS: EnumSelectOption<OrigenCuentaPppoe>[] = [
  {
    value: "INSTALACION",
    label: "Instalación",
  },
  {
    value: "ALTA_MANUAL",
    label: "Alta manual",
  },
];

type PppoeCuentasListFiltersProps = {
  search: string;

  filters: PppoeCuentasListFiltersState;

  servicioOptions: NumericSelectOption[];

  routerOptions: NumericSelectOption[];

  perfilOptions: NumericSelectOption[];

  isLoadingHomologaciones?: boolean;

  isSearching?: boolean;

  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;

  onDebouncedSearchChange: (value: string) => void;

  onFilterChange: <TKey extends keyof PppoeCuentasListFiltersState>(
    key: TKey,
    value: PppoeCuentasListFiltersState[TKey],
  ) => void;

  onClear: () => void;
};

export function PppoeCuentasListFilters({
  search,
  filters,

  servicioOptions,
  routerOptions,
  perfilOptions,

  isLoadingHomologaciones = false,
  isSearching = false,

  hasActiveFilters,

  onSearchChange,
  onDebouncedSearchChange,
  onFilterChange,
  onClear,
}: PppoeCuentasListFiltersProps) {
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
        <div className="md:col-span-2 xl:col-span-2">
          <AppSearchInput
            value={search}
            onValueChange={onSearchChange}
            onDebouncedChange={onDebouncedSearchChange}
            debounceMs={450}
            placeholder="Buscar cliente, teléfono, DPI, usuario PPPoE, perfil o router"
            aria-label="Buscar cuentas PPPoE"
            isSearching={isSearching}
            clearable
          />
        </div>

        <AppField label="Estado cuenta">
          {(fieldUi) => (
            <AppSingleSelect<EstadoCuentaPppoe>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.estadoCuenta}
              options={ESTADO_CUENTA_OPTIONS}
              onChange={(value) => onFilterChange("estadoCuenta", value)}
              placeholder="Todas"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Estado acceso">
          {(fieldUi) => (
            <AppSingleSelect<EstadoAccesoInternet>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.estadoAcceso}
              options={ESTADO_ACCESO_OPTIONS}
              onChange={(value) => onFilterChange("estadoAcceso", value)}
              placeholder="Todos"
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Origen">
          {(fieldUi) => (
            <AppSingleSelect<OrigenCuentaPppoe>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.origen}
              options={ORIGEN_OPTIONS}
              onChange={(value) => onFilterChange("origen", value)}
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
              placeholder="Todos"
              noOptionsText="Sin servicios homologados"
              isLoading={isLoadingHomologaciones}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Router">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.mikrotikRouterId}
              options={routerOptions}
              onChange={(value) => onFilterChange("mikrotikRouterId", value)}
              placeholder="Todos"
              noOptionsText="Sin routers homologados"
              isLoading={isLoadingHomologaciones}
              density="compact"
              isClearable
            />
          )}
        </AppField>

        <AppField label="Perfil">
          {(fieldUi) => (
            <AppSingleSelect<number>
              inputId={fieldUi.id}
              aria-describedby={fieldUi.describedBy}
              aria-invalid={fieldUi.invalid}
              value={filters.perfilHomologacionId}
              options={perfilOptions}
              onChange={(value) =>
                onFilterChange("perfilHomologacionId", value)
              }
              placeholder="Todos"
              noOptionsText="Sin perfiles disponibles"
              isLoading={isLoadingHomologaciones}
              density="compact"
              isClearable
            />
          )}
        </AppField>
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
