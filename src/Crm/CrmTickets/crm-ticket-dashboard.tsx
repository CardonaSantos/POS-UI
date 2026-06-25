"use client";

import * as React from "react";
import { Clipboard, Kanban, Ticket as TicketIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs, type AppTabItem } from "@/components/app/primitives/app-tabs";
import {
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { useGetTicketSoluciones } from "../CrmHooks/hooks/use-ticket-soluciones/useTicketSoluciones";
import {
  QuerySearchTickets,
  TicketsData,
  useGetTicketsSoporte,
} from "../CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetTagsTicket } from "../CrmHooks/hooks/tags-ticket/useTagsTickets";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";
import { MetaPropsResponse } from "../features/meta-server-response/meta-responses";

import CrmTicketPagination from "./CrmTicketPagination";
import TicketList from "./components/ticket-list";
import TicketFilters from "./filters/TicketFilters";
import TicketDetail from "./ticket-detail/TicketDetail";
import OperativoMainPage from "./components/operativo/page";

interface TicketDashboardUiState {
  ticketTab: string;
  dashboardTab: string;
  selectedTicketId: number | null;
}

const DEFAULT_META: MetaPropsResponse = {
  hasNextPage: false,
  hasPrevPage: false,
  limit: 15,
  page: 1,
  total: 0,
  totalPages: 0,
};

const DEFAULT_TICKETS_DATA: TicketsData = {
  ticketEnProceso: 0,
  ticketsDisponibles: 0,
  ticketsResueltos: 0,
};

export default function TicketDashboard() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "tickets";

  const ui = useAppStateHandlers<TicketDashboardUiState>({
    ticketTab: "inbox",
    dashboardTab: defaultTab,
    selectedTicketId: null,
  });

  const filters = useAppStateHandlers<QuerySearchTickets>({
    page: 1,
    limit: 15,
  });

  const createTicketDialog = useAppDisclosure();

  React.useEffect(() => {
    const urlTab = searchParams.get("tab") || "tickets";

    if (urlTab !== ui.state.dashboardTab) {
      ui.setField("dashboardTab", urlTab);
    }
  }, [searchParams, ui]);

  const query = React.useMemo(() => filters.state, [filters.state]);

  const { data: rawTickets, refetch: getTickets } = useGetTicketsSoporte(query);
  const { data: rawSolutions } = useGetTicketSoluciones();
  const { data: rawCustomers } = useGetCustomerToSelect();
  const { data: rawTags } = useGetTagsTicket();
  const { data: rawTecs } = useGetUsersToSelect();
  const { data: sectores = [] } = useGetSectores();

  const ticketsSoporte = React.useMemo(
    () => rawTickets?.data ?? [],
    [rawTickets?.data],
  );

  const meta = React.useMemo<MetaPropsResponse>(
    () => rawTickets?.meta ?? DEFAULT_META,
    [rawTickets?.meta],
  );

  const ticketsData = React.useMemo<TicketsData>(
    () => rawTickets?.ticketsData ?? DEFAULT_TICKETS_DATA,
    [rawTickets?.ticketsData],
  );

  const soluciones = React.useMemo(() => rawSolutions ?? [], [rawSolutions]);
  const clientes = React.useMemo(() => rawCustomers ?? [], [rawCustomers]);
  const etiquetas = React.useMemo(() => rawTags ?? [], [rawTags]);
  const tecnicos = React.useMemo(() => rawTecs ?? [], [rawTecs]);

  const optionsLabels = React.useMemo(
    () =>
      etiquetas.map((label) => ({
        value: label.id.toString(),
        label: label.nombre,
      })),
    [etiquetas],
  );

  const optionsTecs = React.useMemo(
    () =>
      tecnicos.map((tec) => ({
        value: tec.id.toString(),
        label: tec.nombre,
      })),
    [tecnicos],
  );

  const optionsCustomers = React.useMemo(
    () =>
      clientes.map((cliente) => ({
        value: cliente.id.toString(),
        label: cliente.nombre,
      })),
    [clientes],
  );

  const selectedTicket = React.useMemo(
    () =>
      ticketsSoporte.find((ticket) => ticket.id === ui.state.selectedTicketId),
    [ticketsSoporte, ui.state.selectedTicketId],
  );

  const patchFilters = React.useCallback(
    (patch: Partial<QuerySearchTickets>, resetPage = true) => {
      filters.setState((prev) => ({
        ...prev,
        ...patch,
        page: resetPage ? 1 : (patch.page ?? prev.page),
      }));
    },
    [filters],
  );

  const handleTicketListTabChange = React.useCallback(
    (value: string) => {
      ui.setField("ticketTab", value);

      patchFilters({
        vista: value,
      });
    },
    [patchFilters, ui],
  );

  const handleNextPage = React.useCallback(() => {
    if (!meta.hasNextPage) return;

    patchFilters(
      {
        page: (filters.state.page ?? 1) + 1,
      },
      false,
    );
  }, [filters.state.page, meta.hasNextPage, patchFilters]);

  const handlePrevPage = React.useCallback(() => {
    if (!meta.hasPrevPage) return;

    patchFilters(
      {
        page: Math.max((filters.state.page ?? 1) - 1, 1),
      },
      false,
    );
  }, [filters.state.page, meta.hasPrevPage, patchFilters]);

  const setDashboardTab = React.useCallback(
    (value: string) => {
      ui.setField("dashboardTab", value);
    },
    [ui],
  );

  const handleDashboardTabChange = useTabChangeWithUrl({
    activeTab: ui.state.dashboardTab,
    setActiveTab: setDashboardTab,
    searchParams,
    setSearchParams,
  });

  const setSelectedTicketId = React.useCallback(
    (value: React.SetStateAction<number | null>) => {
      const nextValue =
        typeof value === "function" ? value(ui.state.selectedTicketId) : value;

      ui.setField("selectedTicketId", nextValue);
    },
    [ui],
  );

  const tabs = React.useMemo<Array<AppTabItem>>(
    () => [
      {
        label: "Tickets",
        value: "tickets",
        icon: <TicketIcon size={16} />,
        content: (
          <AppStack gap="sm">
            <TicketFilters
              ticketsTotal={ticketsData.ticketsDisponibles}
              tickets={ticketsSoporte}
              value={filters.state}
              onChange={patchFilters}
              userId={userId}
              openCreatT={createTicketDialog.isOpen}
              setOpenCreateT={createTicketDialog.setOpen}
              getTickets={getTickets}
              tecnicos={tecnicos}
              etiquetas={etiquetas}
              sectores={sectores}
            />

            <div className="h-[calc(100vh-230px)] min-h-0 gap-4 lg:grid lg:grid-cols-2">
              <div
                className={[
                  "flex flex-col overflow-hidden rounded-[var(--app-radius-lg)]",
                  "border border-[hsl(var(--app-border,var(--border)))]",
                  "bg-[hsl(var(--app-background,var(--background)))]",
                  selectedTicket ? "h-1/2" : "h-full",
                  "lg:h-full",
                ].join(" ")}
              >
                <div className="min-h-0 flex-1">
                  <TicketList
                    tickets={ticketsSoporte}
                    ticketsData={ticketsData}
                    selectedTicketId={ui.state.selectedTicketId}
                    onSelectTicket={(ticket) =>
                      ui.setField("selectedTicketId", ticket.id)
                    }
                    activeTab={ui.state.ticketTab}
                    onTabChange={handleTicketListTabChange}
                  />
                </div>

                <div className="z-10 shrink-0">
                  <CrmTicketPagination
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    meta={meta}
                  />
                </div>
              </div>

              {selectedTicket ? (
                <div
                  className={[
                    "flex h-1/2 flex-col overflow-hidden rounded-[var(--app-radius-lg)]",
                    "border border-[hsl(var(--app-border,var(--border)))]",
                    "bg-[hsl(var(--app-background,var(--background)))]",
                    "lg:h-full",
                  ].join(" ")}
                >
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
              ) : null}
            </div>
          </AppStack>
        ),
      },
      {
        label: "Operativo",
        value: "operativo",
        icon: <Kanban size={16} />,
        content: <OperativoMainPage tecnicos={tecnicos} />,
      },
      {
        label: "Gerencial",
        value: "gerencial",
        icon: <Clipboard size={16} />,
        content: (
          <div className="rounded-[var(--app-radius-lg)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-6 text-sm text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Próximamente
          </div>
        ),
      },
    ],
    [
      createTicketDialog.isOpen,
      createTicketDialog.setOpen,
      etiquetas,
      filters.state,
      getTickets,
      handleNextPage,
      handlePrevPage,
      handleTicketListTabChange,
      meta,
      optionsCustomers,
      optionsLabels,
      optionsTecs,
      patchFilters,
      query,
      sectores,
      selectedTicket,
      setSelectedTicketId,
      soluciones,
      tecnicos,
      ticketsData,
      ticketsSoporte,
      ui,
      userId,
    ],
  );

  return (
    <PageTransitionCrm titleHeader="Tickets Soporte" variant="fade-pure">
      <AppContainer size="full" paddingX="none" paddingY="none">
        <AppTabs
          tabs={tabs}
          value={ui.state.dashboardTab}
          onValueChange={handleDashboardTabChange}
          variant="compact"
          size="sm"
          contentSpacing="sm"
          listClassName="w-full"
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}
