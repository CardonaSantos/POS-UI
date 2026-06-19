"use client";

import * as React from "react";
import { Ticket } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";
import type {
  ClienteDetailsDto,
  TicketSoporte,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import { createTicketsColumns } from "./tickets-tab.columns";
import { TicketDetailsDialog } from "./ticket-details-dialog";

interface TicketsTabProps {
  cliente: Pick<ClienteDetailsDto, "ticketSoporte">;
}

const TICKETS_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function TicketsTab({ cliente }: TicketsTabProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialColumnVisibility: {},
  });

  const detailDialog = useAppDisclosure();

  const detailsState = useAppStateHandlers({
    selectedTicket: null as TicketSoporte | null,
  });

  const tickets = React.useMemo(
    () => (Array.isArray(cliente.ticketSoporte) ? cliente.ticketSoporte : []),
    [cliente.ticketSoporte],
  );

  const handleViewTicket = React.useCallback(
    (ticket: TicketSoporte) => {
      detailsState.setField("selectedTicket", ticket);
      detailDialog.open();
    },
    [detailsState, detailDialog],
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      detailDialog.setOpen(open);

      if (!open) {
        detailsState.setField("selectedTicket", null);
      }
    },
    [detailDialog, detailsState],
  );

  const columns = React.useMemo(
    () =>
      createTicketsColumns({
        onView: handleViewTicket,
      }),
    [handleViewTicket],
  );

  return (
    <AppStack gap="sm">
      <AppCard
        variant="outline"
        size="sm"
        radius="md"
        className="overflow-visible"
      >
        <AppStack gap="sm">
          <div className="flex items-center gap-2 p-1">
            <Ticket size={16} className="shrink-0" />

            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Tickets de soporte</h2>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Historial de tickets registrados para este cliente.
              </p>
            </div>
          </div>

          <AppDataTable<TicketSoporte>
            data={tickets}
            columns={columns}
            getRowId={(row) => String(row.id)}
            paginationMode="client"
            pagination={table.getPaginationConfig({
              totalRows: tickets.length,
              pageSizeOptions: TICKETS_PAGE_SIZE_OPTIONS,
            })}
            {...table.getDataTableStateProps()}
            enableRowSelection={false}
            enableColumnVisibility
            enableColumnPinning={false}
            enableVirtualization
            stickyHeader
            density={table.density}
            maxHeight="430px"
            emptyTitle="Sin tickets de soporte"
            emptyDescription="No hay tickets de soporte registrados para este cliente."
          />
        </AppStack>
      </AppCard>

      <TicketDetailsDialog
        isOpen={detailDialog.isOpen}
        onOpenChange={handleOpenChange}
        ticket={detailsState.state.selectedTicket}
      />
    </AppStack>
  );
}
