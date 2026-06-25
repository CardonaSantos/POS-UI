import type { ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { createAppSelectionColumn } from "@/components/app/table/app-table-selection-column";

import type { ClienteInternetFromCreateRuta } from "@/Crm/features/rutas/rutas.interfaces";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import {
  ESTADO_CLIENTE_COBRANZA_LABELS,
  ESTADO_CLIENTE_LABELS,
} from "@/Crm/CrmCustomers/customer-table.constants";
import {
  getEstadoTone,
  getEstadoToneCobranza,
} from "@/Crm/CrmCustomers/_components/customer-table.columns";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getClienteNombre(cliente: ClienteInternetFromCreateRuta) {
  return `${cliente.nombre ?? ""} ${cliente.apellidos ?? ""}`.trim();
}

function EmptyText({ children = "-" }: { children?: React.ReactNode }) {
  return (
    <span className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
      {children}
    </span>
  );
}

export function createRutasClientesColumns(): ColumnDef<
  ClienteInternetFromCreateRuta,
  any
>[] {
  return [
    createAppSelectionColumn<ClienteInternetFromCreateRuta>(),

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
      id: "cliente",
      header: "Cliente",
      size: 230,
      accessorFn: (row) => getClienteNombre(row),
      enableSorting: false,
      meta: {
        grow: true,
      },
      cell: ({ row }) => {
        const nombre = getClienteNombre(row.original);

        if (!nombre) return <EmptyText>Sin nombre</EmptyText>;

        return (
          <span
            className="block truncate text-xs font-medium text-[hsl(var(--app-primary))]"
            title={nombre}
          >
            {nombre}
          </span>
        );
      },
    },

    {
      accessorKey: "saldoPendiente",
      header: "Saldo",
      size: 40,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => {
        const saldo = Number(row.original.saldoPendiente ?? 0);
        const tone: AppBadgeTone = saldo > 0 ? "warning" : "neutral";

        return (
          <AppBadge tone={tone} appearance="soft" size="xs" radius="full">
            {formattMonedaGT(saldo)}
          </AppBadge>
        );
      },
    },

    {
      accessorKey: "facturasPendientes",
      header: "Facturas",
      size: 20,
      enableSorting: false,
      meta: {
        align: "center",
      },
      cell: ({ row }) => {
        const count =
          row.original.facturasPendientes ?? row.original.facturas?.length ?? 0;

        return (
          <AppBadge
            tone={count > 0 ? "info" : "neutral"}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {count}
          </AppBadge>
        );
      },
    },

    {
      accessorKey: "zonaFacturacion",
      header: "Zona",
      size: 170,
      enableSorting: false,
      cell: ({ row }) => {
        const zona = row.original.zonaFacturacion;

        if (!zona) return <EmptyText>Sin zona</EmptyText>;

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={zona}
          >
            {zona}
          </span>
        );
      },
    },

    {
      id: "sector",
      header: "Sector",
      size: 130,
      accessorFn: (row) => row.sector?.nombre ?? null,
      enableSorting: false,
      cell: ({ row }) => {
        const sector = row.original.sector?.nombre;

        if (!sector) return <EmptyText>Sin sector</EmptyText>;

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={sector}
          >
            {sector}
          </span>
        );
      },
    },

    {
      id: "municipio",
      header: "Municipio",
      size: 130,
      accessorFn: (row) => row.municipio?.nombre ?? null,
      enableSorting: false,
      cell: ({ row }) => {
        const municipio = row.original.municipio?.nombre;

        if (!municipio) return <EmptyText>Sin municipio</EmptyText>;

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={municipio}
          >
            {municipio}
          </span>
        );
      },
    },

    {
      accessorKey: "direccion",
      header: "Dirección",
      size: 260,
      enableSorting: false,
      cell: ({ row }) => {
        const direccion = row.original.direccion;

        if (!direccion) return <EmptyText>Sin dirección</EmptyText>;

        return (
          <span
            className="block truncate text-xs text-[hsl(var(--app-muted-foreground))]"
            title={direccion}
          >
            {direccion}
          </span>
        );
      },
    },

    {
      accessorKey: "estadoCobranzaCliente",
      header: "Cobranza",
      size: 125,
      enableSorting: false,
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
      accessorKey: "estadoCliente",
      header: "Estado",
      size: 125,
      enableSorting: false,
      cell: ({ row }) => {
        const estado = row.original.estadoCliente;

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
  ];
}
