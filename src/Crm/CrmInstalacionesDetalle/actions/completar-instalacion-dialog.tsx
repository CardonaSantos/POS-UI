import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { usePostCompletarInstalacionTecnica } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import {
  AppForm,
  AppFormSubmit,
  AppFormSwitch,
  AppFormTextarea,
} from "@/components/app/form";
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
  completarInstalacionSchema,
  type CompletarInstalacionFormValues,
} from "./instalacion-action.schemas";

const DEFAULTS: CompletarInstalacionFormValues = {
  resultado: "",
  observaciones: "",
  activarServicio: true,
};

export function CompletarInstalacionDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: InstalacionActionDialogProps) {
  const mutation = usePostCompletarInstalacionTecnica(instalacionId);
  const form = useForm<CompletarInstalacionFormValues>({
    resolver: zodResolver(completarInstalacionSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<CompletarInstalacionFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          resultado: optionalNullableTrimmed(values.resultado),
          observaciones: optionalNullableTrimmed(values.observaciones),
          activarServicio: values.activarServicio,
        }),
        {
          loading: "Completando instalación...",
          success: "Instalación completada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      await onCompleted();
    } catch {
      // Mantener los datos para corregir o reintentar.
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
          <AppDialogTitle>Completar instalación</AppDialogTitle>
          <AppDialogDescription>
            Registra el cierre del trabajo técnico.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppFormTextarea<CompletarInstalacionFormValues>
                name="resultado"
                label="Resultado"
                placeholder="Trabajo realizado"
                rows={3}
                resizeMode="vertical"
              />

              <AppFormTextarea<CompletarInstalacionFormValues>
                name="observaciones"
                label="Observaciones"
                placeholder="Opcional"
                rows={3}
                resizeMode="vertical"
              />

              <AppFormSwitch<CompletarInstalacionFormValues>
                name="activarServicio"
                fieldLabel="Servicio"
                label="Confirmar activación"
                description="La operación puede repetirse sin duplicar el servicio."
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => handleOpenChange(false)}
                >
                  Cerrar
                </AppButton>

                <AppFormSubmit<CompletarInstalacionFormValues>
                  size="sm"
                  loadingText="Completando..."
                  disableWhenInvalid
                >
                  Completar
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
