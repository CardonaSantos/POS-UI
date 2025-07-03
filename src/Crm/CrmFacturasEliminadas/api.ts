const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
import axios from "axios";

export const getFacturasEliminadas = async () => {
  const response = await axios.get(`${VITE_CRM_API_URL}/factura-eliminacion`);
  return response.data;
};
