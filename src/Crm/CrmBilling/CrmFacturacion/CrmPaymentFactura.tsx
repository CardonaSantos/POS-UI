"use client";

import type React from "react";
import { useEffect, useMemo } from "react";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useAppAsyncAction,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useGetFactura } from "@/Crm/CrmHooks/hooks/factura/useFactura";
import { useGetServiciosAdicionales } from "@/Crm/CrmHooks/hooks/servicios-adicionales/useServiciosAdicionales";
import { useCreateFactura } from "@/Crm/CrmHooks/hooks/crear-pago-factura/useCreatePagoFactura";
import { useDeletePagoFactura } from "@/Crm/CrmHooks/hooks/eliminar-pago-factura/useDeletePagoFactura";

import {
  MetodoPagoFacturaInternet,
  type FacturaInternetToPay,
} from "@/Crm/features/factura-internet/factura-to-pay";
import { estadoFacturaInternet } from "@/Crm/features/cliente-interfaces/cliente-types";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import type { NuevoPagoFormValues } from "./types/nuevoPago.interface";

import { FacturaDetailsCard } from "./_components/FacturaDetailsCard";
import { ClientInfoCard } from "./_components/ClientInfoCard";
import { RegistrarPagoCard } from "./_components/RegistrarPagoCard";
import { ConfirmPagoDialog } from "./_components/ConfirmPagoDialog";
import { PagoSuccessDialog } from "./_components/PagoSuccessDialog";
import { DeleteFacturaDialog } from "./_components/DeleteFacturaDialog";
import { HistorialPagosDialog } from "./_components/HistorialPagosDialog";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

const GT_TIMEZONE = "America/Guatemala";

function getDefaultPagoValues(
  factura?: FacturaInternetToPay | null,
): NuevoPagoFormValues {
  return {
    montoPagado: factura?.saldoPendiente ?? factura?.montoPago ?? 0,
    metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
    numeroBoleta: "",
    fechaPago: dayjs().tz(GT_TIMEZONE).toDate(),
  };
}

function isFacturaVencida(factura: FacturaInternetToPay): boolean {
  if (!factura.fechaPagoEsperada) return false;

  return (
    dayjs(factura.fechaPagoEsperada).isBefore(dayjs()) &&
    factura.estadoFacturaInternet !== estadoFacturaInternet.PAGADA
  );
}

function canPayFactura(factura: FacturaInternetToPay): boolean {
  const saldo = factura.saldoPendiente ?? factura.montoPago ?? 0;

  return (
    [
      estadoFacturaInternet.PENDIENTE,
      estadoFacturaInternet.PARCIAL,
      estadoFacturaInternet.VENCIDA,
    ].includes(factura.estadoFacturaInternet) && saldo > 0
  );
}

function getTotalPagado(factura: FacturaInternetToPay): number {
  return (factura.pagos ?? []).reduce(
    (sum, pago) => sum + Number(pago.montoPagado ?? 0),
    0,
  );
}

function parseFacturaId(value?: string): number {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : 0;
}

const CrmPaymentFactura: React.FC = () => {
  const navigate = useNavigate();
  const { facturaId } = useParams();

  const id = parseFacturaId(facturaId);
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const errorState = useAppStateHandlers({
    message: null as string | null,
  });

  const pagoForm = useAppStateHandlers<NuevoPagoFormValues>(
    getDefaultPagoValues(),
  );

  const serviciosState = useAppStateHandlers({
    selectedIds: [] as number[],
  });

  const confirmPagoDialog = useAppDisclosure();
  const deleteFacturaDialog = useAppDisclosure();
  const successPagoDialog = useAppDisclosure();
  const historialDialog = useAppDisclosure();

  const facturaQuery = useGetFactura(id);
  const factura = facturaQuery.data;

  const clienteId = factura?.clienteId ?? 0;
  const serviciosQuery = useGetServiciosAdicionales(clienteId);

  const createPagoMutation = useCreateFactura(id);
  const deleteFacturaMutation = useDeletePagoFactura(id);

  const createPagoAction = useAppAsyncAction(
    async (targetFactura: FacturaInternetToPay) => {
      const saldo =
        targetFactura.saldoPendiente ?? targetFactura.montoPago ?? 0;

      const values = pagoForm.state;

      errorState.setField("message", null);

      if (values.montoPagado <= 0) {
        throw new Error("El monto pagado debe ser mayor a cero.");
      }

      if (!userId) {
        throw new Error("No se encontró un cobrador asignado.");
      }

      if (values.montoPagado > saldo) {
        throw new Error(
          "El monto pagado no puede ser mayor al saldo pendiente.",
        );
      }

      const payload = {
        facturaInternetId: targetFactura.id,
        clienteId: targetFactura.clienteId,
        montoPagado: values.montoPagado,
        metodoPago: values.metodoPago,
        cobradorId: userId,
        numeroBoleta: values.numeroBoleta,
        serviciosAdicionales: serviciosState.state.selectedIds,
        fechaPago: values.fechaPago,
      };

      const promise = createPagoMutation.mutateAsync(payload);

      toast.promise(promise, {
        loading: "Registrando pago...",
        success: "Pago registrado",
        error: (err) => getApiErrorMessageAxios(err),
      });

      await promise;
    },
    {
      preventConcurrent: true,
      onSuccess: () => {
        pagoForm.reset(getDefaultPagoValues(null));
        serviciosState.setField("selectedIds", []);
        confirmPagoDialog.close();
        successPagoDialog.open();
      },
      onError: (err) => {
        errorState.setField(
          "message",
          err instanceof Error
            ? err.message
            : "Ocurrió un error registrando el pago.",
        );
      },
    },
  );

  const deleteFacturaAction = useAppAsyncAction(
    async (targetFactura: FacturaInternetToPay) => {
      const promise = deleteFacturaMutation.mutateAsync(targetFactura.id);

      toast.promise(promise, {
        loading: "Eliminando factura...",
        success: () => {
          navigate(`/crm/cliente/${targetFactura.clienteId}?tab=facturacion`);
          return "Factura eliminada";
        },
        error: (err) => getApiErrorMessageAxios(err),
      });

      await promise;
    },
    {
      preventConcurrent: true,
      onSuccess: () => {
        deleteFacturaDialog.close();
      },
    },
  );

  useEffect(() => {
    if (!factura) return;

    pagoForm.reset(getDefaultPagoValues(factura));
    serviciosState.setField("selectedIds", []);
    errorState.setField("message", null);
  }, [factura?.id]);

  const servicios = serviciosQuery.data ?? [];

  const viewModel = useMemo(() => {
    if (!factura) return null;

    return {
      facturasPendientes: factura.facturasPendientes ?? [],
      totalPagado: getTotalPagado(factura),
      facturaVencida: isFacturaVencida(factura),
      puedePagar: canPayFactura(factura),
    };
  }, [factura]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "montoPagado") {
      pagoForm.setField("montoPagado", Number.parseFloat(value) || 0);
      return;
    }

    if (name === "numeroBoleta") {
      pagoForm.setField("numeroBoleta", value);
    }
  };

  const handleMetodoPagoChange = (value: MetodoPagoFacturaInternet) => {
    pagoForm.setField("metodoPago", value);
  };

  const handleFechaPagoChange = (value: string) => {
    const now = dayjs().tz(GT_TIMEZONE);

    const fechaGt = dayjs
      .tz(value, GT_TIMEZONE)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .toDate();

    pagoForm.setField("fechaPago", fechaGt);
  };

  const handleCheckedServicio = (checked: boolean, servicioId: number) => {
    serviciosState.setState((prev) => {
      const alreadySelected = prev.selectedIds.includes(servicioId);

      if (checked && !alreadySelected) {
        return {
          selectedIds: [...prev.selectedIds, servicioId],
        };
      }

      if (!checked) {
        return {
          selectedIds: prev.selectedIds.filter((id) => id !== servicioId),
        };
      }

      return prev;
    });
  };

  const handleCreatePago = () => {
    if (!factura) return;
    createPagoAction.run(factura);
  };

  const handleDeleteFactura = () => {
    if (!factura) return;
    deleteFacturaAction.run(factura);
  };

  return (
    <PageTransitionCrm titleHeader="Factura" subtitle="" variant="fade-pure">
      <AppDataState
        isLoading={facturaQuery.isLoading}
        error={facturaQuery.isError ? facturaQuery.error : null}
        isEmpty={!factura}
        onRetry={() => facturaQuery.refetch()}
        loadingVariant="skeleton-card"
        loadingRows={3}
        emptyTitle="Factura no encontrada"
        emptyDescription="No se pudo encontrar la factura solicitada."
        errorFallback={
          <AppAlert
            tone="danger"
            variant="soft"
            title="Error"
            description="Ocurrió un error cargando la factura."
            icon={<AlertCircle className="h-4 w-4" />}
          />
        }
      >
        {factura && viewModel ? (
          <AppStack gap="md">
            {errorState.state.message ? (
              <AppAlert
                tone="danger"
                variant="soft"
                title="Error"
                description={errorState.state.message}
                icon={<AlertCircle className="h-4 w-4" />}
                className="print:hidden"
                closable
                onClose={() => errorState.setField("message", null)}
              />
            ) : null}

            <AppGrid cols={{ base: 1, lg: 3 }} gap="lg">
              <AppStack gap="md" className="lg:col-span-2">
                <FacturaDetailsCard
                  factura={factura}
                  servicios={servicios}
                  serviciosSeleccionados={serviciosState.state.selectedIds}
                  onToggleServicio={handleCheckedServicio}
                  onShowHistorial={historialDialog.open}
                  onRequestDelete={deleteFacturaDialog.open}
                  facturaVencida={viewModel.facturaVencida}
                />

                {viewModel.puedePagar ? (
                  <RegistrarPagoCard
                    factura={factura}
                    nuevoPago={pagoForm.state}
                    onInputChange={handleInputChange}
                    onMetodoPagoChange={handleMetodoPagoChange}
                    onFechaPagoChange={handleFechaPagoChange}
                    onOpenConfirm={confirmPagoDialog.open}
                    isSubmitting={createPagoAction.isLoading}
                  />
                ) : null}
              </AppStack>

              <ClientInfoCard
                factura={factura}
                facturasPendientes={viewModel.facturasPendientes}
              />
            </AppGrid>

            <HistorialPagosDialog
              open={historialDialog.isOpen}
              onOpenChange={historialDialog.setOpen}
              factura={factura}
              facturaId={id}
              totalPagado={viewModel.totalPagado}
            />

            <ConfirmPagoDialog
              open={confirmPagoDialog.isOpen}
              onOpenChange={confirmPagoDialog.setOpen}
              onConfirm={handleCreatePago}
              isSubmitting={createPagoAction.isLoading}
            />

            <PagoSuccessDialog
              open={successPagoDialog.isOpen}
              onClose={successPagoDialog.close}
              facturaId={id}
            />

            <DeleteFacturaDialog
              open={deleteFacturaDialog.isOpen}
              onOpenChange={deleteFacturaDialog.setOpen}
              onConfirm={handleDeleteFactura}
              isDeleting={deleteFacturaAction.isLoading}
            />
          </AppStack>
        ) : null}
      </AppDataState>
    </PageTransitionCrm>
  );
};

export default CrmPaymentFactura;
