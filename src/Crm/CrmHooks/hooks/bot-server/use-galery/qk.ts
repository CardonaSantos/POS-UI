import { QueryMediaSearch } from "@/Crm/features/bot-server/galery/galery-types-response.types";

export const comprobantesMediaQKeys = {
  all: ["comprobantes-media"] as const,
  search: (filters: Partial<QueryMediaSearch>) =>
    [...comprobantesMediaQKeys.all, "search", filters] as const,
};
