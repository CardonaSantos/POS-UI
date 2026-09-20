"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { TicketConformidadCanal } from "@/Crm/features/ticket-soporte-conformidad/enums";
import {
  useCrearTicketConformidad,
  useGenerarEnlaceTicketConformidad,
  useGetConformidadActual,
} from "./use-tickets-conformidad.hook";

export function useGenerarEnlaceConformidadRapido(ticketId: number) {
  const [conformidadId, setConformidadId] = useState<number | null>(null);

  const pendingWindowRef = useRef<Window | null>(null);

  const crearConformidad = useCrearTicketConformidad(ticketId);

  /*
   * No consulta automáticamente.
   * Lo usamos manualmente sólo cuando crear devuelve 409.
   */
  const conformidadActual = useGetConformidadActual(ticketId, false);

  /*
   * Este hook necesita el ID para construir
   * /:conformidadId/enlaces.
   */
  const generarEnlace = useGenerarEnlaceTicketConformidad(
    conformidadId,
    ticketId,
  );

  const handleClosePendingWindow = useCallback(() => {
    pendingWindowRef.current?.close();
    pendingWindowRef.current = null;
  }, []);

  const iniciar = useCallback(async () => {
    if (
      crearConformidad.isPending ||
      generarEnlace.isPending ||
      conformidadId !== null
    ) {
      return;
    }

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      toast.error("El ticket indicado no es válido.");
      return;
    }

    /*
     * Debemos abrirla directamente durante
     * el click del usuario.
     *
     * Después de un await el navegador podría
     * bloquear window.open().
     */
    const newWindow = window.open("about:blank", "_blank");

    if (!newWindow) {
      toast.error("El navegador bloqueó la nueva pestaña.");
      return;
    }

    pendingWindowRef.current = newWindow;

    try {
      /*
       * Caso 1:
       * no existe ciclo PENDIENTE.
       */
      const created = await crearConformidad.mutateAsync();

      setConformidadId(created.props.id);
    } catch (error) {
      /*
       * Caso 2:
       * ya existe una conformidad pendiente.
       *
       * El 409 forma parte del flujo normal
       * de esta acción.
       */
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        try {
          const actual = await conformidadActual.refetch();

          const actualId = actual.data?.id;

          if (!actualId || !Number.isInteger(actualId) || actualId <= 0) {
            throw new Error("No se encontró la conformidad pendiente.");
          }

          setConformidadId(actualId);

          return;
        } catch (actualError) {
          console.error("Error obteniendo conformidad actual:", actualError);
        }
      } else {
        console.error("Error creando conformidad:", error);
      }

      handleClosePendingWindow();

      toast.error("No fue posible preparar la conformidad.");
    }
  }, [
    conformidadId,
    crearConformidad,
    generarEnlace.isPending,
    conformidadActual,
    handleClosePendingWindow,
    ticketId,
  ]);

  /*
   * Al cambiar conformidadId React vuelve a renderizar
   * y useGenerarEnlaceTicketConformidad ya posee
   * el endpoint correcto.
   */
  useEffect(() => {
    if (conformidadId === null || pendingWindowRef.current === null) {
      return;
    }

    let active = true;

    const run = async () => {
      try {
        const enlace = await generarEnlace.mutateAsync({
          canal: TicketConformidadCanal.LINK,
        });

        if (!active) return;

        const publicUrl =
          `${window.location.origin}/conformidad/` +
          encodeURIComponent(enlace.token);

        pendingWindowRef.current?.location.replace(publicUrl);
      } catch (error) {
        if (!active) return;

        console.error("Error generando enlace de conformidad:", error);

        handleClosePendingWindow();

        toast.error("No fue posible generar el enlace de conformidad.");
      } finally {
        if (active) {
          pendingWindowRef.current = null;
          setConformidadId(null);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [conformidadId, generarEnlace, handleClosePendingWindow]);

  const isPending =
    crearConformidad.isPending ||
    conformidadActual.isFetching ||
    generarEnlace.isPending ||
    conformidadId !== null;

  return {
    generar: iniciar,
    isPending,
  };
}
