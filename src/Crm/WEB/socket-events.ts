import type { RealTimeLocationRaw } from "../features/real-time-location/real-time-location";

import type {
  TecnicoTrackingRealtimeView,
  TecnicoTrackingStateChangedPayload,
} from "../features/real-time-location/tracking.interfaces";

export type WsEventMap = {
  "ticket-soporte:change-status": {
    ticketId: number;
    nuevoEstado: string;
    tecnico: string;
    titulo: string;
  };

  "ruta-cobro:change-status": {
    rutaId: number;
  };

  "facturacion:change-event": {};

  "nuvia:new-message": {
    wamid: string;
    status: string;
  };

  "notifications:system": {};

  /**
   * Sistema anterior de ubicación.
   * Todavía lo utiliza el dashboard actual.
   */
  "emit:location:real-time": RealTimeLocationRaw;

  /**
   * Nuevo módulo real-time-location / tracking.
   */
  "tracking:location-updated": TecnicoTrackingRealtimeView;

  "tracking:state-changed": TecnicoTrackingStateChangedPayload;
};

export type WsEventName = keyof WsEventMap;
