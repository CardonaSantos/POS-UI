import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { customers_in_tableQkeys } from "./Qk";
import { ClienteTableDto } from "@/Crm/CrmCustomers/CustomerTable";

export interface GetCustomersQueryDto {
  page?: number;
  limite?: number;
  paramSearch?: string;
  zonasFacturacionSelected?: number;
  muniSelected?: number;
  depaSelected?: number;
  sectorSelected?: number;
  estadoSelected?: string;
}

interface Summary {
  activo: number;
  moroso: number;
  pendiente_activo: number;
  atrasado: number;
}

interface TableResponse {
  data: Array<ClienteTableDto>;
  summary: Summary;
  totalCount: number;
}

export const initialResponseTableCustomer: TableResponse = {
  data: [],
  summary: {
    activo: 0,
    atrasado: 0,
    moroso: 0,
    pendiente_activo: 0,
  },
  totalCount: 0,
};

export function useGetCustomersInTable(query: GetCustomersQueryDto) {
  return useCrmQuery<TableResponse, void>(
    customers_in_tableQkeys.list(query),
    "internet-customer/customer-to-table",
    {
      params: query,
    },
  );
}
