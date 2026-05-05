// import type { SingleValue, MultiValue } from "react-select";

// // ─── Re-exported from ticketTypes (keep single source of truth) ────────────
// export type { Ticket, Comment, MetricsTicket, User, Customer, Companion } from "@/types/ticketTypes";
// export type { EstadoTicketSoporte, PrioridadTicketSoporte } from "@/types/ticketTypes";

// // ─── React-Select generic option ──────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

// export type SingleSelectChange = SingleValue<SelectOption>;
// export type MultiSelectChange = MultiValue<SelectOption>;

// // ─── DTO types (mirror what the API expects) ──────────────────────────────
// export interface ComentarioSeguimientoDto {
//   ticketId: number | null;
//   usuarioId: number | null;
//   descripcion: string;
// }

// export interface UpdateTicketDto {
//   title: string;
//   description: string | null;
//   priority: string;
//   status: string;
//   fixed: boolean;
//   clienteId: number | null;
//   tecnicoId: number | null;
//   tecnicosAdicionales: number[];
//   tags: number[];
// }

// // ─── Solucion item (passed in as prop from parent) ────────────────────────
// export interface SolucionTicketItem {
//   id: number;
//   solucion: string;
//   descripcion: string;
//   isEliminado: boolean;
//   ticketsCount: number;
// }

// // ─── Badge helper shape ───────────────────────────────────────────────────
export interface BadgeProps {
  text: string;
  bgColor: string;
  textColor: string;
}

// // ─── Priority badge helper ────────────────────────────────────────────────
export function getPriorityBadge(priority: string): BadgeProps {
  switch (priority) {
    case "BAJA":
      return {
        text: "Baja",
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
      };
    case "MEDIA":
      return {
        text: "Media",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      };
    case "ALTA":
      return {
        text: "Alta",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
      };
    case "URGENTE":
      return {
        text: "Urgente",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      };
    default:
      return { text: "—", bgColor: "bg-gray-100", textColor: "text-gray-400" };
  }
}
