import { useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useAppConfirmHandler } from "@/components/app/handlers";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import {
  useGetInstalacion,
  usePatchInstalacion,
} from "../CrmHooks/hooks/instalaciones/instalaciones-hook";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetTicketsSoporte } from "../CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "../features/instalaciones/enums";
import { InstalacionEditForm } from "./form/editar-instalacion";
import { ReplaceUnderlines } from "@/utils/replaceUnderlines";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  EDITAR_INSTALACION_DEFAULT_VALUES,
  EditarInstalacionFormValues,
  editarInstalacionSchema,
} from "../CrmHomologaciones/schema/editar-stalacion.schema";
import { toActualizarInstalacionPayload } from "../CrmHomologaciones/common/mapper-patch";
import { toEditarInstalacionFormValues } from "../CrmHomologaciones/common/editar-instalacion-mapper";
import { AppStack } from "@/components/app/primitives/app-stack";

export default function EditarInstalacionPage() {
  const params = useParams<{
    instalacionId?: string;
  }>();

  const instalacionId = Number(params.instalacionId);

  const validInstalacionId =
    Number.isInteger(instalacionId) && instalacionId > 0;

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  /*
   * =====================================================
   * CONSULTAS
   * =====================================================
   */

  const instalacionQuery = useGetInstalacion(instalacionId, empresaId);

  const { data: tecnicos = [], isLoading: isLoadingTecnicos } =
    useGetUsersToSelect();

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

  const patchInstalacion = usePatchInstalacion(instalacionId);

  /*
   * =====================================================
   * FORM
   * =====================================================
   */

  const form = useForm<EditarInstalacionFormValues>({
    resolver: zodResolver(editarInstalacionSchema),

    defaultValues: EDITAR_INSTALACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  /*
   * Evita que un refetch de TanStack Query mientras el
   * usuario escribe vuelva a hidratar el formulario y
   * borre cambios locales.
   */
  const hydratedInstallationId = useRef<number | null>(null);

  const detalle = instalacionQuery.data ?? null;

  useEffect(() => {
    if (!detalle) return;

    form.reset(toEditarInstalacionFormValues(detalle));
  }, [detalle, form]);

  /*
   * =====================================================
   * OPTIONS
   * =====================================================
   */

  const tecnicoOptions = useMemo(
    () =>
      tecnicos.map((tecnico) => ({
        value: tecnico.id,
        label: tecnico.nombre,
      })),
    [tecnicos],
  );

  const ticketOptions = useMemo(
    () =>
      tickets.data.map((ticket) => ({
        value: ticket.id,
        label: ticket.title,
      })),
    [tickets.data],
  );

  const tipoOptions = useMemo(
    () =>
      Object.values(TipoInstalacionCliente).map((value) => ({
        value,
        label: ReplaceUnderlines(value),
      })),
    [],
  );

  /*
   * =====================================================
   * REGLAS UI
   * =====================================================
   */

  const canEditPlanning =
    detalle?.estado === EstadoInstalacionCliente.PROGRAMADA ||
    detalle?.estado === EstadoInstalacionCliente.REPROGRAMADA;

  const isFinalizada =
    detalle?.estado === EstadoInstalacionCliente.COMPLETADA ||
    detalle?.estado === EstadoInstalacionCliente.CANCELADA ||
    detalle?.estado === EstadoInstalacionCliente.FALLIDA;

  /*
   * =====================================================
   * CONFIRM
   * =====================================================
   */

  const updateConfirm = useAppConfirmHandler<EditarInstalacionFormValues>();

  const onSubmit: SubmitHandler<EditarInstalacionFormValues> = useCallback(
    (values) => {
      if (!detalle) {
        return;
      }

      updateConfirm.open(values);
    },
    [detalle, updateConfirm.open],
  );

  const handleConfirmUpdate = useCallback(
    () =>
      updateConfirm.confirm(async (values) => {
        if (!detalle) {
          return;
        }

        const payload = toActualizarInstalacionPayload(values, detalle);

        console.log("El payload es: ", payload);

        await toast.promise(patchInstalacion.mutateAsync(payload), {
          loading: "Guardando cambios...",

          success: "Instalación actualizada",

          error: (error) => getApiErrorMessageAxios(error),
        });

        /*
         * Recuperamos el detalle completo porque el
         * PATCH puede devolver solamente la entidad
         * base y nosotros necesitamos relaciones,
         * especialmente técnicos.
         */
        const refreshed = await instalacionQuery.refetch();

        if (refreshed.data) {
          form.reset(toEditarInstalacionFormValues(refreshed.data));

          hydratedInstallationId.current = refreshed.data.id;
        }
      }),
    [detalle, form, instalacionQuery, patchInstalacion, updateConfirm.confirm],
  );

  if (!validInstalacionId) {
    return (
      <AppContainer size="md" paddingX="sm" paddingY="sm">
        <AppEmptyState
          title="Instalación inválida"
          description="El identificador de la instalación no es válido."
        />
      </AppContainer>
    );
  }

  // RENDER

  return (
    <PageTransitionCrm
      titleHeader={
        detalle ? `Editar instalación #${detalle.id}` : "Editar instalación"
      }
    >
      <AppContainer paddingX="sm" paddingY="sm">
        <AppStack gap="sm">
          <AppDataState
            isLoading={instalacionQuery.isLoading}
            isFetching={instalacionQuery.isFetching}
            error={instalacionQuery.error}
            isEmpty={!instalacionQuery.isLoading && !detalle}
            onRetry={() => instalacionQuery.refetch()}
            loadingVariant="skeleton-grid"
            emptyTitle="Instalación no encontrada"
            emptyDescription="No fue posible encontrar la instalación solicitada."
            variant="plain"
            size="sm"
            minHeight="lg"
          >
            {detalle ? (
              isFinalizada ? (
                <AppEmptyState
                  title="Instalación no editable"
                  description={`La instalación se encuentra en estado ${ReplaceUnderlines(
                    detalle.estado,
                  )}. Las instalaciones finalizadas requieren un flujo administrativo de corrección independiente.`}
                />
              ) : (
                <AppCard>
                  <InstalacionEditForm
                    form={form}
                    detalle={detalle}
                    onSubmit={onSubmit}
                    tipoOptions={tipoOptions}
                    ticketOptions={ticketOptions}
                    tecnicoOptions={tecnicoOptions}
                    isLoadingTickets={isLoadingTickets}
                    isLoadingTecnicos={isLoadingTecnicos}
                    canEditPlanning={canEditPlanning}
                  />
                </AppCard>
              )
            ) : null}
          </AppDataState>
        </AppStack>

        <AppConfirmDialog
          open={updateConfirm.isOpen}
          onOpenChange={updateConfirm.setOpen}
          preset="warning"
          title="Guardar cambios"
          description="Se actualizarán los datos de la instalación y, si fueron modificadas, sus asignaciones técnicas. ¿Desea continuar?"
          confirmText="Guardar cambios"
          cancelText="Cancelar"
          loadingText="Guardando..."
          isLoading={patchInstalacion.isPending}
          preventClose={patchInstalacion.isPending}
          onConfirm={handleConfirmUpdate}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}
