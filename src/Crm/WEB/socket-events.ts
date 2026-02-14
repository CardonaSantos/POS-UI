import { RealTimeLocationRaw } from "../features/real-time-location/real-time-location";

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

  "notifications:system": {};
  "emit:location:real-time": RealTimeLocationRaw;
};

export type WsEventName = keyof WsEventMap;
