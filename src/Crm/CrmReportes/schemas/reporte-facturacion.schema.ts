import {
  ReporteFacturacionEstadoFactura,
  ReporteFacturacionMetodoPago,
  ReporteFacturacionOrigenPago,
} from "@/Crm/features/reports/reportes.interfaces";
import { z } from "zod";

// =====================================================
// HELPERS
// =====================================================

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const monthSchema = z
  .string()
  .refine(
    (value) => value === "" || MONTH_PATTERN.test(value),
    "El período no es válido.",
  );

const estadoFacturaSchema = z.enum(
  Object.values(ReporteFacturacionEstadoFactura) as [
    ReporteFacturacionEstadoFactura,
    ...ReporteFacturacionEstadoFactura[],
  ],
);

const metodoPagoSchema = z.enum(
  Object.values(ReporteFacturacionMetodoPago) as [
    ReporteFacturacionMetodoPago,
    ...ReporteFacturacionMetodoPago[],
  ],
);

const origenPagoSchema = z.enum(
  Object.values(ReporteFacturacionOrigenPago) as [
    ReporteFacturacionOrigenPago,
    ...ReporteFacturacionOrigenPago[],
  ],
);

const positiveId = z.number().int().positive();

// SCHEMA

export const reporteFacturacionSchema = z
  .object({
    periodoDesde: monthSchema,

    periodoHasta: monthSchema,

    /**
     * AppFormInput trabaja con el valor real
     * del input HTML, por lo que conservamos
     * este campo como string en FormValues.
     */
    mesesProyeccion: z
      .string()
      .trim()
      .regex(/^\d+$/, "Ingrese un número entero.")
      .refine((value) => {
        const parsed = Number(value);

        return Number.isInteger(parsed) && parsed >= 0 && parsed <= 24;
      }, "La proyección debe estar entre 0 y 24 meses."),

    estadosFactura: z.array(estadoFacturaSchema),

    zonaIds: z.array(positiveId),

    creadorIds: z.array(positiveId),

    clienteId: positiveId.nullable(),

    metodosPago: z.array(metodoPagoSchema),

    origenesPago: z.array(origenPagoSchema),

    cobradorIds: z.array(positiveId),

    rutaIds: z.array(positiveId),
  })
  .superRefine((values, ctx) => {
    const hasDesde = values.periodoDesde.length > 0;

    const hasHasta = values.periodoHasta.length > 0;

    if (hasDesde !== hasHasta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["periodoHasta"],

        message: "Seleccione ambos períodos o deje ambos vacíos.",
      });

      return;
    }

    if (hasDesde && hasHasta && values.periodoDesde > values.periodoHasta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["periodoHasta"],

        message: "El período final no puede ser anterior al inicial.",
      });
    }
  });

// TYPE

export type ReporteFacturacionFormValues = z.infer<
  typeof reporteFacturacionSchema
>;

// DEFAULTS

export const REPORTE_FACTURACION_DEFAULT_VALUES: ReporteFacturacionFormValues =
  {
    periodoDesde: "",

    periodoHasta: "",

    mesesProyeccion: "0",

    estadosFactura: [],

    zonaIds: [],

    creadorIds: [],

    clienteId: null,

    metodosPago: [],

    origenesPago: [],

    cobradorIds: [],

    rutaIds: [],
  };
