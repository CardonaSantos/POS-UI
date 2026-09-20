import type {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

/**
 * Datos enviados tanto para verificar como para
 * confirmar una adopción.
 *
 * La contraseña corresponde al secret YA EXISTENTE
 * en MikroTik.
 *
 * No representa la contraseña del usuario del CRM.
 */
export type PppoeAdopcionPayload = {
  clienteId: number;

  perfilHomologacionId: number;

  usuarioPppoe: string;

  passwordPppoe: string;
};

/**
 * Valores internos del formulario.
 *
 * Los IDs comienzan en null porque todavía no existe
 * una selección válida.
 */
export type PppoeAdopcionFormValues = {
  clienteId: number | null;

  perfilHomologacionId: number | null;

  usuarioPppoe: string;

  /**
   * Nunca hacer trim() automáticamente.
   *
   * Debemos enviar exactamente la contraseña existente
   * en MikroTik.
   */
  passwordPppoe: string;
};

export const PPPOE_ADOPCION_FORM_DEFAULTS: PppoeAdopcionFormValues = {
  clienteId: null,

  perfilHomologacionId: null,

  usuarioPppoe: "",

  passwordPppoe: "",
};

/**
 * Estado observado directamente en el secret remoto.
 *
 * ACTIVA:
 *   disabled=no
 *
 * SUSPENDIDA:
 *   disabled=yes
 */
export type EstadoRemotoAdopcionPppoe =
  | EstadoCuentaPppoe.ACTIVA
  | EstadoCuentaPppoe.SUSPENDIDA;

/**
 * Respuesta de:
 *
 * POST /pppoe-cuentas/adopcion/verificar
 *
 * Esta operación es únicamente de lectura.
 *
 * NO:
 * - crea acceso;
 * - crea cuenta;
 * - cifra credenciales;
 * - modifica MikroTik.
 */
export type VerificarAdopcionPppoeResponse = {
  empresaId: number;

  clienteId: number;

  perfilHomologacionId: number;

  mikrotikRouterId: number;

  servicioInternetId: number;

  usuarioPppoe: string;

  encontrado: boolean;

  passwordCoincide: boolean | null;

  perfilEsperado: string;

  perfilEncontrado: string | null;

  perfilCoincide: boolean | null;

  servicioEncontrado: string | null;

  servicioCompatible: boolean | null;

  deshabilitado: boolean | null;

  estadoRemoto: EstadoRemotoAdopcionPppoe | null;

  /**
   * Solo informativo.
   *
   * Una contraseña histórica puede ser válida aunque
   * no utilice el formato actual de NOVA.
   */
  cumpleFormatoNova: boolean | null;

  puedeAdoptar: boolean;

  advertencias: string[];
};

/**
 * Respuesta de:
 *
 * POST /pppoe-cuentas/adopcion
 *
 * La contraseña nunca debe regresar desde el backend.
 */
export type AdoptarCuentaPppoeResponse = {
  empresaId: number;

  clienteId: number;

  accesoInternetId: number;

  cuentaPppoeId: number;

  perfilHomologacionId: number;

  mikrotikRouterId: number;

  servicioInternetId: number;

  usuarioPppoe: string;

  estadoCuenta: EstadoCuentaPppoe;

  estadoAcceso: EstadoAccesoInternet;

  adoptadoPorId: number;

  adoptadoEn: string;

  auditoriaId: number;

  cumpleFormatoNova: boolean;

  advertencias: string[];
};
