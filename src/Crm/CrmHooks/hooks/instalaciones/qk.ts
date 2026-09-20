import { FiltrarClienteInstalacionesParams } from "@/Crm/features/instalaciones/filter";
import { FiltrarMisInstalacionesAsignadasParams } from "@/Crm/features/instalaciones_tecnico/filters";

export const instalacionesQkeys = {
  all: ["instalaciones"] as const,

  lists: () => [...instalacionesQkeys.all, "list"] as const,

  list: (query: FiltrarClienteInstalacionesParams) =>
    [...instalacionesQkeys.lists(), query] as const,

  details: () => [...instalacionesQkeys.all, "detail"] as const,

  specific: (id: number) => [...instalacionesQkeys.details(), id] as const,

  // DETALLE TÉCNICO OPERATIVO
  technicalDetails: () =>
    [...instalacionesQkeys.all, "technical-detail"] as const,

  technicalDetail: (instalacionId: number) =>
    [...instalacionesQkeys.technicalDetails(), instalacionId] as const,

  // INSTALACIONES ASIGNADAS AL TÉCNICO
  assignedLists: () => [...instalacionesQkeys.all, "assigned-list"] as const,

  assignedList: (query: FiltrarMisInstalacionesAsignadasParams) =>
    [...instalacionesQkeys.assignedLists(), query] as const,
};
