import { TecnicoPanelPeriodo } from "@/Crm/features/dashboard/panel-tecnico.types";

export function formatTecnicoPanelPeriodo(periodo: TecnicoPanelPeriodo) {
  const date = new Date(periodo.inicioMes);

  if (Number.isNaN(date.getTime())) {
    return `${periodo.diasTranscurridos} días transcurridos`;
  }

  const month = new Intl.DateTimeFormat("es-GT", {
    month: "long",
    year: "numeric",
    timeZone: periodo.zonaHoraria,
  }).format(date);

  return `${capitalize(month)} · ${periodo.diasTranscurridos} días transcurridos`;
}

export function formatMinutesDuration(minutes: number | null) {
  if (minutes == null) {
    return "Sin datos";
  }

  const totalMinutes = Math.max(0, Math.round(minutes));

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);

  const remainingMinutes = totalMinutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours} h ${remainingMinutes} min`
      : `${hours} h`;
  }

  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days} d ${remainingHours} h` : `${days} d`;
}

export function formatDecimal(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("es-GT", {
    maximumFractionDigits,
  }).format(value);
}

function capitalize(value: string) {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}
