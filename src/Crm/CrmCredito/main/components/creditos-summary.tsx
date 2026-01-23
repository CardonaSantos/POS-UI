"use client";

import React from "react";

import {
  Banknote,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  CreditoResponse,
  EstadoCredito,
} from "@/Crm/features/credito/credito-interfaces";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

interface CreditosSummaryProps {
  creditos: CreditoResponse[];
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-2 border rounded-md px-3 py-2">
      <div className="text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function CreditosSummary({ creditos }: CreditosSummaryProps) {
  const totalCreditos = creditos.length;

  const activos = creditos.filter(
    (c) => c.estado === EstadoCredito.ACTIVO,
  ).length;
  const enMora = creditos.filter(
    (c) => c.estado === EstadoCredito.EN_MORA,
  ).length;
  const completados = creditos.filter(
    (c) => c.estado === EstadoCredito.COMPLETADO,
  ).length;
  const cancelados = creditos.filter(
    (c) => c.estado === EstadoCredito.CANCELADO,
  ).length;

  const montoTotalCapital = creditos.reduce(
    (acc, c) => acc + parseFloat(c.montoCapital || "0"),
    0,
  );

  const montoPagado = creditos.reduce((acc, c) => {
    const pagadoCuotas = c.cuotas.reduce(
      (sum, cuota) => sum + parseFloat(cuota.montoPagado || "0"),
      0,
    );
    return acc + pagadoCuotas;
  }, 0);

  const montoTotal = creditos.reduce(
    (acc, c) => acc + parseFloat(c.montoTotal || "0"),
    0,
  );

  const montoPendiente = montoTotal - montoPagado;

  const cuotasPendientes = creditos.reduce((acc, c) => {
    return (
      acc +
      c.cuotas.filter(
        (cuota) => cuota.estado !== "PAGADA" && cuota.estado !== "CANCELADA",
      ).length
    );
  }, 0);

  const cuotasPagadas = creditos.reduce((acc, c) => {
    return acc + c.cuotas.filter((cuota) => cuota.estado === "PAGADA").length;
  }, 0);

  const formatCurrency = (value: number) => {
    return formattMonedaGT(value);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatCard
          label="Total créditos"
          value={totalCreditos}
          icon={<Banknote className="size-4" />}
        />
        <StatCard
          label="Activos"
          value={activos}
          icon={<Clock className="size-4" />}
        />
        <StatCard
          label="En mora"
          value={enMora}
          icon={<AlertTriangle className="size-4" />}
        />
        <StatCard
          label="Completados"
          value={completados}
          icon={<CheckCircle className="size-4" />}
        />
        <StatCard
          label="Cancelados"
          value={cancelados}
          icon={<XCircle className="size-4" />}
        />
        <StatCard
          label="Clientes"
          value={new Set(creditos.map((c) => c.clienteId)).size}
          icon={<Users className="size-4" />}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Capital otorgado"
          value={formatCurrency(montoTotalCapital)}
          icon={<Banknote className="size-4" />}
        />
        <StatCard
          label="Monto recuperado"
          value={formatCurrency(montoPagado)}
          icon={<CheckCircle className="size-4" />}
        />
        <StatCard
          label="Monto pendiente"
          value={formatCurrency(montoPendiente)}
          icon={<AlertTriangle className="size-4" />}
        />
        <StatCard
          label="Cuotas pend./pagadas"
          value={`${cuotasPendientes} / ${cuotasPagadas}`}
          icon={<Clock className="size-4" />}
        />
      </div>
    </div>
  );
}
