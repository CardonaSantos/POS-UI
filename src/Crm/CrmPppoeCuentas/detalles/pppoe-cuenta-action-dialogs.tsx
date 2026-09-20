import { useEffect, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
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

import {
  usePostDarDeBajaPppoeCuenta,
  usePostProvisionarPppoeCuenta,
} from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";
import {
  useGetPppoeOperacionDetalle,
  usePostRecuperarPppoeOperacionCuenta,
  usePostReintentarPppoeOperacionCuenta,
} from "@/Crm/CrmHooks/hooks/pppoe-operaciones/pppoe-operaciones-hook";
import { buildPppoeRetryIdempotencyKey } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";

import type { PppoeOperacionDetalle } from "@/Crm/features/pppoe-operaciones/pppoe-operaciones.interfaces";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type BaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void | Promise<void>;
};

type CuentaDialogProps = BaseDialogProps & {
  cuentaPppoeId: number;
  usuario: string;
};

type OperacionDialogProps = BaseDialogProps & {
  cuentaPppoeId: number;
  operacionId: number;
};

type ActionDialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
};

function ActionDialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ActionDialogShellProps) {
  return (
    <AppDialog modal open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>{title}</AppDialogTitle>
          <AppDialogDescription>{description}</AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>{children}</AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

type DialogActionsProps = {
  pending: boolean;
  onCancel: () => void;
  children: ReactNode;
};

function DialogActions({ pending, onCancel, children }: DialogActionsProps) {
  return (
    <AppInline justify="end" gap="xs" fullWidth>
      <AppButton
        type="button"
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={onCancel}
      >
        Cancelar
      </AppButton>

      {children}
    </AppInline>
  );
}

const passwordSchema = z
  .string()
  .min(1, "La contraseña actual es obligatoria.")
  .max(512, "La contraseña es demasiado larga.");

const provisionarSchema = z.object({
  motivo: z.string().max(2000, "El motivo no puede superar 2000 caracteres."),
  contrasenaActual: passwordSchema,
});

const darDeBajaSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(5, "El motivo debe contener al menos 5 caracteres.")
    .max(500, "El motivo no puede superar 500 caracteres."),
  contrasenaActual: passwordSchema,
});

const reintentarSchema = z.object({
  motivo: z.string().max(2000, "El motivo no puede superar 2000 caracteres."),
  contrasenaActual: z.string().max(512, "La contraseña es demasiado larga."),
});

type ProvisionarFormValues = z.infer<typeof provisionarSchema>;
type DarDeBajaFormValues = z.infer<typeof darDeBajaSchema>;
type ReintentarFormValues = z.infer<typeof reintentarSchema>;

const PROVISIONAR_DEFAULTS: ProvisionarFormValues = {
  motivo: "",
  contrasenaActual: "",
};

const DAR_DE_BAJA_DEFAULTS: DarDeBajaFormValues = {
  motivo: "",
  contrasenaActual: "",
};

const REINTENTAR_DEFAULTS: ReintentarFormValues = {
  motivo: "",
  contrasenaActual: "",
};

function isBajaManual(operacion: PppoeOperacionDetalle | undefined): boolean {
  return (
    operacion?.tipo === "ELIMINAR_SECRET" &&
    operacion.instalacionId === null &&
    operacion.desinstalacionId === null
  );
}

export function ProvisionarPppoeDialog({
  cuentaPppoeId,
  usuario,
  open,
  onOpenChange,
  onCompleted,
}: CuentaDialogProps) {
  const mutation = usePostProvisionarPppoeCuenta(cuentaPppoeId);

  const form = useForm<ProvisionarFormValues>({
    resolver: zodResolver(provisionarSchema),
    defaultValues: PROVISIONAR_DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(PROVISIONAR_DEFAULTS);
    }
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
              : "El provisionamiento terminó con una incidencia.",
          error: getApiErrorMessageAxios,
        },
      );

      if (result) {
        await onCompleted();
      }
    } catch {
      form.setValue("contrasenaActual", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  };

  return (
    <ActionDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Provisionar cuenta PPPoE"
      description="Se creará y activará el secret PPPoE en el router MikroTik configurado."
    >
      <AppForm form={form} onSubmit={onSubmit}>
        <AppStack gap="sm">
          <AppAlert
            tone="warning"
            title="Modificación de infraestructura"
            size="xs"
          >
            Se habilitará el acceso PPPoE del usuario <strong>{usuario}</strong>
            .
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

          <DialogActions
            pending={mutation.isPending}
            onCancel={() => onOpenChange(false)}
          >
            <AppFormSubmit<ProvisionarFormValues>
              size="sm"
              loadingText="Provisionando..."
              disableWhenInvalid
            >
              Confirmar provisión
            </AppFormSubmit>
          </DialogActions>
        </AppStack>
      </AppForm>
    </ActionDialogShell>
  );
}

export function DarDeBajaPppoeDialog({
  cuentaPppoeId,
  usuario,
  open,
  onOpenChange,
  onCompleted,
}: CuentaDialogProps) {
  const mutation = usePostDarDeBajaPppoeCuenta(cuentaPppoeId);

  const form = useForm<DarDeBajaFormValues>({
    resolver: zodResolver(darDeBajaSchema),
    defaultValues: DAR_DE_BAJA_DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(DAR_DE_BAJA_DEFAULTS);
    }
  }, [form, open, cuentaPppoeId]);

  const onSubmit: SubmitHandler<DarDeBajaFormValues> = async (values) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          motivo: values.motivo.trim(),
          contrasenaActual: values.contrasenaActual,
        }),
        {
          loading: "Dando de baja la cuenta PPPoE...",
          success: "Cuenta PPPoE dada de baja correctamente",
          error: getApiErrorMessageAxios,
        },
      );

      await onCompleted();
    } catch {
      form.setValue("contrasenaActual", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  };

  return (
    <ActionDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Dar de baja cuenta PPPoE"
      description="Esta acción elimina definitivamente el acceso PPPoE configurado."
    >
      <AppForm form={form} onSubmit={onSubmit}>
        <AppStack gap="sm">
          <AppAlert tone="warning" title="Baja definitiva" size="xs">
            Se eliminará el secret de MikroTik y se cerrarán las sesiones
            activas de <strong>{usuario}</strong>. Esta acción no equivale a una
            suspensión.
          </AppAlert>

          <AppFormTextarea<DarDeBajaFormValues>
            name="motivo"
            label="Motivo de la baja"
            placeholder="Ej. Baja definitiva solicitada por el cliente"
            rows={3}
            resizeMode="vertical"
            required
          />

          <AppFormInput<DarDeBajaFormValues>
            name="contrasenaActual"
            type="password"
            label="Contraseña actual"
            autoComplete="current-password"
            required
          />

          <DialogActions
            pending={mutation.isPending}
            onCancel={() => onOpenChange(false)}
          >
            <AppFormSubmit<DarDeBajaFormValues>
              size="sm"
              loadingText="Dando de baja..."
              disableWhenInvalid
            >
              Confirmar baja definitiva
            </AppFormSubmit>
          </DialogActions>
        </AppStack>
      </AppForm>
    </ActionDialogShell>
  );
}

export function ReintentarOperacionDialog({
  cuentaPppoeId,
  operacionId,
  open,
  onOpenChange,
  onCompleted,
}: OperacionDialogProps) {
  const operacionQuery = useGetPppoeOperacionDetalle(
    cuentaPppoeId,
    operacionId,
    open,
  );

  const mutation = usePostReintentarPppoeOperacionCuenta(
    cuentaPppoeId,
    operacionId,
  );

  const operacion = operacionQuery.data;
  const requiereReautenticacion = isBajaManual(operacion);

  const form = useForm<ReintentarFormValues>({
    resolver: zodResolver(reintentarSchema),
    defaultValues: REINTENTAR_DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(REINTENTAR_DEFAULTS);
    }
  }, [form, open, operacionId]);

  const onSubmit: SubmitHandler<ReintentarFormValues> = async (values) => {
    if (!operacion) {
      toast.error("No fue posible resolver la operación PPPoE.");
      return;
    }

    if (requiereReautenticacion && values.contrasenaActual.length === 0) {
      form.setError("contrasenaActual", {
        type: "manual",
        message: "La contraseña actual es obligatoria.",
      });

      return;
    }

    try {
      await toast.promise(
        mutation.mutateAsync({
          claveIdempotencia: buildPppoeRetryIdempotencyKey(operacionId),
          motivo: values.motivo.trim() || undefined,

          contrasenaActual: requiereReautenticacion
            ? values.contrasenaActual
            : undefined,
        }),
        {
          loading: "Reintentando operación PPPoE...",
          success: "Reintento PPPoE ejecutado",
          error: getApiErrorMessageAxios,
        },
      );

      await onCompleted();
    } catch {
      if (requiereReautenticacion) {
        form.setValue("contrasenaActual", "", {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
    }
  };

  return (
    <ActionDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Reintentar operación"
      description={`Se creará un nuevo intento a partir de la operación #${operacionId}.`}
    >
      <AppForm form={form} onSubmit={onSubmit}>
        <AppStack gap="sm">
          <AppAlert tone="warning" title="Nueva ejecución técnica" size="xs">
            El intento anterior se conserva y se generará una nueva operación.
          </AppAlert>

          <AppFormTextarea<ReintentarFormValues>
            name="motivo"
            label="Motivo"
            placeholder="Observación opcional sobre el reintento"
            rows={3}
            resizeMode="vertical"
          />

          {requiereReautenticacion ? (
            <AppFormInput<ReintentarFormValues>
              name="contrasenaActual"
              type="password"
              label="Contraseña actual"
              autoComplete="current-password"
              required
            />
          ) : null}

          <DialogActions
            pending={mutation.isPending}
            onCancel={() => onOpenChange(false)}
          >
            <AppFormSubmit<ReintentarFormValues>
              size="sm"
              loadingText="Reintentando..."
            >
              Confirmar reintento
            </AppFormSubmit>
          </DialogActions>
        </AppStack>
      </AppForm>
    </ActionDialogShell>
  );
}

export function RecuperarOperacionDialog({
  cuentaPppoeId,
  operacionId,
  open,
  onOpenChange,
  onCompleted,
}: OperacionDialogProps) {
  const mutation = usePostRecuperarPppoeOperacionCuenta(
    cuentaPppoeId,
    operacionId,
  );

  const handleRecover = async () => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          confirmarAbandono: true,
        }),
        {
          loading: "Recuperando operación PPPoE...",
          success: "Operación PPPoE recuperada",
          error: getApiErrorMessageAxios,
        },
      );

      await onCompleted();
    } catch {
      // toast maneja el error
    }
  };

  return (
    <ActionDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Recuperar operación"
      description={`Confirme que la operación #${operacionId} quedó abandonada.`}
    >
      <AppStack gap="sm">
        <AppAlert tone="warning" title="Operación interrumpida" size="xs">
          La recuperación no repite comandos SSH. Solo cierra
          administrativamente la operación interrumpida.
        </AppAlert>

        <DialogActions
          pending={mutation.isPending}
          onCancel={() => onOpenChange(false)}
        >
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
        </DialogActions>
      </AppStack>
    </ActionDialogShell>
  );
}
