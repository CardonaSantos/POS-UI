import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Ellipsis, TicketSlash, RotateCcw, FileText, Sticker } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Ticket } from "../ticketTypes";

interface TicketHeaderProps {
  ticket: Ticket;
  badgeProps: { bgColor: string; text: string; textColor: string };
  onCloseView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseTicket: () => void;
}

export const TicketHeader = ({
  ticket,
  badgeProps,
  onCloseView,
  onEdit,
  onDelete,
  onCloseTicket,
}: TicketHeaderProps) => {
  return (
    // CAMBIO 1 y 5: Padding reducido (p-3) y uso de bg-background para "auto" color
    <div className="p-3 border-b bg-background sticky top-0 z-10">
      
      {/* Fila Superior: Avatar + Acciones */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5"> {/* Gap reducido un poco */}
          
          {/* CAMBIO 2: Avatar más pequeño (w-8 h-8) */}
          <Avatar className="w-8 h-8 border">
            <AvatarFallback className="text-[10px] font-bold bg-emerald-500 text-white">
              {ticket.customer?.name?.slice(0, 2).toUpperCase() || "NA"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col leading-none"> {/* leading-none aprieta el texto verticalmente */}
            {ticket.customer ? (
              <Link 
                to={`/crm/cliente/${ticket.customer.id}`} 
                className="text-xs font-bold text-blue-600 hover:underline mb-0.5"
              >
                {ticket.customer.name}
              </Link>
            ) : (
              <span className="text-xs font-bold text-gray-400 italic mb-0.5">Sin cliente</span>
            )}
            <span className="text-[10px] text-gray-500">
              {ticket.assignee ? `Téc: ${ticket.assignee.name}` : "Sin técnico"}
            </span>
          </div>
        </div>

        {/* Acciones Compactas */}
        <div className="flex items-center gap-1"> {/* Gap reducido entre botones */}
          <Badge variant="outline" className={`h-5 px-1.5 text-[9px] border-0 ${badgeProps.bgColor} ${badgeProps.textColor}`}>
             {badgeProps.text}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                <Ellipsis className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50 justify-between cursor-pointer">
                Eliminar <TicketSlash className="w-3.5 h-3.5" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit} className="justify-between cursor-pointer">
                Editar <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              </DropdownMenuItem>
               <DropdownMenuItem asChild className="cursor-pointer justify-between">
                <Link to={`/crm-boleta-ticket-soporte/${ticket.id}`} className="w-full flex justify-between">
                   Boleta <FileText className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCloseTicket} className="justify-between cursor-pointer">
                Cerrar Ticket <Sticker className="w-3.5 h-3.5 text-gray-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onCloseView} variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-50 hover:text-red-600 text-gray-400">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* CAMBIO 3 y 4: Menos margen superior (mt-1.5) y truncate para una sola línea */}
      <div className="mt-1.5 px-0.5">
         <h2 className="text-sm font-bold leading-tight truncate pr-2">{ticket.title}</h2>
         <p className="text-[11px] text-gray-500 truncate h-4">
           {ticket.description || ""}
         </p>
      </div>
    </div>
  );
};