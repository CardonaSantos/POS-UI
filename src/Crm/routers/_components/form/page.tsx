import { useEffect, useMemo, useRef, useState } from "react";

import { Router } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";

import { AppCard } from "@/components/app/primitives/app-card";

import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

import { AppInline } from "@/components/app/primitives/app-inline";

import { AppLoader } from "@/components/app/primitives/app-loader";

import { AppStack } from "@/components/app/primitives/app-stack";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import {
  useCreateMikrotikRouter,
  useGetMikroTiks,
  useUpdateMikrotikRouter,
} from "@/Crm/CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { routerMkSchemaZ, RouterMkType } from "./zformRouter";
import FormCreateRouter from "./form-create-router";

const ROUTERS_BASE_PATH = "/crm/routers";

const DEFAULT_SSH_PORT = 22;

function getDefaultValues(empresaId: number): RouterMkType {
  return {
    nombre: "",
    host: "",
    sshPort: DEFAULT_SSH_PORT,
    usuario: "",
    passwordEnc: "",
    descripcion: "",
    empresaId,
  };
}

function RouterFormPage() {
  const navigate = useNavigate();

  const { routerId: routerIdParam } = useParams<{
    routerId?: string;
  }>();

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const isEditMode = routerIdParam !== undefined;

  const routerId = routerIdParam !== undefined ? Number(routerIdParam) : null;

  const validRouterId =
    routerId !== null && Number.isInteger(routerId) && routerId > 0;

  const [openConfirm, setOpenConfirm] = useState(false);

  /**
   * Evita volver a resetear el formulario
   * si React Query hace refetch al cambiar
   * de ventana mientras estamos editando.
   */
  const hydratedRouterId = useRef<number | null>(null);

  const { data: routers, isLoading, isError } = useGetMikroTiks();

  const createMk = useCreateMikrotikRouter();

  const updateMk = useUpdateMikrotikRouter();

  const isSaving = createMk.isPending || updateMk.isPending;

  const routerToEdit = useMemo(() => {
    if (!isEditMode || !validRouterId || !routers) {
      return null;
    }

    return routers.find((router) => router.id === routerId) ?? null;
  }, [isEditMode, validRouterId, routers, routerId]);

  const form = useForm<RouterMkType>({
    resolver: zodResolver(routerMkSchemaZ),

    mode: "onChange",

    reValidateMode: "onChange",

    defaultValues: getDefaultValues(empresaId),
  });

  /*
   * En creación solo sincronizamos
   * empresaId si el store termina
   * de hidratarse después del mount.
   */
  useEffect(() => {
    if (isEditMode || empresaId <= 0) {
      return;
    }

    form.setValue("empresaId", empresaId, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [empresaId, form, isEditMode]);

  /*
   * Hidratamos una sola vez por router.
   *
   * Un refetch posterior no destruye
   * cambios que el usuario esté haciendo.
   */
  useEffect(() => {
    if (!isEditMode || !routerToEdit) {
      return;
    }

    if (hydratedRouterId.current === routerToEdit.id) {
      return;
    }

    form.reset({
      nombre: routerToEdit.nombre ?? "",

      host: routerToEdit.host ?? "",

      sshPort: routerToEdit.sshPort ?? DEFAULT_SSH_PORT,

      usuario: routerToEdit.usuario ?? "",

      descripcion: routerToEdit.descripcion ?? "",

      /*
       * Nunca hidratamos la contraseña
       * desde la respuesta del servidor.
       *
       * Vacío durante edición =
       * conservar credencial actual.
       */
      passwordEnc: "",

      empresaId,
    });

    hydratedRouterId.current = routerToEdit.id;
  }, [empresaId, form, isEditMode, routerToEdit]);

  const {
    formState: { isDirty, isValid },
  } = form;

  const canSubmit = isDirty && isValid && !isSaving;

  const handleBack = () => {
    navigate(ROUTERS_BASE_PATH);
  };

  const handleOpenConfirm = () => {
    if (!canSubmit) {
      return;
    }

    setOpenConfirm(true);
  };

  const handleSave = async () => {
    await form.handleSubmit(async (values) => {
      //   const { passwordEnc, ...rest } = values;

      //   const normalizedPassword = passwordEnc?.trim();

      const { passwordEnc, id: _formId, ...rest } = values;

      const normalizedPassword = passwordEnc?.trim();

      /**
       * El frontend recibe una contraseña plana.
       *
       * La API espera `password`.
       * `passwordEnc` pertenece únicamente al
       * modelo persistido del backend y nunca
       * debe enviarse desde el cliente.
       */
      const payload = normalizedPassword
        ? {
            ...rest,
            password: normalizedPassword,
          }
        : rest;

      if (isEditMode && routerToEdit) {
        await toast.promise(
          updateMk.mutateAsync({
            ...payload,

            id: routerToEdit.id,
          }),
          {
            loading: "Actualizando router...",

            success: "Router actualizado correctamente",

            error: (error) => getApiErrorMessageAxios(error),
          },
        );
      } else {
        await toast.promise(createMk.mutateAsync(payload), {
          loading: "Registrando router...",

          success: "Router registrado correctamente",

          error: (error) => getApiErrorMessageAxios(error),
        });
      }

      setOpenConfirm(false);

      navigate(ROUTERS_BASE_PATH, {
        replace: true,
      });
    })();
  };

  const pageTitle = isEditMode
    ? "Editar router MikroTik"
    : "Nuevo router MikroTik";

  const pageSubtitle = isEditMode
    ? "Actualiza la configuración de conexión del router seleccionado."
    : "Registra un nuevo router para utilizarlo en la infraestructura de red.";

  /*
   * EDITAR: ID inválido en URL.
   */
  if (isEditMode && !validRouterId) {
    return (
      <PageTransitionCrm
        titleHeader="Router MikroTik"
        subtitle="No fue posible identificar el router solicitado."
        variant="fade-pure"
      >
        <AppEmptyState
          preset="error"
          title="Identificador inválido"
          description="La dirección utilizada no contiene un identificador de router válido."
          action={
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleBack}
            >
              Volver a routers
            </AppButton>
          }
        />
      </PageTransitionCrm>
    );
  }

  /*
   * EDITAR: esperamos a que
   * cargue el listado.
   */
  if (isEditMode && isLoading) {
    return (
      <PageTransitionCrm
        titleHeader="Editar router MikroTik"
        subtitle="Cargando configuración del router."
        variant="fade-pure"
      >
        <AppCard variant="outline" size="xs" radius="md" className="p-5">
          <AppInline justify="center" align="center" gap="xs" fullWidth>
            <AppLoader size="sm" tone="current" />

            <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Cargando router...
            </span>
          </AppInline>
        </AppCard>
      </PageTransitionCrm>
    );
  }

  /*
   * EDITAR: fallo cargando routers.
   */
  if (isEditMode && isError) {
    return (
      <PageTransitionCrm
        titleHeader="Editar router MikroTik"
        subtitle="No fue posible cargar la información solicitada."
        variant="fade-pure"
      >
        <AppEmptyState
          preset="error"
          title="No fue posible cargar el router"
          description="Ocurrió un problema consultando la infraestructura MikroTik."
          action={
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleBack}
            >
              Volver a routers
            </AppButton>
          }
        />
      </PageTransitionCrm>
    );
  }

  /*
   * EDITAR: terminó el request pero
   * el router no pertenece al listado
   * visible para la empresa.
   */
  if (isEditMode && !routerToEdit) {
    return (
      <PageTransitionCrm
        titleHeader="Editar router MikroTik"
        subtitle="El router solicitado no está disponible."
        variant="fade-pure"
      >
        <AppEmptyState
          preset="error"
          icon={<Router aria-hidden="true" />}
          title="Router no encontrado"
          description="El router no existe o no está disponible para la empresa actual."
          action={
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleBack}
            >
              Volver a routers
            </AppButton>
          }
        />
      </PageTransitionCrm>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader={pageTitle}
      subtitle={pageSubtitle}
      variant="fade-pure"
    >
      <AppStack gap="sm">
        <FormCreateRouter
          form={form}
          mode={isEditMode ? "edit" : "create"}
          isSaving={isSaving}
          onRequestSubmit={handleOpenConfirm}
          onCancel={handleBack}
        />
      </AppStack>

      <AppConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        preset={isEditMode ? "warning" : "confirm"}
        title={
          isEditMode
            ? "Actualizar router MikroTik"
            : "Registrar router MikroTik"
        }
        description={
          isEditMode
            ? `Se actualizará la configuración de "${routerToEdit?.nombre ?? "este router"}". Los cambios pueden afectar servicios asociados.`
            : "Se registrará el router con los datos y credenciales ingresados."
        }
        confirmText={isEditMode ? "Actualizar router" : "Registrar router"}
        loadingText={isEditMode ? "Actualizando..." : "Registrando..."}
        onConfirm={handleSave}
        isLoading={isSaving}
        disabled={!canSubmit}
        preventClose={isSaving}
        closeOnConfirm={false}
      />
    </PageTransitionCrm>
  );
}

export default RouterFormPage;
