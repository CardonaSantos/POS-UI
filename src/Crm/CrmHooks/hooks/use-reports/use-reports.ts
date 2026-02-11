import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";

export function useGenerateHistorialPagos() {
  return useCrmMutation<Blob, { ids: number[] }>(
    "post",
    "generate-reports/historial-pagos",
    {
      responseType: "blob",
    },
  );
}

export function useGenerateInfoReport() {
  return useCrmMutation<Blob, { ids: number[] }>(
    "post",
    "generate-reports/exportar-info",
    {
      responseType: "blob",
    },
  );
}

export const downloadFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
