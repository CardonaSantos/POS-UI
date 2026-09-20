import { memo } from "react";
import type { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { ESTADOS_FILTRO } from "../tecnico-instalaciones.constants";

type InstalacionesToolbarProps = {
  search: string;
  estado: EstadoInstalacionCliente | undefined;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onDebouncedSearch: (value: string) => void;
  onEstadoChange: (estado: EstadoInstalacionCliente | undefined) => void;
};

export const InstalacionesToolbar = memo(function InstalacionesToolbar({
  search,
  estado,
  isSearching,
  onSearchChange,
  onDebouncedSearch,
  onEstadoChange,
}: InstalacionesToolbarProps) {
  return (
    <AppStack gap="xs">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onDebouncedSearch}
        isSearching={isSearching}
        debounceMs={400}
        placeholder="Cliente, teléfono o dirección"
        aria-label="Buscar instalaciones asignadas"
      />

      <AppInline gap="xs" wrap fullWidth>
        {ESTADOS_FILTRO.map((item) => {
          const active = estado === item.value;

          return (
            <AppButton
              key={item.label}
              size="xs"
              variant={active ? "primary" : "outline"}
              aria-pressed={active}
              onClick={() => onEstadoChange(item.value)}
            >
              {item.label}
            </AppButton>
          );
        })}
      </AppInline>
    </AppStack>
  );
});
