import dayjs from "dayjs";
import "dayjs/locale/es";
// import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import currency from "currency.js";

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
