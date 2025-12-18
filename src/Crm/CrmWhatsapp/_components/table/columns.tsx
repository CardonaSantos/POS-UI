"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ClienteWhatsappServerListItem } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const clientesColumns: ColumnDef<ClienteWhatsappServerListItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="text-xs">#{row.original.id}</span>,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const unreadCount = row.original.mensajesSinVer; // Extraemos el valor para limpiar el código

      return (
        <div className="min-w-0 flex flex-col">
          <Link to={`/crm/bot/cliente-whatsapp/${row.original.id}`}>
            {/* Usamos flex para poner Nombre + Badge en la misma linea */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {row.original.nombre || "Sin nombre"}
              </span>

              {/* Condicional: Solo renderiza si hay mensajes sin ver */}
              {unreadCount > 0 && (
                <Badge
                  variant="destructive" // Rojo (shadcn standard) para denotar urgencia
                  className="h-5 min-w-[1.25rem] px-1 text-[10px] flex items-center justify-center rounded-full"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Link>

          <div className="text-xs text-muted-foreground truncate">
            {row.original.telefono}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row }) => <span className="text-sm">{row.original.telefono}</span>,
  },
  {
    accessorKey: "creadoEn",
    header: "Creado",
    cell: ({ row }) => {
      const timeAgo = formatDistanceToNow(new Date(row.original.creadoEn), {
        addSuffix: true,
        locale: es,
      });
      return <span className="text-xs text-muted-foreground">{timeAgo}</span>;
    },
  },
];
