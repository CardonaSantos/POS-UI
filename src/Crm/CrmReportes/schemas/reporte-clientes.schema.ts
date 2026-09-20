import {
  ReporteClienteEstado,
  ReporteClienteEstadoCobranza,
} from "@/Crm/features/reports/reportes.interfaces";
import { z } from "zod";

// HELPERS

const nullablePositiveId = z.number().int().positive().nullable();

const optionalDate = z
  .string()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "La fecha no es válida.",
  );

const clienteEstadoSchema = z.enum(
  Object.values(ReporteClienteEstado) as [
    ReporteClienteEstado,
    ...ReporteClienteEstado[],
  ],
);

const cobranzaEstadoSchema = z.enum(
  Object.values(ReporteClienteEstadoCobranza) as [
    ReporteClienteEstadoCobranza,
    ...ReporteClienteEstadoCobranza[],
  ],
);

// SCHEMA

export const reporteClientesSchema = z
  .object({
    search: z.string().trim().max(160, "La búsqueda es demasiado larga."),

    estado: clienteEstadoSchema.nullable(),

    estadoCobranza: cobranzaEstadoSchema.nullable(),

    servicioInternetId: nullablePositiveId,

    departamentoId: nullablePositiveId,

    municipioId: nullablePositiveId,

    sectorId: nullablePositiveId,

    creadoRange: z.object({
      start: optionalDate,
      end: optionalDate,
    }),

    incluirEliminados: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const { start, end } = values.creadoRange;

    if (start && end && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creadoRange"],
        message: "La fecha inicial no puede ser posterior a la final.",
      });
    }

    if (values.municipioId !== null && values.departamentoId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["municipioId"],
        message: "Seleccione primero un departamento.",
      });
    }

    if (values.sectorId !== null && values.municipioId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sectorId"],
        message: "Seleccione primero un municipio.",
      });
    }
  });

// TYPES

export type ReporteClientesFormValues = z.infer<typeof reporteClientesSchema>;

// DEFAULTS

export const REPORTE_CLIENTES_DEFAULT_VALUES: ReporteClientesFormValues = {
  search: "",

  estado: null,

  estadoCobranza: null,

  servicioInternetId: null,

  departamentoId: null,

  municipioId: null,

  sectorId: null,

  creadoRange: {
    start: "",
    end: "",
  },

  incluirEliminados: false,
};
