import * as React from "react";
import {
  AlertTriangle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  PauseCircle,
  ReceiptText,
  Trash2,
  UserCheck,
  Users,
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

  return (
    <AppStack gap="sm" className="min-w-0 ">
      <DashboardKpiGroup
        title="Facturación"
        description="Resumen mensual de emisión, cobro y saldos pendientes"
        icon={<ReceiptText className="h-4 w-4" />}
        badge={`${facturacion.facturasEmitidasMes} emitidas`}
      >
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 p-1">
          {" "}
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
            tone="purple"
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
            linkValue="PAGADAS"
            title="Cobrado"
            value={formattMonedaGT(facturacion.montoCobradoMes)}
            tone="teal"
            Icon={DollarSign}
          />
        </div>
      </DashboardKpiGroup>

      <DashboardKpiGroup
        title="Clientes"
        description="Estado operativo de clientes en el sistema"
        icon={<Users className="h-4 w-4" />}
        badge={`${clientes.totalEnSistema} en sistema`}
      >
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
          {" "}
          <KpiCard
            type="CLIENTE"
            linkValue=""
            title="En sistema"
            value={clientes.totalEnSistema}
            tone="neutral"
            Icon={Users}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="ACTIVO"
            title="Activos"
            value={clientes.activos}
            tone="success"
            Icon={UserCheck}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="SUSPENDIDO"
            title="Suspendidos"
            value={clientes.suspendidos}
            tone="warning"
            Icon={PauseCircle}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="MOROSO"
            title="Morosos"
            value={clientes.morosos}
            tone="danger"
            Icon={AlertTriangle}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="PENDIENTE_ACTIVO"
            title="Pend. activo"
            value={clientes.pendientesActivacion}
            tone="purple"
            Icon={Clock}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="DESINSTALADO"
            title="Desinstalados"
            value={clientes.desinstalados}
            tone="neutral"
            Icon={Trash2}
          />
        </div>
      </DashboardKpiGroup>
    </AppStack>
  );
}

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
              <h2 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide  text-[hsl(var(--app-foreground,var(--foreground)))]">
                {title}
              </h2>

              <p className="hidden">{description}</p>
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
