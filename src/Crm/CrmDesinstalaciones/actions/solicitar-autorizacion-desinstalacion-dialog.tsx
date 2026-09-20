import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { toast } from "sonner";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import { AppButton } from "@/components/app/primitives/app-button";

import { AppForm, AppFormSubmit, AppFormTextarea } from "@/components/app/form";

import { useSolicitarAutorizacionDesinstalacion } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import { toSolicitarAutorizacionDesinstalacionPayload } from "../common/solicitar-autorizacion-desinstalacion.mapper";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  SOLICITAR_AUTORIZACION_DESINSTALACION_DEFAULT_VALUES,
  SolicitarAutorizacionDesinstalacionFormValues,
  solicitarAutorizacionDesinstalacionSchema,
} from "../schemas/solicitar-autorizacion-desinstalacion.schema";

type SolicitarAutorizacionDesinstalacionDialogProps = {
  desinstalacionId: number;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

export function SolicitarAutorizacionDesinstalacionDialog({
  desinstalacionId,

  open,

  onOpenChange,

  onCompleted,
}: SolicitarAutorizacionDesinstalacionDialogProps) {
  const mutation = useSolicitarAutorizacionDesinstalacion(desinstalacionId);

  const form = useForm<SolicitarAutorizacionDesinstalacionFormValues>({
    resolver: zodResolver(solicitarAutorizacionDesinstalacionSchema),

    defaultValues: SOLICITAR_AUTORIZACION_DESINSTALACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  /**
   * Cada vez que se abre para una nueva desinstalación,
   * comenzamos con un formulario limpio.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(SOLICITAR_AUTORIZACION_DESINSTALACION_DEFAULT_VALUES);
  }, [desinstalacionId, form, open]);

  /**
   * Evita cerrar el modal mientras se está enviando
   * la solicitud.
   *
   * Esto cubre:
   * - Escape;
   * - click fuera;
   * - X;
   * - botón cancelar.
   */
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
    SolicitarAutorizacionDesinstalacionFormValues
  > = async (values) => {
    const payload = toSolicitarAutorizacionDesinstalacionPayload(values);

    try {
      await toast.promise(mutation.mutateAsync(payload), {
        loading: "Solicitando autorización...",

        success: "Autorización solicitada",

        error: (error) => getApiErrorMessageAxios(error),
      });

      form.reset(SOLICITAR_AUTORIZACION_DESINSTALACION_DEFAULT_VALUES);

      onCompleted();
    } catch {
      /**
       * El backend puede responder 409 si:
       *
       * - ya existe una solicitud pendiente;
       * - ya existe una autorización aprobada;
       * - la desinstalación ya finalizó.
       *
       * En esos casos dejamos abierto el diálogo.
       */
    }
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm" viewport="compact">
        <AppDialogHeader>
          <AppDialogTitle>Solicitar autorización</AppDialogTitle>

          <AppDialogDescription>
            Desinstalación #{desinstalacionId}. La solicitud quedará pendiente
            hasta que sea aprobada o rechazada por un operador autorizado.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppForm form={form} onSubmit={onSubmit}>
          <AppDialogBody>
            <AppFormTextarea<SolicitarAutorizacionDesinstalacionFormValues>
              name="motivoSolicitud"
              label="Motivo de solicitud"
              description="Información administrativa para quien revise la autorización."
              placeholder="Ej. Cliente solicitó la baja definitiva del servicio."
              rows={4}
              resizeMode="vertical"
            />
          </AppDialogBody>

          <AppDialogFooter>
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              disabled={mutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </AppButton>

            <AppFormSubmit<SolicitarAutorizacionDesinstalacionFormValues>
              size="sm"
              loadingText="Solicitando..."
            >
              Solicitar autorización
            </AppFormSubmit>
          </AppDialogFooter>
        </AppForm>
      </AppDialogContent>
    </AppDialog>
  );
}
