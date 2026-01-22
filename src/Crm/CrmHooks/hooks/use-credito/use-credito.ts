import { CreditoFormValues } from "@/Crm/CrmCredito/form/schema.zod";
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { creditoQkeys } from "./Qk";

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
