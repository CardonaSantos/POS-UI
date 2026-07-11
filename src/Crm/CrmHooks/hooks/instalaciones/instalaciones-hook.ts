import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { instalacionesQkeys } from "./qk";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { ClienteInstalacionListResponse } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { CrearClienteInstalacionPayload } from "@/Crm/features/instalaciones/crear-instalacion.payload";

export function useGetInstalacionesPaginated(query: any) {
  return crm.useQueryApi<ClienteInstalacionListResponse>(
    instalacionesQkeys.all,
    crm_endpoints.instalaciones.get_instalaciones_paginated,
    {
      params: query,
    },
    undefined,
  );
}

export function useCreateInstalacion() {
  const invalidate = useInvalidateQk();
  return crm.useMutationApi<CrearClienteInstalacionPayload>(
    "post",
    crm_endpoints.instalaciones.post_instalacion,
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}
