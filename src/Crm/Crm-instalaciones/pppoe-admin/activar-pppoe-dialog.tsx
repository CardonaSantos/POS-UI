import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { AppForm, AppFormInput, AppFormSubmit } from "@/components/app/form";
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
import { usePostActivarPppoeInstalacion } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import {
  activarPppoeSchema,
  type ActivarPppoeFormValues,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.schemas";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = PppoeAdminDialogProps & {
  instalacionId: number;
};

const DEFAULTS: ActivarPppoeFormValues = {
  contrasenaActual: "",
};

export function ActivarPppoeDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = usePostActivarPppoeInstalacion(instalacionId);
  const form = useForm<ActivarPppoeFormValues>({
    resolver: zodResolver(activarPppoeSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<ActivarPppoeFormValues> = async (values) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          contrasenaActual: values.contrasenaActual,
        }),
        {
          loading: "Activando cuenta PPPoE...",
          success: "Cuenta PPPoE activada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      onCompleted();
    } catch {
      form.setValue("contrasenaActual", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Activar cuenta por primera vez</AppDialogTitle>

          <AppDialogDescription>
            La oficina iniciará el flujo de instalación, creará o confirmará el
            secret y lo habilitará en el router asociado.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="warning" title="Acción protegida" size="xs">
                Confirme su identidad antes de ejecutar comandos sobre el
                MikroTik. La contraseña no se conservará después del envío.
              </AppAlert>

              <AppFormInput<ActivarPppoeFormValues>
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
                  Cancelar
                </AppButton>

                <AppFormSubmit<ActivarPppoeFormValues>
                  size="sm"
                  loadingText="Activando..."
                  disableWhenInvalid
                >
                  Confirmar activación
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
