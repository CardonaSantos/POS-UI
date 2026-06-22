"use client";

import {
  Ellipsis,
  FileText,
  Pin,
  RotateCcw,
  Sticker,
  TicketSlash,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";

import type { Ticket } from "../ticketTypes";
import {
  deferTicketDetailAction,
  getTicketCustomerInitials,
} from "../_components/ticket-detail.helpers";
import { getTicketPriorityTone } from "../_components/ticket-list.helpers";

interface TicketHeaderProps {
  ticket: Ticket;
  onCloseView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseTicket: () => void;
}

const menuItemClassName =
  "flex h-6 items-center justify-between gap-2 px-2 py-0 text-[10px] leading-none";

function InitialsAvatar({ ticket }: { ticket: Ticket }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--app-primary))] text-[8px] font-bold leading-none text-[hsl(var(--app-primary-foreground,var(--primary-foreground)))]">
      {getTicketCustomerInitials(ticket)}
    </span>
  );
}

export function TicketHeader({
  ticket,
  onCloseView,
  onEdit,
  onDelete,
  onCloseTicket,
}: TicketHeaderProps) {
  const customerName = ticket.customer?.name ?? null;
  const customerId = ticket.customer?.id ?? null;
  const assigneeName = ticket.assignee?.name ?? null;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] px-3 py-2">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-1.5">
          <div className="pt-[1px]">
            <InitialsAvatar ticket={ticket} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1">
              <span className="min-w-0 truncate text-[11px] font-semibold leading-4">
                {customerId ? (
                  <Link
                    to={`/crm/cliente/${customerId}`}
                    className="truncate text-[hsl(var(--app-primary))] hover:underline"
                  >
                    {customerName ?? "Sin cliente"}
                  </Link>
                ) : (
                  <span className="italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Sin cliente
                  </span>
                )}
              </span>
            </div>

            <div className="truncate text-[9px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {assigneeName ? `Téc: ${assigneeName}` : "Sin técnico"}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <AppBadge
            tone={getTicketPriorityTone(ticket.priority)}
            appearance="soft"
            size="xs"
            radius="sm"
            className="h-4 px-1 text-[8.5px] uppercase leading-none"
          >
            {ticket.priority}
          </AppBadge>

          {ticket.fixed ? (
            <Pin
              size={12}
              className="mx-0.5 shrink-0 text-[hsl(var(--app-warning))]"
              aria-label="Fijado"
            />
          ) : null}

          <AppDropdownMenu>
            <AppDropdownMenuTrigger
              className={[
                "inline-flex h-6 w-6 items-center justify-center rounded-[var(--app-radius-sm)]",
                "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.65)]",
                "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
              ].join(" ")}
              aria-label="Opciones del ticket"
            >
              <Ellipsis size={14} />
            </AppDropdownMenuTrigger>

            <AppDropdownMenuContent
              align="end"
              width="sm"
              size="xs"
              className="w-36 p-1"
            >
              <AppDropdownMenuItem
                className={`${menuItemClassName} text-[hsl(var(--app-danger))]`}
                onSelect={() => deferTicketDetailAction(onDelete)}
              >
                <span>Eliminar</span>
                <TicketSlash size={12} />
              </AppDropdownMenuItem>

              <AppDropdownMenuSeparator className="my-1" />

              <AppDropdownMenuItem
                className={menuItemClassName}
                onSelect={() => deferTicketDetailAction(onEdit)}
              >
                <span>Editar</span>
                <RotateCcw size={12} />
              </AppDropdownMenuItem>

              <AppDropdownMenuItem
                className={menuItemClassName}
                onSelect={() => {
                  window.location.href = `/crm-boleta-ticket-soporte/${ticket.id}`;
                }}
              >
                <span>Boleta</span>
                <FileText size={12} />
              </AppDropdownMenuItem>

              <AppDropdownMenuItem
                className={menuItemClassName}
                onSelect={() => deferTicketDetailAction(onCloseTicket)}
              >
                <span>Cerrar ticket</span>
                <Sticker size={12} />
              </AppDropdownMenuItem>
            </AppDropdownMenuContent>
          </AppDropdownMenu>

          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            width="auto"
            onClick={onCloseView}
            className="h-6 w-6 p-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] hover:text-[hsl(var(--app-danger))]"
            aria-label="Cerrar detalle"
          >
            <X size={14} />
          </AppButton>
        </div>
      </div>

      <div className="mt-1 min-w-0 pl-[26px]">
        <p className="truncate text-[11px] font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
          <span className="mr-1 font-normal text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            #{ticket.id}
          </span>
          {ticket.title}
        </p>

        {ticket.description ? (
          <p className="truncate text-[9.5px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {ticket.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
