"use client";

import { Layers } from "lucide-react";

interface TicketCounterProps {
  total: number;
  label?: string;
}

export function TicketCounter({ total, label = "tickets" }: TicketCounterProps) {
  return (
    <span
      title={`${total} ${label}`}
      className="inline-flex items-center gap-1 h-7 px-2 border border-gray-200 rounded bg-white text-[11px] text-gray-500 shrink-0"
    >
      <Layers className="h-3 w-3" />
      <span className="font-medium text-gray-700">{total}</span>
    </span>
  );
}
