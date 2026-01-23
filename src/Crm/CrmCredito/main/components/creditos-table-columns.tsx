"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpDown } from "lucide-react";
import {
  CreditoResponse,
  EstadoCredito,
  FrecuenciaPago,
} from "@/Crm/features/credito/credito-interfaces";
import { Link } from "react-router-dom";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";

const estadoBadgeVariant: Record<
  EstadoCredito,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [EstadoCredito.ACTIVO]: "default",
  [EstadoCredito.EN_MORA]: "destructive",
  [EstadoCredito.COMPLETADO]: "secondary",
  [EstadoCredito.CANCELADO]: "outline",
};

const estadoLabel: Record<EstadoCredito, string> = {
  [EstadoCredito.ACTIVO]: "Activo",
  [EstadoCredito.EN_MORA]: "En mora",
  [EstadoCredito.COMPLETADO]: "Completado",
  [EstadoCredito.CANCELADO]: "Cancelado",
};

const frecuenciaLabel: Record<FrecuenciaPago, string> = {
  [FrecuenciaPago.MENSUAL]: "Mensual",
  [FrecuenciaPago.QUINCENAL]: "Quincenal",
  [FrecuenciaPago.SEMANAL]: "Semanal",
  [FrecuenciaPago.CUSTOM]: "Personalizado",
};

const formatCurrency = (value: string | number) => {
  return formattMonedaGT(value);
};

const formatDate = (dateString: string) => {
  return formattShortFecha(dateString);
};

export const creditosColumns: ColumnDef<CreditoResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">#{row.original.id}</span>
    ),
    size: 60,
  },
  {
    accessorKey: "clienteNombre",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-7 text-xs"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cliente
        <ArrowUpDown className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-medium truncate max-w-[150px]">
          {row.original.clienteNombre}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant={estadoBadgeVariant[row.original.estado]}
        className="text-[10px] px-1.5"
      >
        {estadoLabel[row.original.estado]}
      </Badge>
    ),
    size: 90,
  },
  {
    accessorKey: "montoCapital",
    header: "Capital",
    cell: ({ row }) => (
      <span className="text-xs">
        {formatCurrency(row.original.montoCapital)}
      </span>
    ),
    size: 90,
  },
  {
    accessorKey: "montoTotal",
    header: "Total",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {formatCurrency(row.original.montoTotal)}
      </span>
    ),
    size: 90,
  },
  {
    accessorKey: "montoCuota",
    header: "Cuota",
    cell: ({ row }) => (
      <span className="text-xs">{formatCurrency(row.original.montoCuota)}</span>
    ),
    size: 80,
  },
  {
    accessorKey: "plazoCuotas",
    header: "Plazo",
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.plazoCuotas}{" "}
        {frecuenciaLabel[row.original.frecuencia].toLowerCase().slice(0, 3)}.
      </span>
    ),
    size: 70,
  },
  {
    accessorKey: "interesPorcentaje",
    header: "Int.%",
    cell: ({ row }) => (
      <span className="text-xs">{row.original.interesPorcentaje}%</span>
    ),
    size: 60,
  },
  {
    accessorKey: "fechaInicio",
    header: "Inicio",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.original.fechaInicio)}
      </span>
    ),
    size: 80,
  },
  {
    accessorKey: "cuotasPagadas",
    header: "Progreso",
    cell: ({ row }) => {
      const pagadas = row.original.cuotas.filter(
        (c) => c.estado === "PAGADA",
      ).length;
      const total = row.original.cuotas.length;
      const porcentaje = total > 0 ? Math.round((pagadas / total) * 100) : 0;
      return (
        <div className="flex items-center gap-1">
          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {pagadas}/{total}
          </span>
        </div>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild className="size-7">
        <Link to={`/creditos/${row.original.id}`}>
          <Eye className="size-3.5" />
          <span className="sr-only">Ver crédito</span>
        </Link>
      </Button>
    ),
    size: 40,
  },
];
