"use client";
import * as React from "react";
import { AlertTriangle, ClipboardList, RefreshCw } from "lucide-react";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useGetTicketsAsignados } from "../CrmHooks/hooks/dashboard/useDashboard";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { TicketAsignadoCard } from "./_components/tec-ticket/TicketAsignadoCard";
import { TecDashboardSummary } from "./_components/tec-dashboard-summary";
import {
  getTicketStats,
  sortTicketsForTechnician,
} from "./_components/ticket-helpers";

function TecDashboard() {
  const tecId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const ticketsQuery = useGetTicketsAsignados(tecId);

  const {
    data: tks = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ticketsQuery;

  const tickets = React.useMemo(() => {
    if (!Array.isArray(tks)) return [];

    return [...tks].sort(sortTicketsForTechnician);
  }, [tks]);

  const stats = React.useMemo(() => getTicketStats(tickets), [tickets]);

  return (
    <PageTransitionCrm
      titleHeader="Mis tickets"
      fallbackBackTo="/crm"
      variant="crm-soft"
      stickyHeader
      actions={
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          width="auto"
          leftIcon={
            <RefreshCw
              className={["h-3.5 w-3.5", isFetching ? "animate-spin" : ""].join(
                " ",
              )}
            />
          }
          disabled={isFetching}
          onClick={() => refetch()}
        >
          Actualizar
        </AppButton>
      }
    >
      <AppStack
        gap="sm"
        // className="pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      >
        <TecDashboardSummary stats={stats} isFetching={isFetching} />

        <AppDataState
          isLoading={isLoading}
          isFetching={isFetching}
          error={isError ? error : null}
          isEmpty={!tickets.length}
          onRetry={() => refetch()}
          loadingVariant="skeleton-card"
          loadingRows={4}
          emptyFallback={
            <AppEmptyState
              preset="empty"
              variant="outline"
              size="sm"
              align="center"
              icon={<ClipboardList className="h-6 w-6" />}
              title="Sin tickets asignados"
              description="No tienes tickets pendientes por atender en este momento."
              action={
                <AppButton
                  type="button"
                  size="xs"
                  variant="secondary"
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  onClick={() => refetch()}
                >
                  Actualizar
                </AppButton>
              }
            />
          }
          errorFallback={
            <AppEmptyState
              preset="error"
              variant="outline"
              size="sm"
              align="center"
              icon={<AlertTriangle className="h-6 w-6" />}
              title="No se pudieron cargar los tickets"
              description="Revisa tu conexión o intenta actualizar nuevamente."
              action={
                <AppButton
                  type="button"
                  size="xs"
                  variant="secondary"
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  onClick={() => refetch()}
                >
                  Reintentar
                </AppButton>
              }
            />
          }
        >
          <section aria-label="Lista de tickets asignados">
            <AppStack gap="2xl">
              {tickets.map((ticket) => (
                <TicketAsignadoCard key={ticket.id} ticket={ticket} />
              ))}
            </AppStack>
          </section>
        </AppDataState>
      </AppStack>
    </PageTransitionCrm>
  );
}

export default TecDashboard;
