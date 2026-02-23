import { ChartDataLineNivo } from "@/Crm/_charts/line-chart/LineChart.interfaces";
import { NivoBarData } from "@/Crm/_charts/bar-chart/bar-chart.interface";
import { LineChartNivo } from "@/Crm/_charts/line-chart/LineChart";
import LocationsMaps from "./locations/locations-maps";
import { BarChartNivo } from "@/Crm/_charts/bar-chart/BarChart";
import { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";

interface DashboardChartsGridProps {
  instalacionesMes: ChartDataLineNivo;
  usuariosEnCampo: RealTimeLocationRaw[];
  instalacionesHistoricas: NivoBarData;
}

export function DashboardChartsGrid({
  instalacionesMes,
  usuariosEnCampo,
  instalacionesHistoricas,
}: DashboardChartsGridProps) {
  return (
    <section className="px-1 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 px-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 px-2 py-2">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wide mb-1">
            Instalaciones vs desinstalaciones del mes
          </p>
          <LineChartNivo
            data={instalacionesMes}
            height={220}
            axisBottomLabel="Día del mes"
            axisLeftLabel="Clientes"
            stacked={true}
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 px-2 py-2">
          <LocationsMaps personas={usuariosEnCampo} />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 px-2 py-2">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wide mb-1">
            Instalaciones históricas
          </p>
          <BarChartNivo
            data={instalacionesHistoricas}
            keys={["instalaciones"]}
            indexBy="label"
            axisLeftLabel="Clientes"
          />
        </div>
      </div>
    </section>
  );
}
