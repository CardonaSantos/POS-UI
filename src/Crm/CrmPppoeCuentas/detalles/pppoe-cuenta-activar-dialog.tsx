import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
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

import { usePostActivarPppoeInstalacion } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";

import { usePostProvisionarPppoeCuenta } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import type { PppoeCuentaDetalleActivacionAccion } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type Props = {
  cuentaPppoeId: number;

  usuario: string;

  accion: PppoeCuentaDetalleActivacionAccion;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void | Promise<void>;
};

const passwordSchema = z
  .string()
  .min(1, "La contraseña actual es obligatoria.")
  .max(512, "La contraseña es demasiado larga.");

const activarSchema = z.object({
  /**
   * Sólo se envía en ALTA_MANUAL.
   *
   * Instalación conserva su propia motivación
   * y trazabilidad en backend.
   */
  motivo: z.string().max(2000, "El motivo no puede superar 2000 caracteres."),

  contrasenaActual: passwordSchema,
});

type ActivarFormValues = z.infer<typeof activarSchema>;

const ACTIVAR_DEFAULTS: ActivarFormValues = {
  motivo: "",

  contrasenaActual: "",
};

export function PppoeCuentaActivarDialog({
  cuentaPppoeId,
  usuario,
  accion,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  /**
   * Los hooks siempre deben ejecutarse en el mismo orden.
   *
   * Para ALTA_MANUAL instalacionId será null, así que
   * utilizamos 0 como valor inerte. La mutación de instalación
   * nunca se ejecutará mientras flujo !== INSTALACION.
   */
  const instalacionId = accion.instalacionId ?? 0;

  const activarInstalacionMutation =
    usePostActivarPppoeInstalacion(instalacionId);

  const activarManualMutation = usePostProvisionarPppoeCuenta(cuentaPppoeId);

  const form = useForm<ActivarFormValues>({
    resolver: zodResolver(activarSchema),

    defaultValues: ACTIVAR_DEFAULTS,

    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(ACTIVAR_DEFAULTS);
    }
  }, [form, open, cuentaPppoeId, accion.flujo, accion.instalacionId]);

  const esInstalacion = accion.flujo === "INSTALACION";

  const esAltaManual = accion.flujo === "ALTA_MANUAL";

  const isPending =
    activarInstalacionMutation.isPending || activarManualMutation.isPending;

  const onSubmit: SubmitHandler<ActivarFormValues> = async (values) => {
    /**
     * Defensa adicional.
     *
     * Normalmente este diálogo sólo puede abrirse cuando
     * backend devuelve acciones.activar.habilitada = true.
     */
    if (!accion.habilitada) {
      toast.error(
        accion.motivo ?? "La cuenta PPPoE no puede activarse actualmente.",
      );

      return;
    }

    try {
      if (esInstalacion) {
        if (
          !Number.isInteger(accion.instalacionId) ||
          (accion.instalacionId ?? 0) <= 0
        ) {
          toast.error(
            "No fue posible identificar la instalación vinculada a esta cuenta PPPoE.",
          );

          return;
        }

        /**
         * IMPORTANTE:
         *
         * contrasenaActual se envía exactamente como
         * fue escrita por el operador.
         *
         * Nunca aplicar trim().
         */
        await toast.promise(
          activarInstalacionMutation.mutateAsync({
            contrasenaActual: values.contrasenaActual,
          }),
          {
            loading: "Activando PPPoE desde la instalación...",

            success: "Cuenta PPPoE activada correctamente",

            error: getApiErrorMessageAxios,
          },
        );

        await onCompleted();

        return;
      }

      if (esAltaManual) {
        const result = await toast.promise(
          activarManualMutation.mutateAsync({
            contrasenaActual: values.contrasenaActual,

            motivo: values.motivo.trim() || undefined,
          }),
          {
            loading: "Activando cuenta PPPoE...",

            success: (response) =>
              response.completada
                ? "Cuenta PPPoE activada correctamente"
                : "La activación terminó con una incidencia.",

            error: getApiErrorMessageAxios,
          },
        );

        /**
         * Incluso una respuesta completada=false puede
         * haber cambiado operaciones/estados.
         *
         * Refrescamos el detalle para que backend vuelva
         * a decidir las acciones disponibles.
         */
        if (result) {
          await onCompleted();
        }

        return;
      }

      toast.error(
        "Esta cuenta PPPoE no posee un flujo de activación disponible.",
      );
    } catch {
      /**
       * Por seguridad limpiamos exclusivamente
       * la contraseña.
       *
       * No alteramos el motivo escrito.
       */
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
          <AppDialogTitle>Activar PPPoE</AppDialogTitle>

          <AppDialogDescription>
            {esInstalacion
              ? `La cuenta se activará mediante el flujo de la instalación #${accion.instalacionId}.`
              : "Se creará y activará el acceso PPPoE mediante el flujo administrativo."}
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              {esInstalacion ? (
                <AppAlert
                  tone="warning"
                  title="Activación vinculada a instalación"
                  size="xs"
                >
                  Se activará el acceso PPPoE del usuario{" "}
                  <strong>{usuario}</strong> y se conservará el contexto
                  operativo de la instalación #{accion.instalacionId}.
                </AppAlert>
              ) : (
                <AppAlert
                  tone="warning"
                  title="Activación administrativa"
                  size="xs"
                >
                  Se creará y habilitará en MikroTik el acceso PPPoE del usuario{" "}
                  <strong>{usuario}</strong>.
                </AppAlert>
              )}

              {esAltaManual ? (
                <AppFormTextarea<ActivarFormValues>
                  name="motivo"
                  label="Motivo"
                  placeholder="Observación administrativa opcional"
                  rows={3}
                  resizeMode="vertical"
                />
              ) : null}

              <AppFormInput<ActivarFormValues>
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
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </AppButton>

                <AppFormSubmit<ActivarFormValues>
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
