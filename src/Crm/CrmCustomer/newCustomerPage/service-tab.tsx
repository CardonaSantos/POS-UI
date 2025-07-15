import { Package, Tag, FileText, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ClienteDetailsDto } from "./types";
import currency from "currency.js";

interface ServiceTabProps {
  cliente: ClienteDetailsDto;
}

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

export function ServiceTab({ cliente }: ServiceTabProps) {
  return (
    <div className="space-y-4 p-4">
      {" "}
      {/* Espaciado general y padding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {" "}
        {/* Ajuste de grid para desktop */}
        {/* Servicio de Internet */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Wifi className="h-4 w-4 mr-2 text-primary dark:text-white" />
              Servicio de Internet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Plan:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.servicio?.nombre || "No asignado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Wifi className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Velocidad:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.servicio?.velocidad || "No especificada"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Precio:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.servicio?.precio
                    ? formatearMoneda(cliente.servicio.precio)
                    : "No especificado"}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Configuración IP */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <FileText className="h-4 w-4 mr-2 text-primary dark:text-white" />
              Configuración IP
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {cliente.IP ? (
              <div className="grid gap-2">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Dirección IP:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.IP.direccion}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Máscara:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.IP.mascara}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Gateway:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.IP.gateway}
                  </dd>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No hay configuración IP asignada.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Servicios Adicionales */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
          {" "}
          {/* Ocupa todo el ancho en desktop */}
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Package className="h-4 w-4 mr-2 text-primary dark:text-white" />
              Servicios Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {cliente.clienteServicio && cliente.clienteServicio.length > 0 ? (
              <div className="overflow-x-auto">
                {" "}
                {/* Permite scroll horizontal en tablas pequeñas */}
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">
                        Servicio
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Precio
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Fecha Contratación
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cliente.clienteServicio.map((servicio) => (
                      <TableRow
                        className="text-xs sm:text-sm"
                        key={servicio.id}
                      >
                        <TableCell className="py-2">
                          {servicio.servicio.nombre}
                        </TableCell>
                        <TableCell className="py-2">
                          {formatearMoneda(servicio.servicio.precio)}
                        </TableCell>
                        <TableCell className="py-2">
                          {format(new Date(servicio.fechaContratacion), "PPP", {
                            locale: es,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No hay servicios adicionales contratados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
