import type { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Lock, Trash2 } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import { formattShortFecha } from "@/utils/formattFechas";
import { EstadoRuta, Ruta } from "@/Crm/features/rutas/rutas.interfaces";
import { ESTADO_RUTA_LABELS } from "./rutas_list_consts_";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type RutasListColumnHandlers = {
  onView: (ruta: Ruta) => void;
  onDelete: (ruta: Ruta) => void;
  onClose: (ruta: Ruta) => void;
  onDownloadExcel: (ruta: Ruta) => void;
};

function getEstadoRutaTone(estado?: EstadoRuta | string): AppBadgeTone {
  if (estado === EstadoRuta.ACTIVO) return "success";
  if (estado === EstadoRuta.ASIGNADA) return "info";
  if (estado === EstadoRuta.EN_CURSO) return "primary";
  if (estado === EstadoRuta.PENDIENTE) return "warning";
  if (estado === EstadoRuta.CERRADO) return "neutral";
  if (estado === EstadoRuta.COMPLETADO) return "success";
  if (estado === EstadoRuta.INACTIVO) return "neutral";

  return "neutral";
}

function canCloseRuta(ruta: Ruta) {
  return ![
    EstadoRuta.CERRADO,
    EstadoRuta.COMPLETADO,
    EstadoRuta.INACTIVO,
  ].includes(ruta.estadoRuta);
}

function EmptyText({ children = "-" }: { children?: React.ReactNode }) {
  return (
    <span className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
      {children}
    </span>
  );
}

export function createRutasListColumns(
  handlers: RutasListColumnHandlers,
): ColumnDef<Ruta, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      size: 20,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-[hsl(var(--app-muted-foreground))]">
          {row.original.id}
        </span>
      ),
    },

    {
      accessorKey: "nombreRuta",
      header: "Ruta",
      size: 230,
      enableSorting: false,
      meta: {
        grow: true,
      },
      cell: ({ row }) => {
        const nombre = row.original.nombreRuta;

        if (!nombre) return <EmptyText>Sin nombre</EmptyText>;

        return (
          <button
            type="button"
            className="block max-w-full truncate text-left text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
            title={nombre}
            onClick={() => handlers.onView(row.original)}
          >
            {nombre}
          </button>
        );
      },
    },

    {
      accessorKey: "estadoRuta",
      header: "Estado",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const estado = row.original.estadoRuta;

        return (
          <AppBadge
            tone={getEstadoRutaTone(estado)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {ESTADO_RUTA_LABELS[estado] ?? estado}
          </AppBadge>
        );
      },
    },

    {
      id: "cobrador",
      header: "Cobrador",
      size: 120,
      accessorFn: (row) =>
        row.cobrador
          ? `${row.cobrador.nombre ?? ""} ${row.cobrador.apellidos ?? ""}`.trim()
          : null,
      enableSorting: false,
      cell: ({ row }) => {
        const cobrador = row.original.cobrador;

        if (!cobrador) return <EmptyText>Sin cobrador</EmptyText>;

        const nombre = `${cobrador.nombre ?? ""} ${
          cobrador.apellidos ?? ""
        }`.trim();

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={nombre}
          >
            {nombre}
          </span>
        );
      },
    },

    {
      id: "clientes",
      header: "Clientes",
      size: 40,
      enableSorting: false,
      meta: {
        align: "center",
      },
      cell: ({ row }) => {
        const count = row.original.clientes?.length ?? 0;

        return (
          <AppBadge tone="info" appearance="soft" size="xs" radius="full">
            {count}
          </AppBadge>
        );
      },
    },

    {
      accessorKey: "totalACobrar",
      header: "A cobrar",
      size: 80,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => (
        <span className="text-xs font-semibold">
          {formattMonedaGT(row.original.totalACobrar)}
        </span>
      ),
    },

    {
      accessorKey: "totalCobrado",
      header: "Cobrado",
      size: 90,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-[hsl(var(--app-success))]">
          {formattMonedaGT(row.original.totalCobrado)}
        </span>
      ),
    },

    {
      accessorKey: "fechaCreacion",
      header: "Creada",
      size: 90,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
          {formattShortFecha(row.original.fechaCreacion)}
        </span>
      ),
    },

    {
      accessorKey: "observaciones",
      header: "Observaciones",
      size: 220,
      enableSorting: false,
      cell: ({ row }) => {
        const observaciones = row.original.observaciones;

        if (!observaciones) return <EmptyText>Sin observaciones</EmptyText>;

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={observaciones}
          >
            {observaciones}
          </span>
        );
      },
    },

    createAppRowActionsColumn<Ruta>({
      header: "",
      size: 44,
      actions: (row) => [
        {
          label: "Ver detalle",
          icon: <Eye size={14} />,
          onClick: () => handlers.onView(row.original),
        },
        {
          label: "Descargar Excel",
          icon: <Download size={14} />,
          onClick: () => handlers.onDownloadExcel(row.original),
        },
        {
          label: "Cerrar ruta",
          icon: <Lock size={14} />,
          tone: "warning",
          separatorBefore: true,
          hidden: !canCloseRuta(row.original),
          onClick: () => handlers.onClose(row.original),
        },
        {
          label: "Eliminar",
          icon: <Trash2 size={14} />,
          tone: "danger",
          separatorBefore: true,
          onClick: () => handlers.onDelete(row.original),
        },
      ],
    }),
  ];
}
