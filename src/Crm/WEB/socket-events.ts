//HELPER PARA DEFINIR EVENTOS
export type WsEventMap = {
  "ticket-soporte:change-status": {
    ticketId: number;
    nuevoEstado: string;
    tecnico: string;
    titulo: string;
  };

  "ruta-cobro:change-status": { rutaId: number };

  "facturacion:change-event": {};

  "nuvia:new-message": {
    wamid: string;
    status: string;
  };
};

export type WsEventName = keyof WsEventMap;
