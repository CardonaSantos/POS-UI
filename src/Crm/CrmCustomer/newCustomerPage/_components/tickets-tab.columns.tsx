import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Eye } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import type { TicketSoporte } from "@/Crm/features/cliente-interfaces/cliente-types";
import { TicketEstadoBadge, TicketPrioridadBadge } from "./helpers-tickets";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

interface CreateTicketColumnsParams {
  onView: (ticket: TicketSoporte) => void;
}

function EmptyText({ children = "N/A" }: { children?: React.ReactNode }) {
  return (
    <span className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
      {children}
    </span>
  );
}

export function createTicketsColumns({
  onView,
}: CreateTicketColumnsParams): ColumnDef<TicketSoporte, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      size: 50,
      minSize: 50,
      cell: ({ row }) => (
        <span className="text-xs font-semibold">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "titulo",
      header: "Título",
      size: 260,
      meta: {
        grow: true,
        truncate: true,
      },
      cell: ({ row }) => {
        const titulo = row.original.titulo;

        return titulo ? (
          <span className="block truncate text-xs font-medium" title={titulo}>
            {titulo}
          </span>
        ) : (
          <EmptyText>Sin título</EmptyText>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 150,
      cell: ({ row }) => <TicketEstadoBadge estado={row.original.estado} />,
    },
    {
      accessorKey: "prioridad",
      header: "Prioridad",
      size: 120,
      cell: ({ row }) => (
        <TicketPrioridadBadge prioridad={row.original.prioridad} />
      ),
    },
    {
      accessorKey: "fechaApertura",
      header: "Apertura",
      size: 120,
      cell: ({ row }) => (
        <span className="text-xs">
          {formattFechaWithMinutes(row.original.fechaApertura)}
        </span>
      ),
    },
    {
      accessorKey: "fechaCierre",
      header: "Cierre",
      size: 120,
      cell: ({ row }) =>
        row.original.fechaCierre ? (
          <span className="text-xs">
            {formattFechaWithMinutes(row.original.fechaCierre)}
          </span>
        ) : (
          <EmptyText>Sin cerrar</EmptyText>
        ),
    },
    {
      id: "tecnico",
      header: "Técnico",
      size: 150,
      cell: ({ row }) => {
        const tecnico = row.original.tecnico?.nombre;

        return tecnico ? (
          <span className="block truncate text-xs" title={tecnico}>
            {tecnico}
          </span>
        ) : (
          <EmptyText />
        );
      },
    },
    {
      id: "acciones",
      header: "",
      size: 40,
      minSize: 45,
      meta: {
        align: "right",
      },
      cell: ({ row }) => (
        <AppButton
          type="button"
          variant="ghost"
          size="xs"
          width="auto"
          aria-label={`Ver ticket ${row.original.id}`}
          onClick={(event) => {
            event.stopPropagation();
            onView(row.original);
          }}
        >
          <Eye size={15} />
        </AppButton>
      ),
    },
  ];
}
