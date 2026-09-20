import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { usePatchReprogramarInstalacionTecnica } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
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
import { localDateTimeToIso, optionalTrimmed } from "./action-utils";
import {
  reprogramarInstalacionSchema,
  type ReprogramarInstalacionFormValues,
} from "./instalacion-action.schemas";

const DEFAULTS: ReprogramarInstalacionFormValues = {
  fechaProgramada: "",
  motivo: "",
};

export function ReprogramarInstalacionDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: InstalacionActionDialogProps) {
  const mutation = usePatchReprogramarInstalacionTecnica(instalacionId);
  const form = useForm<ReprogramarInstalacionFormValues>({
    resolver: zodResolver(reprogramarInstalacionSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<ReprogramarInstalacionFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          fechaProgramada: localDateTimeToIso(values.fechaProgramada),
          motivo: optionalTrimmed(values.motivo),
        }),
        {
          loading: "Reprogramando...",
          success: "Instalación reprogramada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      await onCompleted();
    } catch {
      // Mantener los valores para corregir o reintentar.
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
          <AppDialogTitle>Reprogramar instalación</AppDialogTitle>
          <AppDialogDescription>
            Define cuándo debe volver a atenderse la orden.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppFormInput<ReprogramarInstalacionFormValues>
                name="fechaProgramada"
                type="datetime-local"
                label="Nueva fecha y hora"
                required
              />

              <AppFormTextarea<ReprogramarInstalacionFormValues>
                name="motivo"
                label="Motivo"
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
                  Cerrar
                </AppButton>

                <AppFormSubmit<ReprogramarInstalacionFormValues>
                  size="sm"
                  loadingText="Guardando..."
                  disableWhenInvalid
                >
                  Reprogramar
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
