"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppStateHandlers,
} from "@/components/app/handlers";

import { getMetricasRendimiento } from "./api";
import type { Metrics, TicketMoment, TicketsActuales } from "./types";
import {
  normalizeScaleRows,
  type TicketResueltoDiaPivot,
} from "./metricas.helpers";

interface MetricasState {
  metrics: Metrics[];
  dataScale: TicketResueltoDiaPivot[];
  ticketsActuales: TicketsActuales | null;
  ticketsEnProceso: TicketMoment[];
  resueltosDelMes: number;
  error: string | null;
  hasLoaded: boolean;
}

interface UseMetricasRendimientoOptions {
  externalLoading?: boolean;
}

export function useMetricasRendimiento({
  externalLoading = false,
}: UseMetricasRendimientoOptions = {}) {
  const state = useAppStateHandlers<MetricasState>({
    metrics: [],
    dataScale: [],
    ticketsActuales: null,
    ticketsEnProceso: [],
    resueltosDelMes: 0,
    error: null,
    hasLoaded: false,
  });

  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
  });

  const loadAction = useAppAsyncAction(
    async () => {
      stateRef.current.setField("error", null);

      try {
        const response = await getMetricasRendimiento();

        stateRef.current.setState({
          metrics: response.metrics,
          dataScale: normalizeScaleRows(response.dataScale),
          ticketsActuales: response.ticketsActuales,
          ticketsEnProceso: response.ticketsEnProceso,
          resueltosDelMes: response.resueltosDelMes,
          error: null,
          hasLoaded: true,
        });
      } catch (error) {
        const message = "Error al cargar las métricas.";

        stateRef.current.setField("error", message);
        stateRef.current.setField("hasLoaded", true);

        toast.error(message);
        console.error("Error fetching metricas:", error);
      }
    },
    {
      preventConcurrent: true,
    },
  );

  React.useEffect(() => {
    void loadAction.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = React.useCallback(async () => {
    await loadAction.run();
  }, [loadAction]);

  const isLoading =
    externalLoading || loadAction.isLoading || !state.state.hasLoaded;

  return {
    state: state.state,
    isLoading,
    reload,
    loadAction,
  };
}
