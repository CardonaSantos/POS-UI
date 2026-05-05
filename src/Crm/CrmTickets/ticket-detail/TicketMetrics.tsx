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
    <div className="px-3 py-2 border-b space-y-1.5 bg-gray-50/60">
      {/* Time chip */}
      {hasTime && (
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock className="w-3 h-3 shrink-0" />
          <span>
            Tiempo invertido:{" "}
            <span className="font-medium text-gray-600">
              {formatDuration(metricas.timeSpentMinutes)}
            </span>
          </span>
          {metricas.logsCount > 0 && (
            <span className="ml-1 text-gray-300">
              · {metricas.logsCount} sesiones
            </span>
          )}
        </div>
      )}

      {/* Resolution card */}
      {hasResolution && (
        <div className="border border-emerald-100 rounded bg-emerald-50/50 px-2 py-1.5 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>{metricas.resolution.solutionName}</span>
          </div>

          {metricas.resolution.solutionDesc && (
            <p className="text-[10px] text-gray-500 pl-4 leading-snug">
              {metricas.resolution.solutionDesc}
            </p>
          )}

          {metricas.resolution.resolutionNote && (
            <p className="text-[10px] text-gray-600 pl-4 leading-snug">
              {metricas.resolution.resolutionNote}
            </p>
          )}

          {metricas.resolution.internalNote && (
            <div className="flex items-start gap-1 pl-4 py-1 bg-amber-50 border border-amber-100 rounded text-[10px] text-amber-700">
              <Lock className="w-3 h-3 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold uppercase tracking-wide text-[9px] opacity-70">
                  Nota interna
                </span>
                <span className="italic">
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
