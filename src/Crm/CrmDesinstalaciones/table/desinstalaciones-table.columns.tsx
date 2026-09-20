import type { ColumnDef } from "@tanstack/react-table";

import { Eye, ShieldCheck } from "lucide-react";

import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";

import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import type { ClienteDesinstalacionListItem } from "@/Crm/features/desinstalaciones/desinstalaciones.interfaces";

import {
  EstadoAutorizacionDesinstalacion,
  EstadoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

import { formattShortFecha } from "@/utils/formattFechas";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { EstadoCuentaPppoe } from "@/Crm/features/instalaciones/enums";
import { DESINSTALACIONES_ROUTES } from "./routes.route";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type DesinstalacionTableColumnActions = {
  onViewDesinstalacion: (desinstalacionId: number) => void;

  onSolicitarAutorizacion: (
    desinstalacion: ClienteDesinstalacionListItem,
  ) => void;
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
  if (!value) {
    return "Sin fecha";
  }

  return formattShortFecha(value);
}

function getClienteNombre(
  desinstalacion: ClienteDesinstalacionListItem,
): string {
  return [desinstalacion.cliente.nombre, desinstalacion.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function getEstadoTone(estado: EstadoDesinstalacionCliente): AppBadgeTone {
  if (estado === EstadoDesinstalacionCliente.PROGRAMADA) {
    return "info";
  }

  if (estado === EstadoDesinstalacionCliente.EN_PROCESO) {
    return "primary";
  }

  if (estado === EstadoDesinstalacionCliente.COMPLETADA) {
    return "success";
  }

  if (
    estado === EstadoDesinstalacionCliente.CANCELADA ||
    estado === EstadoDesinstalacionCliente.FALLIDA
  ) {
    return "danger";
  }

  return "neutral";
}

function getAutorizacionTone(
  estado: EstadoAutorizacionDesinstalacion,
): AppBadgeTone {
  if (estado === EstadoAutorizacionDesinstalacion.APROBADA) {
    return "success";
  }

  if (estado === EstadoAutorizacionDesinstalacion.PENDIENTE) {
    return "warning";
  }

  if (estado === EstadoAutorizacionDesinstalacion.RECHAZADA) {
    return "danger";
  }

  return "neutral";
}

function getPppoeTone(estado: EstadoCuentaPppoe): AppBadgeTone {
  if (estado === EstadoCuentaPppoe.ACTIVA) {
    return "success";
  }

  if (estado === EstadoCuentaPppoe.SUSPENDIDA) {
    return "warning";
  }

  if (estado === EstadoCuentaPppoe.ERROR) {
    return "danger";
  }

  if (estado === EstadoCuentaPppoe.ELIMINADA) {
    return "neutral";
  }

  return "info";
}

export function createDesinstalacionesTableColumns(
  actions: DesinstalacionTableColumnActions,
): ColumnDef<ClienteDesinstalacionListItem, any>[] {
  return [
    /*
     * ID
     */
    {
      accessorKey: "id",

      header: "ID",

      size: 60,

      minSize: 40,

      maxSize: 40,

      enableSorting: false,

      cell: ({ row }) => (
        <Link
          to={DESINSTALACIONES_ROUTES.detalle(row.original.id)}
          className={`block truncate text-xs font-medium tabular-nums hover:underline ${tableLinkClass}`}
        >
          #{row.original.id}
        </Link>
      ),
    },

    /*
     * CLIENTE
     */
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
            to={DESINSTALACIONES_ROUTES.detalle(row.original.id)}
            className={`block truncate text-xs font-semibold hover:underline ${tableLinkClass}`}
            title={nombre}
          >
            {nombre || "Cliente sin nombre"}
          </Link>
        );
      },
    },

    /*
     * ESTADO
     */
    {
      accessorKey: "estado",

      header: "Estado",

      size: 115,

      minSize: 90,

      maxSize: 100,

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

    /*
     * AUTORIZACIÓN
     */
    {
      id: "autorizacion",

      header: "Autorización",

      size: 120,

      minSize: 100,

      maxSize: 110,

      enableSorting: false,

      accessorFn: (row) => row.ultimaAutorizacion?.estado ?? null,

      cell: ({ row }) => {
        const autorizacion = row.original.ultimaAutorizacion;

        if (!autorizacion) {
          return <EmptyText>Sin solicitar</EmptyText>;
        }

        return (
          <AppBadge
            tone={getAutorizacionTone(autorizacion.estado)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {humanizeEnum(autorizacion.estado)}
          </AppBadge>
        );
      },
    },

    /*
     * FECHA PROGRAMADA
     */
    {
      accessorKey: "fechaProgramada",

      header: "Programada",

      size: 115,

      minSize: 100,

      maxSize: 100,

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

    /*
     * SERVICIO
     */
    {
      id: "servicio",

      header: "Servicio",

      size: 140,

      minSize: 110,

      maxSize: 120,

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

    /*
     * PPPoE
     */
    {
      id: "pppoe",

      header: "PPPoE",

      size: 155,

      minSize: 125,

      maxSize: 170,

      enableSorting: false,

      accessorFn: (row) => row.accesoInternet?.cuentaPppoe?.estado ?? null,

      cell: ({ row }) => {
        const cuenta = row.original.accesoInternet?.cuentaPppoe;

        if (!cuenta) {
          return <EmptyText>Sin cuenta</EmptyText>;
        }

        return (
          <div
            className="flex min-w-0 items-center gap-1.5 whitespace-nowrap"
            title={`${humanizeEnum(cuenta.estado)} · ${cuenta.usuario}`}
          >
            <AppBadge
              tone={getPppoeTone(cuenta.estado)}
              appearance="soft"
              size="xs"
              radius="full"
              className="shrink-0"
            >
              {humanizeEnum(cuenta.estado)}
            </AppBadge>

            <span
              className={`min-w-0 truncate font-mono text-[10px] ${tableMutedTextClass}`}
            >
              {cuenta.usuario}
            </span>
          </div>
        );
      },
    },

    /*
     * TÉCNICO RESPONSABLE
     */
    {
      id: "tecnicoResponsable",

      header: "Técnico",

      size: 150,

      minSize: 110,

      maxSize: 115,

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

    /*
     * EVIDENCIAS
     */
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

    /*
     * ACCIONES
     */
    createAppRowActionsColumn<ClienteDesinstalacionListItem>({
      header: "",

      size: 44,

      actions: (row) => {
        const desinstalacion = row.original;

        const estadoAutorizacion =
          desinstalacion.ultimaAutorizacion?.estado ?? null;

        const estaCompletada =
          desinstalacion.estado === EstadoDesinstalacionCliente.COMPLETADA;

        const tieneAutorizacionBloqueante =
          estadoAutorizacion === EstadoAutorizacionDesinstalacion.PENDIENTE ||
          estadoAutorizacion === EstadoAutorizacionDesinstalacion.APROBADA;

        const puedeSolicitarAutorizacion =
          !estaCompletada && !tieneAutorizacionBloqueante;

        return [
          {
            label: "Ver desinstalación",

            icon: <Eye size={14} />,

            onClick: () => actions.onViewDesinstalacion(desinstalacion.id),
          },

          ...(puedeSolicitarAutorizacion
            ? [
                {
                  label:
                    estadoAutorizacion ===
                    EstadoAutorizacionDesinstalacion.RECHAZADA
                      ? "Solicitar nuevamente"
                      : "Solicitar autorización",

                  icon: <ShieldCheck size={14} />,

                  onClick: () =>
                    actions.onSolicitarAutorizacion(desinstalacion),
                },
              ]
            : []),
        ];
      },
    }),
  ];
}
