import type { ColumnDef } from "@tanstack/react-table";

import { CheckCircle2, Eye, XCircle } from "lucide-react";

import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";

import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import { AutorizacionPendienteListItem } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";
import { DESINSTALACIONES_ROUTES } from "@/Crm/CrmDesinstalaciones/table/routes.route";
import { formattShortFecha } from "@/utils/formattFechas";
import { EstadoAutorizacionDesinstalacion } from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

export type AutorizacionesPendientesTableActions = {
  canAuthorize: boolean;

  onViewDesinstalacion: (desinstalacionId: number) => void;

  onAprobar: (item: AutorizacionPendienteListItem) => void;

  onRechazar: (item: AutorizacionPendienteListItem) => void;
};

const mutedClass =
  "text-[hsl(var(--app-table-cell-muted-fg,var(--app-muted-foreground)))]";

const linkClass =
  "text-[hsl(var(--app-table-cell-link-fg,var(--app-primary)))]";

function humanizeEnum(value: string) {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function getClienteNombre(item: AutorizacionPendienteListItem) {
  return [
    item.desinstalacion.cliente.nombre,

    item.desinstalacion.cliente.apellidos,
  ]
    .filter(Boolean)
    .join(" ");
}

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export function getAutorizacionDesinstalacionTone(
  estado: EstadoAutorizacionDesinstalacion,
): AppBadgeTone {
  switch (estado) {
    case EstadoAutorizacionDesinstalacion.PENDIENTE:
      return "warning";

    case EstadoAutorizacionDesinstalacion.APROBADA:
      return "success";

    case EstadoAutorizacionDesinstalacion.RECHAZADA:
      return "danger";

    case EstadoAutorizacionDesinstalacion.ANULADA:
      return "neutral";

    default:
      return "neutral";
  }
}

export function createAutorizacionesPendientesColumns(
  actions: AutorizacionesPendientesTableActions,
): ColumnDef<AutorizacionPendienteListItem, any>[] {
  return [
    {
      id: "autorizacionId",

      header: "ID",

      size: 40,

      minSize: 45,

      maxSize: 60,

      accessorFn: (row) => row.autorizacion.id,

      cell: ({ row }) => (
        <span className="text-xs font-medium tabular-nums">
          #{row.original.autorizacion.id}
        </span>
      ),
    },

    {
      id: "cliente",

      header: "Cliente",

      size: 210,

      minSize: 170,

      meta: {
        grow: true,
      },

      accessorFn: (row) => getClienteNombre(row),

      cell: ({ row }) => {
        const item = row.original;

        const nombre = getClienteNombre(item);

        return (
          <div className="min-w-0">
            <Link
              to={DESINSTALACIONES_ROUTES.detalle(item.desinstalacion.id)}
              className={`block truncate text-xs font-semibold hover:underline ${linkClass}`}
              title={nombre}
            >
              {nombre}
            </Link>
          </div>
        );
      },
    },

    {
      id: "servicio",

      header: "Servicio",

      size: 100,

      minSize: 100,

      accessorFn: (row) => row.desinstalacion.servicioInternet?.nombre ?? null,

      cell: ({ row }) => {
        const servicio = row.original.desinstalacion.servicioInternet;

        if (!servicio) {
          return (
            <span className={`text-xs italic ${mutedClass}`}>Sin servicio</span>
          );
        }

        return (
          <div className="min-w-0">
            <span className="block truncate text-xs font-medium">
              {servicio.nombre}
            </span>
          </div>
        );
      },
    },

    {
      id: "motivoSolicitud",

      header: "Solicitud",

      size: 210,

      minSize: 150,

      accessorFn: (row) => row.autorizacion.motivoSolicitud,

      cell: ({ row }) => {
        const motivo = row.original.autorizacion.motivoSolicitud;

        return (
          <span
            className={`block truncate text-xs ${mutedClass}`}
            title={motivo ?? "Sin comentario"}
          >
            {motivo ?? "Sin comentario"}
          </span>
        );
      },
    },

    {
      id: "solicitadoPor",

      header: "Solicitado por",

      size: 135,

      minSize: 110,

      accessorFn: (row) => row.solicitadoPor?.nombre ?? null,

      cell: ({ row }) => (
        <span className={`block truncate text-xs ${mutedClass}`}>
          {row.original.solicitadoPor?.nombre ?? "Sin usuario"}
        </span>
      ),
    },

    {
      id: "fechaSolicitud",

      header: "Solicitada",

      size: 100,

      minSize: 100,

      accessorFn: (row) => row.autorizacion.fechaSolicitud,

      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap text-xs tabular-nums ${mutedClass}`}
        >
          {formattShortFecha(row.original.autorizacion.fechaSolicitud)}
        </span>
      ),
    },

    {
      id: "fechaProgramada",

      header: "Programada",

      size: 100,

      minSize: 100,

      accessorFn: (row) => row.desinstalacion.fechaProgramada,

      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap text-xs tabular-nums ${mutedClass}`}
        >
          {formattShortFecha(row.original.desinstalacion.fechaProgramada)}
        </span>
      ),
    },

    {
      id: "tipo",

      header: "Tipo",

      size: 90,

      minSize: 90,

      accessorFn: (row) => row.desinstalacion.tipo,

      cell: ({ row }) => (
        <AppBadge
          tone={getAutorizacionDesinstalacionTone(
            row.original.autorizacion.estado,
          )}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {humanizeEnum(row.original.autorizacion.estado)}
        </AppBadge>
      ),
    },
    // NUEVOS
    createAppRowActionsColumn<AutorizacionPendienteListItem>({
      header: "",

      size: 64,

      actions: (row) => [
        {
          label: "Ver desinstalación",

          icon: <Eye size={14} />,

          onClick: () =>
            actions.onViewDesinstalacion(row.original.desinstalacion.id),
        },

        ...(actions.canAuthorize
          ? [
              {
                label: "Aprobar autorización",

                icon: <CheckCircle2 size={14} />,

                onClick: () => actions.onAprobar(row.original),
              },

              {
                label: "Rechazar autorización",

                icon: <XCircle size={14} />,

                tone: "danger" as const,

                separatorBefore: true,

                onClick: () => actions.onRechazar(row.original),
              },
            ]
          : []),
      ],
    }),
  ];
}
