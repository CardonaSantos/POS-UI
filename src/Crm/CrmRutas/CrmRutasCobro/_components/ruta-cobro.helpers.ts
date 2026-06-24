import type { RutaCobroInterface } from "../RutaCobroInterface";

export enum MetodoPagoFacturaInternet {
  EFECTIVO = "EFECTIVO",
  DEPOSITO = "DEPOSITO",
  TARJETA = "TARJETA",
  OTRO = "OTRO",
  PENDIENTE = "PENDIENTE",
  PAYPAL = "PAYPAL",
}

export type RutaCliente = RutaCobroInterface["clientes"][number];
export type RutaFactura = RutaCliente["facturas"][number];

export type PagoRutaFormState = {
  facturaInternetId: number | null;
  clienteId: number | null;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  cobradorId: number;
  numeroBoleta: string;
  rutaId: string | undefined;
};

export type ClienteRutaMapItem = {
  id: number;
  nombreCompleto: string;
  telefono: string;
  contactoReferencia: {
    nombre: string;
    telefono: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  direccion: string;
  facturas: Array<{
    id: number;
    montoPago: number;
    estadoFactura: string;
    saldoPendiente: number;
    creadoEn: string;
    detalleFactura: string;
  }>;
  imagenes: string[];
};

export const METODO_PAGO_OPTIONS = [
  { value: MetodoPagoFacturaInternet.EFECTIVO, label: "Efectivo" },
  { value: MetodoPagoFacturaInternet.DEPOSITO, label: "Depósito" },
  { value: MetodoPagoFacturaInternet.TARJETA, label: "Tarjeta" },
  { value: MetodoPagoFacturaInternet.PAYPAL, label: "PayPal" },
  { value: MetodoPagoFacturaInternet.OTRO, label: "Otro" },
];

export function createEmptyPagoRutaForm(
  userId: number,
  rutaId: string | undefined,
): PagoRutaFormState {
  return {
    facturaInternetId: null,
    clienteId: null,
    montoPagado: 0,
    metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
    cobradorId: userId,
    numeroBoleta: "",
    rutaId,
  };
}

export function buildPagoRutaPayload(form: PagoRutaFormState) {
  return {
    facturaInternetId: Number(form.facturaInternetId),
    clienteId: Number(form.clienteId),
    montoPagado: Number(form.montoPagado),
    metodoPago: form.metodoPago,
    cobradorId: Number(form.cobradorId),
    numeroBoleta: form.numeroBoleta?.trim() ?? "",
    rutaId: Number(form.rutaId),
  };
}

export function validatePagoRutaForm(form: PagoRutaFormState) {
  if (!form.facturaInternetId) return "Seleccione una factura.";
  if (!form.clienteId) return "Seleccione un cliente.";
  if (!form.cobradorId) return "Debe seleccionar un cobrador.";
  if (!form.montoPagado || form.montoPagado <= 0) {
    return "El monto pagado debe ser mayor a cero.";
  }

  if (
    form.metodoPago === MetodoPagoFacturaInternet.DEPOSITO &&
    !form.numeroBoleta.trim()
  ) {
    return "Ingrese el número de boleta.";
  }

  return null;
}

export function getFacturasPorCobrar(ruta?: RutaCobroInterface | null) {
  if (!ruta?.clientes?.length) return 0;

  return ruta.clientes.reduce(
    (acc, cliente) => acc + (cliente.facturas?.length ?? 0),
    0,
  );
}

function isValidCoordinate(lat?: number | null, lng?: number | null) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

export function mapClientesForMap(
  clientes: RutaCobroInterface["clientes"] = [],
): ClienteRutaMapItem[] {
  return clientes
    .map((cliente) => {
      const lat = cliente.ubicacion?.latitud;
      const lng = cliente.ubicacion?.longitud;

      if (!isValidCoordinate(lat, lng)) return null;

      return {
        id: cliente.id,
        nombreCompleto: cliente.nombreCompleto,
        telefono: cliente.telefono,
        contactoReferencia: {
          nombre: cliente.contactoReferencia?.nombre ?? "",
          telefono: cliente.contactoReferencia?.telefono ?? "",
        },
        location: {
          lat,
          lng,
        },
        direccion: cliente.direccion,
        facturas: cliente.facturas.map((factura) => ({
          id: factura.id,
          montoPago: factura.montoPago,
          estadoFactura: factura.estadoFactura,
          saldoPendiente: factura.saldoPendiente,
          creadoEn: factura.creadoEn,
          detalleFactura: factura.detalleFactura,
        })),
        imagenes: cliente.imagenes ?? [],
      };
    })
    .filter(Boolean) as ClienteRutaMapItem[];
}

export function isFacturaPagada(estado?: string) {
  return estado === "PAGADA";
}

export function getClienteDebeTone(totalDebe: number) {
  return totalDebe > 0 ? "danger" : "success";
}
