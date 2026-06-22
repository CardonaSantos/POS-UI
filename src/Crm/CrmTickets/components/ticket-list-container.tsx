"use client";

import type { Ticket } from "../ticketTypes";
import { TicketEmptyState } from "./ticket-empty-state";
import { TicketItem } from "./ticket-item";
import { getTicketAvatarStyle } from "../_components/ticket-list.helpers";

interface TicketsListContainerProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  emptyMessage: {
    title: string;
    description: string;
  };
}

export function TicketsListContainer({
  tickets,
  selectedTicketId,
  onSelectTicket,
  emptyMessage,
}: TicketsListContainerProps) {
  if (!tickets.length) {
    return (
      <TicketEmptyState
        title={emptyMessage.title}
        description={emptyMessage.description}
      />
    );
  }

  return (
    <div className="min-h-full">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          isSelected={ticket.id === selectedTicketId}
          onSelect={onSelectTicket}
          avatarStyle={getTicketAvatarStyle(ticket.id)}
        />
      ))}
    </div>
  );
}
