import { useMemo } from "react";

import { Router, UserRound } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { toast } from "sonner";

import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";

import { useGetPerfilesHomologacionSeleccionables } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";

import { usePostCrearPrealtaPppoeCuenta } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import {
  PPPOE_PREALTA_FORM_DEFAULTS,
  type CrearPrealtaPppoeCuentaResponse,
  type PppoePrealtaFormValues,
} from "@/Crm/features/pppoe-cuentas/pppoe-prealta.interfaces";

import type { PerfilHomologacionSeleccionable } from "@/Crm/features/pppoe-homologaciones/intefaces";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type Props = {
  onCreated: (result: CrearPrealtaPppoeCuentaResponse) => void | Promise<void>;
};

const schema = z.object({
  clienteId: z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((value) => value !== null, {
      message: "Seleccione un cliente.",
    }),

  perfilHomologacionId: z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((value) => value !== null, {
      message: "Seleccione una homologación.",
    }),
});

function getHomologacionLabel(item: PerfilHomologacionSeleccionable) {
  return [
    item.codigoPerfil,
    item.servicioInternet.nombre,
    item.mikrotikRouter.nombre,
  ].join(" · ");
}

function getHomologacionDescription(item: PerfilHomologacionSeleccionable) {
  const velocidad =
    item.servicioInternet.velocidad || "Velocidad no registrada";

  return `${velocidad} · ${formattMonedaGT(item.servicioInternet.precio)}`;
}

export function PppoeCuentaCreateForm({ onCreated }: Props) {
  const clientesQuery = useGetCustomerToSelect();

  const homologacionesQuery = useGetPerfilesHomologacionSeleccionables();

  const mutation = usePostCrearPrealtaPppoeCuenta();

  const form = useForm<PppoePrealtaFormValues>({
    resolver: zodResolver(schema),

    defaultValues: PPPOE_PREALTA_FORM_DEFAULTS,

    mode: "onChange",
  });

  const clienteOptions = useMemo(
    () =>
      (clientesQuery.data ?? []).map((cliente) => ({
        value: cliente.id,

        label: cliente.nombre,

        description: `Cliente #${cliente.id}`,
      })),
    [clientesQuery.data],
  );

  const homologacionOptions = useMemo(
    () =>
      (homologacionesQuery.data ?? []).map((item) => ({
        value: item.id,

        label: getHomologacionLabel(item),

        description: getHomologacionDescription(item),

        meta: {
          codigoPerfil: item.codigoPerfil,

          mikrotikRouterId: item.mikrotikRouterId,

          servicioInternetId: item.servicioInternetId,
        },
      })),
    [homologacionesQuery.data],
  );

  const selectedPerfilId = form.watch("perfilHomologacionId");

  const selectedHomologacion = useMemo(
    () =>
      homologacionesQuery.data?.find((item) => item.id === selectedPerfilId) ??
      null,
    [homologacionesQuery.data, selectedPerfilId],
  );

  const isCatalogLoading =
    clientesQuery.isLoading || homologacionesQuery.isLoading;

  const catalogError = clientesQuery.error || homologacionesQuery.error;

  const handleSubmit: SubmitHandler<PppoePrealtaFormValues> = async (
    values,
  ) => {
    if (values.clienteId === null || values.perfilHomologacionId === null) {
      return;
    }

    const homologacion = homologacionesQuery.data?.find(
      (item) => item.id === values.perfilHomologacionId,
    );

    /**
     * Defensa contra un catálogo que haya cambiado
     * mientras el formulario estaba abierto.
     */
    if (!homologacion) {
      toast.error("La homologación seleccionada ya no está disponible.");

      await homologacionesQuery.refetch();

      form.setValue("perfilHomologacionId", null, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    try {
      const request = mutation.mutateAsync({
        clienteId: values.clienteId,

        servicioInternetId: homologacion.servicioInternetId,

        mikrotikRouterId: homologacion.mikrotikRouterId,
      });

      toast.promise(request, {
        loading: "Preparando cuenta PPPoE...",

        success: (response) =>
          response.creada
            ? "Prealta PPPoE creada"
            : "Se recuperó una prealta PPPoE existente",

        error: (error) => getApiErrorMessageAxios(error),
      });

      /**
       * Esperamos la promesa ORIGINAL.
       *
       * Esta sí tiene tipo:
       * CrearPrealtaPppoeCuentaResponse
       */
      const result = await request;

      await onCreated(result);
    } catch {
      // toast.promise ya presenta el error.
    }
  };

  return (
    <AppForm form={form} onSubmit={handleSubmit}>
      <AppStack gap="md">
        <AppAlert tone="info" title="Prealta administrativa" size="xs">
          Esta etapa prepara el acceso y la cuenta PPPoE, pero todavía no
          ejecuta comandos sobre el router MikroTik.
        </AppAlert>

        {catalogError ? (
          <AppAlert tone="danger" title="Catálogos no disponibles" size="xs">
            No fue posible cargar todos los datos necesarios para preparar la
            cuenta. Intente nuevamente.
          </AppAlert>
        ) : null}

        <AppCard variant="outline" size="sm" radius="md">
          <AppStack gap="md">
            <div>
              <AppInline align="center" gap="xs">
                <UserRound size={16} aria-hidden="true" />

                <h2 className="text-sm font-semibold">Cliente</h2>
              </AppInline>

              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                Seleccione el cliente existente al que se asignará la identidad
                PPPoE.
              </p>
            </div>

            <AppFormSingleSelect<PppoePrealtaFormValues, number>
              name="clienteId"
              label="Cliente"
              placeholder="Buscar cliente..."
              options={clienteOptions}
              isLoading={clientesQuery.isLoading}
              isDisabled={mutation.isPending}
              noOptionsText="No se encontraron clientes"
              loadingText="Cargando clientes..."
              isSearchable
              isClearable
              required
            />
          </AppStack>
        </AppCard>

        <AppCard variant="outline" size="sm" radius="md">
          <AppStack gap="md">
            <div>
              <AppInline align="center" gap="xs">
                <Router size={16} aria-hidden="true" />

                <h2 className="text-sm font-semibold">Homologación PPPoE</h2>
              </AppInline>

              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                La homologación define conjuntamente el plan de Internet, router
                MikroTik y perfil RouterOS.
              </p>
            </div>

            <AppFormSingleSelect<PppoePrealtaFormValues, number>
              name="perfilHomologacionId"
              label="Perfil homologado"
              placeholder="Buscar plan, perfil o router..."
              options={homologacionOptions}
              isLoading={homologacionesQuery.isLoading}
              isDisabled={mutation.isPending}
              noOptionsText="No existen homologaciones disponibles"
              loadingText="Cargando homologaciones..."
              isSearchable
              isClearable
              required
            />

            {selectedHomologacion ? (
              <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted)/0.25)] p-3">
                <AppGrid
                  cols={{
                    base: 1,
                    sm: 2,
                    lg: 4,
                  }}
                  gap="sm"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Perfil RouterOS
                    </p>

                    <p className="mt-0.5 text-xs font-semibold">
                      {selectedHomologacion.codigoPerfil}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Servicio
                    </p>

                    <p className="mt-0.5 text-xs font-semibold">
                      {selectedHomologacion.servicioInternet.nombre}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Velocidad
                    </p>

                    <p className="mt-0.5 text-xs font-semibold">
                      {selectedHomologacion.servicioInternet.velocidad ||
                        "Sin registrar"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Router
                    </p>

                    <p className="mt-0.5 text-xs font-semibold">
                      {selectedHomologacion.mikrotikRouter.nombre}
                    </p>
                  </div>
                </AppGrid>
              </div>
            ) : null}
          </AppStack>
        </AppCard>

        <AppInline justify="end" gap="xs" fullWidth>
          <AppFormSubmit<PppoePrealtaFormValues>
            size="sm"
            loadingText="Preparando..."
            disableWhenInvalid
            disabled={isCatalogLoading || Boolean(catalogError)}
          >
            Crear prealta PPPoE
          </AppFormSubmit>
        </AppInline>
      </AppStack>
    </AppForm>
  );
}
