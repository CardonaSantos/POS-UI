import {
  FrecuenciaPago,
  InteresTipo,
  OrigenCredito,
} from "@/Crm/features/credito/credito-interfaces";
import { z } from "zod";

/**
 * Sub-schema para cuotas custom
 */
const cuotaCustomSchema = z.object({
  numeroCuota: z.number().int().positive(),
  fechaVencimiento: z.date({
    error: () => ({ message: "Fecha de vencimiento inválida" }),
  }),
  montoCapital: z
    .string()
    .min(1)
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Monto de capital inválido",
    ),
  montoInteres: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
      "Monto de interés inválido",
    ),
});

export const creditoFormSchema = z
  .object({
    clienteId: z
      .number({ error: () => ({ message: "Cliente inválido" }) })
      .int()
      .positive("Cliente requerido"),

    montoCapital: z
      .string()
      .refine(
        (v) => !isNaN(Number(v)) && Number(v) > 0,
        "Monto debe ser mayor a 0",
      ),

    interesPorcentaje: z.string().optional(),
    // .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Interés inválido"),

    interesMoraPorcentaje: z.string().optional(),
    // .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Interés inválido"),

    interesTipo: z.nativeEnum(InteresTipo, {
      error: () => ({ message: "Tipo de interés requerido" }),
    }),

    plazoCuotas: z
      .number({ error: () => ({ message: "Plazo inválido" }) })
      .int()
      .positive("Debe ser mayor a 0"),

    frecuencia: z.nativeEnum(FrecuenciaPago, {
      error: () => ({ message: "Frecuencia requerida" }),
    }),

    intervaloDias: z
      .number({ error: () => ({ message: "Intervalo inválido" }) })
      .int()
      .positive("Intervalo requerido"),

    fechaInicio: z.date({ error: () => ({ message: "Fecha inválida" }) }),

    creadoPorId: z
      .number({ error: () => ({ message: "Usuario inválido" }) })
      .int()
      .positive(),

    tipoGeneracionCuotas: z.enum(["AUTOMATICA", "CUSTOM"]),

    engancheMonto: z
      .string()
      .refine(
        (v) =>
          v === "" || v === undefined || (!isNaN(Number(v)) && Number(v) > 0),
        "Enganche inválido",
      )
      .optional(),

    engancheFecha: z.date().optional(),

    cuotasCustom: z.array(cuotaCustomSchema).optional(),

    origenCredito: z.enum(OrigenCredito).optional(),

    observaciones: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipoGeneracionCuotas === "CUSTOM") {
      if (!data.cuotasCustom || data.cuotasCustom.length === 0) {
        ctx.addIssue({
          path: ["cuotasCustom"],
          message: "Debe definir las cuotas custom",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (
      data.engancheMonto &&
      data.engancheMonto !== "" &&
      !data.engancheFecha
    ) {
      ctx.addIssue({
        path: ["engancheFecha"],
        message: "Fecha de enganche requerida",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type CreditoFormValues = z.infer<typeof creditoFormSchema>;
export type CuotaCustom = z.infer<typeof cuotaCustomSchema>;
