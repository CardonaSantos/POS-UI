import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
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
import { usePostReintentarPrealtaPppoe } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import { useGetPerfilesHomologacionSeleccionables } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import {
  reintentarPrealtaPppoeSchema,
  type ReintentarPrealtaPppoeFormValues,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.schemas";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = PppoeAdminDialogProps & {
  instalacionId: number;
  accesoInternetId: number;
  servicioInternetId: number | null;
};

const DEFAULTS: ReintentarPrealtaPppoeFormValues = {
  perfilHomologacionId: 0,
};

export function ReintentarPrealtaDialog({
  instalacionId,
  accesoInternetId,
  servicioInternetId,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = usePostReintentarPrealtaPppoe(
    instalacionId,
    accesoInternetId,
  );

  const homologacionesQuery = useGetPerfilesHomologacionSeleccionables(open);

  const form = useForm<ReintentarPrealtaPppoeFormValues>({
    resolver: zodResolver(reintentarPrealtaPppoeSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const homologaciones = useMemo(
    () =>
      (homologacionesQuery.data ?? []).filter(
        (perfil) =>
          servicioInternetId == null ||
          perfil.servicioInternetId === servicioInternetId,
      ),
    [homologacionesQuery.data, servicioInternetId],
  );

  const options = useMemo(
    () =>
      homologaciones.map((perfil) => ({
        value: perfil.id,
        label: `${perfil.codigoPerfil} · ${perfil.mikrotikRouter.nombre} · ${perfil.servicioInternet.nombre}`,
      })),
    [homologaciones],
  );

  useEffect(() => {
    if (!open) return;

    const first = homologaciones[0];
    form.reset({
      perfilHomologacionId: first?.id ?? 0,
    });
  }, [form, homologaciones, open]);

  const onSubmit: SubmitHandler<ReintentarPrealtaPppoeFormValues> = async (
    values,
  ) => {
    const perfil = homologaciones.find(
      (item) => item.id === values.perfilHomologacionId,
    );

    if (!perfil) {
      form.setError("perfilHomologacionId", {
        type: "manual",
        message: "Seleccione una homologación disponible",
      });
      return;
    }

    try {
      await toast.promise(
        mutation.mutateAsync({
          mikrotikRouterId: perfil.mikrotikRouterId,
        }),
        {
          loading: "Reintentando prealta PPPoE...",
          success: "Prealta PPPoE procesada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      onCompleted();
    } catch {
      // El diálogo permanece abierto para seleccionar otra homologación.
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="md">
        <AppDialogHeader>
          <AppDialogTitle>Reintentar prealta PPPoE</AppDialogTitle>
          <AppDialogDescription>
            Seleccione la homologación que debe utilizar este acceso antes de
            preparar nuevamente la cuenta local.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="warning" title="No ejecuta SSH" size="xs">
                La prealta genera o recupera la cuenta, credenciales y perfil.
                La activación del secret se confirma después con otra acción.
              </AppAlert>

              <AppFormSingleSelect<ReintentarPrealtaPppoeFormValues, number>
                name="perfilHomologacionId"
                label="Homologación PPPoE"
                options={options}
                placeholder="Seleccione perfil, router y servicio"
                isLoading={homologacionesQuery.isLoading}
                isDisabled={mutation.isPending}
                required
              />

              {homologacionesQuery.error ? (
                <AppAlert
                  tone="danger"
                  title="No se cargaron homologaciones"
                  size="xs"
                >
                  {getApiErrorMessageAxios(homologacionesQuery.error)}
                </AppAlert>
              ) : null}

              {!homologacionesQuery.isLoading && options.length === 0 ? (
                <AppAlert
                  tone="warning"
                  title="Sin homologaciones compatibles"
                  size="xs"
                >
                  No existe un perfil activo para el servicio asociado a este
                  acceso.
                </AppAlert>
              ) : null}

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

                <AppFormSubmit<ReintentarPrealtaPppoeFormValues>
                  size="sm"
                  loadingText="Reintentando..."
                  disableWhenInvalid
                  disabled={options.length === 0}
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
