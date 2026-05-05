import currency from "currency.js";
import { EstadoTicketSoporte } from "../features/dashboard/dashboard-tickets";

export interface FormattedTicket {
  id: number;
  title: string;
  openedAt: string;
  status: EstadoTicketSoporte;
  priority: "BAJA" | "MEDIA" | "ALTA";
  description: string;
  direction: string;
  clientName: string;
  clientPhone: string | null;
  referenceContact: string | null;
  clientId: number;

  location: {
    lat: number;
    lng: number;
  };
}

export const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};
