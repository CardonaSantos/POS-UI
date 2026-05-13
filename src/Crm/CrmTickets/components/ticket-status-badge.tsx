import { cn } from "@/lib/utils";
import { getStatusStyles, LIVE_STATUSES } from "./ticket-badge-helper";

interface TicketStatusBadgeProps {
  status: string;
  className?: string;
}

export function TicketStatusBadge({
  status,
  className,
}: TicketStatusBadgeProps) {
  const isLive = LIVE_STATUSES.has(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-px rounded border text-[10px] font-semibold uppercase tracking-wide leading-none",
        getStatusStyles(status),
        className,
      )}
    >
      {isLive && (
        <span className="w-1 h-1 rounded-full bg-current opacity-70 animate-pulse shrink-0" />
      )}
      {status.replace(/_/g, " ")}
    </span>
  );
}
