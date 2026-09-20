import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppConfirmHandler } from "@/components/app/handlers";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "../CrmHooks/hooks/Client/useGetClient";
import { useCreateInstalacion } from "../CrmHooks/hooks/instalaciones/instalaciones-hook";

import {
  EstadoInstalacionCliente,
  EstadoResultadoPrealtaPppoe,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
  TipoInstalacionCliente,
} from "../features/instalaciones/enums";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppCard } from "@/components/app/primitives/app-card";
import { InstalacionCreateForm } from "./form/crear-instalaciones";
import { useGetServiciosWifi } from "../CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";
import { useGetTicketsSoporte } from "../CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { ReplaceUnderlines } from "@/utils/replaceUnderlines";
import {
  CREAR_INSTALACION_DEFAULT_VALUES,
  CrearInstalacionFormValues,
  crearInstalacionSchema,
} from "../CrmHomologaciones/schema/schema";
import { toCrearInstalacionPayload } from "./common/crear-instalaciones.mapper";
import { useGetHomologacionesSelect } from "../CrmHooks/hooks/pppoe-homologaciones/pppoe-perfil-homologaciones";
import { useNavigate } from "react-router-dom";

function InstalacionesMainPage() {
  const navigate = useNavigate();
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const { data: tecnicos = [], isLoading: isLoadingTecnicos } =
    useGetUsersToSelect();

  const { data: clientes = [], isLoading: isLoadingClientes } =
    useGetCustomerToSelect();

  const { data: servicios = [], isLoading: isLoadingServicios } =
    useGetServiciosWifi();

  const { data: homologacionOptions = [], isLoading: isLoadingHomologaciones } =
    useGetHomologacionesSelect();
  const {
    data: tickets = {
      data: [],
      meta: {
        hasNextPage: 1,
        hasPrevPage: 1,
        limit: 1,
        page: 1,
        total: 1,
        totalPages: 1,
      },
      ticketsData: {
        ticketEnProceso: 0,
        ticketsDisponibles: 0,
        ticketsResueltos: 0,
      },
    },
    isLoading: isLoadingTickets,
  } = useGetTicketsSoporte({});

  const createInstalacion = useCreateInstalacion();

  /*
   * Form
   */

  const form = useForm<CrearInstalacionFormValues>({
    resolver: zodResolver(crearInstalacionSchema),

    defaultValues: CREAR_INSTALACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  /*
   * Options
   */

  const clienteOptions = useMemo(
    () =>
      clientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.nombre,
      })),
    [clientes],
  );

  const tecnicoOptions = useMemo(
    () =>
      tecnicos.map((tecnico) => ({
        value: tecnico.id,
        label: tecnico.nombre,
      })),
    [tecnicos],
  );

  const servicioOptions = useMemo(
    () =>
      servicios.map((servicio) => ({
        value: servicio.id,
        label: servicio.nombre,
      })),
    [servicios],
  );

  const ticketOptions = useMemo(
    () =>
      tickets?.data.map((ticket) => ({
        value: ticket.id,
        label: ticket.title,
      })),
    [tickets],
  );

  const tipoOptions = useMemo(
    () =>
      Object.values(TipoInstalacionCliente).map((value) => ({
        value,
        label: ReplaceUnderlines(value),
      })),
    [],
  );

  const estadoOptions = useMemo(
    () =>
      Object.values(EstadoInstalacionCliente).map((value) => ({
        value,
        label: ReplaceUnderlines(value),
      })),
    [],
  );

  const tecnologiaOptions = useMemo(
    () =>
      Object.values(TecnologiaAccesoInternet).map((value) => ({
        value,
        label: ReplaceUnderlines(value),
      })),
    [],
  );

  const metodoAutenticacionOptions = useMemo(
    () =>
      Object.values(MetodoAutenticacionInternet).map((value) => ({
        value,
        label: ReplaceUnderlines(value),
      })),
    [],
  );

  /*
   * Submit
   */

  const resolveHomologacionSeleccionada = (
    values: CrearInstalacionFormValues,
  ) => {
    const perfilHomologacionId = values.acceso.perfilHomologacionId;

    if (perfilHomologacionId === null) {
      return null;
    }

    const option = homologacionOptions.find(
      (item) => item.value === perfilHomologacionId,
    );

    if (!option?.meta) {
      return null;
    }

    return {
      id: option.value,
      ...option.meta,
    };
  };

  const createConfirm = useAppConfirmHandler<CrearInstalacionFormValues>();

  const onSubmit: SubmitHandler<CrearInstalacionFormValues> = (values) => {
    const requierePrealtaPppoe =
      values.acceso.tecnologia === TecnologiaAccesoInternet.FIBRA_GPON &&
      values.acceso.metodoAutenticacion === MetodoAutenticacionInternet.PPPOE;

    const homologacionSeleccionada = resolveHomologacionSeleccionada(values);

    if (requierePrealtaPppoe && !homologacionSeleccionada) {
      form.setError("acceso.perfilHomologacionId", {
        type: "manual",
        message:
          "La homologación seleccionada ya no está disponible. Selecciónela nuevamente.",
      });

      return;
    }

    form.clearErrors("acceso.perfilHomologacionId");

    createConfirm.open(values);
  };

  const handleConfirmCreate = () =>
    createConfirm.confirm(async (values) => {
      const homologacionSeleccionada = resolveHomologacionSeleccionada(values);

      const payload = toCrearInstalacionPayload(values, {
        empresaId,
        homologacionSeleccionada,
      });

      await toast.promise(createInstalacion.mutateAsync(payload), {
        loading: "Registrando instalación...",

        error: (error) => getApiErrorMessageAxios(error),

        success: (response) => {
          form.reset(CREAR_INSTALACION_DEFAULT_VALUES);

          navigate(`/crm/instalacion/${response.instalacion.id}`);

          return response.prealtaPppoe.estado ===
            EstadoResultadoPrealtaPppoe.FALLIDA
            ? "Instalación creada; la prealta PPPoE quedó pendiente de reintento"
            : "Instalación registrada";
        },
      });
    });

  return (
    <PageTransitionCrm titleHeader="Registrar instalación" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppCard size="sm">
            <InstalacionCreateForm
              estadoOptions={estadoOptions}
              form={form}
              onSubmit={onSubmit}
              clienteOptions={clienteOptions}
              servicioOptions={servicioOptions}
              ticketOptions={ticketOptions}
              tecnicoOptions={tecnicoOptions}
              tipoOptions={tipoOptions}
              tecnologiaOptions={tecnologiaOptions}
              metodoAutenticacionOptions={metodoAutenticacionOptions}
              homologacionOptions={homologacionOptions}
              isLoadingClientes={isLoadingClientes}
              isLoadingServicios={isLoadingServicios}
              isLoadingTickets={isLoadingTickets}
              isLoadingTecnicos={isLoadingTecnicos}
              isLoadingHomologaciones={isLoadingHomologaciones}
            />
          </AppCard>
        </AppStack>

        <AppConfirmDialog
          open={createConfirm.isOpen}
          onOpenChange={createConfirm.setOpen}
          preset="warning"
          title="Crear nueva instalación"
          description="Se registrará una nueva instalación para este cliente con los datos ingresados. Algunos datos podrían no poder modificarse posteriormente. ¿Desea continuar?"
          confirmText="Crear instalación"
          cancelText="Cancelar"
          loadingText="Creando instalación..."
          isLoading={createInstalacion.isPending}
          preventClose={createInstalacion.isPending}
          onConfirm={handleConfirmCreate}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default InstalacionesMainPage;
