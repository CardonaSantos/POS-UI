"use client";

import * as React from "react";
import { Calendar, Layers, Plus } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSearchInput } from "@/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { useAppStateHandlers } from "@/components/app/handlers";

import CrmCreateTicket from "../CreateTickets/CrmCreateTicket";
import type {
  TicketFiltersProps,
  TicketQuickView,
} from "./ticket-filters.types";

const QUICK_VIEW_OPTIONS: Array<{ value: TicketQuickView; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "assignedToMe", label: "Asignados" },
  { value: "createdByMe", label: "Creados" },
];

function getQuickViewValue(
  value: TicketFiltersProps["value"],
  userId: number,
): TicketQuickView {
  if (value.creadosPor === userId) return "createdByMe";

  if (value.tecs?.length === 1 && value.tecs[0] === userId) {
    return "assignedToMe";
  }

  return "all";
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";

  return String(value).slice(0, 10);
}

function TicketDateRangeCompact({
  start,
  end,
  onChange,
}: {
  start?: string;
  end?: string;
  onChange: (patch: { fechaInicio?: string; fechaFin?: string }) => void;
}) {
  return (
    <div className="grid h-8 w-[232px] shrink-0 grid-cols-[106px_12px_106px] items-center gap-1">
      <AppInput
        type="date"
        value={toDateInputValue(start)}
        onChange={(event) =>
          onChange({
            fechaInicio: event.target.value || undefined,
          })
        }
        leftIcon={<Calendar size={12} />}
        size="xs"
        fieldWidth="full"
        className="h-8 text-[11px]"
        containerClassName="min-w-0"
      />

      <span className="text-center text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        –
      </span>

      <AppInput
        type="date"
        value={toDateInputValue(end)}
        min={toDateInputValue(start) || undefined}
        onChange={(event) =>
          onChange({
            fechaFin: event.target.value || undefined,
          })
        }
        size="xs"
        fieldWidth="full"
        className="h-8 text-[11px]"
        containerClassName="min-w-0"
      />
    </div>
  );
}

export default function TicketFilters({
  ticketsTotal,
  value,
  onChange,
  userId,
  tecnicos,
  etiquetas,
  sectores,
  openCreatT,
  setOpenCreateT,
  getTickets,
}: TicketFiltersProps) {
  const search = useAppStateHandlers({
    value: value.search ?? "",
  });

  React.useEffect(() => {
    search.setField("value", value.search ?? "");
  }, [value.search]);

  const tecnicoOptions = React.useMemo(
    () =>
      tecnicos.map((tecnico) => ({
        value: tecnico.id,
        label: tecnico.nombre,
      })),
    [tecnicos],
  );

  const etiquetaOptions = React.useMemo(
    () =>
      etiquetas.map((etiqueta) => ({
        value: etiqueta.id,
        label: etiqueta.nombre,
      })),
    [etiquetas],
  );

  const sectorOptions = React.useMemo(
    () =>
      sectores.map((sector) => ({
        value: sector.id,
        label: sector.nombre,
      })),
    [sectores],
  );

  const quickViewValue = React.useMemo(
    () => getQuickViewValue(value, userId),
    [userId, value],
  );

  const handleQuickViewChange = React.useCallback(
    (nextValue: TicketQuickView | null) => {
      if (nextValue === "assignedToMe") {
        onChange({
          tecs: [userId],
          creadosPor: undefined,
        });
        return;
      }

      if (nextValue === "createdByMe") {
        onChange({
          creadosPor: userId,
          tecs: undefined,
        });
        return;
      }

      onChange({
        tecs: undefined,
        creadosPor: undefined,
      });
    },
    [onChange, userId],
  );

  return (
    <div className="w-full border-b border-[hsl(var(--app-border,var(--border)))] px-3 py-1.5">
      <AppInline gap="xs" align="center" wrap className="w-full">
        <div className="w-[200px] shrink-0">
          <AppSearchInput
            value={search.state.value}
            onValueChange={(nextValue) => search.setField("value", nextValue)}
            onDebouncedChange={(nextValue) =>
              onChange({
                search: nextValue || undefined,
              })
            }
            debounceMs={350}
            placeholder="Buscar ticket..."
            clearable
            onClear={() => {
              search.setField("value", "");
              onChange({ search: undefined });
            }}
            wrapperWidth="full"
            minWidth="sm"
            size="xs"
          />
        </div>

        <TicketDateRangeCompact
          start={value.fechaInicio}
          end={value.fechaFin}
          onChange={onChange}
        />

        <div className="w-[118px] shrink-0">
          <AppSingleSelect<number>
            value={value.tecs?.[0] ?? null}
            onChange={(nextValue) =>
              onChange({
                tecs: nextValue ? [Number(nextValue)] : undefined,
                creadosPor: undefined,
              })
            }
            options={tecnicoOptions}
            placeholder="Técnico"
            isClearable
            isSearchable
            fieldWidth="full"
            portalToBody
            menuPosition="fixed"
            // OTROs
            size="xs"
            density="dense"
          />
        </div>

        <div className="w-[128px] shrink-0">
          <AppMultiSelect<number>
            value={value.tags ?? []}
            onChange={(nextValues) =>
              onChange({
                tags: nextValues.length ? nextValues : undefined,
              })
            }
            options={etiquetaOptions}
            placeholder="Etiquetas"
            isClearable
            fieldWidth="full"
            portalToBody
            menuPosition="fixed"
            // otros
            size="xs"
            density="compact"
          />
        </div>

        <div className="w-[118px] shrink-0">
          <AppSingleSelect<number>
            value={value.sector ?? null}
            onChange={(nextValue) =>
              onChange({
                sector: nextValue ? Number(nextValue) : undefined,
              })
            }
            options={sectorOptions}
            placeholder="Sector"
            isClearable
            isSearchable
            fieldWidth="full"
            portalToBody
            menuPosition="fixed"
            size="xs"
            density="dense"
          />
        </div>

        <div className="w-[105px] shrink-0">
          <AppSingleSelect<TicketQuickView>
            value={quickViewValue}
            onChange={handleQuickViewChange}
            options={QUICK_VIEW_OPTIONS}
            placeholder="Vista"
            isClearable={false}
            isSearchable={false}
            fieldWidth="full"
            portalToBody
            menuPosition="fixed"
            size="xs"
            density="dense"
          />
        </div>

        <span className="min-w-2 flex-1" />

        <AppBadge
          tone="neutral"
          appearance="outline"
          size="xs"
          radius="md"
          className="h-8 shrink-0"
        >
          <span className="inline-flex items-center gap-1">
            <Layers size={13} />
            <span className="font-semibold">{ticketsTotal}</span>
            <span className="hidden sm:inline">tickets activos</span>
          </span>
        </AppBadge>

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          leftIcon={<Plus size={14} />}
          onClick={() => setOpenCreateT(true)}
          className="h-8 shrink-0"
        >
          Nuevo ticket
        </AppButton>

        <CrmCreateTicket
          getTickets={getTickets}
          openCreatT={openCreatT}
          setOpenCreateT={setOpenCreateT}
        />
      </AppInline>
    </div>
  );
}
