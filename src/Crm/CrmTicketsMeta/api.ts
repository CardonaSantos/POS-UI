import axios from "axios";
import {
  CreateMetaTecnicoTicketPayload,
  MetaTecnicoTicket,
  Tecnicos,
} from "./types";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export const getMetasTickets = async (): Promise<MetaTecnicoTicket[]> => {
  const data = await axios.get<MetaTecnicoTicket[]>(
    `${VITE_CRM_API_URL}/metas-tickets`
  );
  return data.data;
};

export const getTecnicosMeta = async (): Promise<Tecnicos[]> => {
  const data = await axios.get<Tecnicos[]>(
    `${VITE_CRM_API_URL}/user/get-users-to-meta-support`
  );
  return data.data;
};

export const getTicketEnProceso = async () => {
  const data = await axios.get(
    `${VITE_CRM_API_URL}/metas-tickets/tickets-en-proceso`
  );
  return data.data;
};

export const createMetaTicket = async (
  data: CreateMetaTecnicoTicketPayload
): Promise<MetaTecnicoTicket> => {
  const res = await axios.post(`${VITE_CRM_API_URL}/metas-tickets`, data);
  return res.data;
};

export const updateMetaTickets = async (
  id: number,
  data: Partial<CreateMetaTecnicoTicketPayload>
): Promise<MetaTecnicoTicket> => {
  const res = await axios.patch(
    `${VITE_CRM_API_URL}/metas-tickets/${id}`,
    data
  );
  return res.data;
};

export const deleteMeta = async (id: number): Promise<void> => {
  await axios.delete(`${VITE_CRM_API_URL}/metas-tickets/${id}`);
};

//metricas para el scale
// export const getMetricasScale = async (): Promise<Tecnicos[]> => {
//   let data = await axios.get<Tecnicos[]>(
//     `${VITE_CRM_API_URL}/user/get-users-to-meta-support`
//   );
//   return data.data;
// };
