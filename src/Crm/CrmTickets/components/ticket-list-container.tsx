import { Ticket } from "../ticketTypes";
import { TicketEmptyState } from "./ticket-empty-state";
import { TicketItem } from "./ticket-item";

interface EmptyMessage {
  title: string;
  description: string;
}

interface TicketsListContainerProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  colorMap: Record<number, string>;
  emptyMessage: EmptyMessage;
}

export function TicketsListContainer({
  tickets,
  selectedTicketId,
  onSelectTicket,
  colorMap,
  emptyMessage,
}: TicketsListContainerProps) {
  if (tickets.length === 0) {
    return (
      <TicketEmptyState
        title={emptyMessage.title}
        description={emptyMessage.description}
      />
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          isSelected={Number(selectedTicketId) === Number(ticket.id)}
          onSelect={onSelectTicket}
          avatarColor={colorMap[ticket.id] ?? "bg-gray-400"}
        />
      ))}
    </div>
  );
}
