"use client";

import * as React from "react";
import {
  Calendar,
  CreditCard,
  FilePlus,
  MoreHorizontal,
  Wallet,
} from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
import { FacturaToDelete, safeNumber } from "./billing-history.helpers";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { HistorialPagos } from "./historial-pagos";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

interface BillingTabProps {
  cliente: ClienteDetailsDto;
  setOpenGenerarFactura: (open: boolean) => void;
  setOpenGenerateFacturas: (open: boolean) => void;
  setOpenDeleteFactura: (open: boolean) => void;
  setFacturaAction: (factura: FacturaToDelete) => void;
}

function BalanceMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "neutral";
}) {
  const toneClassName =
    tone === "danger"
      ? "text-[hsl(var(--app-danger))]"
      : tone === "success"
        ? "text-[hsl(var(--app-success))]"
        : "text-[hsl(var(--app-foreground,var(--foreground)))]";

  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2">
      <AppInline gap="xs" align="center" justify="between" wrap={false}>
        <AppInline gap="xs" align="center" className="min-w-0">
          <CreditCard
            size={14}
            className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          />
          <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </span>
        </AppInline>

        <span className={`shrink-0 text-xs font-bold ${toneClassName}`}>
          {formattMonedaGT(value)}
        </span>
      </AppInline>
    </div>
  );
}

function SaldoClienteCard({
  cliente,
  onOpenGenerarFactura,
  onOpenGenerateFacturas,
}: {
  cliente: ClienteDetailsDto;
  onOpenGenerarFactura: () => void;
  onOpenGenerateFacturas: () => void;
}) {
  const saldo = cliente.saldoCliente;

  const saldoAcumulado = safeNumber(saldo?.saldo);
  const saldoPendiente = safeNumber(saldo?.saldoPendiente);

  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="md"
      className="h-full p-2 overflow-visible bg-[hsl(var(--app-muted,var(--muted))/0.12)]"
    >
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" wrap={false}>
          <AppInline gap="xs" align="center" className="min-w-0">
            <Wallet size={16} className="shrink-0" />

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">Saldo cliente</h2>
              <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Resumen financiero
              </p>
            </div>
          </AppInline>

          <AppDropdownMenu>
            <AppDropdownMenuTrigger asChild>
              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="auto"
                aria-label="Acciones de facturación"
              >
                <MoreHorizontal size={15} />
              </AppButton>
            </AppDropdownMenuTrigger>

            <AppDropdownMenuContent align="end" width="md" size="xs">
              <AppDropdownMenuItem
                icon={<FilePlus size={14} />}
                onSelect={onOpenGenerarFactura}
              >
                Generar individual
              </AppDropdownMenuItem>

              <AppDropdownMenuSeparator />

              <AppDropdownMenuItem
                icon={<FilePlus size={14} />}
                onSelect={onOpenGenerateFacturas}
              >
                Generar varios
              </AppDropdownMenuItem>
            </AppDropdownMenuContent>
          </AppDropdownMenu>
        </AppInline>

        {saldo ? (
          <AppStack gap="xs">
            <BalanceMetric
              label="Saldo acumulado"
              value={saldoAcumulado}
              tone="success"
            />

            <BalanceMetric
              label="Saldo pendiente"
              value={saldoPendiente}
              tone={saldoPendiente > 0 ? "danger" : "success"}
            />

            <div className="border-t border-[hsl(var(--app-border,var(--border)))] pt-2">
              <AppInline justify="between" align="center" gap="sm" wrap={false}>
                <AppInline gap="xs" align="center" className="min-w-0">
                  <Calendar
                    size={14}
                    className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                  />
                  <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Último pago
                  </span>
                </AppInline>

                <span className="shrink-0 text-xs font-medium">
                  {saldo.ultimoPago
                    ? formattFechaWithMinutes(saldo.ultimoPago)
                    : "—"}
                </span>
              </AppInline>
            </div>
          </AppStack>
        ) : (
          <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] px-3 py-5 text-center">
            <Wallet
              size={24}
              className="mx-auto mb-2 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />
            <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Sin saldo disponible
            </p>
          </div>
        )}
      </AppStack>
    </AppCard>
  );
}

export function BillingTab({
  cliente,
  setOpenGenerarFactura,
  setOpenGenerateFacturas,
  setOpenDeleteFactura,
  setFacturaAction,
}: BillingTabProps) {
  const nombreCliente = React.useMemo(
    () => `${cliente.nombre ?? ""} ${cliente.apellidos ?? ""}`.trim(),
    [cliente.nombre, cliente.apellidos],
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-[280px_minmax(0,1fr)]">
      <SaldoClienteCard
        cliente={cliente}
        onOpenGenerarFactura={() => setOpenGenerarFactura(true)}
        onOpenGenerateFacturas={() => setOpenGenerateFacturas(true)}
      />

      <div className="min-w-0">
        <HistorialPagos
          facturas={cliente.facturaInternet ?? []}
          nombreCliente={nombreCliente || "Cliente sin nombre"}
          setOpenDeleteFactura={setOpenDeleteFactura}
          setFacturaAction={setFacturaAction}
        />
      </div>
    </div>
  );
}
