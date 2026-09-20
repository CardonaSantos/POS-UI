import * as React from "react";

import {
  AlertTriangle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  PauseCircle,
  ReceiptText,
  Router,
  ShieldCheck,
  TimerOff,
  Trash2,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

import type { DashboardData } from "@/Crm/features/dashboard/dashboard.interfaces";

import { KpiCard } from "./KpiCard";

interface DashboardKpisSectionProps {
  kpisData: DashboardData;
}

export function DashboardKpisSection({ kpisData }: DashboardKpisSectionProps) {
  const { facturacion, clientes } = kpisData;

  const { resumen, servicio, cobranza } = clientes;

  return (
    <AppStack gap="sm" className="min-w-0">
      {/* ======================================================
       * FACTURACIÓN
       * ====================================================== */}

      <DashboardKpiGroup
        title="Facturación"
        description="Resumen mensual de emisión, cobro y saldos pendientes"
        icon={<ReceiptText className="h-3.5 w-3.5" />}
        badge={`${facturacion.facturasEmitidasMes} emitidas`}
      >
        <div className="grid grid-cols-2 gap-1 p-1 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard
            type="FACTURACION"
            linkValue=""
            title="Emitidas"
            value={facturacion.facturasEmitidasMes}
            tone="info"
            Icon={FileText}
          />

          <KpiCard
            type="FACTURACION"
            linkValue="PAGADA"
            title="Pagadas"
            value={facturacion.facturasPagadasMes}
            tone="success"
            Icon={DollarSign}
          />

          <KpiCard
            type="FACTURACION"
            linkValue=""
            title="Facturado"
            value={formattMonedaGT(facturacion.montoFacturadoMes)}
            tone="info"
            Icon={CreditCard}
          />

          <KpiCard
            type="FACTURACION"
            linkValue="PENDIENTE"
            title="Sin pagar"
            value={formattMonedaGT(facturacion.montoPendienteMes)}
            tone="danger"
            Icon={AlertTriangle}
          />

          <KpiCard
            type="FACTURACION"
            linkValue="PAGADA"
            title="Cobrado"
            value={formattMonedaGT(facturacion.montoCobradoMes)}
            tone="primary"
            Icon={DollarSign}
          />
        </div>
      </DashboardKpiGroup>

      {/* ======================================================
       * CLIENTES
       * ====================================================== */}

      <DashboardKpiGroup
        title="Clientes"
        description="Estado operativo y situación de cobranza"
        icon={<Users className="h-3.5 w-3.5" />}
        badge={`${resumen.totalEnSistema} sistema · ${resumen.carteraActual} cartera`}
      >
        <div className="min-w-0 space-y-1.5 p-1">
          {/* ================================================
           * SERVICIO
           * ================================================ */}

          <DashboardKpiSubgroup
            title="Servicio"
            icon={<Router className="h-3 w-3" />}
          >
            <div className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
              <KpiCard
                type="CLIENTE_SERVICIO"
                linkValue="ACTIVO"
                title="Activos"
                value={servicio.activos}
                tone="success"
                Icon={UserCheck}
              />

              <KpiCard
                type="CLIENTE_SERVICIO"
                linkValue="SUSPENDIDO"
                title="Suspendidos"
                value={servicio.suspendidos}
                tone="warning"
                Icon={PauseCircle}
              />

              <KpiCard
                type="CLIENTE_SERVICIO"
                linkValue="EN_INSTALACION"
                title="Instalación"
                value={servicio.enInstalacion}
                tone="primary"
                Icon={Wrench}
              />

              <KpiCard
                type="CLIENTE_SERVICIO"
                linkValue="DESINSTALADO"
                title="Desinstalados"
                value={servicio.desinstalados}
                tone="neutral"
                Icon={Trash2}
              />
            </div>
          </DashboardKpiSubgroup>

          {/* ================================================
           * COBRANZA
           * ================================================ */}

          <DashboardKpiSubgroup
            title="Cobranza"
            icon={<DollarSign className="h-3 w-3" />}
          >
            <div className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-4">
              <KpiCard
                type="CLIENTE_COBRANZA"
                linkValue="AL_DIA"
                title="Al día"
                value={cobranza.alDia}
                tone="success"
                Icon={ShieldCheck}
              />

              <KpiCard
                type="CLIENTE_COBRANZA"
                linkValue="PAGO_PENDIENTE"
                title="Pago pend."
                value={cobranza.pagoPendiente}
                tone="info"
                Icon={Clock}
              />

              <KpiCard
                type="CLIENTE_COBRANZA"
                linkValue="ATRASADO"
                title="Atrasados"
                value={cobranza.atrasados}
                tone="warning"
                Icon={TimerOff}
              />

              <KpiCard
                type="CLIENTE_COBRANZA"
                linkValue="MOROSO"
                title="Morosos"
                value={cobranza.morosos}
                tone="danger"
                Icon={AlertTriangle}
              />
            </div>
          </DashboardKpiSubgroup>
        </div>
      </DashboardKpiGroup>
    </AppStack>
  );
}

/* ============================================================
 * GROUP
 * ============================================================ */

function DashboardKpiGroup({
  title,
  description,
  icon,
  badge,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <AppCard variant="outline" radius="lg" className="min-w-0 p-1">
      <AppStack gap="xs" className="min-w-0">
        <AppInline
          gap="xs"
          align="center"
          justify="between"
          className="min-w-0"
        >
          <AppInline gap="xs" align="center" className="min-w-0">
            <div
              className={[
                "flex h-5 w-5 shrink-0 items-center justify-center",
                "rounded-[var(--app-radius-md)]",
                "bg-[hsl(var(--app-primary,var(--primary))/0.10)]",
                "text-[hsl(var(--app-primary,var(--primary)))]",
              ].join(" ")}
            >
              {icon}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
                {title}
              </h2>

              <span className="sr-only">{description}</span>
            </div>
          </AppInline>

          <AppBadge
            size="xs"
            tone="neutral"
            appearance="soft"
            className="hidden shrink-0 sm:inline-flex"
          >
            {badge}
          </AppBadge>
        </AppInline>

        {children}
      </AppStack>
    </AppCard>
  );
}

/* ============================================================
 * SUBGROUP
 * ============================================================ */

function DashboardKpiSubgroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {icon}

        <span>{title}</span>
      </div>

      {children}
    </div>
  );
}
