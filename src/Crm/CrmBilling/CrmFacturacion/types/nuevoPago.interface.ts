import { MetodoPagoFacturaInternet } from "@/Crm/features/factura-internet/factura-to-pay";

export interface NuevoPagoFormValues {
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  numeroBoleta: string;
  fechaPago: Date;
}
