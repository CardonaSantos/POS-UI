import axios from "axios";

export function getTicketConformidadPublicErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "No fue posible registrar la respuesta. Intente nuevamente.";
  }

  switch (error.response?.status) {
    case 400:
      return "No fue posible validar los datos enviados. Revise la información e intente nuevamente.";

    case 404:
      return "Este enlace ya no está disponible.";

    case 409:
      return "Este enlace ya fue utilizado o la solicitud ya fue respondida.";

    case 410:
      return "Este enlace ha expirado. Solicite uno nuevo al personal encargado.";

    default:
      return "No fue posible registrar la respuesta. Revise su conexión e intente nuevamente.";
  }
}
