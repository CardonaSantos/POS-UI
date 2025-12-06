import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Invalida la query que se le pase, creado para acompañar eventos socket
 * @returns Una funcion helper con un queryClient creado
 */
export function useInvalidateQk() {
  const queryClient = useQueryClient();

  return useCallback(
    (qk: readonly unknown[]) => {
      queryClient.invalidateQueries({ queryKey: qk });
    },
    [queryClient]
  );
}
