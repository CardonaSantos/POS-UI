import { Pin, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Ticket } from "../ticketTypes";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

interface TicketItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  avatarColor: string;
}

export function TicketItem({
  ticket,
  isSelected,
  onSelect,
  avatarColor,
}: TicketItemProps) {
  const isAssigned = !!ticket.assignee;
  const dateFormatted = format(new Date(ticket.date), "d MMM", { locale: es });
  const initials = ticket.customer
    ? ticket.customer.name.slice(0, 2).toUpperCase()
    : "NA";

  return (
    <button
      type="button"
      onClick={() => onSelect(ticket)}
      className={cn(
        "w-full text-left flex gap-2 px-2 py-1.5 border-b border-border/50 cursor-pointer transition-colors",
        "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "border-l-2",
        isSelected
          ? "bg-muted/60 border-l-primary"
          : "bg-transparent border-l-transparent hover:border-l-border",
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <span
          className={cn(
            "flex h-6 w-6 rounded-full items-center justify-center text-[9px] font-bold text-white",
            avatarColor,
          )}
          aria-hidden="true"
        >
          {initials}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        {/* Row 1: customer + pin + date */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            {ticket.fixed && (
              <Pin
                className="w-2.5 h-2.5 text-orange-500 fill-orange-400/30 rotate-45 shrink-0"
                aria-label="Fijado"
              />
            )}
            <span className="text-xs font-medium text-foreground truncate">
              {ticket.customer?.name ?? "Sin Cliente"}
            </span>
          </div>
          <time
            dateTime={ticket.date}
            className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0"
          >
            {dateFormatted}
          </time>
        </div>

        {/* Row 2: id + title */}
        <div className="flex items-center gap-1 min-w-0">
          <span className="shrink-0 text-[10px] font-mono text-muted-foreground bg-muted border border-border/50 px-1 rounded-sm leading-none py-px">
            #{ticket.id}
          </span>
          <span
            className={cn(
              "text-xs truncate leading-snug",
              isSelected ? " font-medium" : "text-foreground/80",
            )}
          >
            {ticket.title}
          </span>
        </div>

        {/* Row 3: assignee + tags + badges */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          {/* Left: assignee + tags */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <div
              className="flex items-center gap-0.5 shrink-0"
              title={isAssigned ? ticket.assignee!.name : "Sin asignar"}
            >
              <User
                className={cn(
                  "w-2.5 h-2.5",
                  isAssigned
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground/40",
                )}
              />
              <span
                className={cn(
                  "text-[10px] truncate max-w-[64px]",
                  isAssigned
                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground/50 italic",
                )}
              >
                {isAssigned ? ticket.assignee!.name.split(" ")[0] : "—"}
              </span>
            </div>

            {ticket.tags && ticket.tags.length > 0 && (
              <>
                <span
                  className="w-px h-2.5 bg-border/50 shrink-0"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-0.5 overflow-hidden">
                  {ticket.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1 py-px bg-secondary text-secondary-foreground rounded-sm truncate max-w-[52px] leading-none"
                    >
                      {tag.label}
                    </span>
                  ))}
                  {ticket.tags.length > 2 && (
                    <span className="text-[9px] text-muted-foreground">
                      +{ticket.tags.length - 2}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: priority + status */}
          <div className="flex items-center gap-1 shrink-0">
            <TicketPriorityBadge priority={ticket.priority} />
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
      </div>
    </button>
  );
}
