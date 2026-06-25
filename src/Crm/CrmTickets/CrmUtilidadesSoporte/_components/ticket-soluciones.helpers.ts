import type { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import type {
  CreateSolucionTicketDto,
  UpdateSolucionTicketDto,
} from "./form/zod";

export function createEmptySolucionTicketForm(): CreateSolucionTicketDto {
  return {
    solucion: "",
    descripcion: "",
    isEliminado: false,
  };
}

export function solucionTicketToForm(
  solucion: SolucionTicketItem,
): CreateSolucionTicketDto {
  return {
    solucion: solucion.solucion ?? "",
    descripcion: solucion.descripcion ?? "",
    isEliminado: false,
  };
}

export function buildUpdateSolucionPayload(
  id: number,
  data: CreateSolucionTicketDto,
): UpdateSolucionTicketDto {
  return {
    id,
    solucion: data.solucion,
    descripcion: data.descripcion,
    isEliminado: data.isEliminado ?? false,
  };
}

export function getSolucionTitle(solucion: SolucionTicketItem | null) {
  return solucion?.solucion?.trim() || "registro seleccionado";
}

export function getSolucionTicketCount(solucion: SolucionTicketItem) {
  return Number(solucion.ticketsCount ?? 0);
}

export function getSolucionEstadoTone(solucion: SolucionTicketItem) {
  return solucion.isEliminado ? "danger" : "success";
}

export function getSolucionEstadoLabel(solucion: SolucionTicketItem) {
  return solucion.isEliminado ? "Baja" : "Activo";
}
