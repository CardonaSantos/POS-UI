import axios, { AxiosResponse } from "axios";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

/**
 * Descarga el Excel generado por el backend.
 * @param id (opcional) parámetro para identificar el recurso (ajusta si es necesario)
 * @returns AxiosResponse<Blob>
 */
export const downloadExcelRutaCobro = async (
  id: number
): Promise<AxiosResponse<Blob>> => {
  return axios.get(`${VITE_CRM_API_URL}/ruta-cobro/get-excel-ruta/${id}`, {
    responseType: "blob", //para el buffer
  });
};
