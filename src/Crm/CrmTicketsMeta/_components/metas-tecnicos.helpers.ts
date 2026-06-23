import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import type {
  CreateMetaTecnicoTicketPayload,
  EstadoMetaTicket,
  MetaTecnicoTicket,
  Tecnicos,
} from "./types";
import { EstadoMetaTicketEnum } from "./types";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

dayjs.extend(utc);
dayjs.extend(timezone);

const GT_TIMEZONE = "America/Guatemala";

export type MetasPageTab = "ticketsMeta" | "metricas";

export interface MetaTicketFormState {
  tecnicoId: number | null;
  fechaInicio: string;
  fechaFin: string;
  metaTickets: string;
  titulo: string;
  estado: EstadoMetaTicket;
}

export interface MetasSummary {
  totalMetas: number;
  metasActivas: number;
  ticketsResueltos: number;
  metaTotal: number;
  abiertas: number;
  cerradas: number;
  finalizadas: number;
}

export function createEmptyMetaForm(): MetaTicketFormState {
  return {
    tecnicoId: null,
    fechaInicio: "",
    fechaFin: "",
    metaTickets: "",
    titulo: "",
    estado: EstadoMetaTicketEnum.ABIERTO,
  };
}

export function toGuatemalaDateInput(value?: string | Date | null) {
  if (!value) return "";

  const date = dayjs(value);

  if (!date.isValid()) return "";

  return date.tz(GT_TIMEZONE).format("YYYY-MM-DD");
}

export function dateInputToGuatemalaIsoStart(value: string) {
  return dayjs.tz(value, GT_TIMEZONE).startOf("day").toISOString();
}

export function dateInputToGuatemalaIsoEnd(value: string) {
  return dayjs.tz(value, GT_TIMEZONE).endOf("day").toISOString();
}

export function metaToForm(meta: MetaTecnicoTicket): MetaTicketFormState {
  return {
    tecnicoId: meta.tecnico.id,
    fechaInicio: toGuatemalaDateInput(meta.fechaInicio),
    fechaFin: toGuatemalaDateInput(meta.fechaFin),
    metaTickets: String(meta.metaTickets),
    titulo: meta.titulo ?? "",
    estado: meta.estado,
  };
}

export function validateMetaForm(formData: MetaTicketFormState) {
  if (!formData.tecnicoId) {
    return "Seleccione un técnico.";
  }

  if (!formData.fechaInicio) {
    return "Seleccione la fecha de inicio.";
  }

  if (!formData.fechaFin) {
    return "Seleccione la fecha de fin.";
  }

  const metaTickets = Number(formData.metaTickets);

  if (!Number.isFinite(metaTickets) || metaTickets <= 0) {
    return "Ingrese una meta de tickets válida.";
  }

  return null;
}

export function buildCreateMetaPayload(
  formData: MetaTicketFormState,
): CreateMetaTecnicoTicketPayload {
  return {
    tecnicoId: Number(formData.tecnicoId),
    fechaInicio: dateInputToGuatemalaIsoStart(formData.fechaInicio),
    fechaFin: dateInputToGuatemalaIsoEnd(formData.fechaFin),
    metaTickets: Number(formData.metaTickets),
    titulo: formData.titulo.trim() || undefined,
    estado: formData.estado || EstadoMetaTicketEnum.ABIERTO,
  };
}

export function buildUpdateMetaPayload(
  formData: MetaTicketFormState,
): Partial<CreateMetaTecnicoTicketPayload> {
  return {
    tecnicoId: Number(formData.tecnicoId),
    fechaInicio: dateInputToGuatemalaIsoStart(formData.fechaInicio),
    fechaFin: dateInputToGuatemalaIsoEnd(formData.fechaFin),
    metaTickets: Number(formData.metaTickets),
    titulo: formData.titulo.trim() || undefined,
    estado: formData.estado || EstadoMetaTicketEnum.ABIERTO,
  };
}

export function getMetasSummary(metas: MetaTecnicoTicket[]): MetasSummary {
  return metas.reduce<MetasSummary>(
    (acc, meta) => {
      acc.totalMetas += 1;
      acc.metaTotal += meta.metaTickets;
      acc.ticketsResueltos += meta.ticketsResueltos;

      if (meta.estado === "ABIERTO") {
        acc.abiertas += 1;
        acc.metasActivas += 1;
      }

      if (meta.estado === "CERRADO") {
        acc.cerradas += 1;
      }

      if (meta.estado === "FINALIZADO") {
        acc.finalizadas += 1;
      }

      return acc;
    },
    {
      totalMetas: 0,
      metasActivas: 0,
      ticketsResueltos: 0,
      metaTotal: 0,
      abiertas: 0,
      cerradas: 0,
      finalizadas: 0,
    },
  );
}

export function mapTecnicosToOptions(
  tecnicos: Tecnicos[],
): Array<AppSelectOption<number>> {
  return tecnicos.map((tecnico) => ({
    value: tecnico.id,
    label: tecnico.nombre,
  }));
}

export function canManageMetas(role?: string | null) {
  return ["ADMIN", "SUPER_ADMIN", "OFICINA"].includes(String(role ?? ""));
}

export function getEstadoMetaTone(estado: EstadoMetaTicket) {
  if (estado === "ABIERTO") return "info";
  if (estado === "FINALIZADO") return "success";
  if (estado === "CERRADO") return "neutral";
  if (estado === "CANCELADO") return "danger";

  return "neutral";
}

export function calcularPorcentajeCumplido(resueltos: number, meta: number) {
  return meta > 0 ? Math.round((resueltos / meta) * 100) : 0;
}

export function calcularTicketsFaltantes(resueltos: number, meta: number) {
  return Math.max(0, meta - resueltos);
}

export function calcularDiasTranscurridos(fechaInicio: string) {
  const inicio = new Date(fechaInicio);
  const hoy = new Date();

  if (Number.isNaN(inicio.getTime())) return 0;

  const diffTime = Math.abs(hoy.getTime() - inicio.getTime());

  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function calcularDiasTotales(fechaInicio: string, fechaFin: string) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return 0;

  const diffTime = Math.abs(fin.getTime() - inicio.getTime());

  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function calcularPromedioTicketsPorDia(
  resueltos: number,
  diasTranscurridos: number,
) {
  return diasTranscurridos > 0
    ? (resueltos / diasTranscurridos).toFixed(1)
    : "0.0";
}

export function calcularProyeccionCumplimiento(
  resueltos: number,
  diasTranscurridos: number,
  diasTotales: number,
) {
  if (diasTranscurridos === 0) return 0;

  const promedioDiario = resueltos / diasTranscurridos;

  return Math.round(promedioDiario * diasTotales);
}
