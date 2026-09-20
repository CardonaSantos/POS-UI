import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { toast } from "sonner";

import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";

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

import { useAprobarAutorizacionDesinstalacion } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  APROBAR_AUTORIZACION_DEFAULT_VALUES,
  AprobarAutorizacionDesinstalacionFormValues,
  aprobarAutorizacionDesinstalacionSchema,
} from "../schemas/autorizacion-action.schemas";
import { toAprobarAutorizacionPayload } from "../common/autorizacion-action.mapper";

type Props = {
  autorizacionId: number;

  desinstalacionId: number;

  clienteNombre: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

export function AprobarAutorizacionDesinstalacionDialog({
  autorizacionId,
  desinstalacionId,
  clienteNombre,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = useAprobarAutorizacionDesinstalacion(autorizacionId);

  const form = useForm<AprobarAutorizacionDesinstalacionFormValues>({
    resolver: zodResolver(aprobarAutorizacionDesinstalacionSchema),

    defaultValues: APROBAR_AUTORIZACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(APROBAR_AUTORIZACION_DEFAULT_VALUES);
    }
  }, [autorizacionId, form, open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (mutation.isPending && !nextOpen) {
        return;
      }

      onOpenChange(nextOpen);
    },
    [mutation.isPending, onOpenChange],
  );

  const onSubmit: SubmitHandler<
    AprobarAutorizacionDesinstalacionFormValues
  > = async (values) => {
    try {
      await toast.promise(
        mutation.mutateAsync(toAprobarAutorizacionPayload(values)),
        {
          loading: "Aprobando autorización...",

          success: "Autorización aprobada",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(APROBAR_AUTORIZACION_DEFAULT_VALUES);

      onCompleted();
    } catch {
      // Mantener formulario abierto.
    }
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm" viewport="compact">
        <AppDialogHeader>
          <AppDialogTitle>Aprobar autorización</AppDialogTitle>

          <AppDialogDescription>
            Desinstalación #{desinstalacionId} · {clienteNombre}
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert
                tone="danger"
                variant="soft"
                size="xs"
                title="Baja definitiva"
              >
                Aprobar esta autorización ejecutará la eliminación definitiva
                del acceso PPPoE asociado.
              </AppAlert>

              <AppFormInput<AprobarAutorizacionDesinstalacionFormValues>
                name="contrasenaActual"
                type="password"
                label="Contraseña actual"
                autoComplete="current-password"
                required
              />

              <AppFormTextarea<AprobarAutorizacionDesinstalacionFormValues>
                name="comentarioAutorizador"
                label="Comentario"
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
                  Cancelar
                </AppButton>

                <AppFormSubmit<AprobarAutorizacionDesinstalacionFormValues>
                  size="sm"
                  loadingText="Aprobando..."
                  disableWhenInvalid
                >
                  Aprobar
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
