"use client";

import { Inbox } from "lucide-react";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

interface TicketEmptyStateProps {
  title: string;
  description: string;
}

export function TicketEmptyState({
  title,
  description,
}: TicketEmptyStateProps) {
  return (
    <AppEmptyState
      preset="empty"
      variant="plain"
      size="sm"
      align="center"
      fullHeight
      icon={<Inbox size={30} strokeWidth={1.5} />}
      title={title}
      description={description}
      className="px-4 py-10"
    />
  );
}
