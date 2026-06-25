import type { TicketsActuales } from "./types";

export type TicketResueltoDiaPivot = {
  dia: number;
  total: number;
} & Record<string, number>;

export interface TicketDiaDetail {
  dia: number;
  total: number;
  tecnicos: Array<{
    name: string;
    resolved: number;
  }>;
}

export function getTechNamesFromScale(data: TicketResueltoDiaPivot[]) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const keys = new Set<string>();

  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "dia" && key !== "total") {
        keys.add(key);
      }
    });
  });

  return Array.from(keys).sort((a, b) => a.localeCompare(b));
}

export function normalizeScaleRows(data: TicketResueltoDiaPivot[]) {
  return data.map((row) => {
    const cleanRow: TicketResueltoDiaPivot = {
      dia: Number(row.dia),
      total: Number(row.total ?? 0),
    };

    Object.entries(row).forEach(([key, value]) => {
      if (key === "dia" || key === "total") return;
      cleanRow[key] = Number(value ?? 0);
    });

    return cleanRow;
  });
}

export function getDayDetail(
  day: TicketResueltoDiaPivot | null,
): TicketDiaDetail | null {
  if (!day) return null;

  const tecnicos = Object.entries(day)
    .filter(([key]) => key !== "dia" && key !== "total")
    .map(([name, value]) => ({
      name,
      resolved: Number(value ?? 0),
    }))
    .filter((item) => item.resolved > 0)
    .sort((a, b) => b.resolved - a.resolved);

  return {
    dia: Number(day.dia),
    total: Number(
      day.total ?? tecnicos.reduce((acc, item) => acc + item.resolved, 0),
    ),
    tecnicos,
  };
}

export function getTicketsActualesSummary(
  data: TicketsActuales | null,
  resueltosDelMes: number,
) {
  return [
    {
      label: "Tickets disponibles",
      value: data?.tickets ?? 0,
      description: "Tickets visibles para gestión",
      tone: "primary" as const,
    },
    {
      label: "Asignados",
      value: data?.ticketsAsignados ?? 0,
      description: "Tickets con técnico asignado",
      tone: "success" as const,
    },
    {
      label: "En proceso",
      value: data?.ticketsEnProceso ?? 0,
      description: "Tickets trabajándose ahora",
      tone: "warning" as const,
    },
    {
      label: "Resueltos del día",
      value: data?.ticketsResueltos ?? 0,
      description: "Resoluciones de hoy",
      tone: "info" as const,
    },
    {
      label: "Resueltos del mes",
      value: resueltosDelMes,
      description: "Acumulado mensual",
      tone: "primary" as const,
    },
  ];
}
