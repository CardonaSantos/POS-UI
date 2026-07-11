import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import {
  useAppConfirmHandler,
  useAppFormHandlers,
} from "@/components/app/handlers";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "../CrmHooks/hooks/Client/useGetClient";
import { useCreateInstalacion } from "../CrmHooks/hooks/instalaciones/instalaciones-hook";
import {
  CREAR_INSTALACION_DEFAULT_VALUES,
  CrearInstalacionFormValues,
  crearInstalacionSchema,
} from "./crear-instalaciones/zod.schema";
import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "../features/instalaciones/enums";
import { toCrearInstalacionPayload } from "./crear-instalaciones/crear-instalaciones.mapper";
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

function InstalacionesMainPage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const creadoPorId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const { data: tecnicos = [], isLoading: isLoadingTecnicos } =
    useGetUsersToSelect();

  const { data: clientes = [], isLoading: isLoadingClientes } =
    useGetCustomerToSelect();

  const { data: servicios = [], isLoading: isLoadingServicios } =
    useGetServiciosWifi();

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

  const { setField, reset } = useAppFormHandlers(form);

  /*
   * Técnicos seleccionados
   */

  const tecnicoIds =
    useWatch({
      control: form.control,
      name: "tecnicoIds",
    }) ?? [];

  const tecnicoResponsableId = useWatch({
    control: form.control,
    name: "tecnicoResponsableId",
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

  const tecnicoResponsableOptions = useMemo(() => {
    const selectedIds = new Set(tecnicoIds);

    return tecnicoOptions.filter((option) => selectedIds.has(option.value));
  }, [tecnicoIds, tecnicoOptions]);

  const tipoOptions = useMemo(
    () =>
      Object.values(TipoInstalacionCliente).map((value) => ({
        value,
        label: value,
      })),
    [],
  );

  const estadoOptions = useMemo(
    () =>
      Object.values(EstadoInstalacionCliente).map((value) => ({
        value,
        label: value,
      })),
    [],
  );

  useEffect(() => {
    if (tecnicoResponsableId === null) {
      return;
    }

    if (!tecnicoIds.includes(tecnicoResponsableId)) {
      setField("tecnicoResponsableId", null, {
        shouldValidate: true,
      });
    }
  }, [tecnicoIds, tecnicoResponsableId, setField]);

  /*
   * Submit
   */

  const createConfirm = useAppConfirmHandler<CrearInstalacionFormValues>();

  const onSubmit: SubmitHandler<CrearInstalacionFormValues> = (values) => {
    createConfirm.open(values);
  };

  const handleConfirmCreate = () =>
    createConfirm.confirm(async (values) => {
      const payload = toCrearInstalacionPayload(values, {
        empresaId,
        creadoPorId,
      });

      const mutationPromise = createInstalacion.mutateAsync(payload);

      await toast.promise(mutationPromise, {
        loading: "Registrando instalación...",

        error: (error) => getApiErrorMessageAxios(error),

        success: () => {
          reset(CREAR_INSTALACION_DEFAULT_VALUES);

          return "Instalación registrada";
        },
      });
    });

  return (
    <AppContainer size="xl" paddingX="sm" paddingY="sm">
      <AppStack gap="md">
        <div>
          <h1 className="text-xl font-semibold">Nueva instalación</h1>

          <p className="text-sm">
            Registre la instalación, su programación, ubicación, técnicos y
            costos.
          </p>
        </div>

        <AppCard size="sm">
          <InstalacionCreateForm
            form={form}
            onSubmit={onSubmit}
            clienteOptions={clienteOptions}
            servicioOptions={servicioOptions}
            ticketOptions={ticketOptions}
            tecnicoOptions={tecnicoOptions}
            tecnicoResponsableOptions={tecnicoResponsableOptions}
            tipoOptions={tipoOptions}
            estadoOptions={estadoOptions}
            isLoadingClientes={isLoadingClientes}
            isLoadingServicios={isLoadingServicios}
            isLoadingTickets={isLoadingTickets}
            isLoadingTecnicos={isLoadingTecnicos}
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
        onConfirm={handleConfirmCreate}
      />
    </AppContainer>
  );
}

export default InstalacionesMainPage;
