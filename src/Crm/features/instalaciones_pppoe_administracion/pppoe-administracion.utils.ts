import type {
  EstadoCuentaPppoe,
  InstalacionPppoeOperacionTimelineItem,
  PppoeAuditoriaAccesoAdministrableResumen,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export type PppoeMainAction =
  | "ACTIVAR_INICIAL"
  | "SUSPENDER"
  | "REACTIVAR"
  | "NINGUNA";

export type ResolvePppoeMainActionInput = {
  estadoCuenta: EstadoCuentaPppoe;

  /*
   * Se utilizan varias señales porque los registros
   * históricos pueden no tener todas las fechas completas.
   */
  cuentaActivadaEn: string | null;
  accesoActivadoEn: string | null;
  instalacionActivadaEn: string | null;
};

export function resolvePppoeMainAction({
  estadoCuenta,
  cuentaActivadaEn,
  accesoActivadoEn,
  instalacionActivadaEn,
}: ResolvePppoeMainActionInput): PppoeMainAction {
  const activacionInicialCompletada = Boolean(
    cuentaActivadaEn || accesoActivadoEn || instalacionActivadaEn,
  );

  /*
   * Antes de la primera activación:
   * se utiliza exclusivamente el endpoint de instalación.
   */
  if (!activacionInicialCompletada) {
    if (
      estadoCuenta === "PENDIENTE_CREACION" ||
      estadoCuenta === "EN_INSTALACION" ||
      estadoCuenta === "PENDIENTE_ACTIVACION"
    ) {
      return "ACTIVAR_INICIAL";
    }

    return "NINGUNA";
  }

  /*
   * Después de la primera activación:
   * solamente se administra el ciclo de vida de la cuenta.
   */
  if (estadoCuenta === "ACTIVA") {
    return "SUSPENDER";
  }

  if (estadoCuenta === "SUSPENDIDA") {
    return "REACTIVAR";
  }

  /*
   * ERROR, EN_ACTIVACION, EN_SUSPENSION,
   * EN_DESINSTALACION, ELIMINADA y CANCELADA.
   *
   * En ERROR se resolverá desde el reintento de
   * la operación correspondiente en auditoría.
   */
  return "NINGUNA";
}

export function createPppoeManualIdempotencyKey(
  action: "suspender" | "reactivar",
  cuentaPppoeId: number,
) {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return ["pppoe-manual", action, cuentaPppoeId, uuid].join(":");
}

export function findAuthorizablePendingOperation(
  items: Array<
    InstalacionPppoeOperacionTimelineItem | { tipoRegistro: "AUDITORIA" }
  >,
) {
  return items.find(
    (item): item is InstalacionPppoeOperacionTimelineItem =>
      item.tipoRegistro === "OPERACION" &&
      item.operacion.estado === "PENDIENTE" &&
      item.operacion.requiereReautenticacion,
  );
}

export function getPrimaryPppoeAccess(
  accesses: PppoeAuditoriaAccesoAdministrableResumen[],
) {
  return accesses.find((access) => access.cuentaPppoe) ?? accesses[0] ?? null;
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
