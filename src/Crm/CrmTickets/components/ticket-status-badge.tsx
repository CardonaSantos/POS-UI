"use client";

import { AppBadge } from "@/components/app/primitives/app-badge";
import {
  getTicketStatusTone,
  LIVE_TICKET_STATUSES,
  normalizeTicketStatus,
} from "../_components/ticket-list.helpers";

interface TicketStatusBadgeProps {
  status: string;
  className?: string;
}

export function TicketStatusBadge({
  status,
  className,
}: TicketStatusBadgeProps) {
  const isLive = LIVE_TICKET_STATUSES.has(status);

  return (
    <AppBadge
      tone={getTicketStatusTone(status)}
      appearance="outline"
      size="xs"
      radius="sm"
      dot={isLive}
      dotPulse={isLive}
      className={[
        "h-4 px-1 text-[9px] font-semibold uppercase tracking-wide",
        className ?? "",
      ].join(" ")}
    >
      {normalizeTicketStatus(status)}
    </AppBadge>
  );
}
