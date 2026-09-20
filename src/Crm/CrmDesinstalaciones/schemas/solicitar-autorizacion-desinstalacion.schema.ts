import { z } from "zod";

/**
 * Formulario administrativo para solicitar autorización
 * de una desinstalación ya registrada.
 *
 * El solicitante NO forma parte del formulario:
 * el backend lo obtiene del usuario autenticado.
 */
export const solicitarAutorizacionDesinstalacionSchema = z.object({
  motivoSolicitud: z.string().trim(),
});

export type SolicitarAutorizacionDesinstalacionFormValues = z.infer<
  typeof solicitarAutorizacionDesinstalacionSchema
>;

export const SOLICITAR_AUTORIZACION_DESINSTALACION_DEFAULT_VALUES: SolicitarAutorizacionDesinstalacionFormValues =
  {
    motivoSolicitud: "",
  };
