import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { customerQkeys } from "./Qk";
import { CustomerDataResponse } from "@/Crm/features/customer-response-data/customer-response-data.interface";

export function useGetCustomer(customerId: number) {
  return useCrmQuery<CustomerDataResponse>(
    customerQkeys.specificCustomer(customerId),
    `internet-customer/get-customer-to-edit/${customerId}`,
    undefined,
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}
