import { useEffect } from "react";

import {
  KeyRound,
  Play,
  Power,
  PowerOff,
  RefreshCcw,
  RotateCcw,
  Router,
  TriangleAlert,
} from "lucide-react";

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

import { useAppDisclosure } from "@/components/app/handlers";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";

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

import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";

import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";

import {
  useInvalidatePppoeCuenta,
  usePostProvisionarPppoeCuenta,
} from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { SuspenderPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/suspender-pppoe-dialog";

import { ReactivarPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/reactivar-pppoe-dialog";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  usePostRecuperarPppoeOperacionCuenta,
  usePostReintentarPppoeOperacionCuenta,
} from "@/Crm/CrmHooks/hooks/pppoe-operaciones/pppoe-operaciones-hook";
import { buildPppoeRetryIdempotencyKey } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import { PppoeCuentaCredencialesDialog } from "./pppoe-cuenta-credenciales-dialog";

type Props = {
  cuenta: PppoeCuentaDetalle;

  onDataChanged?: () => void | Promise<void>;
};

type RecuperarOperacionDialogProps = {
  cuenta: PppoeCuentaDetalle;

  operacionId: number;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void | Promise<void>;
};

const provisionarSchema = z.object({
  motivo: z.string().max(2000, "El motivo no puede superar 2000 caracteres."),

  /**
   * Importante:
   * no trim() sobre la contraseña.
   */
  contrasenaActual: z
    .string()
    .min(1, "La contraseña actual es obligatoria.")
    .max(512, "La contraseña es demasiado larga."),
});

type ProvisionarFormValues = z.infer<typeof provisionarSchema>;

const PROVISIONAR_DEFAULTS: ProvisionarFormValues = {
  motivo: "",

  contrasenaActual: "",
};

type ProvisionarPppoeDialogProps = {
  cuentaPppoeId: number;

  usuario: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

function ProvisionarPppoeDialog({
  cuentaPppoeId,
  usuario,
  open,
  onOpenChange,
  onCompleted,
}: ProvisionarPppoeDialogProps) {
  const mutation = usePostProvisionarPppoeCuenta(cuentaPppoeId);

  const form = useForm<ProvisionarFormValues>({
    resolver: zodResolver(provisionarSchema),

    defaultValues: PROVISIONAR_DEFAULTS,

    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(PROVISIONAR_DEFAULTS);
  }, [form, open, cuentaPppoeId]);

  const onSubmit: SubmitHandler<ProvisionarFormValues> = async (values) => {
    try {
      const result = await toast.promise(
        mutation.mutateAsync({
          contrasenaActual: values.contrasenaActual,

          motivo: values.motivo.trim() || undefined,
        }),
        {
          loading: "Provisionando cuenta PPPoE...",

          success: (response) =>
            response.completada
              ? "Cuenta PPPoE provisionada correctamente"
              : "El provisionamiento finalizó con una incidencia. Revise la operación generada.",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      /**
       * Un HTTP 200 no necesariamente significa que
       * CREAR_SECRET + ACTIVAR_SECRET terminaron ambos
       * correctamente.
       *
       * Cerramos igualmente y refrescamos para que el
       * detalle muestre el estado técnico real y permita
       * posteriormente reintentar la operación.
       */
      if (result) {
        onCompleted();
      }
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
          <AppDialogTitle>Provisionar cuenta PPPoE</AppDialogTitle>

          <AppDialogDescription>
            Se creará y activará el secret PPPoE en el router MikroTik
            configurado.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert
                tone="warning"
                title="Modificación de infraestructura"
                size="xs"
              >
                Esta acción modificará el router y habilitará el acceso PPPoE
                del usuario <strong>{usuario}</strong>.
              </AppAlert>

              <AppFormTextarea<ProvisionarFormValues>
                name="motivo"
                label="Motivo"
                placeholder="Observación administrativa opcional"
                rows={3}
                resizeMode="vertical"
              />

              <AppFormInput<ProvisionarFormValues>
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

                <AppFormSubmit<ProvisionarFormValues>
                  size="sm"
                  loadingText="Provisionando..."
                  disableWhenInvalid
                >
                  Confirmar provisión
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

type ReintentarOperacionDialogProps = {
  cuenta: PppoeCuentaDetalle;

  operacionId: number;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void | Promise<void>;
};

function ReintentarOperacionDialog({
  cuenta,
  operacionId,
  open,
  onOpenChange,
  onCompleted,
}: ReintentarOperacionDialogProps) {
  const mutation = usePostReintentarPppoeOperacionCuenta(
    cuenta.cuentaPppoeId,
    operacionId,
  );

  const form = useForm<{
    motivo: string;
  }>({
    defaultValues: {
      motivo: "",
    },

    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      motivo: "",
    });
  }, [form, open, operacionId]);

  const onSubmit: SubmitHandler<{
    motivo: string;
  }> = async (values) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          empresaId: cuenta.empresaId,

          claveIdempotencia: buildPppoeRetryIdempotencyKey(operacionId),

          motivo: values.motivo.trim() || undefined,
        }),
        {
          loading: "Reintentando operación PPPoE...",

          success: "Reintento PPPoE ejecutado",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      await onCompleted();
    } catch {
      // El error ya fue presentado por toast.
    }
  };

  return (
    <AppDialog modal open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Reintentar operación</AppDialogTitle>

          <AppDialogDescription>
            Se creará un nuevo intento a partir de la operación #{operacionId}.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert
                tone="warning"
                title="Nueva ejecución técnica"
                size="xs"
              >
                El intento anterior no se modifica. El sistema creará una nueva
                operación y ejecutará nuevamente el flujo correspondiente.
              </AppAlert>

              <AppFormTextarea<{
                motivo: string;
              }>
                name="motivo"
                label="Motivo"
                placeholder="Observación opcional sobre el reintento"
                rows={3}
                resizeMode="vertical"
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

                <AppFormSubmit<{
                  motivo: string;
                }>
                  size="sm"
                  loadingText="Reintentando..."
                >
                  Confirmar reintento
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

function RecuperarOperacionDialog({
  cuenta,
  operacionId,
  open,
  onOpenChange,
  onCompleted,
}: RecuperarOperacionDialogProps) {
  const mutation = usePostRecuperarPppoeOperacionCuenta(
    cuenta.cuentaPppoeId,
    operacionId,
  );

  const handleRecover = async () => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          empresaId: cuenta.empresaId,

          confirmarAbandono: true,
        }),
        {
          loading: "Recuperando operación PPPoE...",

          success: "Operación PPPoE recuperada",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      await onCompleted();
    } catch {
      // El error ya fue presentado por toast.
    }
  };

  return (
    <AppDialog modal open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Recuperar operación</AppDialogTitle>

          <AppDialogDescription>
            Confirme que la operación #{operacionId} quedó abandonada.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            <AppAlert tone="warning" title="Operación interrumpida" size="xs">
              Recuperar no vuelve a ejecutar comandos SSH. Esta acción cierra
              administrativamente una operación que quedó marcada como
              EJECUTANDO después de una interrupción.
            </AppAlert>

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

              <AppButton
                type="button"
                variant="danger"
                size="sm"
                loading={mutation.isPending}
                loadingText="Recuperando..."
                leftIcon={<TriangleAlert size={14} aria-hidden="true" />}
                onClick={handleRecover}
              >
                Confirmar recuperación
              </AppButton>
            </AppInline>
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

export function PppoeCuentaDetailActions({ cuenta, onDataChanged }: Props) {
  const { can } = useAuthorization();

  const provisionarDialog = useAppDisclosure();

  const suspenderDialog = useAppDisclosure();

  const reactivarDialog = useAppDisclosure();
  const credencialesDialog = useAppDisclosure();
  //   OPERACIONES
  const reintentarDialog = useAppDisclosure();

  const recuperarDialog = useAppDisclosure();

  const invalidateCuenta = useInvalidatePppoeCuenta(cuenta.cuentaPppoeId);

  /**
   * Una cuenta adoptada ya posee un secret físico
   * verificado en MikroTik.
   *
   * Nunca debe entrar nuevamente al flujo de
   * CREAR_SECRET + ACTIVAR_SECRET.
   */
  const esAdoptada = cuenta.origen === "EXTERNA_ADOPTADA";

  const canProvisionar =
    can(CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL) && !esAdoptada;

  const canSuspender = can(CRM_PERMISSION.PPPOE_SUSPENDER);

  const canReactivar = can(CRM_PERMISSION.PPPOE_REACTIVAR);

  const canRevealCredentials = can(CRM_PERMISSION.PPPOE_CREDENCIALES_REVELAR);

  const canManageOperations = can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR);

  const retryOperationId = cuenta.acciones.reintentarOperacion.operacionId;

  const recoverOperationId = cuenta.acciones.recuperarOperacion.operacionId;

  /**
   * Defensa adicional:
   *
   * aunque el padre normalmente se encuentra
   * protegido con PPPOE_ADMINISTRACION_VER,
   * no renderizamos acciones si el usuario no
   * tiene ninguna capacidad operativa.
   */
  if (
    !canProvisionar &&
    !canSuspender &&
    !canReactivar &&
    !canRevealCredentials &&
    !canManageOperations
  ) {
    return null;
  }
  const handleCompleted = async () => {
    provisionarDialog.close();

    suspenderDialog.close();

    reactivarDialog.close();

    reintentarDialog.close();

    recuperarDialog.close();

    invalidateCuenta();

    await onDataChanged?.();
  };

  const handleCredentialsRevealed = async () => {
    /**
     * Revelar credenciales genera una nueva entrada
     * de auditoría, por lo que refrescamos el detalle.
     *
     * No cerramos el diálogo: las credenciales deben
     * permanecer visibles hasta que el usuario pulse
     * "Ocultar y cerrar".
     */
    invalidateCuenta();

    await onDataChanged?.();
  };

  return (
    <>
      <AppCard variant="outline" size="xs" radius="md" className="p-3">
        <AppInline
          justify="between"
          align="center"
          collapseBelow="sm"
          gap="sm"
          fullWidth
        >
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap>
              <Router size={16} aria-hidden="true" />

              <p className="text-sm font-semibold">Acciones PPPoE</p>
            </AppInline>
          </div>

          <AppInline gap="xs" wrap>
            {canProvisionar ? (
              <AppButton
                type="button"
                size="sm"
                leftIcon={<Play size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.provisionar.habilitada}
                title={
                  cuenta.acciones.provisionar.habilitada
                    ? "Provisionar cuenta PPPoE"
                    : (cuenta.acciones.provisionar.motivo ??
                      "La provisión no está disponible.")
                }
                onClick={provisionarDialog.open}
              >
                Provisionar
              </AppButton>
            ) : null}

            {canReactivar ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Power size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.reactivar.habilitada}
                title={
                  cuenta.acciones.reactivar.habilitada
                    ? "Reactivar servicio PPPoE"
                    : (cuenta.acciones.reactivar.motivo ??
                      "La reactivación no está disponible.")
                }
                onClick={reactivarDialog.open}
              >
                Reactivar
              </AppButton>
            ) : null}

            {canSuspender ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<PowerOff size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.suspender.habilitada}
                title={
                  cuenta.acciones.suspender.habilitada
                    ? "Suspender servicio PPPoE"
                    : (cuenta.acciones.suspender.motivo ??
                      "La suspensión no está disponible.")
                }
                onClick={suspenderDialog.open}
              >
                Suspender
              </AppButton>
            ) : null}

            {canRevealCredentials ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<KeyRound size={14} aria-hidden="true" />}
                title="Revelar credenciales PPPoE"
                onClick={credencialesDialog.open}
              >
                Revelar credenciales
              </AppButton>
            ) : null}

            {canManageOperations &&
            cuenta.acciones.reintentarOperacion.habilitada &&
            retryOperationId ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw size={14} aria-hidden="true" />}
                title={
                  cuenta.acciones.reintentarOperacion.motivo ??
                  `Reintentar operación #${retryOperationId}`
                }
                onClick={reintentarDialog.open}
              >
                Reintentar
              </AppButton>
            ) : null}

            {canManageOperations &&
            cuenta.acciones.recuperarOperacion.habilitada &&
            recoverOperationId ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RefreshCcw size={14} aria-hidden="true" />}
                title={
                  cuenta.acciones.recuperarOperacion.motivo ??
                  `Recuperar operación #${recoverOperationId}`
                }
                onClick={recuperarDialog.open}
              >
                Recuperar
              </AppButton>
            ) : null}
          </AppInline>
        </AppInline>
      </AppCard>

      {canProvisionar ? (
        <ProvisionarPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          usuario={cuenta.usuario}
          open={provisionarDialog.isOpen}
          onOpenChange={provisionarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canSuspender ? (
        <SuspenderPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          open={suspenderDialog.isOpen}
          onOpenChange={suspenderDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canReactivar ? (
        <ReactivarPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          open={reactivarDialog.isOpen}
          onOpenChange={reactivarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canRevealCredentials ? (
        <PppoeCuentaCredencialesDialog
          cuenta={cuenta}
          open={credencialesDialog.isOpen}
          onOpenChange={credencialesDialog.setOpen}
          onDataChanged={handleCredentialsRevealed}
        />
      ) : null}

      {/* DIALOGOAS */}
      {canManageOperations && retryOperationId ? (
        <ReintentarOperacionDialog
          cuenta={cuenta}
          operacionId={retryOperationId}
          open={reintentarDialog.isOpen}
          onOpenChange={reintentarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canManageOperations && recoverOperationId ? (
        <RecuperarOperacionDialog
          cuenta={cuenta}
          operacionId={recoverOperationId}
          open={recuperarDialog.isOpen}
          onOpenChange={recuperarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}
    </>
  );
}
