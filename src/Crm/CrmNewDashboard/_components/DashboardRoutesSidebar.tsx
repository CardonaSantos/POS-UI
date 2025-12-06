import { MorosoTop, RutaActiva } from "../interfaces/dashboard-interfaces";

interface DashboardRoutesSidebarProps {
  rutaActiva: RutaActiva[];
  topMorosos: MorosoTop[];
}

export function DashboardRoutesSidebar({
  rutaActiva,
  topMorosos,
}: DashboardRoutesSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-slate-200 dark:border-slate-800 pr-2 gap-2">
      <div className="pb-2 mb-1 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-700 dark:text-slate-100 text-xs uppercase tracking-wide">
          Rutas y cobros | Rutas {rutaActiva.length} | Morosos{" "}
          {topMorosos.length}
        </h2>
      </div>

      {/* RUTAS ACTIVAS (scroll propio) */}
      {Array.isArray(rutaActiva) && rutaActiva.length > 0 && (
        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
          {rutaActiva.map((ruta) => (
            <div
              key={`${ruta.nombreRuta}-${ruta.cobrador}`}
              className="rounded-lg border border-teal-100/80 bg-teal-50/90 
                         dark:border-teal-700/70 dark:bg-slate-900/70 
                         px-2.5 py-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ruta activa
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-300">
                  Cobrador: {ruta.cobrador}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-50 text-xs truncate">
                  Ruta: {ruta.nombreRuta}
                </h3>
                <div className="ml-2 inline-flex items-center rounded-full bg-teal-100/80 dark:bg-teal-900/50 px-2 py-[1px]">
                  <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-100">
                    Clientes: {ruta.totalClientes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP MOROSOS (scroll propio) */}
      <div
        className="rounded-lg border border-teal-100/80 bg-teal-50/80 
                   dark:border-teal-700/70 dark:bg-slate-900/70 
                   px-2.5 py-1.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-200 uppercase tracking-wide">
            Top morosos
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-300">
            Últimos 7 días
          </span>
        </div>

        {/* Lista scrolleable de morosos */}
        <div className="mt-1 space-y-0.5 text-[11px] max-h-24 overflow-y-auto pr-1">
          {topMorosos.map((m) => (
            <div key={m.id} className="flex justify-between items-center">
              <span className="text-slate-700 dark:text-slate-50 truncate">
                {m.nombre}
              </span>
              <span className="ml-2 font-bold text-rose-600 dark:text-rose-200">
                {m.cantidad}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
