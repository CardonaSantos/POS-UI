import { z } from "zod";

const contrasenaActualSchema = z
  .string()
  .min(1, "Ingrese su contraseña actual")
  .max(512, "La contraseña supera el límite permitido");

export const activarPppoeSchema = z.object({
  contrasenaActual: contrasenaActualSchema,
});

export type ActivarPppoeFormValues = z.infer<typeof activarPppoeSchema>;

export const motivoSuspensionPppoeSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(5, "Explique el motivo con al menos 5 caracteres")
    .max(500, "El motivo no puede superar 500 caracteres"),

  contrasenaActual: contrasenaActualSchema,
});

export type MotivoSuspensionPppoeFormValues = z.infer<
  typeof motivoSuspensionPppoeSchema
>;

export const motivoReactivacionPppoeSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(5, "Explique el motivo con al menos 5 caracteres")
    .max(2_000, "El motivo no puede superar 2000 caracteres"),

  contrasenaActual: contrasenaActualSchema,
});

export type MotivoReactivacionPppoeFormValues = z.infer<
  typeof motivoReactivacionPppoeSchema
>;

export const autorizarOperacionPppoeSchema = z.object({
  password: contrasenaActualSchema,
});

export type AutorizarOperacionPppoeFormValues = z.infer<
  typeof autorizarOperacionPppoeSchema
>;

export const reintentarPrealtaPppoeSchema = z.object({
  perfilHomologacionId: z
    .number({
      error: "Seleccione una homologación",
    })
    .int()
    .positive("Seleccione una homologación válida"),
});

export type ReintentarPrealtaPppoeFormValues = z.infer<
  typeof reintentarPrealtaPppoeSchema
>;
