import {
  CalendarDays,
  Clock3,
  LogIn,
  LogOut,
  MapPinned,
  RadioTower,
  TimerOff,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { TecnicoTrackingAsistenciaDetalle } from "@/Crm/features/real-time-location/tracking.interfaces";

import {
  attendanceState,
  formatBusinessDate,
  formatMinutes,
  formatTime,
} from "./tracking-attendance.utils";

type Props = {
  detail: TecnicoTrackingAsistenciaDetalle;
  totalLocationPoints: number;
};

export function TrackingAttendanceOverview({
  detail,
  totalLocationPoints,
}: Props) {
  const status = attendanceState(detail);
  const initial = detail.tecnico.nombre.trim().charAt(0).toUpperCase() || "?";

  const metrics = [
    {
      label: "Tracking",
      value: formatMinutes(detail.resumen.minutosTracking),
      icon: <RadioTower className="h-4 w-4" />,
    },
    {
      label: "Jornada",
      value:
        detail.resumen.minutosJornada === null
          ? "En curso"
          : formatMinutes(detail.resumen.minutosJornada),
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      label: "Sin tracking",
      value:
        detail.resumen.minutosSinTracking === null
          ? "Al finalizar"
          : formatMinutes(detail.resumen.minutosSinTracking),
      icon: <TimerOff className="h-4 w-4" />,
    },
    {
      label: "Sesiones",
      value: String(detail.resumen.sesionesTotal),
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      label: "GPS",
      value: String(totalLocationPoints),
      icon: <MapPinned className="h-4 w-4" />,
    },
  ];

  return (
    <AppCard variant="outline" size="xs" radius="lg" className="min-w-0 p-2">
      <div
        className={[
          "grid min-w-0 items-center gap-2",
          "xl:grid-cols-[minmax(22rem,1fr)_auto]",
        ].join(" ")}
      >
        {/* ================================================= */}
        {/* TÉCNICO / JORNADA */}
        {/* ================================================= */}

        <AppInline gap="sm" align="center" wrap={false} className="min-w-0">
          <Avatar
            className={[
              "!h-10 !w-10",
              "max-h-10 max-w-10",
              "min-h-10 min-w-10",
              "shrink-0",
            ].join(" ")}
          >
            <AvatarImage
              src={detail.tecnico.avatarUrl ?? undefined}
              className="h-full w-full object-cover"
            />

            <AvatarFallback className="text-xs font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <AppInline gap="xs" align="center" wrap className="min-w-0">
              <h2 className="truncate text-xs font-semibold">
                {detail.tecnico.nombre}
              </h2>

              <AppBadge tone={status.tone} appearance="soft" size="xs">
                {status.label}
              </AppBadge>

              <AppBadge tone="neutral" appearance="outline" size="xs">
                Asistencia #{detail.asistencia.id}
              </AppBadge>
            </AppInline>

            <AppInline gap="sm" align="center" wrap className="mt-1 min-w-0">
              <AppInline gap="xs" align="center" wrap={false}>
                <CalendarDays className="h-3 w-3 shrink-0 text-muted-foreground" />

                <span className="text-[10px] text-muted-foreground">
                  {formatBusinessDate(detail.asistencia.fecha)}
                </span>
              </AppInline>

              <AppInline gap="xs" align="center" wrap={false}>
                <LogIn className="h-3 w-3 shrink-0 text-muted-foreground" />

                <span className="text-[10px] text-muted-foreground">
                  Entrada{" "}
                  <span className="font-medium text-foreground">
                    {formatTime(detail.asistencia.horaEntrada)}
                  </span>
                </span>
              </AppInline>

              <AppInline gap="xs" align="center" wrap={false}>
                <LogOut className="h-3 w-3 shrink-0 text-muted-foreground" />

                <span className="text-[10px] text-muted-foreground">
                  Salida{" "}
                  <span className="font-medium text-foreground">
                    {detail.asistencia.horaSalida
                      ? formatTime(detail.asistencia.horaSalida)
                      : "En curso"}
                  </span>
                </span>
              </AppInline>
            </AppInline>
          </div>
        </AppInline>

        {/* ================================================= */}
        {/* MÉTRICAS */}
        {/* ================================================= */}

        <div
          className={[
            "grid min-w-0 gap-1.5",
            "grid-cols-2",
            "sm:grid-cols-3",
            "lg:grid-cols-5",
          ].join(" ")}
        >
          {metrics.map((item) => (
            <div
              key={item.label}
              className={[
                "flex h-[2.75rem] min-w-[6.5rem]",
                "items-center",
                "rounded-[var(--app-radius-sm)]",
                "border border-border",
                "bg-muted/20",
                "px-2",
              ].join(" ")}
            >
              <AppInline
                gap="xs"
                align="center"
                wrap={false}
                className="min-w-0"
              >
                <div className="flex size-6 shrink-0 items-center justify-center text-primary">
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[8px] leading-none text-muted-foreground">
                    {item.label}
                  </div>

                  <div className="mt-1 truncate text-[10px] font-semibold leading-none">
                    {item.value}
                  </div>
                </div>
              </AppInline>
            </div>
          ))}
        </div>
      </div>
    </AppCard>
  );
}
