import type { EstadoCuentaPppoe } from "@/Crm/features/instalaciones/enums";

/**
 * Valores que manejará el formulario.
 *
 * La UI selecciona una homologación completa,
 * no servicio/router de forma independiente.
 */
export type PppoePrealtaFormValues = {
  clienteId: number | null;

  perfilHomologacionId: number | null;
};

/**
 * Body real aceptado por:
 *
 * POST /pppoe-cuentas/prealta
 *
 * empresaId y operador se obtienen del JWT.
 */
export type CrearPrealtaPppoeCuentaPayload = {
  clienteId: number;

  servicioInternetId: number;

  mikrotikRouterId: number;
};

/**
 * Respuesta real del backend.
 */
export type CrearPrealtaPppoeCuentaResponse = {
  cuentaPppoeId: number;

  empresaId: number;

  accesoInternetId: number;

  perfilHomologacionId: number;

  usuario: string;

  estado: EstadoCuentaPppoe;

  generadoEn: string;

  /**
   * true:
   * se creó una nueva cuenta.
   *
   * false:
   * el backend reutilizó una prealta válida existente.
   */
  creada: boolean;
};

export const PPPOE_PREALTA_FORM_DEFAULTS: PppoePrealtaFormValues = {
  clienteId: null,

  perfilHomologacionId: null,
};
