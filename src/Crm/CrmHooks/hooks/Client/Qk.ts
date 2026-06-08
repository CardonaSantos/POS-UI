import { CustomersCampaingQuery } from "@/Crm/features/cliente-interfaces/cliente-types";

export const customerQkeys = {
  all: ["customers"],
  specificCustomer: (customerId: number) => ["customer", customerId],

  filter: (filter: CustomersCampaingQuery) => [...customerQkeys.all, filter],
};
