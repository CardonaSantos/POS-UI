"use client";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { getTicketPriorityTone } from "../_components/ticket-list.helpers";

interface TicketPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function TicketPriorityBadge({
  priority,
  className,
}: TicketPriorityBadgeProps) {
  return (
    <AppBadge
      tone={getTicketPriorityTone(priority)}
      appearance="soft"
      size="xs"
      radius="sm"
      className={[
        "h-4 px-1 text-[9px] uppercase tracking-wide",
        className ?? "",
      ].join(" ")}
    >
      {priority}
    </AppBadge>
  );
}
