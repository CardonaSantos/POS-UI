import { z } from "zod";

import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";

const optionalText = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`);

export const reprogramarInstalacionSchema = z.object({
  fechaProgramada: z
    .string()
    .min(1, "Indique la nueva fecha y hora.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ingrese una fecha válida.",
    }),
  motivo: optionalText(1000),
});

export type ReprogramarInstalacionFormValues = z.infer<
  typeof reprogramarInstalacionSchema
>;

export const iniciarInstalacionSchema = z.object({
  contrasenaActual: z
    .string()
    .min(1, "Ingrese su contraseña actual.")
    .max(200, "Máximo 200 caracteres."),
  activarServicio: z.boolean(),
});

export type IniciarInstalacionFormValues = z.infer<
  typeof iniciarInstalacionSchema
>;

export const completarInstalacionSchema = z.object({
  resultado: optionalText(2000),
  observaciones: optionalText(2000),
  activarServicio: z.boolean(),
});

export type CompletarInstalacionFormValues = z.infer<
  typeof completarInstalacionSchema
>;

export const cancelarInstalacionSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "Explique brevemente por qué se cancela.")
    .max(1000, "Máximo 1000 caracteres."),
  observaciones: optionalText(2000),
});

export type CancelarInstalacionFormValues = z.infer<
  typeof cancelarInstalacionSchema
>;

export const subirEvidenciaSchema = z.object({
  tipo: z.nativeEnum(TipoEvidenciaClienteOperacion),
  descripcion: optionalText(2000),
  orden: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 0),
      "Ingrese un orden válido.",
    ),
});

export type SubirEvidenciaFormValues = z.infer<
  typeof subirEvidenciaSchema
>;
