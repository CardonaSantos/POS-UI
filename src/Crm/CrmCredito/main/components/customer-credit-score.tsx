"use client";

import React from "react";

import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  FileText,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Flame,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ResumenCreditoUI,
  VerifyCustomerResponseUI,
} from "@/Crm/features/credito/credito-interfaces";

interface CustomerCreditScoreProps {
  data: VerifyCustomerResponseUI;
}

const clasificacionConfig: Record<
  ResumenCreditoUI["clasificacion"],
  { label: string; icon: React.ReactNode; className: string }
> = {
  CONFIABLE: {
    label: "Confiable",
    icon: <ShieldCheck className="h-4 w-4" />,
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  RIESGO_MEDIO: {
    label: "Riesgoso",
    icon: <ShieldAlert className="h-4 w-4" />,
    className: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  },
  RIESGO_ALTO: {
    label: "No Aprobable",
    icon: <ShieldX className="h-4 w-4" />,
    className: "bg-red-500/15 text-red-600 border-red-500/30",
  },
  NO_APROBABLE: {
    label: "No Aprobable",
    icon: <ShieldX className="h-4 w-4" />,
    className: "bg-red-500/15 text-red-600 border-red-500/30",
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function CustomerCreditScore({ data }: CustomerCreditScoreProps) {
  const { historial, resumen } = data;
  const config = clasificacionConfig[resumen.clasificacion];

  const hasData = historial.length > 0;

  if (!hasData) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Sin historial de facturas
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Seleccione un cliente para ver su historial
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header con Score y Clasificacion */}
      <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Score Crediticio</span>
            </div>
            <Badge variant="outline" className={`gap-1 ${config.className}`}>
              {config.icon}
              {config.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBg(resumen.score)} transition-all duration-500`}
                style={{ width: `${resumen.score}%` }}
              />
            </div>
            <span
              className={`text-lg font-bold ${getScoreColor(resumen.score)}`}
            >
              {resumen.score}
            </span>
          </div>
        </div>
      </div>

      {/* Metricas en Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border border-b border-border">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs">Puntualidad</span>
          </div>
          <p
            className={`text-lg font-semibold ${resumen.puntualidadPct >= 80 ? "text-emerald-600" : resumen.puntualidadPct >= 60 ? "text-amber-600" : "text-red-600"}`}
          >
            {resumen.puntualidadPct.toFixed(1)}%
          </p>
        </div>

        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Prom. Atraso</span>
          </div>
          <p className="text-lg font-semibold">
            {resumen.promedioAtraso > 0 ? (
              <span className="text-red-600">{resumen.promedioAtraso}d</span>
            ) : (
              <span className="text-emerald-600">0d</span>
            )}
          </p>
        </div>

        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs">Med. Atraso</span>
          </div>
          <p className="text-lg font-semibold">
            {resumen.medianaAtraso > 0 ? (
              <span className="text-amber-600">{resumen.medianaAtraso}d</span>
            ) : (
              <span className="text-emerald-600">0d</span>
            )}
          </p>
        </div>

        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Flame className="h-3.5 w-3.5" />
            <span className="text-xs">Racha Actual</span>
          </div>
          <p
            className={`text-lg font-semibold ${resumen.rachaActual >= 3 ? "text-emerald-600" : "text-foreground"}`}
          >
            {resumen.rachaActual}
          </p>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-2 pl-3 font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Factura
                </span>
              </th>
              <th className="text-left p-2 font-medium text-muted-foreground hidden sm:table-cell">
                Vencimiento
              </th>
              <th className="text-left p-2 font-medium text-muted-foreground hidden sm:table-cell">
                Pagada
              </th>
              <th className="text-center p-2 font-medium text-muted-foreground">
                Estado
              </th>
              <th className="text-right p-2 pr-3 font-medium text-muted-foreground">
                Diferencia
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {historial.map((factura) => (
              <tr
                key={factura.facturaId}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="p-2 pl-3">
                  <span className="font-mono text-xs">
                    #{factura.facturaId}
                  </span>
                  <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                    {factura.fechaVencimiento}
                  </div>
                </td>
                <td className="p-2 text-muted-foreground hidden sm:table-cell">
                  {factura.fechaVencimiento}
                </td>
                <td className="p-2 text-muted-foreground hidden sm:table-cell">
                  {factura.fechaPagada}
                </td>
                <td className="p-2 text-center">
                  {factura.pagadaATiempo ? (
                    <Badge
                      variant="outline"
                      className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="hidden sm:inline">A tiempo</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 bg-red-500/10 text-red-600 border-red-500/30"
                    >
                      <XCircle className="h-3 w-3" />
                      <span className="hidden sm:inline">Atrasado</span>
                    </Badge>
                  )}
                </td>
                <td className="p-2 pr-3 text-right">
                  {factura.diferencia > 0 ? (
                    <span className="text-emerald-600 font-medium">
                      +{factura.diferencia}d
                    </span>
                  ) : factura.diferencia < 0 ? (
                    <span className="text-red-600 font-medium">
                      {factura.diferencia}d
                    </span>
                  ) : (
                    <span className="text-muted-foreground">0d</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con total */}
      <div className="p-2 px-3 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
        <span>{historial.length} facturas analizadas</span>
        <span>
          {historial.filter((f) => f.pagadaATiempo).length} a tiempo /{" "}
          {historial.filter((f) => !f.pagadaATiempo).length} atrasadas
        </span>
      </div>
    </div>
  );
}
