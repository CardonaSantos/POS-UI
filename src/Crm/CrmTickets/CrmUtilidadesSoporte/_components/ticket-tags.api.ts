import axios from "axios";
import type { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
import { normalizeTagsResponse } from "./ticket-tags.helpers";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface CreateTagTicketPayload {
  nombre: string;
}

export interface UpdateTagTicketPayload {
  nombre: string;
}

export async function getTagsTicket(): Promise<EtiquetaTicket[]> {
  const res = await axios.get<unknown>(`${VITE_CRM_API_URL}/tags-ticket`);

  return normalizeTagsResponse(res.data);
}

export async function createTagTicket(
  payload: CreateTagTicketPayload,
): Promise<EtiquetaTicket> {
  const res = await axios.post<EtiquetaTicket>(
    `${VITE_CRM_API_URL}/tags-ticket`,
    payload,
  );

  return res.data;
}

export async function updateTagTicket(
  id: number,
  payload: UpdateTagTicketPayload,
): Promise<EtiquetaTicket> {
  const res = await axios.patch<EtiquetaTicket>(
    `${VITE_CRM_API_URL}/tags-ticket/${id}`,
    payload,
  );

  return res.data;
}

export async function deleteTagTicket(id: number): Promise<void> {
  await axios.delete(`${VITE_CRM_API_URL}/tags-ticket/delete-ticket/${id}`);
}
