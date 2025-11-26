import { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";
import { ServicioAdicional } from "@/Crm/features/servicio-adicional/servicio-adicional";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Calendar,
  CalendarClock,
  CreditCard,
  EllipsisVertical,
  FilePenLine,
  FileText,
  Globe,
  History,
  Info,
  MapPin,
  ReceiptText,
  Trash2,
  User,
  Wifi,
} from "lucide-react";
import {
  getEstadoBadgeColor,
  getEstadoIcon,
} from "../helpers/bagesColorFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { CompactField } from "./CompactField";
import { Button } from "@/components/ui/button";
import { formattShortFecha } from "@/utils/formattFechas";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { Separator } from "@/components/ui/separator";

interface FacturaDetailsCardProps {
  factura: FacturaInternetToPay;
  servicios: ServicioAdicional[];
  serviciosSeleccionados: number[];
  facturaVencida: boolean;
  onToggleServicio: (checked: boolean, idServicio: number) => void;
  onShowHistorial: () => void;
  onRequestDelete: () => void;
}

export const FacturaDetailsCard: React.FC<FacturaDetailsCardProps> = ({
  factura,
  servicios,
  serviciosSeleccionados,
  facturaVencida,
  onToggleServicio,
  onShowHistorial,
  onRequestDelete,
}) => {
  return (
    <Card>
      <CardHeader className="pt-3 pb-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ReceiptText className="h-4 w-4" />
            <span className="truncate">Factura #{factura.id}</span>
          </CardTitle>

          <Badge
            className={`${getEstadoBadgeColor(
              factura.estadoFacturaInternet
            )} flex items-center text-[11px] px-2 py-0.5`}
          >
            {getEstadoIcon(factura.estadoFacturaInternet)}
            {factura.estadoFacturaInternet}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted dark:hover:bg-gray-800"
              >
                <EllipsisVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel className="text-xs">
                Acciones
              </DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center text-xs"
                  to={`/crm/editar?factura=${factura.id}`}
                >
                  <FilePenLine className="h-3 w-3 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onRequestDelete}
                className="text-red-600 dark:text-red-400 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 pb-3">
        {/* Detalles principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
          {/* Servicio */}
          <CompactField
            icon={<Wifi className="h-4 w-4" />}
            label="Servicio"
            value={
              factura.cliente.servicioInternet?.nombre || "Plan de Internet"
            }
            extra={factura.cliente.servicioInternet?.velocidad}
          />

          {/* Fecha de Pago Esperada */}
          <CompactField
            icon={
              <CalendarClock
                className={`h-4 w-4 ${
                  facturaVencida
                    ? "text-destructive"
                    : "text-primary dark:text-white"
                }`}
              />
            }
            label="Fecha de Pago Esperada"
            value={formattShortFecha(factura.fechaPagoEsperada)}
            badge={
              facturaVencida && (
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1 uppercase"
                >
                  Vencida
                </Badge>
              )
            }
          />

          {/* Fecha Pagada */}
          <CompactField
            icon={<Calendar className="h-4 w-4" />}
            label="Fecha Pagada"
            value={formattShortFecha(factura.fechaPagada)}
          />

          {/* Monto Total */}
          <CompactField
            icon={<CreditCard className="h-4 w-4" />}
            label="Monto Total"
            value={formattMonedaGT(factura.montoPago)}
            valueClassName="text-sm"
          />

          {/* Saldo Pendiente */}
          <CompactField
            icon={<CreditCard className="h-4 w-4" />}
            label="Saldo Pendiente"
            value={formattMonedaGT(
              factura.saldoPendiente ?? factura.montoPago ?? 0
            )}
            valueClassName={`text-sm ${
              factura.saldoPendiente && factura.saldoPendiente > 0
                ? "text-destructive"
                : "text-green-600"
            }`}
          />

          {/* Generado por */}
          <CompactField
            icon={
              factura.creador ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )
            }
            label="Generado por"
            value={factura.creador?.nombre ?? "Sistema Auto"}
            valueClassName="text-sm"
          />
        </div>

        <Separator />
        {/* Detalle + Zona + Historial súper compactados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {/* Detalle de la factura */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>Detalle</span>
            </div>
            <p className="bg-muted rounded-md px-2 py-1 leading-snug">
              {factura.detalleFactura || "Sin detalles adicionales"}
            </p>
          </div>

          {/* Zona de facturación */}
          {factura.facturacionZona && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Zona de Facturación</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary dark:text-white" />
                <span className="text-xs">
                  {factura.facturacionZona.nombre}
                </span>
              </div>
            </div>
          )}

          {/* Historial de pagos */}
          {factura.pagos && factura.pagos.length > 0 && (
            <div className="space-y-1 md:col-span-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <History className="h-3 w-3" />
                  <span>Historial de Pagos</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px]"
                  onClick={onShowHistorial}
                >
                  <History className="h-3.5 w-3.5 mr-1" />
                  Ver historial
                </Button>
              </div>
              <div className="text-[11px]">
                {factura.pagos.length === 1 ? (
                  <span>1 pago registrado</span>
                ) : (
                  <span>{factura.pagos.length} pagos registrados</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Otros servicios adquiridos – sin Card, más plano */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Otros servicios adquiridos
            </span>
          </div>

          {servicios.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">
              No hay servicios adicionales disponibles para este cliente.
            </p>
          ) : (
            <div className="space-y-1.5">
              {servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 px-2 py-1.5 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="outline"
                      className="flex h-5 items-center gap-1 bg-background"
                    >
                      <Globe className="h-3 w-3" />
                      <span className="text-[11px] font-medium">
                        {servicio.nombre}
                      </span>
                    </Badge>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold">
                          {formattMonedaGT(servicio.precio)}
                        </span>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[220px] text-[11px]"
                            >
                              <p>{servicio.descripcion}</p>
                              <p className="mt-1 text-muted-foreground">
                                Adquirido:{" "}
                                {formattShortFecha(servicio.creadoEn as string)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <Switch
                    checked={serviciosSeleccionados.includes(servicio.id)}
                    onCheckedChange={(checked) =>
                      onToggleServicio(checked, servicio.id)
                    }
                    aria-label={`Agregar ${servicio.nombre} a la factura`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
