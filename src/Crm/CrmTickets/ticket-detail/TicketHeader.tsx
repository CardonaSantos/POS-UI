import {
  X,
  Ellipsis,
  TicketSlash,
  RotateCcw,
  FileText,
  Sticker,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket } from "../ticketTypes";
import { BadgeProps } from "./ticket-detail.types";

interface TicketHeaderProps {
  ticket: Ticket;
  badgeProps: BadgeProps;
  onCloseView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseTicket: () => void;
}

/** Initials avatar — no external deps */
function InitialsAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500 text-white font-bold ${className}`}
    >
      {initials || "?"}
    </span>
  );
}

export function TicketHeader({
  ticket,
  badgeProps,
  onCloseView,
  onEdit,
  onDelete,
  onCloseTicket,
}: TicketHeaderProps) {
  const customerName = ticket.customer?.name ?? null;
  const assigneeName = ticket.assignee?.name ?? null;

  return (
    <div className="px-3 pt-2 pb-2 border-b bg-white sticky top-0 z-10">
      {/* Row 1: avatar + customer + actions */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <InitialsAvatar
            name={customerName ?? "NA"}
            className="w-6 h-6 text-[9px] shrink-0"
          />
          <div className="flex flex-col leading-none min-w-0">
            <span
              className={`text-xs font-semibold truncate ${
                customerName ? "text-blue-600" : "text-gray-400 italic"
              }`}
            >
              {customerName ?? "Sin cliente"}
            </span>
            <span className="text-[10px] text-gray-400 truncate">
              {assigneeName ? `Téc: ${assigneeName}` : "Sin técnico"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Priority badge */}
          <span
            className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${badgeProps.bgColor} ${badgeProps.textColor}`}
          >
            {badgeProps.text}
          </span>

          {ticket.fixed && (
            <Pin
              className="w-3 h-3 text-amber-500 ml-0.5"
              aria-label="Fijado"
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400"
              >
                <Ellipsis className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 text-xs">
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 justify-between text-xs cursor-pointer"
              >
                Eliminar <TicketSlash className="w-3.5 h-3.5" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onEdit}
                className="justify-between text-xs cursor-pointer"
              >
                Editar <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem className="justify-between text-xs cursor-pointer">
                <a
                  href={`/crm-boleta-ticket-soporte/${ticket.id}`}
                  className="flex w-full justify-between items-center"
                >
                  Boleta <FileText className="w-3.5 h-3.5 text-gray-400" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onCloseTicket}
                className="justify-between text-xs cursor-pointer"
              >
                Cerrar Ticket <Sticker className="w-3.5 h-3.5 text-gray-400" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={onCloseView}
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-red-50 hover:text-red-500 text-gray-400"
            aria-label="Cerrar detalle"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Row 2: title + description */}
      <div className="mt-1.5 min-w-0">
        <p className="text-xs font-semibold leading-tight truncate text-gray-800">
          <span className="text-gray-400 font-normal mr-1">#{ticket.id}</span>
          {ticket.title}
        </p>
        {ticket.description && (
          <p className="text-[10px] text-gray-400 truncate mt-0.5">
            {ticket.description}
          </p>
        )}
      </div>
    </div>
  );
}
