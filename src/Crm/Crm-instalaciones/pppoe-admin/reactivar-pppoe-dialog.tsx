import { useEffect, useRef } from "react";
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
import { usePostReactivarCuentaPppoe } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import {
  motivoReactivacionPppoeSchema,
  type MotivoReactivacionPppoeFormValues,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.schemas";
import { createPppoeManualIdempotencyKey } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = PppoeAdminDialogProps & {
  cuentaPppoeId: number;
};

const DEFAULTS: MotivoReactivacionPppoeFormValues = {
  motivo: "",
  contrasenaActual: "",
};

export function ReactivarPppoeDialog({
  cuentaPppoeId,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = usePostReactivarCuentaPppoe(cuentaPppoeId);
  const idempotencyKeyRef = useRef("");
  const form = useForm<MotivoReactivacionPppoeFormValues>({
    resolver: zodResolver(motivoReactivacionPppoeSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;

    idempotencyKeyRef.current = createPppoeManualIdempotencyKey(
      "reactivar",
      cuentaPppoeId,
    );
    form.reset(DEFAULTS);
  }, [cuentaPppoeId, form, open]);

  const onSubmit: SubmitHandler<MotivoReactivacionPppoeFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          claveIdempotencia: idempotencyKeyRef.current,

          motivo: values.motivo.trim(),

          contrasenaActual: values.contrasenaActual,
        }),
        {
          loading: "Reactivando servicio PPPoE...",
          success: "Servicio PPPoE reactivado",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      onCompleted();
    } catch {
      form.setValue("contrasenaActual", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  };

  return (
    <AppDialog modal open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Reactivar servicio PPPoE</AppDialogTitle>
          <AppDialogDescription>
            Se habilitará o confirmará el secret y el acceso volverá a ACTIVO.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert
                tone="warning"
                title="Confirmación administrativa"
                size="xs"
              >
                Verifique que la causa de suspensión ya fue resuelta antes de
                reactivar el servicio.
              </AppAlert>

              <AppFormTextarea<MotivoReactivacionPppoeFormValues>
                name="motivo"
                label="Motivo de reactivación"
                placeholder="Explique por qué se restablece el acceso"
                rows={4}
                resizeMode="vertical"
                required
              />

              <AppFormInput<MotivoReactivacionPppoeFormValues>
                name="contrasenaActual"
                type="password"
                label="Contraseña actual"
                autoComplete="current-password"
                required
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Volver
                </AppButton>

                <AppFormSubmit<MotivoReactivacionPppoeFormValues>
                  size="sm"
                  loadingText="Reactivando..."
                  disableWhenInvalid
                >
                  Confirmar reactivación
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
