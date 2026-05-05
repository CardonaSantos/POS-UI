"use client";
import { useState, useMemo } from "react";
import { MultiValue } from "react-select";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import { useGetTicketSoluciones } from "../CrmHooks/hooks/use-ticket-soluciones/useTicketSoluciones";
import {
  QuerySearchTickets,
  TicketsData,
  useGetTicketsSoporte,
} from "../CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetTagsTicket } from "../CrmHooks/hooks/tags-ticket/useTagsTickets";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import CrmTicketPagination from "./CrmTicketPagination";
import { MetaPropsResponse } from "../features/meta-server-response/meta-responses";
import { useSearchParams } from "react-router-dom";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";
import { ReusableTabs, TabItem } from "../Utils/Components/tabs/reusable-tabs";
import { Kanban, Ticket as TicketIcon } from "lucide-react";
import TicketList from "./components/ticket-list";
// import TicketDetail from "./TicketDetail/CrmTicketDetails";
import { EstadoTicketSoporte } from "../features/dashboard/dashboard-tickets";
import TicketFilters from "./filters/TicketFilters";
import TicketDetail from "./ticket-detail/TicketDetail";

export default function TicketDashboard() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as string) || "tickets";

  const [ticketTab, setTicketTab] = useState("inbox");
  const [dashboardTab, setDashboardTab] = useState(defaultTab);

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const [tecnicoSelected, setTecnicoSelected] = useState<string | null>(null);

  const [filters, setFilters] = useState<QuerySearchTickets>({
    page: 1,
    limit: 15,
  });
  const query = useMemo(() => filters, [filters]);
  const { data: rawTickets, refetch: getTickets } = useGetTicketsSoporte(query);
  const { data: rawSolutions } = useGetTicketSoluciones();
  const { data: rawCustomers } = useGetCustomerToSelect();
  const { data: rawTags } = useGetTagsTicket();
  const { data: rawTecs } = useGetUsersToSelect();

  // Data normalization (Safe access)
  const ticketsSoporte = rawTickets?.data ? rawTickets.data : [];

  const meta = useMemo(() => {
    const met: MetaPropsResponse = rawTickets?.meta
      ? rawTickets?.meta
      : {
          hasNextPage: false,
          hasPrevPage: false,
          limit: 15,
          page: 1,
          total: 0,
          totalPages: 0,
        };
    return met;
  }, [rawTickets]);

  const ticketsData = useMemo(() => {
    const tData: TicketsData = rawTickets?.ticketsData
      ? rawTickets.ticketsData
      : {
          ticketEnProceso: 0,
          ticketsDisponibles: 0,
          ticketsResueltos: 0,
        };
    return tData;
  }, [rawTickets?.ticketsData]);

  const soluciones = useMemo(() => rawSolutions ?? [], [rawSolutions]);
  const clientes = useMemo(() => rawCustomers ?? [], [rawCustomers]);
  const etiquetas = useMemo(() => rawTags ?? [], [rawTags]);
  const tecnicos = useMemo(() => rawTecs ?? [], [rawTecs]);

  const optionsLabels = useMemo(
    () =>
      etiquetas.map((label) => ({
        value: label.id.toString(),
        label: label.nombre,
      })),
    [etiquetas],
  );

  const optionsTecs = useMemo(
    () =>
      tecnicos.map((tec) => ({
        value: tec.id.toString(),
        label: tec.nombre,
      })),
    [tecnicos],
  );

  const optionsCustomers = useMemo(
    () =>
      clientes.map((c) => ({
        value: c.id.toString(),
        label: c.nombre,
      })),
    [clientes],
  );

  // Ticket seleccionado actualmente
  const selectedTicket = useMemo(
    () => ticketsSoporte.find((ticket) => ticket.id === selectedTicketId),
    [ticketsSoporte, selectedTicketId],
  );

  const handleTabChange = (value: string) => {
    setTicketTab(value);

    setFilters((prev) => ({
      ...prev,
      page: 1,
      vista: value,
    }));
  };

  const handleSelectedTecnico = (optionSelect: OptionSelected | null) => {
    setTecnicoSelected(optionSelect ? optionSelect.value : null);

    setFilters((prev) => ({
      ...prev,
      tecs: optionSelect ? [Number(optionSelect.value)] : undefined,
      page: 1,
    }));
  };

  const handleChangeLabels = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
  ) => {
    const selectedIds = selectedOptions.map((option) => Number(option.value));

    setFilters((prev) => ({
      ...prev,
      tags: selectedIds.length ? selectedIds : undefined,
      page: 1,
    }));
  };

  type DateSide = "start" | "end";

  const handleChangeDates = (side: DateSide, date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [side === "start" ? "fechaInicio" : "fechaFin"]: date
        ? date.toISOString()
        : undefined,
      page: 1,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handleStatusChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      estado: value ? (value as EstadoTicketSoporte) : undefined,
      page: 1,
    }));
  };

  const handleQuickViewChange = (value: string, userId: number) => {
    setFilters((prev) => {
      if (value === "assignedToMe") {
        return {
          ...prev,
          tecs: [userId],
          creadosPor: undefined,
          page: 1,
        };
      }

      if (value === "createdByMe") {
        return {
          ...prev,
          creadosPor: userId,
          tecs: undefined,
          page: 1,
        };
      }

      return {
        ...prev,
        tecs: undefined,
        creadosPor: undefined,
        page: 1,
      };
    });
  };

  const handleNextPage = () => {
    if (!meta?.hasNextPage) return;

    setFilters((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
    }));
  };

  const handlePrevPage = () => {
    if (!meta?.hasPrevPage) return;

    setFilters((prev) => ({
      ...prev,
      page: Math.max((prev.page ?? 1) - 1, 1),
    }));
  };

  // Tabs
  const handleChangeTabs = useTabChangeWithUrl({
    activeTab: dashboardTab,
    setActiveTab: setDashboardTab,
    searchParams,
    setSearchParams,
  });

  const tabs: Array<TabItem> = [
    {
      label: "Tickets",
      value: "tickets",
      icon: <TicketIcon size={16} />,
      content: (
        <div>
          <TicketFilters
            ticketsTotal={ticketsData.ticketsDisponibles}
            tickets={ticketsSoporte}
            onFilterChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onQuickViewChange={(value) => handleQuickViewChange(value, userId)}
            openCreatT={openCreateTicket}
            setOpenCreateT={setOpenCreateTicket}
            getTickets={getTickets}
            tecnicos={tecnicos}
            tecnicoSelected={tecnicoSelected}
            handleSelectedTecnico={handleSelectedTecnico}
            etiquetas={etiquetas}
            etiquetasSelecteds={filters.tags ?? []}
            handleChangeLabels={handleChangeLabels}
            dateRangeStart={filters.fechaInicio}
            dateRangeEnd={filters.fechaFin}
            handleChangeDates={handleChangeDates}
          />

          {/* CONTENT AREA */}
          <div className="mt-2 h-[calc(100vh-230px)] flex flex-col lg:grid lg:grid-cols-2 gap-4">
            <div
              className={`flex flex-col overflow-hidden bg-background border border-border rounded-lg shadow-sm
            ${selectedTicket ? "h-1/2" : "h-full"} 
            lg:h-full`}
            >
              <div className="flex-1 min-h-0">
                <TicketList
                  tickets={ticketsSoporte}
                  ticketsData={ticketsData}
                  selectedTicketId={selectedTicketId}
                  onSelectTicket={(t) => setSelectedTicketId(t.id)}
                  activeTab={ticketTab}
                  onTabChange={handleTabChange}
                />
              </div>

              <div className="shrink-0 z-10">
                <CrmTicketPagination
                  handleNextPage={handleNextPage}
                  handlePrevPage={handlePrevPage}
                  meta={meta}
                />
              </div>
            </div>

            {selectedTicket && (
              <div className="flex flex-col h-1/2 overflow-hidden lg:h-full bg-background border border-border rounded-lg shadow-sm">
                <TicketDetail
                  query={query}
                  ticket={selectedTicket}
                  setSelectedTicketId={setSelectedTicketId}
                  getTickets={getTickets}
                  soluciones={soluciones}
                  optionsCustomers={optionsCustomers}
                  optionsLabels={optionsLabels}
                  optionsTecs={optionsTecs}
                />
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      label: "Operativo",
      value: "tickets-operativo",
      icon: <Kanban size={16} />,
      content: (
        <div className="">
          <h2>Otra page</h2>
        </div>
      ),
    },
  ];

  return (
    <PageTransitionCrm titleHeader="Tickets Soporte" variant="fade-pure">
      <ReusableTabs
        tabs={tabs}
        activeTab={dashboardTab}
        setActiveTab={setDashboardTab}
        handleTabChange={handleChangeTabs}
        variant="compact"
      />
    </PageTransitionCrm>
  );
}
