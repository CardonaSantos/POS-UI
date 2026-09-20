import {
  ReporteTicketAgrupacion,
  ReporteTicketEstado,
  ReporteTicketPrioridad,
} from "@/Crm/features/reports/reportes.interfaces";
import { z } from "zod";

// HELPERS

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const optionalDate = z
  .string()
  .refine(
    (value) => value === "" || isValidDateOnly(value),
    "La fecha no es válida.",
  );

const agrupacionSchema = z.enum(
  Object.values(ReporteTicketAgrupacion) as [
    ReporteTicketAgrupacion,
    ...ReporteTicketAgrupacion[],
  ],
);

const estadoSchema = z.enum(
  Object.values(ReporteTicketEstado) as [
    ReporteTicketEstado,
    ...ReporteTicketEstado[],
  ],
);

const prioridadSchema = z.enum(
  Object.values(ReporteTicketPrioridad) as [
    ReporteTicketPrioridad,
    ...ReporteTicketPrioridad[],
  ],
);

// =====================================================
// SCHEMA
// =====================================================

export const reporteTicketsSchema = z
  .object({
    periodo: z.object({
      start: optionalDate,
      end: optionalDate,
    }),

    agrupacion: agrupacionSchema,

    estados: z.array(estadoSchema),

    prioridades: z.array(prioridadSchema),

    etiquetaIds: z.array(z.number().int().positive()),

    tecnicoIds: z.array(z.number().int().positive()),

    clienteId: z.number().int().positive().nullable(),
  })
  .superRefine((values, ctx) => {
    const { start, end } = values.periodo;

    const hasStart = start.length > 0;

    const hasEnd = end.length > 0;

    if (hasStart !== hasEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodo"],
        message: "Seleccione ambas fechas o deje el período vacío.",
      });

      return;
    }

    if (hasStart && hasEnd && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodo"],
        message: "La fecha inicial no puede ser posterior a la final.",
      });
    }
  });

// =====================================================
// TYPES
// =====================================================

export type ReporteTicketsFormValues = z.infer<typeof reporteTicketsSchema>;

// =====================================================
// DEFAULTS
// =====================================================

export const REPORTE_TICKETS_DEFAULT_VALUES: ReporteTicketsFormValues = {
  periodo: {
    start: "",
    end: "",
  },

  agrupacion: ReporteTicketAgrupacion.AUTO,

  estados: [],

  prioridades: [],

  etiquetaIds: [],

  tecnicoIds: [],

  clienteId: null,
};
