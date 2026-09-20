import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { usePostCancelarInstalacionTecnica } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import { AppForm, AppFormSubmit, AppFormTextarea } from "@/components/app/form";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { InstalacionActionDialogProps } from "./action-dialog.types";
import { optionalNullableTrimmed } from "./action-utils";
import {
  cancelarInstalacionSchema,
  type CancelarInstalacionFormValues,
} from "./instalacion-action.schemas";

const DEFAULTS: CancelarInstalacionFormValues = {
  motivo: "",
  observaciones: "",
};

export function CancelarInstalacionDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: InstalacionActionDialogProps) {
  const mutation = usePostCancelarInstalacionTecnica(instalacionId);
  const form = useForm<CancelarInstalacionFormValues>({
    resolver: zodResolver(cancelarInstalacionSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<CancelarInstalacionFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          motivo: values.motivo.trim(),
          observaciones: optionalNullableTrimmed(values.observaciones),
        }),
        {
          loading: "Cancelando instalación...",
          success: "Instalación cancelada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      await onCompleted();
    } catch {
      // Mantener el motivo para corregir o reintentar.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Cancelar instalación</AppDialogTitle>
          <AppDialogDescription>
            Esta acción detiene el flujo operativo de la orden.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="warning" size="xs" variant="soft">
                Confirma que la orden ya no debe continuar.
              </AppAlert>

              <AppFormTextarea<CancelarInstalacionFormValues>
                name="motivo"
                label="Motivo"
                placeholder="Por qué se cancela"
                rows={3}
                resizeMode="vertical"
                required
              />

              <AppFormTextarea<CancelarInstalacionFormValues>
                name="observaciones"
                label="Observaciones"
                placeholder="Opcional"
                rows={3}
                resizeMode="vertical"
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => handleOpenChange(false)}
                >
                  Volver
                </AppButton>

                <AppFormSubmit<CancelarInstalacionFormValues>
                  size="sm"
                  variant="danger"
                  loadingText="Cancelando..."
                  disableWhenInvalid
                >
                  Cancelar instalación
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
