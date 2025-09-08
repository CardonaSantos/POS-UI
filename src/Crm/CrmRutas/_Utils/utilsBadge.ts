import { EstadoRuta } from "../rutas-types";

export const getEstadoBadgeColorRutaList = (estado: EstadoRuta) => {
  switch (estado) {
    case EstadoRuta.ACTIVO:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case EstadoRuta.PENDIENTE:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case EstadoRuta.COMPLETADO:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case EstadoRuta.INACTIVO:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";

    case EstadoRuta.CERRADO:
      return "bg-red-500 text-white dark:bg-red-600 dark:text-white";
    default:
      return "";
  }
};
