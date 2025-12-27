import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { customerQkeys } from "./Qk";
import { CustomerDataResponse } from "@/Crm/features/customer-response-data/customer-response-data.interface";

interface Cliente {
  id: number;
  nombre: string;
}


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


export function useGetCustomerToSelect() {
  return useCrmQuery<Array<Cliente>>(
    customerQkeys.all,
    `internet-customer/get-customers-to-ticket`,
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
