import { AutorizacionesPendientesQueryParams } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";

type ToAutorizacionesPendientesQueryParamsInput = {
  pageIndex: number;

  pageSize: number;
};

export function toAutorizacionesPendientesQueryParams({
  pageIndex,
  pageSize,
}: ToAutorizacionesPendientesQueryParamsInput): AutorizacionesPendientesQueryParams {
  return {
    page: pageIndex + 1,

    limit: pageSize,
  };
}
