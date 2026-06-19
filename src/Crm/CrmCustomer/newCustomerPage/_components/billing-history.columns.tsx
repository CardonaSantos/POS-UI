import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, FilePenLine, Trash2, User } from "lucide-react";
import { Link } from "react-router-dom";

import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";

import {
  BillingHistoryRow,
  FacturaEstadoBadge,
  FacturaToDelete,
  formatBillingDate,
  formatBillingMoney,
  formatBillingPeriod,
} from "./billing-history.helpers";

interface CreateBillingHistoryColumnsParams {
  onEditFactura: (facturaId: number) => void;
  onDeleteFactura: (factura: FacturaToDelete) => void;
}

function EmptyText({ children = "—" }: { children?: React.ReactNode }) {
  return (
    <span className="text-[10px] italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
      {children}
    </span>
  );
}

function MoneyText({
  value,
  tone,
}: {
  value: number;
  tone: "danger" | "success" | "neutral";
}) {
  if (!value) return <EmptyText />;

  const toneClassName =
    tone === "danger"
      ? "text-[hsl(var(--app-danger))]"
      : tone === "success"
        ? "text-[hsl(var(--app-success))]"
        : "text-[hsl(var(--app-foreground,var(--foreground)))]";

  return (
    <span
      className={`whitespace-nowrap text-[10px] font-semibold ${toneClassName}`}
    >
      {formatBillingMoney(value)}
    </span>
  );
}

function CanalDropdown({ row }: { row: BillingHistoryRow }) {
  return (
    <AppDropdownMenu>
      <AppDropdownMenuTrigger asChild>
        <button
          type="button"
          className="block max-w-[88px] truncate text-left text-[10px] underline decoration-dotted underline-offset-2 transition-colors hover:text-[hsl(var(--app-primary))]"
          title={row.canal.creador}
        >
          {row.canal.creador}
        </button>
      </AppDropdownMenuTrigger>

      <AppDropdownMenuContent align="start" width="md" size="xs">
        <div className="space-y-2 px-1 py-1">
          <div className="flex items-start gap-2">
            <User
              size={13}
              className="mt-0.5 shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Creado por
              </p>
              <p className="truncate text-xs">{row.canal.creador}</p>
            </div>
          </div>

          <AppDropdownMenuSeparator />

          <div className="flex items-start gap-2">
            <CreditCard
              size={13}
              className="mt-0.5 shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Cobrado por
              </p>

              <p className="text-xs">
                {row.canal.cobrador === "Sin registrar" ? (
                  <span className="italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Sin registrar
                  </span>
                ) : (
                  row.canal.cobrador
                )}
              </p>
            </div>
          </div>
        </div>
      </AppDropdownMenuContent>
    </AppDropdownMenu>
  );
}

export function createBillingHistoryColumns({
  onEditFactura,
  onDeleteFactura,
}: CreateBillingHistoryColumnsParams): ColumnDef<BillingHistoryRow, any>[] {
  return [
    {
      accessorKey: "fecha",
      header: "Fecha",
      size: 70,
      minSize: 70,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-[10px]">
          {formatBillingDate(row.original.fecha)}
        </span>
      ),
    },
    {
      accessorKey: "periodo",
      header: "Periodo",

      size: 70,
      minSize: 70,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-[10px]">
          {formatBillingPeriod(row.original.periodo)}
        </span>
      ),
    },
    {
      id: "canal",
      header: "Canal",
      size: 85,
      minSize: 80,
      enableSorting: false,
      cell: ({ row }) => <CanalDropdown row={row.original} />,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 70,
      minSize: 70,
      enableSorting: false,
      cell: ({ row }) => <FacturaEstadoBadge estado={row.original.estado} />,
    },
    {
      accessorKey: "fechaPagada",
      header: "F. pag.",
      size: 70,
      minSize: 70,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.fechaPagada ? (
          <span className="whitespace-nowrap text-[10px]">
            {formatBillingDate(row.original.fechaPagada)}
          </span>
        ) : (
          <EmptyText>Sin pagar</EmptyText>
        ),
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 130,
      minSize: 130,
      enableSorting: false,
      meta: {
        grow: true,
        truncate: true,
      },
      cell: ({ row }) => (
        <Link
          to={`/crm/facturacion/pago-factura/${row.original.id}`}
          className="block truncate text-[10px] font-medium text-[hsl(var(--app-primary))] hover:underline"
          title={row.original.detalle}
        >
          {row.original.detalle}
        </Link>
      ),
    },
    {
      accessorKey: "cobro",
      header: "Cobro",
      size: 60,
      minSize: 60,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => <MoneyText value={row.original.cobro} tone="danger" />,
    },
    {
      accessorKey: "saldo",
      header: "Saldo",
      size: 60,
      minSize: 60,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => (
        <MoneyText
          value={row.original.saldo}
          tone={row.original.saldo > 0 ? "danger" : "success"}
        />
      ),
    },

    {
      accessorKey: "tipoPago",
      header: "Tipo pago",
      size: 80,
      minSize: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className="block truncate text-[10px]"
          title={row.original.tipoPago}
        >
          {row.original.tipoPago || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "pago",
      header: "Pago",
      size: 60,
      minSize: 60,
      enableSorting: false,
      meta: {
        align: "right",
      },
      cell: ({ row }) => <MoneyText value={row.original.pago} tone="success" />,
    },

    createAppRowActionsColumn<BillingHistoryRow>({
      header: "",
      size: 34,
      actions: (row) => [
        {
          label: "Editar",
          icon: <FilePenLine size={14} />,
          tone: "success",
          onClick: () => onEditFactura(row.original.id),
        },
        {
          label: "Eliminar",
          icon: <Trash2 size={14} />,
          tone: "danger",
          separatorBefore: true,
          onClick: () =>
            onDeleteFactura({
              id: row.original.id,
              estado: row.original.estado,
              fechaEmision: row.original.fechaEmision,
              fechaVencimiento: row.original.fechaVencimiento,
            }),
        },
      ],
    }),
  ];
}
