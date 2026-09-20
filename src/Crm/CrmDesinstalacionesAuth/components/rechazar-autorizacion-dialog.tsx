import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { toast } from "sonner";

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

import { useRechazarAutorizacionDesinstalacion } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  RECHAZAR_AUTORIZACION_DEFAULT_VALUES,
  RechazarAutorizacionDesinstalacionFormValues,
  rechazarAutorizacionDesinstalacionSchema,
} from "../schemas/autorizacion-action.schemas";
import { toRechazarAutorizacionPayload } from "../common/autorizacion-action.mapper";

type Props = {
  autorizacionId: number;

  desinstalacionId: number;

  clienteNombre: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

export function RechazarAutorizacionDesinstalacionDialog({
  autorizacionId,
  desinstalacionId,
  clienteNombre,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = useRechazarAutorizacionDesinstalacion(autorizacionId);

  const form = useForm<RechazarAutorizacionDesinstalacionFormValues>({
    resolver: zodResolver(rechazarAutorizacionDesinstalacionSchema),

    defaultValues: RECHAZAR_AUTORIZACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(RECHAZAR_AUTORIZACION_DEFAULT_VALUES);
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
    RechazarAutorizacionDesinstalacionFormValues
  > = async (values) => {
    try {
      await toast.promise(
        mutation.mutateAsync(toRechazarAutorizacionPayload(values)),
        {
          loading: "Rechazando autorización...",

          success: "Autorización rechazada",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(RECHAZAR_AUTORIZACION_DEFAULT_VALUES);

      onCompleted();
    } catch {
      // Mantener abierto.
    }
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm" viewport="compact">
        <AppDialogHeader>
          <AppDialogTitle>Rechazar autorización</AppDialogTitle>

          <AppDialogDescription>
            Desinstalación #{desinstalacionId} · {clienteNombre}
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="warning" variant="soft" size="xs">
                La solicitud dejará de estar pendiente. Una nueva autorización
                podrá solicitarse posteriormente.
              </AppAlert>

              <AppFormTextarea<RechazarAutorizacionDesinstalacionFormValues>
                name="comentarioAutorizador"
                label="Comentario"
                placeholder="Motivo o comentario del rechazo"
                rows={4}
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

                <AppFormSubmit<RechazarAutorizacionDesinstalacionFormValues>
                  variant="danger"
                  size="sm"
                  loadingText="Rechazando..."
                >
                  Rechazar autorización
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
