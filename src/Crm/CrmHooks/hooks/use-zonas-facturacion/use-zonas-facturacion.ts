import { crm } from "@/Crm/API/crmApi";
import { zonasFQkeys } from "./Qk";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import {
  FacturacionZona,
  NuevaFacturacionZona,
} from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

/**
 * GET ZONA FACTURACION
 * @returns
 */
export function useGetZonasFacturacion() {
  return crm.useQueryApi<Array<FacturacionZona>>(
    zonasFQkeys.all,
    crm_endpoints.zonas_facturacion.get_all,
  );
}

/**
 * CREAR ZONA DE FACTURACION
 * @returns
 */
export function usePostZona() {
  return crm.useMutationApi<void, NuevaFacturacionZona>(
    "post",
    crm_endpoints.zonas_facturacion.post_zona_f,
  );
}

/**
 * ACTUALIZAR ZONA DE FACTURACION
 * @returns
 */
export function usePatchZona() {
  return crm.useMutationApi<void, FacturacionZona>(
    "patch",
    crm_endpoints.zonas_facturacion.patch_zona,
  );
}

/**
 * ELIMINAR ZONA DE FACTURACION
 * @returns
 */
export function useDeleteZona(id: number) {
  return crm.useMutationApi<void, FacturacionZona>(
    "delete",
    crm_endpoints.zonas_facturacion.delete_zona(id),
  );
}
