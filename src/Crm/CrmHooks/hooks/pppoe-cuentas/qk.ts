import type { FiltrarPppoeCuentasParams } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.filters";

export const pppoeCuentasQkeys = {
  /**
   * Raíz completa del recurso.
   *
   * Invalidar esta key refresca:
   *
   * - listados;
   * - detalles;
   * - historial asociado a cuentas.
   */
  all: ["pppoe-cuentas"] as const,

  /**
   * Todos los listados.
   */
  lists: () => [...pppoeCuentasQkeys.all, "list"] as const,

  /**
   * Listado concreto con filtros/paginación.
   */
  list: (params: FiltrarPppoeCuentasParams) =>
    [...pppoeCuentasQkeys.lists(), params] as const,

  /**
   * Todos los detalles.
   */
  details: () => [...pppoeCuentasQkeys.all, "detail"] as const,

  /**
   * Detalle de una cuenta concreta.
   */
  detail: (cuentaPppoeId: number) =>
    [...pppoeCuentasQkeys.details(), cuentaPppoeId] as const,

  /**
   * Historial de operaciones perteneciente
   * a una cuenta PPPoE.
   *
   * Todavía no implementamos el hook en esta tanda,
   * pero dejamos preparada la jerarquía.
   */
  operations: (cuentaPppoeId: number) =>
    [...pppoeCuentasQkeys.detail(cuentaPppoeId), "operations"] as const,

  /**
   * Detalle técnico de una operación concreta
   * consultada desde el contexto de una cuenta.
   */
  operationDetail: (cuentaPppoeId: number, operacionId: number) =>
    [
      ...pppoeCuentasQkeys.operations(cuentaPppoeId),
      "detail",
      operacionId,
    ] as const,
};
