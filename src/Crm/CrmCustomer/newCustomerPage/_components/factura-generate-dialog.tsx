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
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppAsyncAction,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { AppMonthPicker } from "@/components/app/primitives/app-month-picker";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface GenerateFacturaPayload {
  clienteId: number;
  mes: number;
  anio: number;
  creadorId: number | null;
}

interface FacturaGenerateDialogProps {
  openGenerarFactura: boolean;
  setOpenGenerarFactura: (value: boolean) => void;
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

  return { anio, mes };
}

function getAxiosFacturaErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const axErr = error as AxiosError<any>;

  if (axErr.response?.status === 409) {
    return axErr.response.data?.message ?? "Factura duplicada";
  }

  return fallback;
}

export default function FacturaGenerateDialog({
  openGenerarFactura,
  setOpenGenerarFactura,
  clienteId,
  userId,
  getClienteDetails,
}: FacturaGenerateDialogProps) {
  const form = useAppStateHandlers({
    periodo: "",
  });

  const generateAction = useAppAsyncAction(
    async (payload: GenerateFacturaPayload) => {
      return axios.post(
        `${VITE_CRM_API_URL}/facturacion/generate-factura-internet`,
        payload,
      );
    },
    {
      onSuccess: async () => {
        toast.success("Factura generada");

        form.reset();
        setOpenGenerarFactura(false);
        await getClienteDetails();
      },
      onError: (error) => {
        const message = getAxiosFacturaErrorMessage(
          error,
          "Error al generar factura",
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

  React.useEffect(() => {
    if (!openGenerarFactura) {
      form.reset();
      generateAction.resetError?.();
    }
  }, [openGenerarFactura]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpenGenerarFactura(open);

      if (!open) {
        form.reset();
      }
    },
    [form, setOpenGenerarFactura],
  );

  const handleSubmit = React.useCallback(async () => {
    if (!clienteId || clienteId <= 0) {
      toast.error("No se ha proporcionado un cliente válido.");
      return;
    }

    const periodo = parseMonthValue(form.state.periodo);

    if (!periodo) {
      toast.warning("Seleccione el mes y año de la factura.");
      return;
    }

    await generateAction.run({
      clienteId,
      mes: periodo.mes,
      anio: periodo.anio,
      creadorId: userId || null,
    });
  }, [clienteId, form.state.periodo, generateAction, userId]);

  return (
    <AppDialog open={openGenerarFactura} onOpenChange={handleOpenChange}>
      <AppDialogContent
        size="md"
        viewport="default"
        padding="sm"
        // overlayTone=""
        // overlayBlur="sm"
      >
        <AppDialogHeader divider>
          <AppDialogTitle className="flex items-center gap-2">
            <FileText size={16} />
            Generar factura
          </AppDialogTitle>

          <AppDialogDescription>
            Genere una factura pasada o futura para este cliente.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody padding="sm">
          <AppStack gap="sm">
            <AppAlert
              tone="info"
              size="sm"
              icon={<CalendarIcon size={15} />}
              title="Periodo de facturación"
            >
              Seleccione el mes y año que desea generar. El sistema validará si
              ya existe una factura para ese periodo.
            </AppAlert>

            <AppField
              label="Mes de pago"
              description="Seleccione mes y año. No se selecciona día."
              required
            >
              {(field) => (
                <AppMonthPicker
                  id={field.id}
                  value={form.state.periodo}
                  onChange={(value) => form.setField("periodo", value)}
                  invalid={field.invalid}
                  ariaDescribedBy={field.describedBy}
                  size="sm"
                  placeholder="Seleccione mes y año"
                />
              )}
            </AppField>
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
              Generar factura
            </AppButton>
          </AppInline>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
