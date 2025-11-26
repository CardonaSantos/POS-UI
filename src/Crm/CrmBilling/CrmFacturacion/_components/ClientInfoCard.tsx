import { EstadoCliente } from "@/Crm/features/cliente-interfaces/cliente-types";
import { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  MapPin,
  Phone,
  Receipt,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getEstadoBadgeColor } from "../helpers/bagesColorFunctions";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { CompactField } from "./CompactField";

interface ClientInfoCardProps {
  factura: FacturaInternetToPay;
  facturasPendientes: NonNullable<FacturaInternetToPay["facturasPendientes"]>;
}

export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  factura,
  facturasPendientes,
}) => {
  const pendientes = facturasPendientes ?? [];

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4" />
          Información del Cliente
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <CompactField
          label="Nombre Completo"
          icon={<UserCheck className="h-4 w-4 text-primary dark:text-white" />}
          value={
            <Link
              to={`/crm/cliente/${factura.cliente.id}`}
              className="font-medium text-blue-500 underline"
            >
              {factura.cliente.nombre} {factura.cliente.apellidos || ""}
            </Link>
          }
        />

        {factura.cliente.telefono && (
          <CompactField
            label="Teléfono"
            icon={<Phone className="h-4 w-4 text-primary dark:text-white" />}
            value={factura.cliente.telefono}
          />
        )}

        {factura.cliente.direccion && (
          <CompactField
            label="Dirección"
            icon={
              <MapPin className="h-4 w-4 mt-0.5 text-primary dark:text-white" />
            }
            value={factura.cliente.direccion}
          />
        )}

        {factura.cliente.dpi && (
          <CompactField
            label="DPI"
            icon={<FileText className="h-4 w-4 text-primary dark:text-white" />}
            value={factura.cliente.dpi}
          />
        )}

        {/* Estado cliente */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Estado del Cliente
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={
                factura.cliente.estadoCliente === EstadoCliente.ACTIVO
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : factura.cliente.estadoCliente === EstadoCliente.MOROSO
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }
            >
              {factura.cliente.estadoCliente === EstadoCliente.ACTIVO && (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {factura.cliente.estadoCliente === EstadoCliente.MOROSO && (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {factura.cliente.estadoCliente === EstadoCliente.SUSPENDIDO && (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {factura.cliente.estadoCliente}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Otras facturas pendientes */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Otras Facturas Pendientes
          </div>

          {pendientes.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No hay otras facturas pendientes
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {pendientes.map((f) => (
                  <Link
                    key={f.id}
                    to={`/crm/facturacion/pago-factura/${f.id}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center p-2.5 bg-muted rounded-md hover:bg-accent/40 transition-colors">
                      <div className="flex items-start gap-2">
                        <Receipt className="h-4 w-4 text-primary dark:text-white mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">
                            Factura #{f.id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vence: {formattShortFecha(f.fechaPagoEsperada)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getEstadoBadgeColor(f.estado)}>
                          {f.estado}
                        </Badge>
                        <div className="text-sm font-semibold">
                          {formattMonedaGT(f.montoPago)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
