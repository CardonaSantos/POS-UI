import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { createAppSelectionColumn } from "@/components/app/table/app-table-selection-column";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import type { ClasificacionCliente } from "@/Crm/features/credito/credito-interfaces";
import type { ServicioInternet } from "@/Crm/CrmServices/CrmServiciosWifi/servicio-internet.types";
import type { ClienteTableDto } from "../CustomerTable";
import {
  CLASIFICACION_CREDITO_LABELS,
  ESTADO_CLIENTE_COBRANZA_LABELS,
  ESTADO_CLIENTE_LABELS,
} from "../customer-table.constants";
import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type ClienteTableColumnActions = {
  onCopyPhone: (telefono: string) => void;
  onOpenWhatsapp: (telefono: string) => void;
  onCallPhone: (telefono: string) => void;
  onEditCliente: (clienteId: number) => void;
};

export function getEstadoTone(estado?: EstadoCliente): AppBadgeTone {
  if (estado === "ACTIVO") return "success";
  if (estado === "PENDIENTE_ACTIVO") return "warning";
  if (estado === "PAGO_PENDIENTE") return "info";
  if (estado === "EN_INSTALACION") return "primary";
  if (estado === "MOROSO") return "danger";
  if (estado === "ATRASADO") return "warning";
  return "neutral";
}

export function getEstadoToneCobranza(
  estado?: EstadoCobranzaCliente,
): AppBadgeTone {
  if (estado === EstadoCobranzaCliente.AL_DIA) return "success";
  if (estado === EstadoCobranzaCliente.PAGO_PENDIENTE) return "info";
  if (estado === EstadoCobranzaCliente.ATRASADO) return "warning";
  if (estado === EstadoCobranzaCliente.MOROSO) return "danger";
  return "neutral";
}

export function getClasificacionTone(
  clasificacion?: ClasificacionCliente,
): AppBadgeTone {
  if (clasificacion === "CONFIABLE") return "success";
  if (clasificacion === "RIESGO_MEDIO") return "warning";
  if (clasificacion === "RIESGO_ALTO") return "warning";
  if (clasificacion === "NO_APROBABLE") return "danger";
  return "neutral";
}

function EmptyText({ children = "-" }: { children?: React.ReactNode }) {
  return (
    <span className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
      {children}
    </span>
  );
}

export function createClienteTableColumns(
  actions: ClienteTableColumnActions,
): ColumnDef<ClienteTableDto, any>[] {
  return [
    createAppSelectionColumn<ClienteTableDto>(),

    {
      accessorKey: "id",
      header: "ID",
      size: 70,
      enableSorting: true,
      maxSize: 70,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-[hsl(var(--app-muted-foreground))]">
          {row.original.id}
        </span>
      ),
    },

    {
      accessorKey: "nombreCompleto",
      header: "Cliente",
      size: 100,
      maxSize: 100,
      minSize: 100,
      enableResizing: true,
      enableSorting: true,
      meta: {
        grow: true,
      },
      cell: ({ row }) => (
        <Link
          to={`/crm/cliente/${row.original.id}/?tab=resumen`}
          className="block truncate text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
          title={row.original.nombreCompleto}
        >
          {row.original.nombreCompleto}
        </Link>
      ),
    },

    {
      accessorKey: "telefono",
      header: "Teléfono",
      size: 110,
      cell: ({ row }) => {
        const telefono = row.original.telefono;

        if (!telefono) return <EmptyText>Sin teléfono</EmptyText>;

        return (
          <AppInline gap="xs" align="center" wrap={false}>
            <span
              className="max-w-[86px] truncate text-xs text-[hsl(var(--app-muted-foreground))]"
              title={telefono}
            >
              {telefono}
            </span>

            <AppButton
              type="button"
              variant="ghost"
              size="xs"
              width="auto"
              title="Copiar teléfono"
              onClick={() => actions.onCopyPhone(telefono)}
            ></AppButton>
          </AppInline>
        );
      },
    },

    {
      accessorKey: "direccionIp",
      header: "IP",
      size: 130,
      enableSorting: true,
      cell: ({ row }) => {
        const ip = row.original.direccionIp;

        if (!ip) return <EmptyText>Sin IP</EmptyText>;

        return (
          <span className="font-mono text-xs text-[hsl(var(--app-muted-foreground))]">
            {ip}
          </span>
        );
      },
    },

    {
      id: "servicios",
      header: "Servicio",
      size: 130,
      accessorFn: (row) => row.servicios?.[0],
      cell: ({ getValue }) => {
        const servicio = getValue<ServicioInternet | undefined>();

        if (!servicio) return <EmptyText>Sin servicio</EmptyText>;

        return (
          <span
            className="block max-w-[150px] truncate text-xs font-medium text-[hsl(var(--app-muted-foreground))]"
            title={servicio.nombre}
          >
            {servicio.nombre}
          </span>
        );
      },
    },

    {
      accessorKey: "facturacionZona",
      header: "Zona Fac.",
      size: 150,
      cell: ({ row }) => {
        const zona = row.original.facturacionZona;

        if (!zona) return <EmptyText>Sin zona</EmptyText>;

        return (
          <span
            className="block max-w-[140px] truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={zona}
          >
            {zona}
          </span>
        );
      },
    },

    {
      accessorKey: "direccion",
      header: "Dirección",
      size: 230,
      cell: ({ row }) => {
        const direccion = row.original.direccion;

        if (!direccion) return <EmptyText>Sin dirección</EmptyText>;

        return (
          <span
            className="block max-w-[220px] truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={direccion}
          >
            {direccion}
          </span>
        );
      },
    },

    {
      accessorKey: "estadoCobranza",
      header: "Cobranza",
      size: 100,
      cell: ({ row }) => {
        const estado = row.original.estadoCobranza;

        return (
          <AppBadge
            tone={getEstadoToneCobranza(estado)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {ESTADO_CLIENTE_COBRANZA_LABELS[estado] ?? estado}
          </AppBadge>
        );
      },
    },

    {
      accessorKey: "estado",
      header: "Operativo",
      size: 100,
      cell: ({ row }) => {
        const estado = row.original.estado;

        return (
          <AppBadge
            tone={getEstadoTone(estado)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {ESTADO_CLIENTE_LABELS[estado] ?? estado}
          </AppBadge>
        );
      },
    },

    {
      id: "sector",
      header: "Sector",
      size: 100,
      accessorFn: (row) => row.sector?.nombre ?? null,
      cell: ({ row }) => {
        const sector = row.original.sector?.nombre;

        if (!sector) return <EmptyText>Sin sector</EmptyText>;

        return (
          <span
            className="block max-w-[140px] truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={sector}
          >
            {sector}
          </span>
        );
      },
    },

    {
      accessorKey: "clasificacionCredito",
      header: "Crédito",
      size: 100,
      cell: ({ row }) => {
        const clasificacion =
          row.original.clasificacionCredito?.resumen?.clasificacion;

        if (!clasificacion) return <EmptyText>N/A</EmptyText>;

        return (
          <AppBadge
            tone={getClasificacionTone(clasificacion)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {CLASIFICACION_CREDITO_LABELS[clasificacion] ?? clasificacion}
          </AppBadge>
        );
      },
    },

    createAppRowActionsColumn<ClienteTableDto>({
      header: "",
      size: 44,
      actions: (row) => [
        {
          label: "Editar cliente",
          icon: <Edit size={14} />,
          onClick: () => actions.onEditCliente(row.original.id),
        },
      ],
    }),
  ];
}
