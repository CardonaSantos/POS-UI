"use client";
import { Wallet, Calendar, CreditCard, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HistorialPagos } from "../HistorialPagos";
import type { ClienteDetailsDto } from "./types";
import currency from "currency.js";
import dayjs from "dayjs";

interface BillingTabProps {
  cliente: ClienteDetailsDto;
  setOpenGenerarFactura: (open: boolean) => void;
  setOpenGenerateFacturas: (open: boolean) => void;
  setOpenDeleteFactura: (open: boolean) => void;
  setFacturaAction: (factura: any) => void;
}

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD/MM/YYYY");
};

export function BillingTab({
  cliente,
  setOpenGenerarFactura,
  setOpenGenerateFacturas,
  setOpenDeleteFactura,
  setFacturaAction,
}: BillingTabProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Saldo del Cliente */}
      <Card className="w-full lg:max-w-[280px] flex-shrink-0 border-0 shadow-sm bg-gradient-to-br from-slate-50/80 to-slate-100/40 dark:from-slate-900/30 dark:to-slate-800/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-200">
              <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              Saldo Cliente
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setOpenGenerarFactura(true)}>
                  Generar individual
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenGenerateFacturas(true)}>
                  Generar masivo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs p-2">
          {cliente.saldoCliente ? (
            <>
              {[
                {
                  label: "Actual",
                  value: cliente.saldoCliente.saldo,
                  color: "emerald",
                },
                {
                  label: "Pendiente",
                  value: cliente.saldoCliente.saldoPendiente,
                  color: "red",
                },
                {
                  label: "Total",
                  value: cliente.saldoCliente.totalPagos,
                  color: "blue",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 text-slate-600"
                >
                  <div className="flex items-center gap-1">
                    <CreditCard
                      className={`h-3 w-3 text-${item.color}-600 dark:text-${item.color}-400`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`font-semibold text-${item.color}-600 dark:text-${item.color}-400`}
                  >
                    {formatearMoneda(item.value)}
                  </span>
                </div>
              ))}
              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  Último pago
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {cliente.saldoCliente.ultimoPago
                    ? formatearFecha(cliente.saldoCliente.ultimoPago)
                    : "—"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Wallet className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Sin saldo disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Pagos */}
      <div className="flex-1 overflow-hidden">
        <HistorialPagos
          facturas={cliente.facturaInternet}
          nombreCliente={`${cliente.nombre} ${cliente.apellidos}`}
          setOpenDeleteFactura={setOpenDeleteFactura}
          setFacturaAction={setFacturaAction}
        />
      </div>
    </div>
  );
}
