import { CreditoFormValues } from "@/Crm/CrmCredito/form/schema.zod";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { creditoQkeys } from "./Qk";
import { GetCreditosQueryDto } from "@/Crm/CrmHooks/hooks/use-credito/query";
import {
  CreditoResponse,
  GetCreditosResponse,
} from "@/Crm/features/credito/credito-interfaces";

export function useCreateCredito() {
  const query = useQueryClient();
  return useCrmMutation<void, CreditoFormValues>("post", `credito`, undefined, {
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: creditoQkeys.all,
      });
    },
  });
}

/**
 * GET DE TODOS LOS CREDITOS CON PAGINACION
 * @param params
 * @returns
 */
export function useGetCreditos(params?: GetCreditosQueryDto) {
  return useCrmQuery<GetCreditosResponse, GetCreditosQueryDto>(
    creditoQkeys.all,
    "credito/find-many",
    {
      params,
    },
    {
      enabled: !!params,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
}
