import {
  ActualizarCodigoPerfilPayload,
  CrearPerfilHomologacionPayload,
} from "../../features/pppoe-homologaciones/intefaces";
import {
  ActualizarCodigoPerfilFormValues,
  CrearPerfilHomologacionFormValues,
} from "../schema/schema";

export function toCrearPerfilHomologacionPayload(
  values: CrearPerfilHomologacionFormValues,
): CrearPerfilHomologacionPayload {
  return {
    mikrotikRouterId: values.mikrotikRouterId,
    servicioInternetId: values.servicioInternetId,
    codigoPerfil: values.codigoPerfil.trim(),
  };
}

export function toActualizarCodigoPerfilPayload(
  values: ActualizarCodigoPerfilFormValues,
): ActualizarCodigoPerfilPayload {
  return {
    codigoPerfil: values.codigoPerfil.trim(),
  };
}
