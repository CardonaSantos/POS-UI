import { DashboardData } from "@/Crm/features/dashboard/dashboard.interfaces";
import { KpiCard } from "./KpiCard";
import {
  CreditCard,
  DollarSign,
  FileText,
  AlertTriangle,
  Users,
  UserCheck,
  PauseCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

interface DashboardKpisSectionProps {
  kpisData: DashboardData;
}

export function DashboardKpisSection({ kpisData }: DashboardKpisSectionProps) {
  const { facturacion, clientes } = kpisData;

  return (
    <main className="flex-1 flex flex-col gap-4">
      {/* FACTURACIÓN */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2.5">
          Facturación
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 auto-rows-fr">
          {/* Cantidades (facturas) */}
          <KpiCard
            type="FACTURACION"
            linkValue=""
            title="Emitidas"
            value={facturacion.facturasEmitidasMes}
            color="bg-blue-500 dark:bg-blue-600"
            Icon={FileText}
          />
          <KpiCard
            type="FACTURACION"
            linkValue="PAGADA"
            title="Pagadas"
            value={facturacion.facturasPagadasMes}
            color="bg-emerald-500 dark:bg-emerald-600"
            Icon={DollarSign}
          />

          {/* Montos en Q */}
          <KpiCard
            type="FACTURACION"
            linkValue=""
            title="Facturado"
            value={formattMonedaGT(facturacion.montoFacturadoMes)}
            color="bg-indigo-500 dark:bg-indigo-600"
            Icon={CreditCard}
          />
          <KpiCard
            type="FACTURACION"
            linkValue="PENDIENTE"
            title="Sin pagar"
            value={formattMonedaGT(facturacion.montoPendienteMes)}
            color="bg-rose-500 dark:bg-rose-600"
            Icon={AlertTriangle}
          />

          <div className="col-span-2 md:col-span-1 rounded-xl px-3 py-2.5 shadow-sm bg-slate-800/95 dark:bg-slate-900/95 text-slate-50 flex flex-col justify-between min-w-0 overflow-hidden">
            <p className="text-[10px] uppercase tracking-wide opacity-80 font-semibold">
              Total pagadas
            </p>
            <p
              className="text-base md:text-lg lg:text-xl font-bold mt-1 truncate"
              title={formattMonedaGT(facturacion.montoCobradoMes)}
            >
              {formattMonedaGT(facturacion.montoCobradoMes)}
            </p>
          </div>
        </div>
      </section>

      {/* ESTADO DE CLIENTES */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2.5">
          Clientes
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 auto-rows-fr">
          <KpiCard
            type="CLIENTE"
            linkValue=""
            title="En sistema"
            value={clientes.totalEnSistema}
            color="bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900"
            solidText={false}
            Icon={Users}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="ACTIVO"
            title="Activos"
            value={clientes.activos}
            color="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100/80 dark:border-emerald-800 text-emerald-800"
            solidText={false}
            Icon={UserCheck}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="SUSPENDIDO"
            title="Suspendidos"
            value={clientes.suspendidos}
            color="bg-amber-50 dark:bg-amber-900/40 border border-amber-100/80 dark:border-amber-800 text-amber-800"
            solidText={false}
            Icon={PauseCircle}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="MOROSO"
            title="Morosos"
            value={clientes.morosos}
            color="bg-rose-50 dark:bg-rose-900/40 border border-rose-100/80 dark:border-rose-800 text-rose-800"
            solidText={false}
            Icon={AlertTriangle}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="PENDIENTE_ACTIVO"
            title="Pend. activo"
            value={clientes.pendientesActivacion}
            color="bg-fuchsia-50 dark:bg-fuchsia-900/40 border border-fuchsia-100/80 dark:border-fuchsia-800 text-fuchsia-800"
            solidText={false}
            Icon={Clock}
          />
          <KpiCard
            type="CLIENTE"
            linkValue="DESINSTALADO"
            title="Desinstalados"
            value={clientes.desinstalados}
            color="bg-slate-50 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-700 text-slate-800"
            solidText={false}
            Icon={Trash2}
          />
        </div>
      </section>
    </main>
  );
}
