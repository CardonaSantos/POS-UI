"use client";
import { useRef, useState, useMemo } from "react";
import { MultiValue } from "react-select";

// Components
import TicketList from "./CrmTicketList";
import TicketDetail from "./CrmTicketDetails";
import TicketFilters from "./CrmTicketFilter";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";

// Hooks & Queries
import { useGetTicketSoluciones } from "../CrmHooks/hooks/use-ticket-soluciones/useTicketSoluciones";
import { useGetTicketsSoporte } from "../CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetTagsTicket } from "../CrmHooks/hooks/tags-ticket/useTagsTickets";

// Types & Utils
import type { Ticket } from "./ticketTypes";
import { EstadoTicketSoporte } from "../DashboardCRM/types";

type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export default function TicketDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [tecnicoSelected, setTecnicoSelected] = useState<string | null>(null);
  const [labelsSelecteds, setLabelsSelecteds] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  // ----------------------------------------------------------------------
  // 5. DATA FETCHING (API HOOKS)
  // ----------------------------------------------------------------------
  const { data: rawTickets, refetch: getTickets } = useGetTicketsSoporte();
  const { data: rawSolutions } = useGetTicketSoluciones();
  const { data: rawCustomers } = useGetCustomerToSelect();
  const { data: rawTags } = useGetTagsTicket();
  const { data: rawTecs } = useGetUsersToSelect();

  // Data normalization (Safe access)
  const ticketsSoporte = useMemo(() => rawTickets ?? [], [rawTickets]);
  const soluciones = useMemo(() => rawSolutions ?? [], [rawSolutions]);
  const clientes = useMemo(() => rawCustomers ?? [], [rawCustomers]);
  const etiquetas = useMemo(() => rawTags ?? [], [rawTags]);
  const tecnicos = useMemo(() => rawTecs ?? [], [rawTecs]);

  // ----------------------------------------------------------------------
  // 6. DERIVED DATA (MEMOIZED OPTIONS & STATS)
  // ----------------------------------------------------------------------
  
  // Opciones para Selects
  const optionsLabels = useMemo(() => etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  })), [etiquetas]);

  const optionsTecs = useMemo(() => tecnicos.map((tec) => ({
    value: tec.id.toString(),
    label: tec.nombre,
  })), [tecnicos]);

  const optionsCustomers = useMemo(() => clientes.map((c) => ({
    value: c.id.toString(),
    label: c.nombre,
  })), [clientes]);

  // Ticket seleccionado actualmente
  const selectedTicket = useMemo(() => 
    ticketsSoporte.find((ticket) => ticket.id === selectedTicketId),
  [ticketsSoporte, selectedTicketId]);

  const stats = useMemo(() => ({
    abiertos: ticketsSoporte.filter((t) => t.status === EstadoTicketSoporte.ABIERTA).length,
    proceso: ticketsSoporte.filter((t) => t.status === EstadoTicketSoporte.EN_PROCESO).length,
    resueltos: ticketsSoporte.filter((t) => t.status === EstadoTicketSoporte.RESUELTA).length,
  }), [ticketsSoporte]);

  const filteredTickets = useMemo(() => {
    return ticketsSoporte.filter((ticket) => {
      const term = filterText.toLowerCase();
      const matchesText =
        ticket.title.toLowerCase().includes(term) ||
        (ticket.customer?.name || "").toLowerCase().includes(term) ||
        (ticket.description || "").toLowerCase().includes(term) ||
        ticket.id.toString().includes(filterText);

      if (!matchesText) return false;

      if (selectedStatus && String(ticket.status) !== selectedStatus) return false;

      if (selectedAssignee && ticket.assignee?.id.toString() !== selectedAssignee) return false;
      if (selectedCreator && ticket.creator?.id.toString() !== selectedCreator) return false;
      if (tecnicoSelected && ticket.assignee?.id.toString() !== tecnicoSelected) return false;

      if (labelsSelecteds.length > 0) {
       
        const originalMatchLogic = ticket.tags?.some(tag => labelsSelecteds.includes(Number(tag.value)));
        if (!originalMatchLogic) return false;
      }

      if (dateRange.startDate || dateRange.endDate) {
        const ticketDate = new Date(ticket.date);
        if (isNaN(ticketDate.getTime())) return false;

        const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
        start.setHours(0, 0, 0, 0);

        const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        if (ticketDate < start || ticketDate > end) return false;
      }

      return true;
    });
  }, [
    ticketsSoporte, filterText, selectedStatus, selectedAssignee, 
    selectedCreator, tecnicoSelected, labelsSelecteds, dateRange
  ]);

  const handleSelectedTecnico = (optionSelect: OptionSelected | null) => {
    setTecnicoSelected(optionSelect ? optionSelect.value : null);
  };

  const handleChangeLabels = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const selectedIds = selectedOptions.map((option) => parseInt(option.value));
    setLabelsSelecteds(selectedIds);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicketId(ticket.id);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };
console.log('Los tickets llegando son: ', filteredTickets);

  return (
    <PageTransitionCrm
      titleHeader="Tickets Soporte"
      subtitle={`${stats.abiertos} abiertos · ${stats.proceso} en proceso · ${stats.resueltos} cerrados hoy`}
      variant="fade-pure"
    >
      <div>
        
        {/* FILTERS AREA */}
        <TicketFilters
          tickets={filteredTickets} // Pasamos los ya filtrados o los totales según necesite el componente para conteos
          onFilterChange={setFilterText}
          onStatusChange={setSelectedStatus}
          
          // Create Modal Props
          openCreatT={openCreateTicket}
          setOpenCreateT={setOpenCreateTicket}
          getTickets={getTickets}
          
          // Filter Setters
          setSelectedAssignee={setSelectedAssignee}
          setSelectedCreator={setSelectedCreator}
          
          // Technical Filters
          tecnicos={tecnicos}
          tecnicoSelected={tecnicoSelected}
          handleSelectedTecnico={handleSelectedTecnico}
          
          // Label Filters
          etiquetas={etiquetas}
          etiquetasSelecteds={labelsSelecteds}
          handleChangeLabels={handleChangeLabels}
          
          // Date Filters
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* CONTENT AREA */}
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-220px)]">
          
          {/* LEFT COLUMN: LIST */}
          <div className="flex flex-col h-full">
            <TicketList
              tickets={filteredTickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={handleSelectTicket}
            />
          </div>

          {/* RIGHT COLUMN: DETAIL */}
          {selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              setSelectedTicketId={setSelectedTicketId}
              getTickets={getTickets}
              
              soluciones={soluciones}
              optionsCustomers={optionsCustomers}
              optionsLabels={optionsLabels}
              optionsTecs={optionsTecs}
            />
          )}
        </div>
      </div>
    </PageTransitionCrm>
  );
}
