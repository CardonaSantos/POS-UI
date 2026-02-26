import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Wifi,
  Package,
  CreditCard,
  Wallet,
  Activity,
  CalendarDays,
  Receipt,
  Server,
  WifiOff,
  SquareDot,
  EyeOff,
  GitCommitHorizontal,
  Building2,
  LandPlot,
  Map,
  Globe,
  Wrench,
  Key,
  Router,
  UserCheck,
  Banknote,
} from "lucide-react";
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
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ClienteDetailsDto,
  EstadoCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import { InfoCard, InfoItem } from "./components/info-card";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { cn } from "@/lib/utils";
import {
  getEstadoOperandoClienteColorBadge,
  returnStatusClient,
} from "@/Crm/Utils/Utils2";

interface ClientOverviewProps {
  cliente: ClienteDetailsDto;
}

const StatusBadge = ({ status }: { status: string; active?: boolean }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium border rounded-md ",
        getEstadoOperandoClienteColorBadge(
          returnStatusClient(status as EstadoCliente),
        ),
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export function ClientOverview({ cliente }: ClientOverviewProps) {
  const estadoItems: InfoItem[] = [
    {
      label: "Estado Sistema",
      value: <StatusBadge status={cliente.estadoCliente} />,
      icon: UserCheck,
    },
    {
      label: "Servicio Mikrotik",
      value: (
        <StatusBadge
          status={cliente.estadoServicioMikrotik}
          active={cliente.servicioEstado}
        />
      ),
      icon: Server,
    },
    {
      label: "Saldo Pendiente",
      value: (
        <span className="font-bold text-red-600 dark:text-red-400">
          {formattMonedaGT(cliente.saldoCliente?.saldoPendiente || 0)}
        </span>
      ),
      icon: Banknote,
      divider: true,
    },
  ];

  const personalItems: InfoItem[] = [
    {
      label: "Nombre",
      value: `${cliente.nombre} ${cliente.apellidos}`,
      icon: User,
    },
    { label: "Teléfono", value: cliente.telefono, icon: Phone },
    { label: "DPI", value: cliente.dpi, icon: FileText },
    {
      label: "Contacto Referencia",
      value: cliente.contactoReferenciaNombre,
      icon: User,
      divider: true,
    },
    {
      label: "Teléfono Referencia",
      value: cliente.contactoReferenciaTelefono,
      icon: Phone,
    },
    {
      label: "Observaciones",
      value: cliente.observaciones,
      icon: MessageSquare,
      divider: true,
    },
  ];

  const facturacionItems: InfoItem[] = [
    {
      label: "Zona Asignada",
      value: cliente.facturacionZona?.nombre,
      icon: MapPin,
    },
    {
      label: "Día de Generación",
      value: cliente.facturacionZona?.diaGeneracionFactura
        ? `Día ${cliente.facturacionZona.diaGeneracionFactura}`
        : null,
      icon: Receipt,
    },
    {
      label: "Día de Pago",
      value: cliente.facturacionZona?.diaPago
        ? `Día ${cliente.facturacionZona.diaPago}`
        : null,
      icon: CalendarDays,
    },
    {
      label: "Día de Corte",
      value: cliente.facturacionZona?.diaCorte
        ? `Día ${cliente.facturacionZona.diaCorte}`
        : null,
      icon: WifiOff,
    },
  ];
  const internetItems: InfoItem[] = [
    {
      label: "Plan",
      value: cliente.servicio?.nombre,
      icon: Globe, // Un globo terráqueo representa mejor el acceso a "la red" que un paquete de envíos.
    },
    {
      label: "Precio Mensual",
      value: cliente.servicio?.precio
        ? formattMonedaGT(cliente.servicio.precio)
        : null,
      icon: Wallet, // Mucho más claro para representar dinero/pagos que una etiqueta (Tag).
    },

    {
      label: "Fecha Instalación",
      value: cliente.fechaInstalacion
        ? format(new Date(cliente.fechaInstalacion), "PPP", { locale: es })
        : null,
      icon: Wrench, // Una llave inglesa le da ese toque "técnico/físico" de que alguien fue a instalarlo. (CalendarCheck también es buena opción).
      divider: true,
    },
    {
      label: "SSID Wi-Fi",
      value: cliente.ssidRouter,
      icon: Router, // Un enrutador físico distingue bien la señal de red del aparato en sí. (Wifi también es perfecto si prefieres mantenerlo).
    },
    {
      label: "Contraseña",
      value: cliente.contrasenaWifi,
      icon: Key, // Una llave suele ser más directa para "credenciales" de acceso que un candado cerrado.
    },
  ];

  const ubicacionItems: InfoItem[] = [
    {
      label: "Dirección",
      value: cliente.direccion,
      icon: MapPin,
    },
    {
      label: "Sector",
      value: cliente.sector?.nombre,
      icon: LandPlot,
    },
    {
      label: "Municipio",
      value: cliente.municipio?.nombre,
      icon: Building2,
    },
    {
      label: "Departamento",
      value: cliente.departamento?.nombre,
      icon: Map,
    },
  ];

  const tecnicaItems: InfoItem[] = [
    { label: "Router Mikrotik", value: cliente.mikrotik?.nombre, icon: Server },
    {
      label: "Dirección IP",
      value: cliente.IP?.direccion,
      icon: SquareDot,
      divider: true,
    },
    { label: "Máscara", value: cliente.IP?.mascara, icon: EyeOff },
    { label: "Gateway", value: cliente.IP?.gateway, icon: GitCommitHorizontal },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-1">
        {/* BLOQUE IZQUIERDO: Lo más urgente (Identidad, Estado Financiero, Facturación) */}
        <div className="space-y-4 lg:space-y-1">
          <InfoCard
            title="Estado y Saldos"
            icon={Activity}
            items={estadoItems}
            className="border-primary/20 bg-primary/5 dark:bg-primary/10" // Le damos un tinte ligero para resaltarlo
            action={
              <Link to={`/crm/credito?clienteId=${cliente.id}`}>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 gap-2 shadow-sm"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Verificar Crédito</span>
                </Button>
              </Link>
            }
          />

          <InfoCard
            title="Información Personal"
            icon={User}
            items={personalItems}
          />
          <InfoCard
            title="Reglas de Facturación"
            icon={Receipt}
            items={facturacionItems}
          />
        </div>

        {/* BLOQUE DERECHO: Servicios, Ubicación y Técnica */}
        <div className="space-y-4 lg:space-y-1">
          <InfoCard
            title="Servicio de Internet"
            icon={Wifi}
            items={internetItems}
          />
          <InfoCard title="Ubicación" icon={MapPin} items={ubicacionItems} />
          <InfoCard
            title="Configuración de Red"
            icon={Server}
            items={tecnicaItems}
          />
        </div>
      </div>

      {/* SERVICIOS ADICIONALES (Ancho completo abajo) */}
      <InfoCard title="Servicios Adicionales Contratados" icon={Package}>
        {cliente.clienteServicio && cliente.clienteServicio.length > 0 ? (
          <div className="overflow-x-auto border rounded-md mt-2">
            <Table className="min-w-full">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Servicio</TableHead>
                  {/* <TableHead className="text-xs sm:text-sm">Tipo</TableHead> */}
                  <TableHead className="text-xs sm:text-sm">Precio</TableHead>
                  <TableHead className="text-xs sm:text-sm">
                    Fecha Contratación
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cliente.clienteServicio.map((cs) => (
                  <TableRow className="text-xs sm:text-sm" key={cs.id}>
                    <TableCell className="py-3 font-medium">
                      {cs.servicio.nombre}
                    </TableCell>
                    {/* <TableCell className="py-3 text-muted-foreground">{cs.servicio.tipo}</TableCell> */}

                    <TableCell className="py-3">
                      {formattMonedaGT(cs.servicio.precio)}
                    </TableCell>
                    <TableCell className="py-3">
                      {cs.fechaContratacion
                        ? format(new Date(cs.fechaContratacion), "PPP", {
                            locale: es,
                          })
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2 italic">
            No hay servicios adicionales contratados.
          </p>
        )}
      </InfoCard>
    </div>
  );
}
