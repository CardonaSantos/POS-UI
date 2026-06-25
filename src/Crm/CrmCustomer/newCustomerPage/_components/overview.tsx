import {
  Activity,
  Banknote,
  Building2,
  CalendarDays,
  CreditCard,
  EyeOff,
  FileText,
  GitCommitHorizontal,
  Globe,
  Key,
  LandPlot,
  Map,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Receipt,
  Router,
  Server,
  SquareDot,
  User,
  UserCheck,
  Wallet,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppTableHandlers } from "@/components/app/handlers";

import {
  ClienteDetailsDto,
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import {
  getEstadoTone,
  getEstadoToneCobranza,
} from "@/Crm/CrmCustomers/_components/customer-table.columns";
import {
  ESTADO_CLIENTE_COBRANZA_LABELS,
  ESTADO_CLIENTE_LABELS,
} from "@/Crm/CrmCustomers/customer-table.constants";
import {
  ClienteServicioAdicional,
  serviciosAdicionalesColumns,
} from "./servicios-adicionales.columns";
import { InfoCard, InfoItem } from "./info-card";

interface ClientOverviewProps {
  cliente: ClienteDetailsDto;
}

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getGenericStatusTone(status?: string): BadgeTone {
  if (!status) return "neutral";

  if (["ACTIVO", "AL_DIA", "ONLINE", "HABILITADO"].includes(status)) {
    return "success";
  }

  if (["PAGO_PENDIENTE", "PENDIENTE_ACTIVO", "ATRASADO"].includes(status)) {
    return "warning";
  }

  if (["MOROSO", "SUSPENDIDO", "DESINSTALADO", "OFFLINE"].includes(status)) {
    return "danger";
  }

  return "neutral";
}

function StatusBadge({
  status,
  label,
  tone,
}: {
  status?: string | null;
  label?: string | null;
  tone?: BadgeTone;
}) {
  if (!status && !label) {
    return (
      <span className="italic text-[hsl(var(--app-muted-foreground))]">
        No especificado
      </span>
    );
  }

  return (
    <AppBadge
      tone={tone ?? getGenericStatusTone(status ?? undefined)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {label ?? status?.replace(/_/g, " ")}
    </AppBadge>
  );
}

function formatDate(value?: string | Date | null) {
  if (!value) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return format(parsed, "PPP", { locale: es });
}

export function ClientOverview({ cliente }: ClientOverviewProps) {
  const serviciosTable = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialColumnVisibility: {},
  });

  const serviciosAdicionales = (cliente.clienteServicio ??
    []) as ClienteServicioAdicional[];

  const estadoOperativo = cliente.estadoCliente as EstadoCliente;
  const estadoCobranza = cliente.estadoCobranza as EstadoCobranzaCliente;

  const estadoItems: InfoItem[] = [
    {
      label: "Estado Sistema",
      value: (
        <StatusBadge
          status={estadoOperativo}
          label={ESTADO_CLIENTE_LABELS[estadoOperativo] ?? estadoOperativo}
          tone={getEstadoTone(estadoOperativo)}
        />
      ),
      icon: UserCheck,
    },
    {
      label: "Estado Cobranza",
      value: (
        <StatusBadge
          status={estadoCobranza}
          label={
            ESTADO_CLIENTE_COBRANZA_LABELS[estadoCobranza] ?? estadoCobranza
          }
          tone={getEstadoToneCobranza(estadoCobranza)}
        />
      ),
      icon: Wallet,
    },
    {
      label: "Servicio Mikrotik",
      value: <StatusBadge status={cliente.estadoServicioMikrotik} />,
      icon: Server,
    },
    {
      label: "Saldo Pendiente",
      value: (
        <span className="font-bold text-[hsl(var(--app-danger))]">
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
      value: `${cliente.nombre ?? ""} ${cliente.apellidos ?? ""}`.trim(),
      icon: User,
    },
    { label: "Teléfono", value: cliente.telefono, icon: Phone },
    { label: "DPI", value: cliente.dpi, icon: FileText },
    {
      label: "Contacto Ref.",
      value: cliente.contactoReferenciaNombre,
      icon: User,
      divider: true,
    },
    {
      label: "Teléfono Ref.",
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
      label: "Generación",
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
      icon: Globe,
    },
    {
      label: "Precio Mensual",
      value: cliente.servicio?.precio
        ? formattMonedaGT(cliente.servicio.precio)
        : null,
      icon: Wallet,
    },
    {
      label: "Fecha Instalación",
      value: formatDate(cliente.fechaInstalacion),
      icon: Wrench,
      divider: true,
    },
    {
      label: "SSID Wi-Fi",
      value: cliente.ssidRouter,
      icon: Router,
    },
    {
      label: "Contraseña",
      value: cliente.contrasenaWifi,
      icon: Key,
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
    {
      label: "Router Mikrotik",
      value: cliente.mikrotik?.nombre,
      icon: Server,
    },
    {
      label: "Dirección IP",
      value: cliente.IP?.direccion,
      icon: SquareDot,
      divider: true,
    },
    {
      label: "Máscara",
      value: cliente.IP?.mascara,
      icon: EyeOff,
    },
    {
      label: "Gateway",
      value: cliente.IP?.gateway,
      icon: GitCommitHorizontal,
    },
  ];

  return (
    <AppStack gap="sm" className="pb-4">
      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppStack gap="sm">
          <InfoCard
            title="Estado y Saldos"
            icon={Activity}
            items={estadoItems}
            className="border-[hsl(var(--app-primary)/0.35)] bg-[hsl(var(--app-primary)/0.06)]"
            action={
              <Link to={`/crm/credito?clienteId=${cliente.id}`}>
                <AppButton
                  size="xs"
                  variant="primary"
                  leftIcon={<CreditCard size={14} />}
                >
                  Verificar Crédito
                </AppButton>
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
        </AppStack>

        <AppStack gap="sm">
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
        </AppStack>
      </AppGrid>

      <InfoCard title="Servicios Adicionales Contratados" icon={Package}>
        <AppDataTable<ClienteServicioAdicional>
          data={serviciosAdicionales}
          columns={serviciosAdicionalesColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          enableRowSelection={false}
          enableColumnVisibility={false}
          enableColumnPinning={false}
          enableVirtualization={false}
          stickyHeader={false}
          maxHeight="none"
          emptyTitle="Sin servicios adicionales"
          emptyDescription="No hay servicios adicionales contratados."
          {...serviciosTable.getDataTableStateProps()}
        />
      </InfoCard>
    </AppStack>
  );
}
