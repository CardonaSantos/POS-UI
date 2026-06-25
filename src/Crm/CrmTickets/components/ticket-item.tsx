"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pin, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { Ticket } from "../ticketTypes";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";
import { getTicketInitials } from "../_components/ticket-list.helpers";

interface TicketItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  avatarStyle: CSSProperties;
}

function formatTicketDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return format(parsed, "d MMM", { locale: es });
}

export function TicketItem({
  ticket,
  isSelected,
  onSelect,
  avatarStyle,
}: TicketItemProps) {
  const isAssigned = Boolean(ticket.assignee);
  const dateFormatted = formatTicketDate(ticket.date);
  const initials = getTicketInitials(ticket);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelect(ticket);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(ticket)}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full cursor-pointer select-text border-b border-[hsl(var(--app-border,var(--border))/0.55)]",
        "border-l-2 px-2 py-1.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        isSelected
          ? "border-l-[hsl(var(--app-primary))] bg-[hsl(var(--app-muted,var(--muted))/0.58)]"
          : "border-l-transparent bg-transparent hover:border-l-[hsl(var(--app-border,var(--border)))] hover:bg-[hsl(var(--app-muted,var(--muted))/0.35)]",
      )}
    >
      <AppInline gap="xs" align="start" className="w-full">
        <div className="mt-0.5 shrink-0">
          <span
            style={avatarStyle}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
            aria-hidden="true"
          >
            {initials}
          </span>
        </div>

        <AppStack gap="none" className="min-w-0 flex-1">
          <AppInline
            gap="xs"
            align="center"
            justify="between"
            className="w-full"
          >
            <AppInline gap="xs" align="center" className="min-w-0">
              {ticket.fixed ? (
                <Pin
                  size={11}
                  className="shrink-0 rotate-45 fill-[hsl(var(--app-warning))]/30 text-[hsl(var(--app-warning))]"
                  aria-label="Fijado"
                />
              ) : null}

              <span className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                {ticket.customer?.name ?? "Sin cliente"}
              </span>
            </AppInline>

            <time
              dateTime={ticket.date}
              className="shrink-0 whitespace-nowrap text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            >
              {dateFormatted}
            </time>
          </AppInline>

          <AppInline gap="xs" align="center" className="min-w-0 pt-0.5">
            <span className="shrink-0 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.6)] px-1 py-px font-mono text-[10px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              #{ticket.id}
            </span>

            <span
              className={cn(
                "truncate text-xs leading-snug",
                isSelected
                  ? "font-medium text-[hsl(var(--app-foreground,var(--foreground)))]"
                  : "text-[hsl(var(--app-foreground,var(--foreground))/0.82)]",
              )}
            >
              {ticket.title}
            </span>
          </AppInline>

          <AppInline
            gap="xs"
            align="center"
            justify="between"
            className="mt-1 w-full"
          >
            <AppInline
              gap="xs"
              align="center"
              className="min-w-0 overflow-hidden"
            >
              <AppInline
                gap="none"
                align="center"
                className="shrink-0"
                title={isAssigned ? ticket.assignee?.name : "Sin asignar"}
              >
                <User
                  size={11}
                  className={cn(
                    "mr-0.5",
                    isAssigned
                      ? "text-[hsl(var(--app-success))]"
                      : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground))/0.45)]",
                  )}
                />

                <span
                  className={cn(
                    "max-w-[64px] truncate text-[10px]",
                    isAssigned
                      ? "font-medium text-[hsl(var(--app-success))]"
                      : "italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground))/0.55)]",
                  )}
                >
                  {isAssigned ? ticket.assignee?.name.split(" ")[0] : "—"}
                </span>
              </AppInline>

              {ticket.tags?.length ? (
                <>
                  <span
                    className="h-3 w-px shrink-0 bg-[hsl(var(--app-border,var(--border))/0.65)]"
                    aria-hidden="true"
                  />

                  <AppInline gap="none" align="center" className="min-w-0">
                    {ticket.tags.slice(0, 2).map((tag) => (
                      <AppBadge
                        key={`${ticket.id}-${tag.value}-${tag.label}`}
                        tone="neutral"
                        appearance="soft"
                        size="xs"
                        radius="sm"
                        className="mr-0.5 max-w-[56px] truncate px-1 text-[9px]"
                        title={tag.label}
                      >
                        {tag.label}
                      </AppBadge>
                    ))}

                    {ticket.tags.length > 2 ? (
                      <span className="text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                        +{ticket.tags.length - 2}
                      </span>
                    ) : null}
                  </AppInline>
                </>
              ) : null}
            </AppInline>

            <AppInline gap="xs" align="center" className="shrink-0">
              <TicketPriorityBadge priority={ticket.priority} />
              <TicketStatusBadge status={ticket.status} />
            </AppInline>
          </AppInline>
        </AppStack>
      </AppInline>
    </div>
  );
}
