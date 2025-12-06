//HELPER PARA DEFINIR EVENTOS
export type WsEventMap = {
  "ticket-soporte:change-status": { ticketId: number; nuevoEstado: string };

  "ruta-cobro:change-status": { rutaId: number };

  "facturacion:change-event": {};
};

export type WsEventName = keyof WsEventMap;
