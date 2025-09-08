import { toast } from "sonner";

export const copyToClipBoard = async (textoCopiar: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(textoCopiar);
    toast.success("Texto copiado");
  } catch (error) {
    toast.error("Error al copiar texto");
  }
};
