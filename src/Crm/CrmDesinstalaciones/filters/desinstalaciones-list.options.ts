import {
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

export const DESINSTALACION_ESTADO_OPTIONS = [
  {
    value: EstadoDesinstalacionCliente.PROGRAMADA,
    label: "Programada",
  },

  {
    value: EstadoDesinstalacionCliente.EN_PROCESO,
    label: "En proceso",
  },

  {
    value: EstadoDesinstalacionCliente.COMPLETADA,
    label: "Completada",
  },

  {
    value: EstadoDesinstalacionCliente.CANCELADA,
    label: "Cancelada",
  },

  {
    value: EstadoDesinstalacionCliente.FALLIDA,
    label: "Fallida",
  },
];

export const DESINSTALACION_TIPO_OPTIONS = [
  {
    value: TipoDesinstalacionCliente.COMPLETA,
    label: "Completa",
  },

  {
    value: TipoDesinstalacionCliente.PARCIAL,
    label: "Parcial",
  },

  {
    value: TipoDesinstalacionCliente.RETIRO_EQUIPO,
    label: "Retiro de equipo",
  },

  {
    value: TipoDesinstalacionCliente.CAMBIO_DOMICILIO,
    label: "Cambio de domicilio",
  },

  {
    value: TipoDesinstalacionCliente.CANCELACION_SERVICIO,
    label: "Cancelación de servicio",
  },

  {
    value: TipoDesinstalacionCliente.OTRO,
    label: "Otro",
  },
];

export const DESINSTALACION_MOTIVO_OPTIONS = [
  {
    value: MotivoDesinstalacionCliente.VOLUNTARIA,
    label: "Voluntaria",
  },

  {
    value: MotivoDesinstalacionCliente.MORA,
    label: "Mora",
  },

  {
    value: MotivoDesinstalacionCliente.CAMBIO_DOMICILIO,
    label: "Cambio de domicilio",
  },

  {
    value: MotivoDesinstalacionCliente.MAL_SERVICIO,
    label: "Mal servicio",
  },

  {
    value: MotivoDesinstalacionCliente.FRAUDE,
    label: "Fraude",
  },

  {
    value: MotivoDesinstalacionCliente.FALLA_TECNICA,
    label: "Falla técnica",
  },

  {
    value: MotivoDesinstalacionCliente.CAMBIO_PROVEEDOR,
    label: "Cambio de proveedor",
  },

  {
    value: MotivoDesinstalacionCliente.CLIENTE_NO_LOCALIZADO,
    label: "Cliente no localizado",
  },

  {
    value: MotivoDesinstalacionCliente.OTRO,
    label: "Otro",
  },
];
