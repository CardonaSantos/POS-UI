export enum CategoriaNotificacion {
  SISTEMA = "SISTEMA",
  FACTURACION = "FACTURACION",
  COBRANZA = "COBRANZA",
  SOPORTE = "SOPORTE",
  RUTA_COBRO = "RUTA_COBRO",
  CLIENTE = "CLIENTE",
  BOT = "BOT",
  OTROS = "OTROS",
}

export enum SeveridadNotificacion {
  INFO = "INFO",
  EXITO = "EXITO",
  ALERTA = "ALERTA",
  ERROR = "ERROR",
  CRITICA = "CRITICA",
}

export enum AudienciaNotificacion {
  USUARIOS = "USUARIOS",
  ROL = "ROL",
  EMPRESA = "EMPRESA",
  GLOBAL = "GLOBAL",
}

export interface UiNotificacion {
  id: number;
  notificacionId: number;

  // --- Contenido ---
  titulo: string | null;
  mensaje: string;
  categoria: CategoriaNotificacion;
  subtipo: string | null;
  severidad: SeveridadNotificacion;
  audiencia: AudienciaNotificacion;

  // --- Navegación / Acción ---
  route: string | null;
  url: string | null;
  actionLabel: string | null;

  // --- Contexto de Negocio (Agrupado para limpieza) ---
  referencia: {
    tipo: string | null; // 'TicketSoporte', 'FacturaInternet', etc.
    id: number | null;
  } | null;

  empresaId: number | null;

  // --- Estado Personal (Del usuario logueado) ---
  leido: boolean;
  leidoEn: string | null; // string (ISO Date) es mejor para transferir JSON al front
  eliminado: boolean;
  recibidoEn: string; // string (ISO Date)
  fechaCreacion: string;
  fijadoHasta: string | null; // string (ISO Date)

  // --- Emisor (Opcional) ---
  remitente?: {
    id: number;
    nombre: string | null;
  } | null;
}
