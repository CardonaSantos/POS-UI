"use client";

import {
  CheckCircle2,
  User,
  Calendar,
  Hash,
  FileText,
  CreditCard,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PagoCreditoResponse } from "@/Crm/features/credito/credito-interfaces";
import { formattShortFecha } from "@/utils/formattFechas";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

interface PagoHistorialItemProps {
  pago: PagoCreditoResponse;
  onDelete?: (pagoId: number) => void;
  isDeleting?: boolean;
}

export function PagoHistorialItem({
  pago,
  onDelete,
  isDeleting = false,
}: PagoHistorialItemProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDetails =
    pago.metodoPago ||
    pago.referencia ||
    pago.observacion ||
    pago.aplicaciones.length > 0;

  return (
    <div className="border-b border-border/50 last:border-0">
      {/* Main Row */}
      <div
        className={cn(
          "group flex items-center justify-between py-2.5 px-3 hover:bg-muted/30 transition-colors",
          hasDetails && "cursor-pointer",
        )}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold">
                {formattMonedaGT(pago.montoTotal)}
              </p>
              {pago.metodoPago && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  <CreditCard className="h-2.5 w-2.5" />
                  {pago.metodoPago}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattShortFecha(pago.fechaPago)}
              </span>
              <span className="text-muted-foreground/50">|</span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {pago.registradoPor.nombre}
              </span>
              {pago.referencia && (
                <>
                  <span className="text-muted-foreground/50 hidden sm:inline">
                    |
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {pago.referencia}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasDetails && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                expanded && "rotate-180",
              )}
            />
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(pago.id);
              }}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar pago</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && hasDetails && (
        <div className="px-3 pb-3 pt-1 ml-12 space-y-2 animate-in slide-in-from-top-1 duration-200">
          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-muted/30 rounded-lg text-xs">
            <div>
              <p className="text-muted-foreground">Registrado</p>
              <p className="font-medium">{formattShortFecha(pago.creadoEn)}</p>
            </div>

            {pago.referencia && (
              <div>
                <p className="text-muted-foreground">Referencia</p>
                <p className="font-medium">{pago.referencia}</p>
              </div>
            )}

            <div>
              <p className="text-muted-foreground">Registrado por</p>
              <p className="font-medium">{pago.registradoPor.nombre}</p>
              <p className="text-muted-foreground text-[10px]">
                {pago.registradoPor.rol}
              </p>
            </div>
          </div>

          {/* Aplicaciones */}
          {pago.aplicaciones.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Aplicado a cuotas:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pago.aplicaciones.map((app) => (
                  <span
                    key={app.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <Hash className="h-3 w-3" />
                    Cuota {app.cuotaId} |
                    <span className="font-semibold">
                      {formattMonedaGT(app.monto)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Observacion */}
          {pago.observacion && (
            <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
              <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Observacion
                </p>
                <p className="text-xs">{pago.observacion}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PagoHistorialItem;
