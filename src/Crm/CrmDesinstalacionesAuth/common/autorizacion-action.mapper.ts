import {
  AprobarAutorizacionDesinstalacionPayload,
  RechazarAutorizacionDesinstalacionPayload,
} from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";
import {
  AprobarAutorizacionDesinstalacionFormValues,
  RechazarAutorizacionDesinstalacionFormValues,
} from "../schemas/autorizacion-action.schemas";

function optionalTrimmed(value: string): string | undefined {
  const normalized = value.trim();

  return normalized || undefined;
}

export function toAprobarAutorizacionPayload(
  values: AprobarAutorizacionDesinstalacionFormValues,
): AprobarAutorizacionDesinstalacionPayload {
  return {
    contrasenaActual: values.contrasenaActual,

    ...(optionalTrimmed(values.comentarioAutorizador)
      ? {
          comentarioAutorizador: optionalTrimmed(values.comentarioAutorizador),
        }
      : {}),
  };
}

export function toRechazarAutorizacionPayload(
  values: RechazarAutorizacionDesinstalacionFormValues,
): RechazarAutorizacionDesinstalacionPayload {
  const comentarioAutorizador = optionalTrimmed(values.comentarioAutorizador);

  return {
    ...(comentarioAutorizador
      ? {
          comentarioAutorizador,
        }
      : {}),
  };
}
