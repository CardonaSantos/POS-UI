import type React from "react";
import { Link } from "react-router-dom";
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

import { EstadoCliente } from "@/Crm/features/cliente-interfaces/cliente-types";
import type { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";

import { CompactField } from "./CompactField";
import { getFacturaEstadoTone } from "@/Crm/CrmCustomer/newCustomerPage/_components/billing-history.helpers";

interface ClientInfoCardProps {
  factura: FacturaInternetToPay;
  facturasPendientes: NonNullable<FacturaInternetToPay["facturasPendientes"]>;
}

export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  factura,
  facturasPendientes,
}) => {
  const pendientes = facturasPendientes ?? [];
  const estadoClienteMeta = getEstadoClienteMeta(factura.cliente.estadoCliente);

  return (
    <AppCard
      className="lg:col-span-1"
      variant="outline"
      size="sm"
      title={
        <AppInline gap="xs" align="center">
          <User className="h-4 w-4" />
          <span>Información del cliente</span>
        </AppInline>
      }
    >
      <AppStack gap="sm">
        <CompactField
          label="Nombre completo"
          icon={
            <UserCheck className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
          }
          value={
            <Link
              to={`/crm/cliente/${factura.cliente.id}`}
              className={[
                "font-medium underline-offset-2 hover:underline",
                "text-[hsl(var(--app-primary,var(--primary)))]",
              ].join(" ")}
            >
              {factura.cliente.nombre} {factura.cliente.apellidos || ""}
            </Link>
          }
        />

        {factura.cliente.telefono ? (
          <CompactField
            label="Teléfono"
            icon={
              <Phone className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            value={factura.cliente.telefono}
          />
        ) : null}

        {factura.cliente.direccion ? (
          <CompactField
            label="Dirección"
            icon={
              <MapPin className="mt-0.5 h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            value={factura.cliente.direccion}
          />
        ) : null}

        {factura.cliente.dpi ? (
          <CompactField
            label="DPI"
            icon={
              <FileText className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            value={factura.cliente.dpi}
          />
        ) : null}

        <AppStack gap="xs">
          <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Estado del cliente
          </span>

          <AppInline gap="xs" align="center">
            <AppBadge
              size="xs"
              tone={estadoClienteMeta.tone}
              appearance="soft"
              leftIcon={estadoClienteMeta.icon}
            >
              {factura.cliente.estadoCliente}
            </AppBadge>
          </AppInline>
        </AppStack>

        <AppSeparator spacing="xs" />

        <AppStack gap="xs">
          <AppInline gap="xs" align="center" justify="between">
            <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Otras facturas pendientes
            </span>

            {pendientes.length > 0 ? (
              <AppBadge size="xs" tone="warning" appearance="soft">
                {pendientes.length}
              </AppBadge>
            ) : null}
          </AppInline>

          {pendientes.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="xs"
              align="left"
              title="Sin facturas pendientes"
              description="No hay otras facturas pendientes para este cliente."
            />
          ) : (
            <div className="max-h-64 overflow-y-auto pr-1">
              <AppStack gap="xs">
                {pendientes.map((facturaPendiente) => (
                  <PendingInvoiceItem
                    key={facturaPendiente.id}
                    factura={facturaPendiente}
                  />
                ))}
              </AppStack>
            </div>
          )}
        </AppStack>
      </AppStack>
    </AppCard>
  );
};

function PendingInvoiceItem({
  factura,
}: {
  factura: NonNullable<FacturaInternetToPay["facturasPendientes"]>[number];
}) {
  return (
    <Link
      to={`/crm/facturacion/pago-factura/${factura.id}`}
      className="block rounded-[var(--app-radius-md)] outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]"
    >
      <div
        className={[
          "rounded-[var(--app-radius-md)]",
          "border border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
          "px-2.5 py-2",
          "transition-colors",
          "hover:bg-[hsl(var(--app-muted,var(--muted))/0.32)]",
        ].join(" ")}
      >
        <AppInline gap="sm" align="start" justify="between">
          <AppInline gap="xs" align="start" className="min-w-0">
            <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />

            <AppStack gap="none" className="min-w-0">
              <span className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                Factura #{factura.id}
              </span>

              <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Vence: {formattShortFecha(factura.fechaPagoEsperada)}
              </span>
            </AppStack>
          </AppInline>

          <AppStack gap="xs" align="end" className="shrink-0">
            <AppBadge
              size="xs"
              tone={getFacturaEstadoTone(String(factura.estado))}
              appearance="soft"
            >
              {factura.estado}
            </AppBadge>

            <span className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattMonedaGT(factura.montoPago)}
            </span>
          </AppStack>
        </AppInline>
      </div>
    </Link>
  );
}

function getEstadoClienteMeta(estado: EstadoCliente) {
  if (estado === EstadoCliente.ACTIVO) {
    return {
      tone: "success" as const,
      icon: <CheckCircle className="h-3 w-3" />,
    };
  }

  if (estado === EstadoCliente.MOROSO) {
    return {
      tone: "danger" as const,
      icon: <AlertCircle className="h-3 w-3" />,
    };
  }

  if (estado === EstadoCliente.SUSPENDIDO) {
    return {
      tone: "warning" as const,
      icon: <XCircle className="h-3 w-3" />,
    };
  }

  return {
    tone: "neutral" as const,
    icon: null,
  };
}
