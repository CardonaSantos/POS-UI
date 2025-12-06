import { Settings } from "lucide-react";
import { TicketsDashboardSoporte } from "../interfaces/dashboard-interfaces";

interface DashboardSupportSidebarProps {
  ticketsSoporte: TicketsDashboardSoporte;
}

export function DashboardSupportSidebar({
  ticketsSoporte,
}: DashboardSupportSidebarProps) {
  const tickets = ticketsSoporte.tickets;

  return (
    <aside className="hidden xl:flex flex-col w-72 border-l border-slate-200 dark:border-slate-800 pl-2">
      <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-700 dark:text-slate-100 text-[0.6rem] uppercase tracking-wide">
          Tickets Soporte | En línea {ticketsSoporte.ticketsMetricas.enLinea} |
          En proceso {tickets.length} | RESTANTES{" "}
          {ticketsSoporte.ticketsMetricas.enLinea - tickets.length}
        </h2>
      </div>

      {/* scrollable */}
      <div className="space-y-1.5 overflow-y-auto max-h-60 pr-1">
        {tickets.map((ticket) => {
          const acompanantes = Array.isArray(ticket.acompanantes)
            ? ticket.acompanantes.filter(Boolean)
            : [];

          const MAX_ACOMPANANTES_VISIBLE = 3;
          const visibles = acompanantes.slice(0, MAX_ACOMPANANTES_VISIBLE);
          const restantes = acompanantes.length - visibles.length;

          return (
            <div
              key={ticket.id}
              className="
                rounded-lg px-2.5 py-1.5 border shadow-sm
                border-teal-100/80 bg-teal-50/90
                dark:border-teal-700/70 dark:bg-slate-900/60
                dark:text-slate-50
              "
            >
              {/* Título + estado */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-50 truncate">
                  {ticket.titulo}
                </p>

                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                  <Settings className="w-3 h-3 animate-spin" />
                  En curso
                </span>
              </div>

              {/* Cliente + equipo */}
              <div className="mt-1 flex flex-col gap-1 text-[11px] text-slate-700 dark:text-slate-200">
                <span className="truncate">Cliente: {ticket.cliente}</span>

                {/* Contenedor de chips (técnico + acompañantes) */}
                <div className="flex flex-wrap justify-end gap-1">
                  {ticket.tecnico && (
                    <span className="text-[10px] px-2 py-[1px] rounded-full bg-teal-100/90 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100">
                      Tec: {ticket.tecnico || "N/A"}
                    </span>
                  )}

                  {visibles.map((nombre, idx) => (
                    <span
                      key={`${ticket.id}-acom-${idx}`}
                      className="text-[10px] px-2 py-[1px] rounded-full bg-teal-50/90 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100"
                    >
                      Acomp: {nombre || "N/A"}
                    </span>
                  ))}

                  {restantes > 0 && (
                    <span className="text-[10px] bg-slate-200/80 dark:bg-slate-700 px-2 py-[1px] rounded-full text-slate-800 dark:text-slate-50">
                      +{restantes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
