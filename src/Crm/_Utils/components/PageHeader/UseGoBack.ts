// src/components/navigation/use-go-back.ts
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Devuelve una función goBack():
 * - Si hay historial, navega atrás.
 * - Si no, navega al fallback (por defecto "/").
 */
export function useGoBackCrm(fallback: string = "/") {
  const navigate = useNavigate();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }, [navigate, fallback]);
}
