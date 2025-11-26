"use client";
import type React from "react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle, LoaderPinwheel } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetFactura } from "@/Crm/CrmHooks/hooks/factura/useFactura";
import {
  MetodoPagoFacturaInternet,
  type FacturaInternetToPay,
} from "@/Crm/features/factura-internet/factura-to-pay";
import { estadoFacturaInternet } from "@/Crm/features/cliente-interfaces/cliente-types";
import { useGetServiciosAdicionales } from "@/Crm/CrmHooks/hooks/servicios-adicionales/useServiciosAdicionales";
import { useCreateFactura } from "@/Crm/CrmHooks/hooks/crear-pago-factura/useCreatePagoFactura";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useDeletePagoFactura } from "@/Crm/CrmHooks/hooks/eliminar-pago-factura/useDeletePagoFactura";
import { NuevoPagoFormValues } from "./types/nuevoPago.interface";
import { FacturaDetailsCard } from "./_components/FacturaDetailsCard";
import { ClientInfoCard } from "./_components/ClientInfoCard";
import { RegistrarPagoCard } from "./_components/RegistrarPagoCard";
import { HistorialPagosDialog } from "./_components/HistorialPagosDialog";
import { ConfirmPagoDialog } from "./_components/ConfirmPagoDialog";
import { PagoSuccessDialog } from "./_components/PagoSuccessDialog";
import { DeleteFacturaDialog } from "./_components/DeleteFacturaDialog";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

const isFacturaVencida = (factura: FacturaInternetToPay): boolean => {
  if (!factura.fechaPagoEsperada) return false;
  const fechaEsperada = new Date(factura.fechaPagoEsperada);
  const hoy = new Date();

  return (
    fechaEsperada < hoy &&
    factura.estadoFacturaInternet !== estadoFacturaInternet.PAGADA
  );
};

const canPayFactura = (factura: FacturaInternetToPay): boolean => {
  const saldo = factura.saldoPendiente ?? factura.montoPago ?? 0;
  return (
    (factura.estadoFacturaInternet === estadoFacturaInternet.PENDIENTE ||
      factura.estadoFacturaInternet === estadoFacturaInternet.PARCIAL ||
      factura.estadoFacturaInternet === estadoFacturaInternet.VENCIDA) &&
    saldo !== 0
  );
};

const getTotalPagado = (factura: FacturaInternetToPay): number => {
  const pagos = factura.pagos ?? [];
  return pagos.reduce(
    (sum: number, pago: { montoPagado: number }) => sum + pago.montoPagado,
    0
  );
};

const CrmPaymentFactura: React.FC = () => {
  const navigate = useNavigate();
  const { facturaId } = useParams();
  const id = facturaId ? Number(facturaId) : 0;

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPdfPago, setOpenPdfPago] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    number[]
  >([]);

  const [nuevoPago, setNuevoPago] = useState<NuevoPagoFormValues>({
    montoPagado: 0,
    metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
    numeroBoleta: "",
    fechaPago: dayjs().tz("America/Guatemala").toDate(),
  });

  const { data: factura, isLoading, isError } = useGetFactura(id);

  const clienteId = factura?.clienteId ?? 0;
  const { data: serviciosAdicionales } = useGetServiciosAdicionales(clienteId);
  const servicios = serviciosAdicionales ?? [];

  const submitPago = useCreateFactura(id);
  const submitDelete = useDeletePagoFactura(id);
  useEffect(() => {
    if (!factura) return;

    setNuevoPago({
      montoPagado: factura.saldoPendiente ?? factura.montoPago ?? 0,
      metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
      numeroBoleta: "",
      fechaPago: dayjs().tz("America/Guatemala").toDate(),
    });

    setServiciosSeleccionados([]);
    setError(null);
  }, [factura?.id]);

  if (isLoading) {
    return (
      <PageTransitionCrm titleHeader="Factura" subtitle="" variant="fade-pure">
        <div className="flex justify-center items-center py-12">
          <LoaderPinwheel className="h-10 w-10 animate-spin text-primary" />
        </div>
      </PageTransitionCrm>
    );
  }

  if (isError) {
    return (
      <PageTransitionCrm titleHeader="Factura" subtitle="" variant="fade-pure">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Ocurrió un error cargando la factura.
          </AlertDescription>
        </Alert>
      </PageTransitionCrm>
    );
  }

  if (!factura) {
    return (
      <PageTransitionCrm titleHeader="Factura" subtitle="" variant="fade-pure">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Factura no encontrada</AlertTitle>
          <AlertDescription>
            No se pudo encontrar la factura solicitada.
          </AlertDescription>
        </Alert>
      </PageTransitionCrm>
    );
  }

  const facturasPendientes = factura.facturasPendientes ?? [];
  const totalPagado = getTotalPagado(factura);
  const facturaVencida = isFacturaVencida(factura);
  const puedePagar = canPayFactura(factura);
  const isSubmittingPago = submitPago.isPending;
  const isDeleting = submitDelete.isPending;
  // Handlers

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNuevoPago((prev) => {
      if (name === "montoPagado") {
        return {
          ...prev,
          montoPagado: Number.parseFloat(value) || 0,
        };
      }

      if (name === "numeroBoleta") {
        return {
          ...prev,
          numeroBoleta: value,
        };
      }

      return prev;
    });
  };

  const handleMetodoPagoChange = (value: MetodoPagoFacturaInternet) => {
    setNuevoPago((prev) => ({
      ...prev,
      metodoPago: value,
    }));
  };

  const handleFechaPagoChange = (value: string) => {
    const fechaGt = dayjs.tz(value, "America/Guatemala").toDate();
    setNuevoPago((prev) => ({
      ...prev,
      fechaPago: fechaGt,
    }));
  };

  const handleCheckedServicio = (checked: boolean, idServicio: number) => {
    setServiciosSeleccionados((prev) => {
      if (checked) {
        if (prev.includes(idServicio)) return prev;
        return [...prev, idServicio];
      }
      return prev.filter((id) => id !== idServicio);
    });
  };

  const handleCreatePago = async () => {
    if (!factura) return;
    if (isSubmittingPago) return; // evita doble submit

    setError(null);

    const saldo = factura.saldoPendiente ?? factura.montoPago ?? 0;

    // Validaciones de negocio
    if (nuevoPago.montoPagado <= 0) {
      setError("El monto pagado debe ser mayor a cero.");
      return;
    }

    if (!userId) {
      setError("No se encontró un cobrador asignado.");
      return;
    }

    if (nuevoPago.montoPagado > saldo) {
      setError("El monto pagado no puede ser mayor al saldo pendiente.");
      return;
    }

    const payload = {
      facturaInternetId: factura.id,
      clienteId: factura.clienteId,
      montoPagado: nuevoPago.montoPagado,
      metodoPago: nuevoPago.metodoPago,
      cobradorId: userId,
      numeroBoleta: nuevoPago.numeroBoleta,
      serviciosAdicionales: serviciosSeleccionados,
      fechaPago: nuevoPago.fechaPago,
    };

    try {
      const promise = submitPago.mutateAsync(payload);

      toast.promise(promise, {
        loading: "Registrando pago...",
        success: "Pago registrado",
        error: (err) => getApiErrorMessageAxios(err),
      });

      await promise;

      setNuevoPago({
        montoPagado: 0,
        metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
        numeroBoleta: "",
        fechaPago: dayjs().tz("America/Guatemala").toDate(),
      });
      setServiciosSeleccionados([]);
      setOpenConfirm(false);
      setOpenPdfPago(true);
    } catch (err) {
      console.error("Error creando pago: ", err);
    }
  };

  const handleDeleteFactura = async () => {
    if (!factura || isDeleting) return;

    try {
      const promise = submitDelete.mutateAsync(factura.id);

      toast.promise(promise, {
        loading: "Eliminando factura...",
        success: () => {
          navigate(`/crm/cliente/${factura.clienteId}?tab=facturacion`);
          return "Factura eliminada";
        },
        error: (err) => getApiErrorMessageAxios(err),
      });

      await promise;
      setOpenDelete(false);
    } catch (err) {
      console.error("Error al eliminar factura: ", err);
    }
  };

  return (
    <PageTransitionCrm titleHeader="Factura" subtitle={``} variant="fade-pure">
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive" className="print:hidden">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Factura + Pago */}
          <div className="lg:col-span-2 space-y-4">
            <FacturaDetailsCard
              factura={factura}
              servicios={servicios}
              serviciosSeleccionados={serviciosSeleccionados}
              onToggleServicio={handleCheckedServicio}
              onShowHistorial={() => setShowHistorial(true)}
              onRequestDelete={() => setOpenDelete(true)}
              facturaVencida={facturaVencida}
            />

            {puedePagar && (
              <RegistrarPagoCard
                factura={factura}
                nuevoPago={nuevoPago}
                onInputChange={handleInputChange}
                onMetodoPagoChange={handleMetodoPagoChange}
                onFechaPagoChange={handleFechaPagoChange}
                onOpenConfirm={() => setOpenConfirm(true)}
                isSubmitting={isSubmittingPago}
              />
            )}
          </div>

          {/* Columna derecha: Cliente */}
          <ClientInfoCard
            factura={factura}
            facturasPendientes={facturasPendientes}
          />
        </div>

        {/* Historial de pagos */}
        <HistorialPagosDialog
          open={showHistorial}
          onOpenChange={setShowHistorial}
          factura={factura}
          facturaId={id}
          totalPagado={totalPagado}
        />

        {/* Confirmación de pago */}
        <ConfirmPagoDialog
          open={openConfirm}
          onOpenChange={setOpenConfirm}
          onConfirm={handleCreatePago}
          isSubmitting={isSubmittingPago}
        />

        {/* Dialog de pago registrado + descarga */}
        <PagoSuccessDialog
          open={openPdfPago}
          onClose={() => setOpenPdfPago(false)}
          facturaId={id}
        />

        {/* Confirmación eliminación de factura */}
        <DeleteFacturaDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          onConfirm={handleDeleteFactura}
          isDeleting={isDeleting}
        />
      </div>
    </PageTransitionCrm>
  );
};

export default CrmPaymentFactura;
