"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ClienteWhatsappServerListItem } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

export const clientesColumns: ColumnDef<ClienteWhatsappServerListItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="text-xs">#{row.original.id}</span>,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link to={`/crm/bot/cliente-whatsapp/${row.original.id}`}>
          <div className="text-sm font-medium truncate">
            {row.original.nombre || "Sin nombre"}
          </div>
        </Link>

        <div className="text-xs text-muted-foreground truncate">
          {row.original.telefono}
        </div>
      </div>
    ),
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
