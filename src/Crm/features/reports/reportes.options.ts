import {
  ReporteClienteEstado,
  ReporteClienteEstadoCobranza,
  ReporteFacturacionEstadoFactura,
  ReporteFacturacionMetodoPago,
  ReporteFacturacionOrigenPago,
} from "./reportes.interfaces";
import {
  ReporteTicketAgrupacion,
  ReporteTicketEstado,
  ReporteTicketPrioridad,
} from "./reportes.interfaces";
// CLIENTES

export const REPORTE_CLIENTE_ESTADO_OPTIONS = [
  {
    value: ReporteClienteEstado.ACTIVO,
    label: "Activo",
  },

  {
    value: ReporteClienteEstado.SUSPENDIDO,
    label: "Suspendido",
  },

  {
    value: ReporteClienteEstado.DESINSTALADO,
    label: "Desinstalado",
  },

  {
    value: ReporteClienteEstado.PENDIENTE_ACTIVO,
    label: "Pendiente de activación",
  },

  {
    value: ReporteClienteEstado.EN_INSTALACION,
    label: "En instalación",
  },
];

export const REPORTE_CLIENTE_COBRANZA_OPTIONS = [
  {
    value: ReporteClienteEstadoCobranza.AL_DIA,
    label: "Al día",
  },

  {
    value: ReporteClienteEstadoCobranza.PAGO_PENDIENTE,
    label: "Pago pendiente",
  },

  {
    value: ReporteClienteEstadoCobranza.ATRASADO,
    label: "Atrasado",
  },

  {
    value: ReporteClienteEstadoCobranza.MOROSO,
    label: "Moroso",
  },
];

// OTROS

// =====================================================
// TICKETS
// =====================================================

export const REPORTE_TICKET_AGRUPACION_OPTIONS: Array<{
  value: ReporteTicketAgrupacion;
  label: string;
}> = [
  {
    value: ReporteTicketAgrupacion.AUTO,
    label: "Automática",
  },
  {
    value: ReporteTicketAgrupacion.DIA,
    label: "Día",
  },
  {
    value: ReporteTicketAgrupacion.SEMANA,
    label: "Semana",
  },
  {
    value: ReporteTicketAgrupacion.MES,
    label: "Mes",
  },
];

export const REPORTE_TICKET_ESTADO_OPTIONS: Array<{
  value: ReporteTicketEstado;
  label: string;
}> = [
  {
    value: ReporteTicketEstado.NUEVO,
    label: "Nuevo",
  },
  {
    value: ReporteTicketEstado.ABIERTA,
    label: "Abierta",
  },
  {
    value: ReporteTicketEstado.EN_PROCESO,
    label: "En proceso",
  },
  {
    value: ReporteTicketEstado.PENDIENTE,
    label: "Pendiente",
  },
  {
    value: ReporteTicketEstado.PENDIENTE_CLIENTE,
    label: "Pendiente cliente",
  },
  {
    value: ReporteTicketEstado.PENDIENTE_TECNICO,
    label: "Pendiente técnico",
  },
  {
    value: ReporteTicketEstado.PENDIENTE_REVISION,
    label: "Pendiente revisión",
  },
  {
    value: ReporteTicketEstado.RESUELTA,
    label: "Resuelta",
  },
  {
    value: ReporteTicketEstado.CERRADO,
    label: "Cerrado",
  },
  {
    value: ReporteTicketEstado.CANCELADA,
    label: "Cancelada",
  },
  {
    value: ReporteTicketEstado.ARCHIVADA,
    label: "Archivada",
  },
];

export const REPORTE_TICKET_PRIORIDAD_OPTIONS: Array<{
  value: ReporteTicketPrioridad;
  label: string;
}> = [
  {
    value: ReporteTicketPrioridad.BAJA,
    label: "Baja",
  },
  {
    value: ReporteTicketPrioridad.MEDIA,
    label: "Media",
  },
  {
    value: ReporteTicketPrioridad.ALTA,
    label: "Alta",
  },
  {
    value: ReporteTicketPrioridad.URGENTE,
    label: "Urgente",
  },
];

// =====================================================
// FACTURACIÓN
// =====================================================

export const REPORTE_FACTURACION_ESTADO_OPTIONS: Array<{
  value: ReporteFacturacionEstadoFactura;
  label: string;
}> = [
  {
    value: ReporteFacturacionEstadoFactura.PENDIENTE,
    label: "Pendiente",
  },
  {
    value: ReporteFacturacionEstadoFactura.PAGADA,
    label: "Pagada",
  },
  {
    value: ReporteFacturacionEstadoFactura.VENCIDA,
    label: "Vencida",
  },
  {
    value: ReporteFacturacionEstadoFactura.ANULADA,
    label: "Anulada",
  },
  {
    value: ReporteFacturacionEstadoFactura.PARCIAL,
    label: "Parcial",
  },
];

export const REPORTE_FACTURACION_METODO_PAGO_OPTIONS: Array<{
  value: ReporteFacturacionMetodoPago;
  label: string;
}> = [
  {
    value: ReporteFacturacionMetodoPago.EFECTIVO,
    label: "Efectivo",
  },
  {
    value: ReporteFacturacionMetodoPago.TARJETA,
    label: "Tarjeta",
  },
  {
    value: ReporteFacturacionMetodoPago.DEPOSITO,
    label: "Depósito",
  },
  {
    value: ReporteFacturacionMetodoPago.PAYPAL,
    label: "PayPal",
  },
  {
    value: ReporteFacturacionMetodoPago.PENDIENTE,
    label: "Pendiente",
  },
  {
    value: ReporteFacturacionMetodoPago.OTRO,
    label: "Otro",
  },
];

export const REPORTE_FACTURACION_ORIGEN_PAGO_OPTIONS: Array<{
  value: ReporteFacturacionOrigenPago;
  label: string;
}> = [
  {
    value: ReporteFacturacionOrigenPago.RUTA,
    label: "Ruta",
  },
  {
    value: ReporteFacturacionOrigenPago.OFICINA,
    label: "Oficina",
  },
  {
    value: ReporteFacturacionOrigenPago.TRANSFERENCIA,
    label: "Transferencia",
  },
  {
    value: ReporteFacturacionOrigenPago.EN_LINEA,
    label: "En línea",
  },
];
