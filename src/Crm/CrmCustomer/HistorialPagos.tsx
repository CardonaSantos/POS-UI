import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  EllipsisVertical,
  FilePenLine,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FacturaInternet } from "../features/cliente-interfaces/cliente-types";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

interface FacturaToDeleter {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
}

// Función para formatear fechas
const formatearFecha = (fechaISO: string | Date) => {
  const fecha = new Date(fechaISO);
  return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
};

// Función para formatear moneda
const formatearMoneda = (monto: number) => {
  return monto.toFixed(0);
};

// Función para determinar el color de fila según el tipo de transacción
const getRowColor = (esPago: boolean) => {
  return esPago
    ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary"
    : "hover:bg-muted/50 dark:hover:bg-muted/20";
};

interface HistorialPagosProps {
  facturas: FacturaInternet[];
  nombreCliente: string;

  setFacturaAction: (value: FacturaToDeleter) => void;
  setOpenDeleteFactura: (value: boolean) => void;
}

export function HistorialPagos({
  facturas,
  setFacturaAction,
  setOpenDeleteFactura,
}: HistorialPagosProps) {
  console.log("Las transacciones, pagos de facturas, son: ", facturas);

  const transacciones = [...facturas]
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime()
    )
    .map((factura) => {
      const facturaRow = {
        fecha: factura.fechaEmision,
        fechaPagada: factura.fechaPagada,
        canal: {
          creador: factura?.creador?.nombre
            ? factura?.creador?.nombre
            : "SISTEMA AUTO",
          cobrador:
            factura.pagos.length > 0
              ? factura.pagos.map((c) => c?.cobrador?.nombreCobrador).join(", ")
              : "Sin registrar",
        },
        tipoPago: factura?.pagos[0]?.metodoPago ?? "N/A",
        periodo: factura.periodo,
        referencia: factura.id.toString(),
        detalle: `FACTURA ${dayjs
          .utc(factura.fechaVencimiento)
          .locale("es")
          .format("MMMM YYYY")
          .toUpperCase()}`,
        cobro: factura.monto,
        pago:
          factura.pagos?.reduce((total, pago) => total + pago.montoPagado, 0) ||
          0,
        saldo:
          factura.monto -
          (factura.pagos?.reduce(
            (total, pago) => total + pago.montoPagado,
            0
          ) || 0),
        esPago: false, // Solo es pago cuando no es una factura original
        id: factura.id,
        estado: factura.estado,
        fechaEmision: factura.fechaEmision,
        fechaVencimiento: factura.fechaVencimiento,
        pagos: factura.pagos, // Mantén los pagos asociados a la factura
      };
      return facturaRow;
    });

  let saldoAcumulado = 0;
  transacciones.forEach((t) => {
    saldoAcumulado = saldoAcumulado + t.cobro - t.pago;
    t.saldo = saldoAcumulado;
  });

  return (
    <Card className="shadow-sm h-full border dark:border-gray-800">
      <CardHeader className="pb-2 pt-3 bg-muted/30 dark:bg-gray-900/40">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-1.5 text-primary" />
            <span className="font-medium">Historial de Facturación</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* <ScrollArea className="max-h-60 overflow-y-auto"> */}
        <div className="max-h-60 overflow-auto">
          <Table className="w-full text-[11px] [&_th]:py-1.5 [&_td]:py-1 [&_th]:text-[11px] [&_td]:text-[11px] [&_th]:px-2 [&_td]:px-2">
            <TableHeader className="sticky top-0 bg-muted/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
              <TableRow className="border-b dark:border-gray-800">
                <TableHead className="font-medium w-[60px] text-[11px]">
                  Fecha
                </TableHead>
                <TableHead className="font-medium w-[60px] text-[11px]">
                  Periodo
                </TableHead>
                <TableHead className="font-medium w-[80px] text-[11px]">
                  Canales
                </TableHead>
                <TableHead className="font-medium w-[70px] text-[11px]">
                  Estado
                </TableHead>

                <TableHead className="font-medium w-[70px] text-[11px]">
                  F. Pagada
                </TableHead>

                <TableHead className="font-medium w-[70px] text-[11px]">
                  Tipo Pago
                </TableHead>
                <TableHead className="font-medium w-[60px] text-[11px]">
                  ID
                </TableHead>
                <TableHead className="font-medium w-[100px] text-[11px]">
                  Detalle
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Cobro
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Pago
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Saldo
                </TableHead>
                <TableHead className="font-medium text-center w-[40px] text-[11px]">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacciones.map((t) => (
                <TableRow
                  key={t.id}
                  className={`${getRowColor(!!t.pago)} transition-colors`}
                >
                  <TableCell className="whitespace-nowrap font-medium text-[11px]">
                    {formatearFecha(t.fecha)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-medium text-[11px]">
                    {t?.periodo ?? "N/A"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <span className="truncate hover:cursor-pointer hover:text-primary transition-colors text-[11px] underline decoration-dotted underline-offset-2">
                            {t.canal.creador}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-3" align="start">
                          <div className="space-y-3">
                            {/* Creador */}
                            <div className="flex items-start gap-2">
                              <User className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                  Creado por
                                </p>
                                <p className="text-[11px] font-normal text-foreground truncate">
                                  {t.canal.creador}
                                </p>
                              </div>
                            </div>

                            {/* Separador sutil */}
                            <div className="border-t border-border/50"></div>

                            {/* Cobrador */}
                            <div className="flex items-start gap-2">
                              <CreditCard className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                  Cobrado por
                                </p>
                                <p className="text-[11px] font-normal text-foreground">
                                  {t.canal.cobrador === "Sin registrar" ? (
                                    <span className="text-muted-foreground italic">
                                      Sin registrar
                                    </span>
                                  ) : (
                                    t.canal.cobrador
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    <Badge
                      variant={t.estado === "PAGADA" ? "default" : "outline"}
                      className={`px-1.5 py-0 text-[8px] ${
                        t.estado === "PAGADA"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {t.estado}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[11px]">
                    {t.fechaPagada && (
                      <div className="flex items-center gap-1">
                        <span className="truncate">
                          {formatearFecha(t.fechaPagada)}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[11px]">
                    {t.tipoPago && (
                      <div className="flex items-center gap-1">
                        <span className="truncate">{t.tipoPago}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    {t.referencia}
                  </TableCell>

                  {/* Ajustamos la columna de "Detalle" */}
                  <TableCell className="truncate text-[11px]" title={t.detalle}>
                    <Link
                      className="text-primary hover:underline dark:text-blue-300"
                      to={`/crm/facturacion/pago-factura/${t.id}`}
                    >
                      <p className="text-[11px]">{t.detalle}</p>
                    </Link>
                  </TableCell>

                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    {t.cobro > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        {formatearMoneda(t.cobro)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    {t.pago > 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        {formatearMoneda(t.pago)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    <span
                      className={
                        t.saldo > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {formatearMoneda(t.saldo)}
                    </span>
                  </TableCell>

                  {/* Columna de acciones con el botón de elipsis */}
                  <TableCell className="text-center p-0 text-[11px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-muted dark:hover:bg-gray-800"
                        >
                          <EllipsisVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuLabel className="text-sm">
                          Acciones
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/crm/editar?factura=${t.id}`}
                            className="flex items-center text-green-600 dark:text-green-400 focus:text-green-700 dark:focus:text-green-300"
                          >
                            <FilePenLine className="h-3.5 w-3.5 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            const facturaSeleccionada = {
                              id: t.id,
                              estado: t.estado,
                              fechaEmision: t.fechaEmision,
                              fechaVencimiento: t.fechaVencimiento,
                            };

                            setFacturaAction(facturaSeleccionada);
                            setOpenDeleteFactura(true);
                          }}
                          className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
