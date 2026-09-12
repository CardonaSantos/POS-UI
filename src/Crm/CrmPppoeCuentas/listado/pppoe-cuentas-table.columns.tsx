import type { ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/components/app/primitives/app-badge";

import {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

import type {
  OrigenCuentaPppoe,
  PppoeCuentaListItem,
} from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.interfaces";

import { formattShortFecha } from "@/utils/formattFechas";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const mutedTextClass =
  "text-[hsl(var(--app-table-cell-muted-fg,var(--app-muted-foreground)))]";

function EmptyText({ children = "-" }: { children?: React.ReactNode }) {
  return <span className={`text-xs italic ${mutedTextClass}`}>{children}</span>;
}

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function getClienteNombre(item: PppoeCuentaListItem): string {
  return [item.cliente.nombre, item.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Sin fecha";
  }

  return formattShortFecha(value);
}

function getEstadoCuentaTone(estado: EstadoCuentaPppoe): AppBadgeTone {
  switch (estado) {
    case EstadoCuentaPppoe.ACTIVA:
      return "success";

    case EstadoCuentaPppoe.SUSPENDIDA:
      return "warning";

    case EstadoCuentaPppoe.ERROR:
      return "danger";

    case EstadoCuentaPppoe.ELIMINADA:
    case EstadoCuentaPppoe.CANCELADA:
      return "neutral";

    case EstadoCuentaPppoe.EN_SUSPENSION:
    case EstadoCuentaPppoe.EN_DESINSTALACION:
      return "warning";

    case EstadoCuentaPppoe.PENDIENTE_CREACION:
    case EstadoCuentaPppoe.PENDIENTE_ACTIVACION:
      return "info";

    case EstadoCuentaPppoe.EN_INSTALACION:
    case EstadoCuentaPppoe.EN_ACTIVACION:
      return "primary";

    default:
      return "neutral";
  }
}

function getEstadoAccesoTone(estado: EstadoAccesoInternet): AppBadgeTone {
  switch (estado) {
    case EstadoAccesoInternet.ACTIVO:
      return "success";

    case EstadoAccesoInternet.SUSPENDIDO:
      return "warning";

    case EstadoAccesoInternet.CONFIGURANDO:
      return "primary";

    case EstadoAccesoInternet.PENDIENTE:
      return "info";

    case EstadoAccesoInternet.BAJA:
      return "neutral";

    default:
      return "neutral";
  }
}

function getOrigenTone(origen: OrigenCuentaPppoe): AppBadgeTone {
  switch (origen) {
    case "ALTA_MANUAL":
      return "primary";

    case "EXTERNA_ADOPTADA":
      return "warning";

    case "INSTALACION":
      return "info";

    default:
      return "neutral";
  }
}

export function createPppoeCuentasTableColumns(): ColumnDef<
  PppoeCuentaListItem,
  any
>[] {
  return [
    {
      accessorKey: "cuentaPppoeId",
      header: "ID",

      size: 65,
      minSize: 55,
      maxSize: 65,

      enableSorting: false,

      cell: ({ row }) => (
        <span className="block text-xs font-semibold tabular-nums">
          #{row.original.cuentaPppoeId}
        </span>
      ),
    },

    {
      id: "cliente",
      header: "Cliente",

      size: 210,
      minSize: 170,
      maxSize: 300,

      enableSorting: false,
      enableResizing: true,

      accessorFn: (row) => getClienteNombre(row),

      meta: {
        grow: true,
      },

      cell: ({ row }) => {
        const nombre = getClienteNombre(row.original);

        return (
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold" title={nombre}>
              {nombre || "Cliente sin nombre"}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "usuario",
      header: "Usuario PPPoE",

      size: 120,
      minSize: 100,
      maxSize: 140,

      enableSorting: false,

      cell: ({ row }) => (
        <span
          className="block truncate text-xs font-medium tabular-nums"
          title={row.original.usuario}
        >
          {row.original.usuario}
        </span>
      ),
    },

    {
      accessorKey: "estadoCuenta",
      header: "Cuenta",

      size: 135,
      minSize: 110,
      maxSize: 150,

      enableSorting: false,

      cell: ({ row }) => (
        <AppBadge
          tone={getEstadoCuentaTone(row.original.estadoCuenta)}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {humanizeEnum(row.original.estadoCuenta)}
        </AppBadge>
      ),
    },

    {
      accessorKey: "estadoAcceso",
      header: "Acceso",

      size: 120,
      minSize: 100,
      maxSize: 135,

      enableSorting: false,

      cell: ({ row }) => (
        <AppBadge
          tone={getEstadoAccesoTone(row.original.estadoAcceso)}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {humanizeEnum(row.original.estadoAcceso)}
        </AppBadge>
      ),
    },

    {
      accessorKey: "origen",
      header: "Origen",

      size: 135,
      minSize: 115,
      maxSize: 160,

      enableSorting: false,

      cell: ({ row }) => {
        const origen = row.original.origen;

        const label =
          origen === "ALTA_MANUAL"
            ? "Alta manual"
            : origen === "EXTERNA_ADOPTADA"
              ? "Externa adoptada"
              : "Instalación";

        return (
          <AppBadge
            tone={getOrigenTone(origen)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {label}
          </AppBadge>
        );
      },
    },

    {
      id: "servicio",
      header: "Servicio",

      size: 175,
      minSize: 145,
      maxSize: 230,

      enableSorting: false,

      accessorFn: (row) => row.servicioInternet?.nombre ?? null,

      cell: ({ row }) => {
        const servicio = row.original.servicioInternet;

        if (!servicio) {
          return <EmptyText>Sin servicio</EmptyText>;
        }

        const description = [
          servicio.velocidad,
          servicio.precio != null ? formattMonedaGT(servicio.precio) : null,
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium" title={servicio.nombre}>
              {servicio.nombre}
            </p>
          </div>
        );
      },
    },

    {
      id: "infraestructura",
      header: "Router / Perfil",

      size: 190,
      minSize: 150,
      maxSize: 240,

      enableSorting: false,
      enableResizing: true,

      accessorFn: (row) => row.router.nombre,

      cell: ({ row }) => {
        const router = row.original.router;

        const perfil = row.original.perfilHomologacion;

        return (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium" title={router.nombre}>
              {router.nombre}
            </p>
          </div>
        );
      },
    },

    {
      id: "ultimaOperacion",
      header: "Última operación",

      size: 170,
      minSize: 145,
      maxSize: 210,

      enableSorting: false,

      accessorFn: (row) => row.ultimaOperacion?.tipo ?? null,

      cell: ({ row }) => {
        const operacion = row.original.ultimaOperacion;

        if (!operacion) {
          return <EmptyText>Sin operaciones</EmptyText>;
        }

        return (
          <div className="min-w-0">
            <p
              className="truncate text-xs font-medium"
              title={humanizeEnum(operacion.tipo)}
            >
              {humanizeEnum(operacion.tipo)}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "ultimaSincronizacionEn",
      header: "Sincronización",

      size: 125,
      minSize: 105,
      maxSize: 145,

      enableSorting: false,

      cell: ({ row }) => {
        const value = row.original.ultimaSincronizacionEn;

        if (!value) {
          return <EmptyText>Sin sincronizar</EmptyText>;
        }

        return (
          <span
            className={`block whitespace-nowrap text-xs tabular-nums ${mutedTextClass}`}
            title={value}
          >
            {formatDate(value)}
          </span>
        );
      },
    },
  ];
}
