import { cn } from "@/lib/utils";
import { getPriorityStyles } from "./ticket-badge-helper";

interface TicketPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function TicketPriorityBadge({
  priority,
  className,
}: TicketPriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-px rounded border text-[10px] uppercase tracking-wide leading-none",
        getPriorityStyles(priority),
        className,
      )}
    >
      {priority}
    </span>
  );
}
