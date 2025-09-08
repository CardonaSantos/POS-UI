const zona = "America/Guatemala";
import "dayjs/locale/es";
import "dayjs/locale/es"; // Importar la localización en español
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";

import "dayjs/locale/es"; // importa el paquete de idioma

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("es");

export const formattShortFecha = (value: string | Date): string => {
  return dayjs(value).tz(zona).format("DD/MM/YYYY");
};

export const formattFechaWithMinutes = (value: string | Date): string => {
  return dayjs(value).tz(zona).format("DD/MM/YYYY hh:mm a");
};
