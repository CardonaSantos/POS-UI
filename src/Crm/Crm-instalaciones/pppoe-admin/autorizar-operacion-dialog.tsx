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
import { usePostAutorizarOperacionPppoe } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import {
  autorizarOperacionPppoeSchema,
  type AutorizarOperacionPppoeFormValues,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.schemas";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = PppoeAdminDialogProps & {
  operacionId: number;
  empresaId: number;
};

const DEFAULTS: AutorizarOperacionPppoeFormValues = {
  password: "",
};

export function AutorizarOperacionDialog({
  operacionId,
  empresaId,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = usePostAutorizarOperacionPppoe(operacionId);
  const form = useForm<AutorizarOperacionPppoeFormValues>({
    resolver: zodResolver(autorizarOperacionPppoeSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<AutorizarOperacionPppoeFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          empresaId,
          password: values.password,
        }),
        {
          loading: "Autorizando y ejecutando operación...",
          success: "Operación autorizada y procesada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      onCompleted();
    } catch {
      form.setValue("password", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Autorizar operación #{operacionId}</AppDialogTitle>
          <AppDialogDescription>
            La operación pendiente será reautenticada y ejecutada de inmediato.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="warning" title="Operación protegida" size="xs">
                Revise el tipo de operación mostrado en la tarjeta antes de
                confirmar. La contraseña no se almacenará en la interfaz.
              </AppAlert>

              <AppFormInput<AutorizarOperacionPppoeFormValues>
                name="password"
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

                <AppFormSubmit<AutorizarOperacionPppoeFormValues>
                  size="sm"
                  loadingText="Autorizando..."
                  disableWhenInvalid
                >
                  Autorizar y ejecutar
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
