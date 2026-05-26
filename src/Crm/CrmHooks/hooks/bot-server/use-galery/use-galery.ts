import {
  MediaFilterState,
  QueryMediaSearch,
  WazMediaRecord,
} from "@/Crm/features/bot-server/galery/galery-types-response.types";

import { useBotQuery } from "@/hooks/hookBot/useBotHook";
import { bot_server_endpoints } from "../api/bot-server-endpoints";
import { comprobantesMediaQKeys } from "./qk";

function buildMediaSearchDto(filters: MediaFilterState): QueryMediaSearch {
  const clienteId = filters.clienteId.trim();

  return {
    creadoEn: filters.creadoEn || undefined,
    clienteId: clienteId ? Number(clienteId) : undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    type: filters.type === "ALL" ? undefined : filters.type,
    direction: filters.direction === "ALL" ? undefined : filters.direction,
  };
}

export function useComprobantesMedia(filters: MediaFilterState) {
  const query = buildMediaSearchDto(filters);

  return useBotQuery<WazMediaRecord[]>(
    comprobantesMediaQKeys.search(query),
    bot_server_endpoints.media.galery_filter,
    {
      params: query,
    },
  );
}
