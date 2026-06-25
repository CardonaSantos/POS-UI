"use client";

import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Map,
  Phone,
  PhoneCall,
  Printer,
  User,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppStateHandlers } from "@/components/app/handlers";
import { copyToClipBoard } from "@/utils/clipBoard";
import { openNumberPhone } from "@/utils/openNumberPhone";
import { formattShortFecha } from "@/utils/formattFechas";
import { formattMonedaGT } from "@/utils/formattMonedaGt";

import type { RutaCliente, RutaFactura } from "./ruta-cobro.helpers";
import { getClienteDebeTone, isFacturaPagada } from "./ruta-cobro.helpers";

interface RutaCobroClientPanelProps {
  clientes: RutaCliente[];
  selectedClientId: number | null;
  onSelectClient: (clienteId: number | null) => void;
  onOpenPayment: (cliente: RutaCliente, factura: RutaFactura) => void;
}

function ContactAction({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const cleanValue = value?.trim();

  if (!cleanValue) {
    return (
      <AppInline align="center" gap="xs" className="min-w-0">
        <Phone
          size={13}
          className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        />
        <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}: no registrado
        </span>
      </AppInline>
    );
  }

  return (
    <AppInline align="center" justify="between" gap="xs" className="min-w-0">
      <AppInline align="center" gap="xs" className="min-w-0">
        <Phone
          size={13}
          className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        />
        <span className="truncate text-xs text-[hsl(var(--app-foreground,var(--foreground)))]">
          {label}: {cleanValue}
        </span>
      </AppInline>

      <AppInline align="center" gap="md" className="shrink-0">
        <AppButton
          type="button"
          variant="ghost"
          size="xs"
          width="auto"
          aria-label={`Copiar ${label}`}
          onClick={() => copyToClipBoard(cleanValue)}
          className="h-7 px-2"
        >
          <Copy size={12} />
        </AppButton>

        <AppButton
          type="button"
          variant="ghost"
          size="xs"
          width="auto"
          aria-label={`Llamar a ${label}`}
          onClick={() => openNumberPhone(cleanValue)}
          className="h-7 px-2"
        >
          <PhoneCall size={12} />
        </AppButton>
      </AppInline>
    </AppInline>
  );
}

function ClientHeader({
  cliente,
  expanded,
  selected,
  onToggle,
}: {
  cliente: RutaCliente;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const tone = getClienteDebeTone(cliente.totalDebe);

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={`cliente-ruta-${cliente.id}`}
      onClick={onToggle}
      className={[
        "flex w-full min-w-0 items-center justify-between gap-2 rounded-[var(--app-radius-md)] px-2 py-2 text-left transition-colors",
        selected
          ? "bg-[hsl(var(--app-primary)/0.10)]"
          : "hover:bg-[hsl(var(--app-muted,var(--muted)))/0.45]",
      ].join(" ")}
    >
      <AppInline align="center" gap="xs" className="min-w-0">
        <span
          className={[
            "h-2 w-2 shrink-0 rounded-full",
            cliente.totalDebe > 0
              ? "bg-[hsl(var(--app-danger,var(--destructive)))]"
              : "bg-[hsl(var(--app-success))]",
          ].join(" ")}
        />

        <div className="min-w-0">
          <p
            className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]"
            title={cliente.nombreCompleto}
          >
            {cliente.nombreCompleto}
          </p>

          <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {cliente.facturas.length} factura
            {cliente.facturas.length === 1 ? "" : "s"} · Último pago:{" "}
            {formattShortFecha(cliente.saldo?.ultimoPago)}
          </p>
        </div>
      </AppInline>

      <AppInline align="center" gap="xs" className="shrink-0">
        <AppBadge tone={tone} appearance="soft" size="xs" radius="full">
          {formattMonedaGT(cliente.totalDebe)}
        </AppBadge>

        <ChevronDown
          size={14}
          className={[
            "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] transition-transform",
            expanded ? "rotate-180" : "",
          ].join(" ")}
        />
      </AppInline>
    </button>
  );
}

function ClienteInfoGrid({ cliente }: { cliente: RutaCliente }) {
  const hasLocation = Boolean(
    cliente.ubicacion?.latitud && cliente.ubicacion?.longitud,
  );

  return (
    <AppGrid cols={{ base: 1, md: 2 }} gap="xs">
      <ContactAction label="Teléfono" value={cliente.telefono} />

      <ContactAction
        label="Referencia"
        value={cliente.contactoReferencia?.telefono}
      />

      <AppInline align="center" gap="xs" className="min-w-0">
        <CreditCard
          size={13}
          className="shrink-0 text-[hsl(var(--app-danger,var(--destructive)))]"
        />
        <span className="truncate text-xs text-[hsl(var(--app-foreground,var(--foreground)))]">
          Pendiente: {formattMonedaGT(cliente.totalDebe)}
        </span>
      </AppInline>

      {hasLocation ? (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center gap-1 text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          <Map size={13} className="shrink-0" />
          <span className="truncate">Ubicación en Maps</span>
          <ExternalLink size={11} className="shrink-0" />
        </a>
      ) : (
        <AppInline align="center" gap="xs" className="min-w-0">
          <Map
            size={13}
            className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          />
          <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Ubicación no disponible
          </span>
        </AppInline>
      )}
    </AppGrid>
  );
}

function FacturaCard({
  cliente,
  factura,
  onOpenPayment,
}: {
  cliente: RutaCliente;
  factura: RutaFactura;
  onOpenPayment: (cliente: RutaCliente, factura: RutaFactura) => void;
}) {
  const pagada = isFacturaPagada(factura.estadoFactura);

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppStack gap="xs">
        <AppInline align="center" justify="between" gap="xs">
          <AppInline align="center" gap="xs" className="min-w-0">
            {pagada ? (
              <CheckCircle2
                size={13}
                className="shrink-0 text-[hsl(var(--app-success))]"
              />
            ) : (
              <AlertCircle
                size={13}
                className="shrink-0 text-[hsl(var(--app-warning))]"
              />
            )}

            <span className="truncate text-xs font-semibold">
              Factura #{factura.id}
            </span>
          </AppInline>

          <AppBadge
            tone={
              pagada
                ? "success"
                : factura.estadoFactura === "PARCIAL"
                  ? "warning"
                  : "danger"
            }
            appearance="soft"
            size="xs"
            radius="full"
          >
            {factura.estadoFactura}
          </AppBadge>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 3 }} gap="xs">
          <div className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Monto:{" "}
            <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattMonedaGT(factura.montoPago)}
            </span>
          </div>

          <div className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Pendiente:{" "}
            <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattMonedaGT(factura.saldoPendiente)}
            </span>
          </div>

          <div className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Fecha:{" "}
            <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattShortFecha(factura.creadoEn)}
            </span>
          </div>
        </AppGrid>

        <AppInline align="center" justify="between" gap="xs" wrap>
          <Link
            to={`/crm/factura-pago/pago-servicio-pdf/${factura.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
          >
            <Printer size={13} />
            Imprimir factura
          </Link>

          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            disabled={pagada}
            onClick={() => onOpenPayment(cliente, factura)}
          >
            Registrar pago
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

function FacturasClienteList({
  cliente,
  onOpenPayment,
}: {
  cliente: RutaCliente;
  onOpenPayment: (cliente: RutaCliente, factura: RutaFactura) => void;
}) {
  if (!cliente.facturas.length) {
    return (
      <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-4 text-center text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        No hay facturas pendientes.{" "}
        <Link
          to={`/crm/cliente/${cliente.id}`}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          Ver facturación
        </Link>
      </div>
    );
  }

  return (
    <AppStack gap="xs">
      <AppInline align="center" gap="xs">
        <FileText
          size={13}
          className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        />
        <h4 className="text-xs font-semibold">Facturas pendientes</h4>
      </AppInline>

      <AppStack gap="xs">
        {cliente.facturas.map((factura) => (
          <FacturaCard
            key={factura.id}
            cliente={cliente}
            factura={factura}
            onOpenPayment={onOpenPayment}
          />
        ))}
      </AppStack>
    </AppStack>
  );
}

function ClienteRutaItem({
  cliente,
  expanded,
  selected,
  onToggle,
  onOpenPayment,
}: {
  cliente: RutaCliente;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpenPayment: (cliente: RutaCliente, factura: RutaFactura) => void;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-1">
      <ClientHeader
        cliente={cliente}
        expanded={expanded}
        selected={selected}
        onToggle={onToggle}
      />

      {expanded ? (
        <div id={`cliente-ruta-${cliente.id}`} className="px-2 pb-2 pt-1">
          <AppStack gap="sm">
            <Link
              to={`/crm/cliente/${cliente.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--app-primary))] hover:underline"
            >
              <User size={13} />
              Ver perfil del cliente
              <ExternalLink size={11} />
            </Link>

            <ClienteInfoGrid cliente={cliente} />

            <FacturasClienteList
              cliente={cliente}
              onOpenPayment={onOpenPayment}
            />
          </AppStack>
        </div>
      ) : null}
    </AppCard>
  );
}

export function RutaCobroClientPanel({
  clientes,
  selectedClientId,
  onSelectClient,
  onOpenPayment,
}: RutaCobroClientPanelProps) {
  const disclosure = useAppStateHandlers<{
    expandedClientId: number | null;
  }>({
    expandedClientId: null,
  });

  const toggleClient = (clienteId: number) => {
    const nextId =
      disclosure.state.expandedClientId === clienteId ? null : clienteId;

    disclosure.setField("expandedClientId", nextId);
    onSelectClient(nextId);
  };

  if (!clientes.length) {
    return (
      <AppEmptyState
        preset="empty"
        variant="dashed"
        size="sm"
        align="center"
        title="Sin clientes en ruta"
        description="Esta ruta no tiene clientes asignados."
      />
    );
  }

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="min-h-0 flex-1 overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col">
        <AppInline
          align="center"
          justify="between"
          gap="sm"
          className="border-b border-[hsl(var(--app-border,var(--border)))] px-3 py-2"
        >
          <AppInline align="center" gap="xs">
            <User size={14} />
            <h2 className="text-xs font-semibold">Clientes en ruta</h2>
          </AppInline>

          <AppBadge tone="info" appearance="soft" size="xs">
            {clientes.length}
          </AppBadge>
        </AppInline>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pr-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--app-border,var(--border)))_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--app-border,var(--border)))]">
          <AppStack gap="xs">
            {clientes.map((cliente) => (
              <ClienteRutaItem
                key={cliente.id}
                cliente={cliente}
                expanded={disclosure.state.expandedClientId === cliente.id}
                selected={selectedClientId === cliente.id}
                onToggle={() => toggleClient(cliente.id)}
                onOpenPayment={onOpenPayment}
              />
            ))}
          </AppStack>
        </div>
      </div>
    </AppCard>
  );
}
