"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket } from "../ticketTypes";
import { TicketsData } from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { AVATAR_COLORS } from "./ticket-badge-helper";
import { TicketsListContainer } from "./ticket-list-container";

interface TicketListProps {
  tickets: Ticket[];
  ticketsData: TicketsData;
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TABS = [
  {
    value: "inbox",
    label: "Todos",
    countKey: "ticketsDisponibles" as const,
    emptyMessage: {
      title: "Todo al día",
      description: "No hay tickets pendientes.",
    },
  },
  {
    value: "enProceso",
    label: "En proceso",
    countKey: "ticketEnProceso" as const,
    emptyMessage: {
      title: "Sin actividad",
      description: "No hay tickets en proceso.",
    },
  },
  {
    value: "lista",
    label: "Resueltos",
    countKey: "ticketsResueltos" as const,
    emptyMessage: {
      title: "Sin resueltos",
      description: "Aún no hay tickets resueltos.",
    },
  },
] as const;

export default function TicketList({
  tickets,
  ticketsData,
  selectedTicketId,
  onSelectTicket,
  activeTab,
  onTabChange,
}: TicketListProps) {
  const [colorMap, setColorMap] = useState<Record<number, string>>({});

  useEffect(() => {
    setColorMap((prev) => {
      const next = { ...prev };
      let changed = false;
      tickets.forEach((t) => {
        if (!(t.id in next)) {
          next[t.id] =
            AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [tickets]);

  return (
    <div className="flex flex-col h-full border-r border-border overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col h-full"
      >
        {/* Tab header */}
        <div className="border-b border-border px-2 py-1.5 shrink-0">
          <TabsList className="w-full h-7 bg-muted/50 p-0.5 grid grid-cols-3">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-[10px] h-full data-[state=active]:bg-background data-[state=active]:shadow-none px-1"
              >
                {tab.label}
                <span className="ml-1 text-[9px] text-muted-foreground">
                  ({ticketsData[tab.countKey]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab panels */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {TABS.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="m-0 h-full data-[state=active]:flex data-[state=active]:flex-col overflow-y-auto"
            >
              <TicketsListContainer
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelectTicket={onSelectTicket}
                colorMap={colorMap}
                emptyMessage={tab.emptyMessage}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
