import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { toast } from "sonner";

import { useAppConfirmHandler } from "@/components/app/handlers";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { ReplaceUnderlines } from "@/utils/replaceUnderlines";

import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";

import { useGetUsersToSelect } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";

import {
  useCreateDesinstalacion,
  useGetContextoCreacionDesinstalacion,
} from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import {
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";
import {
  CREAR_DESINSTALACION_DEFAULT_VALUES,
  CrearDesinstalacionFormValues,
  crearDesinstalacionSchema,
} from "../../schemas/crear-desinstalacion.schema";
import { toCrearDesinstalacionPayload } from "../../common/crear-desinstalacion.mapper";
import { DesinstalacionCreateForm } from "../form/desinstalacion-create-form";
import { AppSelectOption } from "@/components/app/primitives/app-single-select";
import { useNavigate } from "react-router-dom";

function DesinstalacionCreatePage() {
  const navigate = useNavigate();
  /**
   * CATÁLOGOS
   */

  const { data: clientes = [], isLoading: isLoadingClientes } =
    useGetCustomerToSelect();

  const { data: tecnicos = [], isLoading: isLoadingTecnicos } =
    useGetUsersToSelect();

  /**
   * FORM
   */

  const form = useForm<CrearDesinstalacionFormValues>({
    resolver: zodResolver(crearDesinstalacionSchema),

    defaultValues: CREAR_DESINSTALACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  /**
   *  clienteId porque es la dependencia
   * que determina el contexto de creación.
   */
  const clienteId = useWatch({
    control: form.control,

    name: "clienteId",
  });

  /**
   * CONTEXTO DEPENDIENTE DEL CLIENTE
   */

  const {
    data: contexto,
    isLoading: isLoadingContexto,
    isFetching: isFetchingContexto,
    isError: isErrorContexto,
    refetch: refetchContexto,
  } = useGetContextoCreacionDesinstalacion(clienteId);

  /**
   * MUTATION
   */

  const createDesinstalacion = useCreateDesinstalacion();

  /**
   * OPTIONS
   */

  const clienteOptions = useMemo<AppSelectOption<number>[]>(
    () =>
      clientes.map((cliente) => ({
        value: cliente.id,

        label: cliente.nombre,
      })),
    [clientes],
  );

  const tecnicoOptions = useMemo<AppSelectOption<number>[]>(
    () =>
      tecnicos.map((tecnico) => ({
        value: tecnico.id,

        label: tecnico.nombre,
      })),
    [tecnicos],
  );

  const accesoOptions = useMemo<AppSelectOption<number>[]>(
    () =>
      contexto?.accesos.map((acceso) => {
        const servicio = acceso.servicioInternet?.nombre ?? "Sin plan asociado";

        const usuario = acceso.cuentaPppoe?.usuario ?? "Sin usuario";

        const estadoCuenta = acceso.cuentaPppoe?.estado ?? "Sin cuenta PPPoE";

        return {
          value: acceso.id,

          label:
            `${servicio} · ` +
            `${usuario} · ` +
            `${ReplaceUnderlines(estadoCuenta)}`,
        };
      }) ?? [],
    [contexto],
  );

  const ticketOptions = useMemo<AppSelectOption<number>[]>(
    () =>
      contexto?.tickets.map((ticket) => ({
        value: ticket.id,

        label: ticket.titulo?.trim() || `Ticket #${ticket.id}`,
      })) ?? [],
    [contexto],
  );

  const tipoOptions = useMemo<AppSelectOption<TipoDesinstalacionCliente>[]>(
    () =>
      Object.values(TipoDesinstalacionCliente).map((value) => ({
        value,

        label: ReplaceUnderlines(value),
      })),
    [],
  );

  const motivoOptions = useMemo<AppSelectOption<MotivoDesinstalacionCliente>[]>(
    () =>
      Object.values(MotivoDesinstalacionCliente).map((value) => ({
        value,

        label: ReplaceUnderlines(value),
      })),
    [],
  );

  /**
   * SUBMIT
   */

  const createConfirm = useAppConfirmHandler<CrearDesinstalacionFormValues>();

  const onSubmit: SubmitHandler<CrearDesinstalacionFormValues> = (values) => {
    /**
     * Protección adicional.
     *
     * Zod ya valida accesoInternetId, pero aquí verificamos
     * también que siga existiendo en el contexto actualmente
     * cargado.
     */
    const accesoExiste =
      contexto?.accesos.some(
        (acceso) => acceso.id === values.accesoInternetId,
      ) ?? false;

    if (!accesoExiste) {
      form.setError("accesoInternetId", {
        type: "manual",

        message:
          "El servicio seleccionado ya no está disponible. Seleccione nuevamente el cliente.",
      });

      return;
    }

    form.clearErrors("accesoInternetId");

    createConfirm.open(values);
  };

  const handleConfirmCreate = () =>
    createConfirm.confirm(async (values) => {
      const payload = toCrearDesinstalacionPayload(values);

      await toast.promise(createDesinstalacion.mutateAsync(payload), {
        loading: "Registrando desinstalación...",

        error: (error) => getApiErrorMessageAxios(error),

        success: (response) => {
          form.reset(CREAR_DESINSTALACION_DEFAULT_VALUES);

          navigate(`/crm/desinstalacion/${response.id}`);

          return "Desinstalación registrada";
        },
      });
    });

  return (
    <PageTransitionCrm
      titleHeader="Registrar desinstalación"
      variant="fade-pure"
    >
      <AppContainer>
        <AppStack gap="md">
          <AppCard>
            <DesinstalacionCreateForm
              form={form}
              onSubmit={onSubmit}
              contexto={contexto}
              clienteOptions={clienteOptions}
              accesoOptions={accesoOptions}
              ticketOptions={ticketOptions}
              tecnicoOptions={tecnicoOptions}
              tipoOptions={tipoOptions}
              motivoOptions={motivoOptions}
              isLoadingClientes={isLoadingClientes}
              isLoadingTecnicos={isLoadingTecnicos}
              isLoadingContexto={isLoadingContexto || isFetchingContexto}
              isErrorContexto={isErrorContexto}
              onRetryContexto={() => {
                void refetchContexto();
              }}
            />
          </AppCard>
        </AppStack>

        <AppConfirmDialog
          open={createConfirm.isOpen}
          onOpenChange={createConfirm.setOpen}
          preset="warning"
          title="Crear desinstalación"
          description="Se registrará una desinstalación para el cliente y servicio seleccionados. El servicio no será dado de baja en este momento; la baja definitiva ocurrirá posteriormente cuando la solicitud sea autorizada. ¿Desea continuar?"
          confirmText="Crear desinstalación"
          cancelText="Cancelar"
          loadingText="Creando desinstalación..."
          isLoading={createDesinstalacion.isPending}
          preventClose={createDesinstalacion.isPending}
          onConfirm={handleConfirmCreate}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default DesinstalacionCreatePage;
