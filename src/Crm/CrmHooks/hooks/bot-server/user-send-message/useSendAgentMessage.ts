import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // O tu librería de notificaciones
import axios from "axios"; // Asegúrate de importar tu instancia configurada de axios

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface SendMessagePayload {
  clienteId: number;
  text: string;
  file?: File | null;
}

export function useSendAgentMessage() {
  return useMutation({
    mutationFn: async ({ clienteId, text, file }: SendMessagePayload) => {
      const formData = new FormData();

      // FormData convierte todo a string, pero el backend lo parsea
      formData.append("clienteId", String(clienteId));
      formData.append("text", text);

      if (file) {
        formData.append("file", file);
      }

      // Nota: No establezcas 'Content-Type': 'multipart/form-data' manualmente.
      // Axios y el navegador lo hacen automáticamente para incluir el "boundary".
      const { data } = await axios.post(
        `${VITE_CRM_API_URL}/agent/chat/send`,
        formData
      );
      return data;
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al enviar el mensaje");
    },
    // No necesitamos onSuccess para invalidar queries porque
    // tu Socket Event ya se encarga de actualizar la UI en tiempo real.
  });
}
