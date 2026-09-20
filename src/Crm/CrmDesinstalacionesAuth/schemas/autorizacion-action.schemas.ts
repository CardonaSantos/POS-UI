import { z } from "zod";

export const aprobarAutorizacionDesinstalacionSchema = z.object({
  contrasenaActual: z
    .string()
    .min(1, "Ingrese su contraseña actual.")
    .max(255, "La contraseña excede la longitud permitida."),

  comentarioAutorizador: z
    .string()
    .trim()
    .max(500, "El comentario no puede exceder 500 caracteres."),
});

export type AprobarAutorizacionDesinstalacionFormValues = z.infer<
  typeof aprobarAutorizacionDesinstalacionSchema
>;

export const APROBAR_AUTORIZACION_DEFAULT_VALUES: AprobarAutorizacionDesinstalacionFormValues =
  {
    contrasenaActual: "",

    comentarioAutorizador: "",
  };

export const rechazarAutorizacionDesinstalacionSchema = z.object({
  comentarioAutorizador: z.string().trim(),
});

export type RechazarAutorizacionDesinstalacionFormValues = z.infer<
  typeof rechazarAutorizacionDesinstalacionSchema
>;

export const RECHAZAR_AUTORIZACION_DEFAULT_VALUES: RechazarAutorizacionDesinstalacionFormValues =
  {
    comentarioAutorizador: "",
  };
