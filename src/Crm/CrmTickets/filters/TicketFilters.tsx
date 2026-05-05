"use client";

import { Plus } from "lucide-react";
import { FilterSearch } from "./FilterSearch";
import { FilterDateRange } from "./FilterDateRange";
import { FilterTecnico } from "./FilterTecnico";
import { FilterEtiquetas } from "./FilterEtiquetas";
import { FilterVista } from "./FilterVista";
import { TicketCounter } from "./TicketCounter";
import type { TicketFiltersProps } from "./ticket-filters.types";
import CrmCreateTicket from "../CreateTickets/CrmCreateTicket";

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
}: TicketFiltersProps) {
  return (
    <div className="w-full border-b border-gray-100  px-3 py-1.5">
      {/* Single row on desktop, wraps on mobile */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Search */}
        <FilterSearch onChange={onFilterChange} />

        {/* Divider — hidden on mobile */}
        <span className="hidden sm:block h-4 w-px bg-gray-200" />

        {/* Date Range */}
        <FilterDateRange
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          onChangeDates={handleChangeDates}
        />

        {/* Tecnico */}
        <FilterTecnico
          tecnicos={tecnicos}
          tecnicoSelected={tecnicoSelected}
          onChange={handleSelectedTecnico}
        />

        {/* Etiquetas */}
        <FilterEtiquetas
          etiquetas={etiquetas}
          etiquetasSelecteds={etiquetasSelecteds}
          onChange={handleChangeLabels}
        />

        {/* Vista */}
        <FilterVista onChange={onQuickViewChange} />

        {/* Spacer pushes counter + button to the right */}
        <span className="flex-1" />

        {/* Counter */}
        <TicketCounter total={ticketsTotal} label="tickets activos" />

        {/* Create button */}
        <button
          type="button"
          onClick={() => setOpenCreateT(true)}
          className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Nuevo Ticket</span>
        </button>

        {/* Modal — rendered here so it stays with the bar */}
        <CrmCreateTicket
          getTickets={getTickets}
          openCreatT={openCreatT}
          setOpenCreateT={setOpenCreateT}
        />
      </div>
    </div>
  );
}
