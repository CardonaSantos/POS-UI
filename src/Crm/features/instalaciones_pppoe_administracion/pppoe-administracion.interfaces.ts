import type {
  EstadoCuentaPppoe,
  EstadoOperacionPppoe,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export type ActivarPppoeInstalacionPayload = {
  contrasenaActual: string;
};

export type AccionManualCuentaPppoePayload = {
  claveIdempotencia: string;
  motivo: string;

  /*
   * Se prepara en UI ahora.
   * El backend debe aceptar este campo antes de probar
   * suspensión y reactivación.
   */
  contrasenaActual: string;
};

export type AutorizarPppoeOperacionPayload = {
  empresaId: number;
  password: string;
};

export type EjecutarOperacionPppoeResponse = {
  operacionId: number;
  cuentaPppoeId: number;
  tipo: TipoOperacionPppoe;
  estadoOperacion: EstadoOperacionPppoe;
  estadoCuenta: EstadoCuentaPppoe | null;
  numeroIntento: number;
  reintentable: boolean;
  resultado: Record<string, unknown> | null;
  errorCodigo: string | null;
  errorMensaje: string | null;
};

export type ActivarPppoeInstalacionResponse = Record<string, unknown>;

export type PppoeAdminActionRequest =
  | {
      action: "reintentarPrealta";
      instalacionId: number;
      accesoInternetId: number;
      servicioInternetId: number | null;
    }
  | {
      /*
       * No necesita cuentaPppoeId porque el endpoint
       * resuelve la cuenta a partir de instalacionId.
       */
      action: "activarInicial";
      instalacionId: number;
    }
  | {
      action: "revelarCredenciales";
      instalacionId: number;
    }
  | {
      action: "suspender";
      instalacionId: number;
      cuentaPppoeId: number;
    }
  | {
      action: "reactivar";
      instalacionId: number;
      cuentaPppoeId: number;
    }
  | {
      action: "autorizarOperacion";
      instalacionId: number;
      operacionId: number;
      empresaId: number;
    };
