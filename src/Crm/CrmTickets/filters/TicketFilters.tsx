"use client";
import { Plus } from "lucide-react";
import { FilterSearch } from "./FilterSearch";
import { FilterDateRange } from "./FilterDateRange";
import { FilterEtiquetas } from "./FilterEtiquetas";
import { FilterVista } from "./FilterVista";
import { TicketCounter } from "./TicketCounter";
import type { TicketFiltersProps } from "./ticket-filters.types";
import CrmCreateTicket from "../CreateTickets/CrmCreateTicket";
import { FilterTecnico } from "./FilterTecnico";
import { FilterSector } from "./FilterSector";

export default function TicketFilters({
  ticketsTotal,
  dateRangeStart,
  dateRangeEnd,
  tecnicos,
  tecnicoSelected,
  etiquetas,
  etiquetasSelecteds,
  openCreatT,
  onFilterChange,
  onQuickViewChange,
  handleChangeDates,
  handleSelectedTecnico,
  handleChangeLabels,
  setOpenCreateT,
  getTickets,
  sectores,
  sectorSelected,
  handleChangeSector,
}: TicketFiltersProps) {
  return (
    <div className="w-full border-b border-gray-100  px-3 py-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterSearch onChange={onFilterChange} />
        <span className="hidden sm:block h-4 w-px bg-gray-200" />
        <FilterDateRange
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          onChangeDates={handleChangeDates}
        />
        <FilterTecnico
          tecnicos={tecnicos}
          tecnicoSelected={tecnicoSelected}
          handleSelectedTecnico={handleSelectedTecnico}
        />
        <FilterEtiquetas
          etiquetas={etiquetas}
          etiquetasSelecteds={etiquetasSelecteds}
          onChange={handleChangeLabels}
        />

        <FilterEtiquetas
          etiquetas={etiquetas}
          etiquetasSelecteds={etiquetasSelecteds}
          onChange={handleChangeLabels}
        />

        <FilterSector
          onChange={handleChangeSector}
          sector={sectores}
          sectorSelected={sectorSelected}
        />

        <FilterVista onChange={onQuickViewChange} />
        <span className="flex-1" />
        <TicketCounter total={ticketsTotal} label="tickets activos" />
        <button
          type="button"
          onClick={() => setOpenCreateT(true)}
          className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Nuevo Ticket</span>
        </button>
        <CrmCreateTicket
          getTickets={getTickets}
          openCreatT={openCreatT}
          setOpenCreateT={setOpenCreateT}
        />
      </div>
    </div>
  );
}
