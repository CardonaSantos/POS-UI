import { GetCustomersQueryDto } from "./useGetCustomerTable";

export const customers_in_tableQkeys = {
  all: ["customers-in-table"] as const,
  specific: (id: number) => ["customers-in-table", id] as const,
  /**
   * Recibe el query que cambia y fetchea por cada change
   * @param params QUERY
   * @returns
   */
  list: (params: GetCustomersQueryDto) =>
    [...customers_in_tableQkeys.all, params] as const,
};
