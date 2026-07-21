import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import type { ClienteInstalacionListItem } from "@/Crm/features/instalaciones/instalaciones.interfaces";

import { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import { INSTALACIONES_ROUTES } from "../filters/routes";
import { formattShortFecha } from "@/utils/formattFechas";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type InstalacionTableColumnActions = {
  onViewInstalacion: (instalacionId: number) => void;
};

const tableMutedTextClass =
  "text-[hsl(var(--app-table-cell-muted-fg,var(--app-muted-foreground)))]";

const tableLinkClass =
  "text-[hsl(var(--app-table-cell-link-fg,var(--app-primary)))]";

function EmptyText({ children = "-" }: { children?: React.ReactNode }) {
  return (
    <span className={`text-xs italic ${tableMutedTextClass}`}>{children}</span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "Sin fecha";

  return formattShortFecha(value);
}

function getClienteNombre(instalacion: ClienteInstalacionListItem): string {
  return [instalacion.cliente.nombre, instalacion.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

function getEstadoTone(estado: EstadoInstalacionCliente): AppBadgeTone {
  if (estado === EstadoInstalacionCliente.PROGRAMADA) {
    return "info";
  }

  if (estado === EstadoInstalacionCliente.REPROGRAMADA) {
    return "warning";
  }

  if (estado === EstadoInstalacionCliente.EN_PROCESO) {
    return "primary";
  }

  if (estado === EstadoInstalacionCliente.COMPLETADA) {
    return "success";
  }

  if (
    estado === EstadoInstalacionCliente.CANCELADA ||
    estado === EstadoInstalacionCliente.FALLIDA
  ) {
    return "danger";
  }

  return "neutral";
}

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

export function createInstalacionesTableColumns(
  actions: InstalacionTableColumnActions,
): ColumnDef<ClienteInstalacionListItem, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",

      size: 60,
      minSize: 40,
      maxSize: 40,

      enableSorting: false,

      cell: ({ row }) => (
        <Link
          to={INSTALACIONES_ROUTES.detalle(row.original.id)}
          className={`block truncate text-xs font-medium tabular-nums hover:underline ${tableLinkClass}`}
        >
          #{row.original.id}
        </Link>
      ),
    },

    {
      id: "cliente",
      header: "Cliente",

      size: 200,
      minSize: 170,
      maxSize: 280,

      enableResizing: true,
      enableSorting: false,

      accessorFn: (row) => getClienteNombre(row),

      meta: {
        grow: true,
      },

      cell: ({ row }) => {
        const nombre = getClienteNombre(row.original);

        return (
          <Link
            to={INSTALACIONES_ROUTES.detalle(row.original.id)}
            className={`block truncate text-xs font-semibold hover:underline ${tableLinkClass}`}
            title={nombre}
          >
            {nombre || "Cliente sin nombre"}
          </Link>
        );
      },
    },

    {
      accessorKey: "estado",
      header: "Estado",

      size: 110,
      minSize: 85,
      maxSize: 85,

      enableSorting: false,

      cell: ({ row }) => (
        <AppBadge
          tone={getEstadoTone(row.original.estado)}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {humanizeEnum(row.original.estado)}
        </AppBadge>
      ),
    },

    {
      accessorKey: "fechaProgramada",
      header: "Programada",

      size: 110,
      minSize: 95,
      maxSize: 95,

      enableSorting: false,

      cell: ({ row }) => (
        <span
          className={`block whitespace-nowrap text-xs tabular-nums ${tableMutedTextClass}`}
          title={`Fecha programada: ${formatDate(
            row.original.fechaProgramada,
          )}`}
        >
          {formatDate(row.original.fechaProgramada)}
        </span>
      ),
    },

    {
      id: "servicio",
      header: "Servicio",

      size: 130,
      minSize: 100,
      maxSize: 100,

      enableSorting: false,

      accessorFn: (row) => row.servicioInternet?.nombre ?? null,

      cell: ({ row }) => {
        const servicio = row.original.servicioInternet;

        if (!servicio) {
          return <EmptyText>Sin servicio</EmptyText>;
        }

        return (
          <span
            className={`block truncate text-xs font-medium ${tableMutedTextClass}`}
            title={`${servicio.nombre} · ${formattMonedaGT(
              servicio.precio ?? 0,
            )}`}
          >
            {servicio.nombre}
          </span>
        );
      },
    },

    {
      id: "tecnicoResponsable",
      header: "Técnico",

      size: 150,
      minSize: 100,
      maxSize: 100,

      enableSorting: false,

      accessorFn: (row) => row.tecnicoResponsable?.nombre ?? null,

      cell: ({ row }) => {
        const tecnico = row.original.tecnicoResponsable;

        if (!tecnico) {
          return <EmptyText>Sin técnico</EmptyText>;
        }

        const adicionales = Math.max(row.original.conteos.tecnicos - 1, 0);

        const label =
          adicionales > 0
            ? `${tecnico.nombre} +${adicionales}`
            : tecnico.nombre;

        return (
          <span
            className={`block truncate text-xs ${tableMutedTextClass}`}
            title={`${tecnico.nombre}. Técnicos asignados: ${row.original.conteos.tecnicos}`}
          >
            {label}
          </span>
        );
      },
    },

    {
      id: "asesor",
      header: "Asesor",

      size: 140,
      minSize: 110,
      maxSize: 110,

      enableSorting: false,

      accessorFn: (row) => row.asesor?.nombre ?? null,

      cell: ({ row }) => {
        const asesor = row.original.asesor;

        if (!asesor) {
          return <EmptyText>Sin asesor</EmptyText>;
        }

        return (
          <span
            className={`block truncate text-xs ${tableMutedTextClass}`}
            title={asesor.nombre}
          >
            {asesor.nombre}
          </span>
        );
      },
    },

    {
      id: "ubicacion",
      header: "Ubicación",

      size: 220,
      minSize: 100,
      maxSize: 100,

      enableResizing: true,
      enableSorting: false,

      accessorFn: (row) => row.ubicacion.direccion ?? null,

      meta: {
        grow: true,
      },

      cell: ({ row }) => {
        const direccion = row.original.ubicacion.direccion;

        const referencia = row.original.ubicacion.referencia;

        if (!direccion) {
          return <EmptyText>Sin dirección</EmptyText>;
        }

        const title = referencia
          ? `${direccion}. Referencia: ${referencia}`
          : direccion;

        return (
          <span
            className={`block truncate text-xs ${tableMutedTextClass}`}
            title={title}
          >
            {direccion}
          </span>
        );
      },
    },

    {
      id: "evidencias",
      header: "Evidencias",

      size: 90,
      minSize: 80,
      maxSize: 80,

      enableSorting: false,

      accessorFn: (row) => row.conteos.evidencias,

      cell: ({ row }) => (
        <span className={`block text-xs tabular-nums ${tableMutedTextClass}`}>
          {row.original.conteos.evidencias}
        </span>
      ),
    },

    createAppRowActionsColumn<ClienteInstalacionListItem>({
      header: "",
      size: 44,

      actions: (row) => [
        {
          label: "Ver instalación",
          icon: <Eye size={14} />,
          onClick: () => actions.onViewInstalacion(row.original.id),
        },
      ],
    }),
  ];
}
