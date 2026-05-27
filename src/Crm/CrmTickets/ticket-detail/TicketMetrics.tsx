import { Clock, CheckCircle2, Lock } from "lucide-react";
import { MetricsTicket } from "../ticketTypes";

interface TicketMetricsProps {
  metricas: MetricsTicket;
}

function formatDuration(totalMinutes: number): string {
  if (!totalMinutes) return "0 min";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}

export function TicketMetrics({ metricas }: TicketMetricsProps) {
  const hasTime = metricas?.timeSpentMinutes > 0;
  const hasResolution = !!metricas?.resolution?.solutionName;

  if (!hasTime && !hasResolution) return null;

  return (
    <div className="border-b border-zinc-200 bg-zinc-50/90 px-3 py-2 space-y-2 dark:border-zinc-800 dark:bg-zinc-950/70">
      {/* Time chip */}
      {hasTime && (
        <div className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-zinc-200 bg-white/80 px-2 py-1 text-[10px] text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
          <Clock className="h-3 w-3 shrink-0 text-zinc-500 dark:text-zinc-400" />

          <span className="truncate">
            Tiempo invertido:{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
              {formatDuration(metricas.timeSpentMinutes)}
            </span>
          </span>

          {metricas.logsCount > 0 && (
            <span className="shrink-0 text-sky-700 dark:text-sky-300">
              · {metricas.logsCount} sesiones
            </span>
          )}
        </div>
      )}

      {/* Resolution card */}
      {hasResolution && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/35">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{metricas.resolution.solutionName}</span>
          </div>

          {metricas.resolution.solutionDesc && (
            <p className="mt-1 pl-5 text-[10px] leading-snug text-zinc-600 dark:text-zinc-300">
              {metricas.resolution.solutionDesc}
            </p>
          )}

          {metricas.resolution.resolutionNote && (
            <p className="mt-1 pl-5 text-[10px] leading-snug text-zinc-700 dark:text-zinc-200">
              {metricas.resolution.resolutionNote}
            </p>
          )}

          {metricas.resolution.internalNote && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/35 dark:text-amber-300">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" />

              <div className="min-w-0">
                <span className="block text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Nota interna
                </span>

                <span className="italic leading-snug text-amber-900 dark:text-amber-200">
                  {metricas.resolution.internalNote}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
