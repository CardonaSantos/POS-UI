import axios from "axios";
import { CreateMetaTecnicoTicketPayload, MetaTecnicoTicket } from "./types";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export const getMetasTickets = async (): Promise<MetaTecnicoTicket[]> => {
  let data = await axios.get<MetaTecnicoTicket[]>(
    `${VITE_CRM_API_URL}/metas-tickets`
  );
  return data.data;
};

export const createMetaTicket = async (
  data: CreateMetaTecnicoTicketPayload
) => {
  return axios.post(`${VITE_CRM_API_URL}/metas-tickets`, data);
};
