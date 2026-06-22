"use client";

import * as React from "react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { TicketsData } from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import type { Ticket } from "../ticketTypes";

import { TicketsListContainer } from "./ticket-list-container";
import {
  getTicketTabCount,
  TICKET_LIST_TABS,
  TicketListTabValue,
} from "../_components/ticket-list.helpers";

interface TicketListProps {
  tickets: Ticket[];
  ticketsData: TicketsData;
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function TicketList({
  tickets,
  ticketsData,
  selectedTicketId,
  onSelectTicket,
  activeTab,
  onTabChange,
}: TicketListProps) {
  const resolvedActiveTab = React.useMemo<TicketListTabValue>(() => {
    const exists = TICKET_LIST_TABS.some((tab) => tab.value === activeTab);

    return exists ? (activeTab as TicketListTabValue) : "inbox";
  }, [activeTab]);

  const activeTabData =
    TICKET_LIST_TABS.find((tab) => tab.value === resolvedActiveTab) ??
    TICKET_LIST_TABS[0];

  return (
    <AppStack
      gap="none"
      className="h-full overflow-hidden border-r border-[hsl(var(--app-border,var(--border)))]"
    >
      <div className="shrink-0 border-b border-[hsl(var(--app-border,var(--border)))] px-2 py-1.5">
        <div className="rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted))/0.45)] p-0.5">
          <AppInline gap="none" align="center" className="grid grid-cols-3">
            {TICKET_LIST_TABS.map((tab) => {
              const isActive = tab.value === resolvedActiveTab;
              const count = getTicketTabCount(ticketsData, tab.countKey);

              return (
                <AppButton
                  key={tab.value}
                  type="button"
                  variant={isActive ? "secondary" : "ghost"}
                  size="xs"
                  width="full"
                  className={[
                    "h-6 justify-center rounded-[var(--app-radius-sm)] px-1",
                    "text-[10px] font-medium",
                    isActive
                      ? "bg-[hsl(var(--app-background,var(--background)))] text-[hsl(var(--app-foreground,var(--foreground)))]"
                      : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                  ].join(" ")}
                  onClick={() => onTabChange(tab.value)}
                >
                  <span className="truncate">{tab.label}</span>
                  <span className="ml-1 text-[9px] opacity-70">({count})</span>
                </AppButton>
              );
            })}
          </AppInline>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <TicketsListContainer
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={onSelectTicket}
          emptyMessage={activeTabData.emptyMessage}
        />
      </div>
    </AppStack>
  );
}
