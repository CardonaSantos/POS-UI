import type React from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bot,
  Calendar,
  CalendarClock,
  CheckCircle,
  CreditCard,
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
  XCircle,
} from "lucide-react";

import type { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";
import type { ServicioAdicional } from "@/Crm/features/servicio-adicional/servicio-adicional";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";

import { CompactField } from "./CompactField";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

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
  const pagosCount = factura.pagos?.length ?? 0;
  const saldoPendiente = factura.saldoPendiente ?? factura.montoPago ?? 0;
  const estadoTone = getFacturaEstadoTone(
    String(factura.estadoFacturaInternet),
  );

  return (
    <AppCard
      variant="outline"
      size="xs"
      title={
        <AppInline gap="xs" align="center" className="min-w-0">
          <ReceiptText className="h-4 w-4 shrink-0" />
          <span className="truncate">Factura #{factura.id}</span>
        </AppInline>
      }
      action={
        <AppInline gap="xs" align="center" justify="end" wrap>
          <AppBadge
            size="xs"
            tone={estadoTone}
            appearance="soft"
            leftIcon={getFacturaEstadoIcon(
              String(factura.estadoFacturaInternet),
            )}
          >
            {factura.estadoFacturaInternet}
          </AppBadge>

          <AppButton
            asChild
            size="xs"
            variant="ghost"
            leftIcon={<FilePenLine className="h-3.5 w-3.5" />}
          >
            <Link to={`/crm/editar?factura=${factura.id}`}>Editar</Link>
          </AppButton>

          <AppButton
            type="button"
            size="xs"
            variant="danger"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={onRequestDelete}
          >
            Eliminar
          </AppButton>
        </AppInline>
      }
    >
      <AppStack gap="xs">
        <AppGrid cols={{ base: 1, sm: 2, xl: 3 }} gap="xs">
          <CompactField
            icon={
              <Wifi className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            label="Servicio"
            value={
              factura.cliente.servicioInternet?.nombre || "Plan de Internet"
            }
            extra={factura.cliente.servicioInternet?.velocidad}
          />

          <CompactField
            icon={
              <CalendarClock
                className={[
                  "h-4 w-4",
                  facturaVencida
                    ? "text-[hsl(var(--app-danger,var(--destructive)))]"
                    : "text-[hsl(var(--app-primary,var(--primary)))]",
                ].join(" ")}
              />
            }
            label="Fecha de pago esperada"
            value={formattShortFecha(factura.fechaPagoEsperada)}
            badge={
              facturaVencida ? (
                <AppBadge size="xs" tone="danger" appearance="soft">
                  Vencida
                </AppBadge>
              ) : null
            }
          />

          <CompactField
            icon={
              <Calendar className="h-4 w-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />
            }
            label="Fecha pagada"
            value={formattShortFecha(factura.fechaPagada)}
          />

          <CompactField
            icon={
              <CreditCard className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            label="Monto total"
            value={formattMonedaGT(factura.montoPago)}
          />

          <CompactField
            icon={
              <CreditCard className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
            }
            label="Saldo pendiente"
            value={formattMonedaGT(saldoPendiente)}
            valueClassName={
              saldoPendiente > 0
                ? "text-[hsl(var(--app-danger,var(--destructive)))]"
                : "text-[hsl(var(--app-success))]"
            }
          />

          <CompactField
            icon={
              factura.creador ? (
                <User className="h-4 w-4 text-[hsl(var(--app-primary,var(--primary)))]" />
              ) : (
                <Bot className="h-4 w-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />
              )
            }
            label="Generado por"
            value={factura.creador?.nombre ?? "Sistema Auto"}
          />
        </AppGrid>

        <AppSeparator spacing="none" />

        <AppGrid cols={{ base: 1, md: 2 }} gap="xs">
          <FacturaInfoBox
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Detalle"
          >
            {factura.detalleFactura || "Sin detalles adicionales"}
          </FacturaInfoBox>

          {factura.facturacionZona ? (
            <FacturaInfoBox
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Zona de facturación"
            >
              <AppInline gap="xs" align="center">
                <MapPin className="h-3.5 w-3.5 text-[hsl(var(--app-primary,var(--primary)))]" />
                <span>{factura.facturacionZona.nombre}</span>
              </AppInline>
            </FacturaInfoBox>
          ) : null}

          {pagosCount > 0 ? (
            <div className="md:col-span-2">
              <FacturaInfoBox
                icon={<History className="h-3.5 w-3.5" />}
                label="Historial de pagos"
                action={
                  <AppButton
                    type="button"
                    size="xs"
                    variant="ghost"
                    leftIcon={<History className="h-3.5 w-3.5" />}
                    onClick={onShowHistorial}
                  >
                    Ver historial
                  </AppButton>
                }
              >
                {pagosCount === 1
                  ? "1 pago registrado"
                  : `${pagosCount} pagos registrados`}
              </FacturaInfoBox>
            </div>
          ) : null}
        </AppGrid>

        <AppSeparator spacing="none" />

        <AppStack gap="xs">
          <AppInline gap="xs" align="center" justify="between">
            <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Otros servicios adquiridos
            </span>

            {servicios.length > 0 ? (
              <AppBadge size="xs" tone="info" appearance="soft">
                {servicios.length}
              </AppBadge>
            ) : null}
          </AppInline>

          {servicios.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="xs"
              align="left"
              title="Sin servicios adicionales"
              description="No hay servicios adicionales disponibles para este cliente."
            />
          ) : (
            <AppStack gap="xs">
              {servicios.map((servicio) => (
                <ServicioAdicionalItem
                  key={servicio.id}
                  servicio={servicio}
                  checked={serviciosSeleccionados.includes(servicio.id)}
                  onCheckedChange={(checked) =>
                    onToggleServicio(checked, servicio.id)
                  }
                />
              ))}
            </AppStack>
          )}
        </AppStack>
      </AppStack>
    </AppCard>
  );
};

function FacturaInfoBox({
  icon,
  label,
  action,
  children,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.14)] px-2 py-1.5">
      <AppInline gap="xs" align="center" justify="between" className="mb-0.5">
        <AppInline gap="xs" align="center" className="min-w-0">
          {icon ? (
            <span className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {icon}
            </span>
          ) : null}

          <span className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </span>
        </AppInline>

        {action ? <div className="shrink-0">{action}</div> : null}
      </AppInline>

      <div className="break-words text-xs leading-snug text-[hsl(var(--app-foreground,var(--foreground)))]">
        {children}
      </div>
    </div>
  );
}

function ServicioAdicionalItem({
  servicio,
  checked,
  onCheckedChange,
}: {
  servicio: ServicioAdicional;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background))/0.45)] px-2 py-1.5 transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.18)]">
      <AppInline gap="sm" align="start" justify="between">
        <AppStack gap="none" className="min-w-0">
          <AppInline gap="xs" align="center" wrap>
            <AppBadge
              size="xs"
              tone="primary"
              appearance="soft"
              leftIcon={<Globe className="h-3 w-3" />}
            >
              {servicio.nombre}
            </AppBadge>

            <span className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattMonedaGT(servicio.precio)}
            </span>
          </AppInline>

          {servicio.descripcion ? (
            <AppInline
              gap="xs"
              align="start"
              className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            >
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="break-words leading-snug">
                {servicio.descripcion}
              </span>
            </AppInline>
          ) : null}

          <span className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Adquirido: {formattShortFecha(servicio.creadoEn as string)}
          </span>
        </AppStack>

        <AppSwitch
          size="sm"
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={`Agregar ${servicio.nombre} a la factura`}
        />
      </AppInline>
    </div>
  );
}

function getFacturaEstadoTone(estado: string): AppBadgeTone {
  const normalized = estado.toUpperCase();

  if (normalized.includes("PAGADA")) return "success";
  if (normalized.includes("VENCIDA")) return "danger";
  if (normalized.includes("PARCIAL")) return "info";
  if (normalized.includes("PENDIENTE")) return "warning";
  if (normalized.includes("ANULADA")) return "neutral";

  return "neutral";
}

function getFacturaEstadoIcon(estado: string) {
  const normalized = estado.toUpperCase();

  if (normalized.includes("PAGADA")) {
    return <CheckCircle className="h-3 w-3" />;
  }

  if (normalized.includes("VENCIDA")) {
    return <AlertCircle className="h-3 w-3" />;
  }

  if (normalized.includes("PARCIAL")) {
    return <CreditCard className="h-3 w-3" />;
  }

  if (normalized.includes("PENDIENTE")) {
    return <CalendarClock className="h-3 w-3" />;
  }

  if (normalized.includes("ANULADA")) {
    return <XCircle className="h-3 w-3" />;
  }

  return null;
}
