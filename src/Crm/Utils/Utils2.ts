import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";

export const returnStatusClient = (estado: EstadoCliente) => {
  let estadoDefined: string;
  switch (estado) {
    case EstadoCliente.ACTIVO:
      estadoDefined = "ACTIVO";
      break;

    case EstadoCliente.DESINSTALADO:
      estadoDefined = "DESINSTALADO";
      break;

    case EstadoCliente.ATRASADO:
      estadoDefined = "ATRASADO";
      break;

    case EstadoCliente.EN_INSTALACION:
      estadoDefined = "EN INSTALACION";
      break;

    case EstadoCliente.MOROSO:
      estadoDefined = "MOROSO";
      break;

    case EstadoCliente.PAGO_PENDIENTE:
      estadoDefined = "PAGO PENDIENTE";
      break;

    case EstadoCliente.PENDIENTE_ACTIVO:
      estadoDefined = "PENDIENTE ACTIVO";
      break;

    case EstadoCliente.SUSPENDIDO:
      estadoDefined = "SUSPENDIDO ";
      break;

    default:
      estadoDefined = "DESCONOCIDO";
      break;
  }
  return estadoDefined;
};

export const getEstadoOperandoClienteColorBadge = (estado: string) => {
  switch (estado) {
    case "ACTIVO":
      return "bg-green-100 text-green-800";
    case "DESINSTALADO":
      return "bg-gray-200 text-gray-600"; // Color neutral para desinstalados
    case "ATRASADO":
      return "bg-orange-100 text-orange-800";
    case "EN INSTALACION":
      return "bg-blue-100 text-blue-800";
    case "MOROSO":
      return "bg-red-100 text-red-800";
    case "PAGO PENDIENTE":
      return "bg-yellow-100 text-yellow-800";
    case "PENDIENTE ACTIVO":
      return "bg-cyan-100 text-cyan-800";
    case "SUSPENDIDO":
      return "bg-amber-100 text-amber-800";
    case "DESCONOCIDO":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getEstadoColorText = (estado: string) => {
  switch (estado) {
    case "ACTIVO":
      return "text-green-700 dark:text-green-400 font-semibold";
    case "DESINSTALADO":
      return "text-gray-600 dark:text-gray-400 font-semibold";
    case "ATRASADO":
      return "text-orange-700 dark:text-orange-400 font-semibold";
    case "EN INSTALACION":
      return "text-blue-700 dark:text-blue-400 font-semibold";
    case "MOROSO":
      return "text-red-700 dark:text-red-400 font-semibold";
    case "PAGO PENDIENTE":
      return "text-yellow-700 dark:text-yellow-400 font-semibold";
    case "PENDIENTE ACTIVO":
      return "text-cyan-700 dark:text-cyan-400 font-semibold";
    case "SUSPENDIDO":
      return "text-amber-700 dark:text-amber-400 font-semibold";
    case "DESCONOCIDO":
      return "text-gray-700 dark:text-gray-400 font-semibold";
    default:
      return "text-gray-700 dark:text-gray-400 font-semibold";
  }
};
