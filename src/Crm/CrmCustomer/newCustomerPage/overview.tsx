import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Calendar,
  Building,
  Map,
  LandPlot,
  Wifi,
  Package,
  Tag,
} from "lucide-react";
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
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

// Define la interfaz completa para los datos del cliente

interface ClientOverviewProps {
  cliente: ClienteDetailsDto;
}

// Función de utilidad para formatear moneda
const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ", // Moneda de Guatemala, ajusta según sea necesario
    minimumFractionDigits: 2,
  }).format(valor);
};

export function ClientOverview({ cliente }: ClientOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Información Personal & Contacto de Referencia */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <User className="h-4 w-4 mr-2 text-primary dark:text-white" />
              Información Personal & Contacto de Referencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Nombre:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.nombre} {cliente.apellidos}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Teléfono:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.telefono || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  DPI:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.dpi || "No especificado"}
                </dd>
              </div>
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Contacto Referencia:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.contactoReferenciaNombre || "No especificado"}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Teléfono Referencia:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.contactoReferenciaTelefono || "No especificado"}
                  </dd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Ubicación Completa & Sistema */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Building className="h-4 w-4 mr-2 text-primary dark:text-white" />
              Ubicación Completa & Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-start gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Dirección:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.direccion || "No especificada"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Building className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Empresa:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.empresa?.nombre || "No especificada"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Municipio:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.municipio?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <LandPlot className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Sector:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.sector?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Map className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Departamento:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.departamento?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-start gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Observaciones:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.observaciones ||
                      "No hay observaciones registradas."}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Fecha Instalación:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.fechaInstalacion
                      ? format(new Date(cliente.fechaInstalacion), "PPP", {
                          locale: es,
                        })
                      : "No disponible"}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Creado:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.creadoEn
                      ? format(new Date(cliente.creadoEn), "PPP", {
                          locale: es,
                        })
                      : "No disponible"}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-0">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Actualizado:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.actualizadoEn
                      ? format(new Date(cliente.actualizadoEn), "PPP", {
                          locale: es,
                        })
                      : "No disponible"}
                  </dd>
                </div>
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
      </div>

      {/* Servicios Adicionales (ocupa todo el ancho) */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <Package className="h-4 w-4 mr-2 text-primary dark:text-white" />
            Servicios Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {cliente.clienteServicio && cliente.clienteServicio.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">
                      Servicio
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Precio</TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      Fecha Contratación
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cliente.clienteServicio.map((servicio) => (
                    <TableRow className="text-xs sm:text-sm" key={servicio.id}>
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
  );
}
