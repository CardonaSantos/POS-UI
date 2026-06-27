"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { CalendarIcon, FileText, X } from "lucide-react";
import { toast } from "sonner";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppAsyncAction,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { AppMonthPicker } from "@/components/app/primitives/app-month-picker";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface GenerateFacturasPayload {
  clienteId: number;
  mesInicio: number;
  mesFin: number;
  anio: number;
  creadorId: number | null;
}

interface GenerateFacturasProps {
  openGenerateFacturas: boolean;
  setOpenGenerateFacturas: (value: boolean) => void;
  clienteId: number | null;
  userId: number;
  getClienteDetails: () => void;
}

function parseMonthValue(value: string) {
  if (!value) return null;

  const [anioText, mesText] = value.split("-");
  const anio = Number(anioText);
  const mes = Number(mesText);

  if (!Number.isInteger(anio) || !Number.isInteger(mes)) return null;
  if (mes < 1 || mes > 12) return null;

  return {
    anio,
    mes,
    order: anio * 12 + mes,
  };
}

function getAxiosFacturaErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const axErr = error as AxiosError<any>;

  if (axErr.response?.status === 409) {
    return axErr.response.data?.message ?? "Factura duplicada";
  }

  return fallback;
}

export default function GenerateFacturas({
  openGenerateFacturas,
  setOpenGenerateFacturas,
  clienteId,
  userId,
  getClienteDetails,
}: GenerateFacturasProps) {
  const form = useAppStateHandlers({
    periodoInicio: "",
    periodoFin: "",
  });

  const generateAction = useAppAsyncAction(
    async (payload: GenerateFacturasPayload) => {
      return axios.post(
        `${VITE_CRM_API_URL}/facturacion/generate-factura-internet-multiple`,
        payload,
      );
    },
    {
      onSuccess: async () => {
        toast.success("Facturas generadas");

        form.reset();
        setOpenGenerateFacturas(false);
        await getClienteDetails();
      },
      onError: (error) => {
        const message = getAxiosFacturaErrorMessage(
          error,
          "Error al generar facturas",
        );

        if (axios.isAxiosError(error) && error.response?.status === 409) {
          toast.warning(message);
          return;
        }

        toast.error(message);
        console.error(error);
      },
    },
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpenGenerateFacturas(open);

      if (!open) {
        form.reset();
        generateAction.resetError?.();
      }
    },
    [form, generateAction, setOpenGenerateFacturas],
  );

  const handleSubmit = React.useCallback(async () => {
    if (!clienteId || clienteId <= 0) {
      toast.error("No se ha proporcionado un cliente válido.");
      return;
    }

    const inicio = parseMonthValue(form.state.periodoInicio);
    const fin = parseMonthValue(form.state.periodoFin);

    if (!inicio || !fin) {
      toast.warning("Seleccione el mes de inicio y el mes de fin.");
      return;
    }

    if (inicio.anio !== fin.anio) {
      toast.warning(
        "El rango debe pertenecer al mismo año. El endpoint actual recibe un solo año.",
      );
      return;
    }

    if (fin.order < inicio.order) {
      toast.warning("El mes de fin no puede ser anterior al mes de inicio.");
      return;
    }

    await generateAction.run({
      clienteId,
      mesInicio: inicio.mes,
      mesFin: fin.mes,
      anio: inicio.anio,
      creadorId: userId || null,
    });
  }, [
    clienteId,
    form.state.periodoFin,
    form.state.periodoInicio,
    generateAction,
    userId,
  ]);

  return (
    <AppDialog open={openGenerateFacturas} onOpenChange={handleOpenChange}>
      <AppDialogContent size="lg" viewport="default" padding="sm">
        <AppDialogHeader divider>
          <AppDialogTitle className="flex items-center gap-2">
            <FileText size={16} />
            Generar facturas por rango
          </AppDialogTitle>

          <AppDialogDescription>
            Genere múltiples facturas para los meses seleccionados.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody padding="sm">
          <AppStack gap="sm">
            <AppAlert
              tone="info"
              size="sm"
              icon={<CalendarIcon size={15} />}
              title="Rango de facturación"
            >
              Seleccione el mes inicial y final. El rango debe pertenecer al
              mismo año porque el endpoint actual recibe un solo campo de año.
            </AppAlert>

            <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
              <AppField
                label="Mes de inicio"
                description="Primer mes del rango. No se selecciona día."
                required
              >
                {(field) => (
                  <AppMonthPicker
                    id={field.id}
                    value={form.state.periodoInicio}
                    onChange={(value) => form.setField("periodoInicio", value)}
                    invalid={field.invalid}
                    ariaDescribedBy={field.describedBy}
                    size="sm"
                    placeholder="Mes inicial"
                  />
                )}
              </AppField>

              <AppField
                label="Mes de fin"
                description="Último mes del rango. No se selecciona día."
                required
              >
                {(field) => (
                  <AppMonthPicker
                    id={field.id}
                    value={form.state.periodoFin}
                    onChange={(value) => form.setField("periodoFin", value)}
                    invalid={field.invalid}
                    ariaDescribedBy={field.describedBy}
                    size="sm"
                    placeholder="Mes final"
                  />
                )}
              </AppField>
            </AppGrid>
          </AppStack>
        </AppDialogBody>

        <AppDialogFooter divider>
          <AppInline gap="xs" justify="end" className="w-full">
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              width="auto"
              leftIcon={<X size={14} />}
              disabled={generateAction.isLoading}
              onClick={() => handleOpenChange(false)}
            >
              Cerrar
            </AppButton>

            <AppButton
              type="button"
              variant="primary"
              size="sm"
              width="auto"
              leftIcon={<FileText size={14} />}
              loading={generateAction.isLoading}
              loadingText="Generando..."
              onClick={handleSubmit}
            >
              Generar facturas
            </AppButton>
          </AppInline>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
