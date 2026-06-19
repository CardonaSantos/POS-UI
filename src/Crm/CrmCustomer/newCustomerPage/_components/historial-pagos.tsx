"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppTableHandlers } from "@/components/app/handlers";
import type { FacturaInternet } from "../../../features/cliente-interfaces/cliente-types";
import {
  buildBillingHistoryRows,
  FacturaToDelete,
} from "./billing-history.helpers";
import { createBillingHistoryColumns } from "./billing-history.columns";

interface HistorialPagosProps {
  facturas: FacturaInternet[] | null | undefined;
  nombreCliente: string;
  setFacturaAction: (value: FacturaToDelete) => void;
  setOpenDeleteFactura: (value: boolean) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export function HistorialPagos({
  facturas,
  nombreCliente,
  setFacturaAction,
  setOpenDeleteFactura,
}: HistorialPagosProps) {
  const navigate = useNavigate();

  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialColumnVisibility: {
      fechaPagada: true,
    },
  });

  const rows = React.useMemo(
    () => buildBillingHistoryRows(facturas),
    [facturas],
  );

  const handleEditFactura = React.useCallback(
    (facturaId: number) => {
      navigate(`/crm/editar?factura=${facturaId}`);
    },
    [navigate],
  );

  const handleDeleteFactura = React.useCallback(
    (factura: FacturaToDelete) => {
      setFacturaAction(factura);
      setOpenDeleteFactura(true);
    },
    [setFacturaAction, setOpenDeleteFactura],
  );

  const columns = React.useMemo(
    () =>
      createBillingHistoryColumns({
        onEditFactura: handleEditFactura,
        onDeleteFactura: handleDeleteFactura,
      }),
    [handleEditFactura, handleDeleteFactura],
  );

  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="md"
      className="h-full overflow-visible"
    >
      <AppStack gap="sm">
        <AppInline gap="xs" align="center" justify="between" wrap>
          <AppInline gap="xs" align="center" className="min-w-0">
            <CreditCard size={16} className="shrink-0" />

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">
                Historial de facturación
              </h2>
              <p className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {nombreCliente}
              </p>
            </div>
          </AppInline>

          <span className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {rows.length} registro{rows.length === 1 ? "" : "s"}
          </span>
        </AppInline>

        <AppDataTable
          data={rows}
          columns={columns}
          getRowId={(row) => String(row.id)}
          paginationMode="client"
          pagination={table.getPaginationConfig({
            totalRows: rows.length,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
          })}
          {...table.getDataTableStateProps()}
          enableRowSelection={false}
          enableColumnVisibility
          enableColumnPinning={false}
          enableVirtualization={false}
          stickyHeader
          density={table.density}
          maxHeight="330px"
          emptyTitle="Sin facturas"
          emptyDescription="Este cliente no tiene historial de facturación registrado."
        />
      </AppStack>
    </AppCard>
  );
}
