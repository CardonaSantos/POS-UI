"use client";

import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

interface ZonaTableProps {
  zonas: FacturacionZona[];
  searchTerm: string;
  onEditClick: (zona: FacturacionZona) => void;
  onDeleteClick: (id: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Chip numérico para un día del ciclo */
const DayChip: React.FC<{
  label: string;
  value: number | null | undefined;
}> = ({ label, value }) => (
  <TooltipTrigger asChild>
    <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground leading-none cursor-default select-none">
      {label}
      <span className="text-foreground font-semibold ml-0.5">
        {value ?? "—"}
      </span>
    </span>
  </TooltipTrigger>
);

/** Indicador boolean compacto */
const Flag: React.FC<{ active: boolean; label: string }> = ({
  active,
  label,
}) => (
  <span
    aria-label={`${label}: ${active ? "activo" : "inactivo"}`}
    className={[
      "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none",
      active
        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400"
        : "border-border bg-muted text-muted-foreground",
    ].join(" ")}
  >
    <span
      className={[
        "h-1.5 w-1.5 rounded-full",
        active ? "bg-green-500" : "bg-muted-foreground/40",
      ].join(" ")}
      aria-hidden="true"
    />
    {label}
  </span>
);

// ── Component ──────────────────────────────────────────────────────────────

const ZonaTable: React.FC<ZonaTableProps> = ({
  zonas,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[160px]">Nombre</TableHead>
            <TableHead>Días del ciclo</TableHead>
            <TableHead>Notificaciones</TableHead>
            <TableHead className="text-right w-[80px]">Clientes</TableHead>
            <TableHead className="text-right w-[80px]">Facturas</TableHead>
            <TableHead className="w-[72px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {zonas.map((zona) => (
            <TableRow key={zona.id}>
              {/* Nombre */}
              <TableCell className="font-medium text-sm py-3">
                {zona.nombre}
              </TableCell>

              {/* Días del ciclo */}
              <TableCell className="py-3">
                <div className="flex flex-wrap gap-1">
                  <Tooltip>
                    <DayChip label="Gen" value={zona.diaGeneracionFactura} />
                    <TooltipContent side="top">
                      Día de generación de factura
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <DayChip label="Pago" value={zona.diaPago} />
                    <TooltipContent side="top">Día de pago</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <DayChip label="Rec1" value={zona.diaRecordatorio} />
                    <TooltipContent side="top">
                      Día del primer recordatorio
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <DayChip label="Rec2" value={zona.diaSegundoRecordatorio} />
                    <TooltipContent side="top">
                      Día del segundo recordatorio
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <DayChip label="Corte" value={zona.diaCorte} />
                    <TooltipContent side="top">Día de corte</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Notificaciones */}
              <TableCell className="py-3">
                <div className="flex flex-wrap gap-1">
                  <Flag
                    active={zona.enviarRecordatorioGeneracion}
                    label="Gen."
                  />
                  <Flag active={zona.enviarRecordatorio1} label="Rec1" />
                  <Flag active={zona.enviarRecordatorio2} label="Rec2" />
                  <Flag active={zona.enviarAvisoPago} label="Pago" />
                </div>
              </TableCell>

              {/* Clientes */}
              <TableCell className="text-right tabular-nums text-sm py-3">
                {zona.clientesCount ?? 0}
              </TableCell>

              {/* Facturas */}
              <TableCell className="text-right tabular-nums text-sm py-3">
                {zona.facturasCount ?? 0}
              </TableCell>

              {/* Acciones */}
              <TableCell className="py-3">
                <div className="flex justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEditClick(zona)}
                        aria-label={`Editar ${zona.nombre}`}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Editar</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onDeleteClick(zona.id)}
                        aria-label={`Eliminar ${zona.nombre}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Eliminar</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default ZonaTable;
