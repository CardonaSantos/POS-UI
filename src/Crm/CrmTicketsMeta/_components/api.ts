import axios from "axios";
import {
  CreateMetaTecnicoTicketPayload,
  MetaTecnicoTicket,
  Metrics,
  Tecnicos,
  TicketMoment,
  TicketsActuales,
} from "./types";
import { TicketResueltoDiaPivot } from "./metricas.helpers";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export const getMetasTickets = async (): Promise<MetaTecnicoTicket[]> => {
  const data = await axios.get<MetaTecnicoTicket[]>(
    `${VITE_CRM_API_URL}/metas-tickets`,
  );
  return data.data;
};

export const getTecnicosMeta = async (): Promise<Tecnicos[]> => {
  const data = await axios.get<Tecnicos[]>(
    `${VITE_CRM_API_URL}/user/get-users-to-meta-support`,
  );
  return data.data;
};

export const getTicketEnProceso = async () => {
  const data = await axios.get(
    `${VITE_CRM_API_URL}/metas-tickets/tickets-en-proceso`,
  );
  return data.data;
};

export const createMetaTicket = async (
  data: CreateMetaTecnicoTicketPayload,
): Promise<MetaTecnicoTicket> => {
  const res = await axios.post(`${VITE_CRM_API_URL}/metas-tickets`, data);
  return res.data;
};

export const updateMetaTickets = async (
  id: number,
  data: Partial<CreateMetaTecnicoTicketPayload>,
): Promise<MetaTecnicoTicket> => {
  const res = await axios.patch(
    `${VITE_CRM_API_URL}/metas-tickets/${id}`,
    data,
  );
  return res.data;
};

export const deleteMeta = async (id: number): Promise<void> => {
  await axios.delete(`${VITE_CRM_API_URL}/metas-tickets/${id}`);
};

// OTROS

export interface MetricasRendimientoResponse {
  metrics: Metrics[];
  dataScale: TicketResueltoDiaPivot[];
  ticketsEnProceso: TicketMoment[];
  ticketsActuales: TicketsActuales | null;
  resueltosDelMes: number;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function safeNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMetricasResponse(
  value: unknown,
): MetricasRendimientoResponse {
  if (!value || typeof value !== "object") {
    return {
      metrics: [],
      dataScale: [],
      ticketsEnProceso: [],
      ticketsActuales: null,
      resueltosDelMes: 0,
    };
  }

  const record = value as Record<string, unknown>;

  return {
    metrics: safeArray<Metrics>(record.data),
    dataScale: safeArray<TicketResueltoDiaPivot>(record.dataScale),
    ticketsEnProceso: safeArray<TicketMoment>(record.ticketsEnProceso),
    ticketsActuales:
      record.ticketsActuales && typeof record.ticketsActuales === "object"
        ? (record.ticketsActuales as TicketsActuales)
        : null,
    resueltosDelMes: safeNumber(record.resueltosDelMes),
  };
}

export const getMetricasRendimiento =
  async (): Promise<MetricasRendimientoResponse> => {
    const res = await axios.get<unknown>(
      `${VITE_CRM_API_URL}/metas-tickets/tickets-for-metricas`,
    );

    return normalizeMetricasResponse(res.data);
  };
