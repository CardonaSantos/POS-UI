import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const ticketConformidadPublicClient = axios.create({
  baseURL: API_URL,

  withCredentials: false,

  headers: {
    Accept: "application/json",
  },
});
