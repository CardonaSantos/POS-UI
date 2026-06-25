"use client";

import * as React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useApiQuery } from "@/hooks/genericoCall/genericoCallHook";

import type { RutaCobroInterface } from "../RutaCobroInterface";
import {
  buildPagoRutaPayload,
  createEmptyPagoRutaForm,
  getFacturasPorCobrar,
  mapClientesForMap,
  validatePagoRutaForm,
  type PagoRutaFormState,
  type RutaCliente,
  type RutaFactura,
} from "./ruta-cobro.helpers";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

type RutaCobroUiState = {
  selectedClientId: number | null;
  facturaSelectedId: number | null;
  pagoForm: PagoRutaFormState;
};

export function useRutaCobroPage() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { rutaId } = useParams<{ rutaId: string }>();

  const paymentDialog = useAppDisclosure();
  const confirmPaymentDialog = useAppDisclosure();
  const successPaymentDialog = useAppDisclosure();

  const ui = useAppStateHandlers<RutaCobroUiState>({
    selectedClientId: null,
    facturaSelectedId: null,
    pagoForm: createEmptyPagoRutaForm(userId, rutaId),
  });

  const rutaQuery = useApiQuery<RutaCobroInterface>(
    ["ruta-cobro", rutaId],
    `/ruta-cobro/get-one-ruta-cobro/${rutaId}`,
    undefined,
    {
      retry: 1,
    },
  );

  const uiRef = React.useRef(ui);
  const paymentDialogRef = React.useRef(paymentDialog);
  const confirmPaymentDialogRef = React.useRef(confirmPaymentDialog);
  const successPaymentDialogRef = React.useRef(successPaymentDialog);

  React.useEffect(() => {
    uiRef.current = ui;
    paymentDialogRef.current = paymentDialog;
    confirmPaymentDialogRef.current = confirmPaymentDialog;
    successPaymentDialogRef.current = successPaymentDialog;
  });

  React.useEffect(() => {
    ui.setField("pagoForm", createEmptyPagoRutaForm(userId, rutaId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, rutaId]);

  const ruta = rutaQuery.data ?? null;

  const facturasPorCobrar = React.useMemo(
    () => getFacturasPorCobrar(ruta),
    [ruta],
  );

  const clientesToMap = React.useMemo(
    () => mapClientesForMap(ruta?.clientes ?? []),
    [ruta?.clientes],
  );

  const setSelectedClient = React.useCallback((clienteId: number | null) => {
    uiRef.current.setField("selectedClientId", clienteId);
  }, []);

  const patchPagoForm = React.useCallback(
    (patch: Partial<PagoRutaFormState>) => {
      uiRef.current.setField("pagoForm", {
        ...uiRef.current.state.pagoForm,
        ...patch,
      });
    },
    [],
  );

  const openPaymentForFactura = React.useCallback(
    (cliente: RutaCliente, factura: RutaFactura) => {
      uiRef.current.patch({
        selectedClientId: cliente.id,
        facturaSelectedId: factura.id,
        pagoForm: {
          ...createEmptyPagoRutaForm(userId, rutaId),
          clienteId: cliente.id,
          facturaInternetId: factura.id,
          montoPagado: Number(factura.saldoPendiente ?? 0),
        },
      });

      paymentDialogRef.current.open();
    },
    [rutaId, userId],
  );

  const openConfirmPayment = React.useCallback(() => {
    const errorMessage = validatePagoRutaForm(uiRef.current.state.pagoForm);

    if (errorMessage) {
      toast.info(errorMessage);
      return;
    }

    paymentDialogRef.current.close();
    confirmPaymentDialogRef.current.open();
  }, []);

  const resetPaymentState = React.useCallback(() => {
    uiRef.current.patch({
      selectedClientId: null,
      facturaSelectedId: null,
      pagoForm: createEmptyPagoRutaForm(userId, rutaId),
    });
  }, [rutaId, userId]);

  const submitPaymentAction = useAppAsyncAction(
    async () => {
      const form = uiRef.current.state.pagoForm;
      const errorMessage = validatePagoRutaForm(form);

      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      await axios.post(
        `${VITE_CRM_API_URL}/facturacion/create-new-payment-for-ruta`,
        buildPagoRutaPayload(form),
      );

      toast.success("Pago registrado");

      confirmPaymentDialogRef.current.close();
      resetPaymentState();

      await rutaQuery.refetch();

      successPaymentDialogRef.current.open();
    },
    { preventConcurrent: true },
  );

  const submitPayment = React.useCallback(async (): Promise<void> => {
    await submitPaymentAction.run();
  }, [submitPaymentAction]);

  return {
    rutaId,
    userId,

    ruta,
    rutaQuery,
    facturasPorCobrar,
    clientesToMap,

    ui: ui.state,
    paymentDialog,
    confirmPaymentDialog,
    successPaymentDialog,

    isSubmittingPayment: submitPaymentAction.isLoading,

    setSelectedClient,
    patchPagoForm,
    openPaymentForFactura,
    openConfirmPayment,
    resetPaymentState,
    submitPayment,
  };
}
