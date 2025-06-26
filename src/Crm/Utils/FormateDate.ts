import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import currency from "currency.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.locale("es");

export const formateDateWithMinutes = (date: string): string => {
  const dateFormatted = dayjs(date).format("DD/MM/YYYY hh:mm A");

  return dateFormatted;
};

export const formateDate = (date: string): string => {
  const dateFormatted = dayjs(date).format("DD/MM/YYYY");
  return dateFormatted;
};

export const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};
