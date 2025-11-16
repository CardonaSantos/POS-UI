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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

interface GeneralTabProps {
  cliente: ClienteDetailsDto;
}

export function GeneralTab({ cliente }: GeneralTabProps) {
  return (
    <div className="space-y-2 p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Información Personal & Contacto de Referencia */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <User className="h-3 w-3 mr-2 text-primary dark:text-white" />
              Información Personal & Contacto de Referencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid gap-1">
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <User className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Nombre:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.nombre} {cliente.apellidos}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Teléfono:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.telefono || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  DPI:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.dpi || "No especificado"}
                </dd>
              </div>
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <User className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                    Contacto Referencia:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.contactoReferenciaNombre || "No especificado"}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
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

        {/* Ubicación Completa & Sistema */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Building className="h-3 w-3 mr-2 text-primary dark:text-white" />
              Ubicación Completa & Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid gap-1">
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-start gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Dirección:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.direccion || "No especificada"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Municipio:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.municipio?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <LandPlot className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Sector:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.sector?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Map className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                  Departamento:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {cliente.departamento?.nombre || "No especificado"}
                </dd>
              </div>
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-start gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
                    Observaciones:
                  </dt>
                  <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                    {cliente.observaciones ||
                      "No hay observaciones registradas."}
                  </dd>
                </div>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
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
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
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
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1">
                  <dt className="font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />{" "}
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
      </div>
    </div>
  );
}
