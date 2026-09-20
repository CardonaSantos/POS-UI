import { memo } from "react";
import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";

import {
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

const ESTADO_OPTIONS = [
  {
    value: EstadoDesinstalacionCliente.PROGRAMADA,
    label: "Programada",
  },
  {
    value: EstadoDesinstalacionCliente.EN_PROCESO,
    label: "En proceso",
  },
  {
    value: EstadoDesinstalacionCliente.COMPLETADA,
    label: "Completada",
  },
  {
    value: EstadoDesinstalacionCliente.CANCELADA,
    label: "Cancelada",
  },
  {
    value: EstadoDesinstalacionCliente.FALLIDA,
    label: "Fallida",
  },
];

const TIPO_OPTIONS = [
  {
    value: TipoDesinstalacionCliente.COMPLETA,
    label: "Completa",
  },
  {
    value: TipoDesinstalacionCliente.PARCIAL,
    label: "Parcial",
  },
  {
    value: TipoDesinstalacionCliente.RETIRO_EQUIPO,
    label: "Retiro de equipo",
  },
  {
    value: TipoDesinstalacionCliente.CAMBIO_DOMICILIO,
    label: "Cambio de domicilio",
  },
  {
    value: TipoDesinstalacionCliente.CANCELACION_SERVICIO,
    label: "Cancelación de servicio",
  },
  {
    value: TipoDesinstalacionCliente.OTRO,
    label: "Otro",
  },
];

const MOTIVO_OPTIONS = [
  {
    value: MotivoDesinstalacionCliente.VOLUNTARIA,
    label: "Voluntaria",
  },
  {
    value: MotivoDesinstalacionCliente.MORA,
    label: "Mora",
  },
  {
    value: MotivoDesinstalacionCliente.CAMBIO_DOMICILIO,
    label: "Cambio de domicilio",
  },
  {
    value: MotivoDesinstalacionCliente.MAL_SERVICIO,
    label: "Mal servicio",
  },
  {
    value: MotivoDesinstalacionCliente.FRAUDE,
    label: "Fraude",
  },
  {
    value: MotivoDesinstalacionCliente.FALLA_TECNICA,
    label: "Falla técnica",
  },
  {
    value: MotivoDesinstalacionCliente.CAMBIO_PROVEEDOR,
    label: "Cambio de proveedor",
  },
  {
    value: MotivoDesinstalacionCliente.CLIENTE_NO_LOCALIZADO,
    label: "Cliente no localizado",
  },
  {
    value: MotivoDesinstalacionCliente.OTRO,
    label: "Otro",
  },
];

type DesinstalacionesFiltersProps = {
  search: string;

  estado: EstadoDesinstalacionCliente | null;

  tipo: TipoDesinstalacionCliente | null;

  motivo: MotivoDesinstalacionCliente | null;

  isFetching: boolean;

  onSearchChange: (value: string) => void;

  onSearchDebouncedChange: (value: string) => void;

  onEstadoChange: (value: EstadoDesinstalacionCliente | null) => void;

  onTipoChange: (value: TipoDesinstalacionCliente | null) => void;

  onMotivoChange: (value: MotivoDesinstalacionCliente | null) => void;

  onClear: () => void;
};

export const DesinstalacionesFilters = memo(function DesinstalacionesFilters({
  search,
  estado,
  tipo,
  motivo,
  isFetching,
  onSearchChange,
  onSearchDebouncedChange,
  onEstadoChange,
  onTipoChange,
  onMotivoChange,
  onClear,
}: DesinstalacionesFiltersProps) {
  return (
    <AppGrid
      cols={{
        base: 1,
        md: 2,
        xl: 5,
      }}
      gap="xs"
      align="end"
    >
      <div className="xl:col-span-2">
        <AppSearchInput
          value={search}
          onValueChange={onSearchChange}
          onDebouncedChange={onSearchDebouncedChange}
          placeholder="Buscar cliente, teléfono, dirección..."
          clearable
          isSearching={isFetching}
          // loading={isFetching}
        />
      </div>

      <AppSingleSelect<EstadoDesinstalacionCliente>
        value={estado}
        options={ESTADO_OPTIONS}
        onChange={onEstadoChange}
        placeholder="Todos los estados"
        isClearable
      />

      <AppSingleSelect<TipoDesinstalacionCliente>
        value={tipo}
        options={TIPO_OPTIONS}
        onChange={onTipoChange}
        placeholder="Todos los tipos"
        isClearable
      />

      <div className="flex min-w-0 gap-2">
        <div className="min-w-0 flex-1">
          <AppSingleSelect<MotivoDesinstalacionCliente>
            value={motivo}
            options={MOTIVO_OPTIONS}
            onChange={onMotivoChange}
            placeholder="Todos los motivos"
            isClearable
          />
        </div>

        <AppButton
          variant="outline"
          size="sm"
          onClick={onClear}
          aria-label="Limpiar filtros"
        >
          <RotateCcw size={14} aria-hidden="true" />
        </AppButton>
      </div>
    </AppGrid>
  );
});
