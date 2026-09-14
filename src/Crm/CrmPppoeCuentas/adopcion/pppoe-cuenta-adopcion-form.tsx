import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  KeyRound,
  Network,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { toast } from "sonner";

import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";

import { useGetPerfilesHomologacionSeleccionables } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";

import {
  usePostAdoptarCuentaPppoe,
  usePostVerificarAdopcionPppoe,
} from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-adopcion-hook";

import type { PerfilHomologacionSeleccionable } from "@/Crm/features/pppoe-homologaciones/intefaces";

import {
  PPPOE_ADOPCION_FORM_DEFAULTS,
  type AdoptarCuentaPppoeResponse,
  type PppoeAdopcionFormValues,
  type PppoeAdopcionPayload,
  type VerificarAdopcionPppoeResponse,
} from "@/Crm/features/pppoe-cuentas/pppoe-adopcion.interfaces";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type Props = {
  onAdopted: (result: AdoptarCuentaPppoeResponse) => void | Promise<void>;
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

  usuarioPppoe: z
    .string()
    .min(1, "Ingrese el usuario PPPoE.")
    .max(128, "El usuario no puede superar 128 caracteres.")
    .regex(/^\S+$/, {
      message: "El usuario PPPoE no puede contener espacios.",
    }),

  /**
   * No usar trim().
   *
   * La contraseña debe enviarse exactamente
   * como está registrada en MikroTik.
   */
  passwordPppoe: z
    .string()
    .min(1, "Ingrese la contraseña PPPoE.")
    .max(512, "La contraseña no puede superar 512 caracteres."),
});

function getHomologacionLabel(item: PerfilHomologacionSeleccionable): string {
  return [
    item.codigoPerfil,
    item.servicioInternet.nombre,
    item.mikrotikRouter.nombre,
  ].join(" · ");
}

function getHomologacionDescription(
  item: PerfilHomologacionSeleccionable,
): string {
  const velocidad =
    item.servicioInternet.velocidad || "Velocidad no registrada";

  return `${velocidad} · ${formattMonedaGT(item.servicioInternet.precio)}`;
}

function buildPayload(
  values: PppoeAdopcionFormValues,
): PppoeAdopcionPayload | null {
  if (values.clienteId === null || values.perfilHomologacionId === null) {
    return null;
  }

  return {
    clienteId: values.clienteId,

    perfilHomologacionId: values.perfilHomologacionId,

    usuarioPppoe: values.usuarioPppoe,

    /**
     * Se conserva exactamente.
     */
    passwordPppoe: values.passwordPppoe,
  };
}

function BooleanStatus({
  value,
  yesLabel,
  noLabel,
}: {
  value: boolean | null;
  yesLabel: string;
  noLabel: string;
}) {
  if (value === null) {
    return (
      <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
        Sin confirmar
      </AppBadge>
    );
  }

  return (
    <AppBadge
      tone={value ? "success" : "danger"}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {value ? yesLabel : noLabel}
    </AppBadge>
  );
}

export function PppoeCuentaAdopcionForm({ onAdopted }: Props) {
  const clientesQuery = useGetCustomerToSelect();

  const homologacionesQuery = useGetPerfilesHomologacionSeleccionables();

  const verificarMutation = usePostVerificarAdopcionPppoe();

  const adoptarMutation = usePostAdoptarCuentaPppoe();

  const [verification, setVerification] =
    useState<VerificarAdopcionPppoeResponse | null>(null);

  const form = useForm<PppoeAdopcionFormValues>({
    resolver: zodResolver(schema),

    defaultValues: PPPOE_ADOPCION_FORM_DEFAULTS,

    /**
     * El botón de verificación responde al
     * estado real del formulario mientras se edita.
     */
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

  const clienteId = form.watch("clienteId");

  const usuarioPppoe = form.watch("usuarioPppoe");

  const passwordPppoe = form.watch("passwordPppoe");

  const selectedHomologacion = useMemo(
    () =>
      homologacionesQuery.data?.find((item) => item.id === selectedPerfilId) ??
      null,
    [homologacionesQuery.data, selectedPerfilId],
  );

  /**
   * Una verificación solo sirve para los valores
   * exactos que fueron comprobados.
   *
   * Si cambia cliente, homologación, usuario o
   * contraseña, obligamos a verificar otra vez.
   */
  useEffect(() => {
    setVerification(null);
  }, [clienteId, selectedPerfilId, usuarioPppoe, passwordPppoe]);

  const catalogError = clientesQuery.error || homologacionesQuery.error;

  const isCatalogLoading =
    clientesQuery.isLoading || homologacionesQuery.isLoading;

  const isBusy = verificarMutation.isPending || adoptarMutation.isPending;

  /**
   * Primer submit:
   *
   * verifica, pero NO adopta.
   */
  const handleVerify: SubmitHandler<PppoeAdopcionFormValues> = async (
    values,
  ) => {
    const payload = buildPayload(values);

    if (!payload) {
      return;
    }

    try {
      const result = await verificarMutation.mutateAsync(payload);

      setVerification(result);

      if (result.puedeAdoptar) {
        toast.success("Cuenta verificada correctamente.");
      }
    } catch (error) {
      setVerification(null);

      toast.error(getApiErrorMessageAxios(error));
    }
  };

  /**
   * Segundo paso:
   *
   * solo se permite después de una verificación
   * favorable.
   *
   * El backend vuelve a comprobar MikroTik antes
   * de guardar, por lo que esta validación visual
   * no sustituye la seguridad del servidor.
   */
  const handleAdopt: SubmitHandler<PppoeAdopcionFormValues> = async (
    values,
  ) => {
    if (!verification?.puedeAdoptar) {
      return;
    }

    const payload = buildPayload(values);

    if (!payload) {
      return;
    }

    try {
      const result = await adoptarMutation.mutateAsync(payload);

      toast.success("Cuenta PPPoE adoptada.");

      await onAdopted(result);
    } catch (error) {
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  return (
    <AppForm form={form} onSubmit={handleVerify}>
      <AppStack gap="md">
        {catalogError ? (
          <AppAlert
            tone="danger"
            title="No se pudieron cargar los datos"
            size="xs"
          >
            Intente nuevamente antes de continuar.
          </AppAlert>
        ) : null}

        {/* ======================================== */}
        {/* CLIENTE + HOMOLOGACIÓN                  */}
        {/* ======================================== */}

        <AppCard variant="outline" size="sm" radius="md" className="p-2">
          <AppStack gap="md">
            <div>
              <AppInline align="center" gap="xs">
                <UserRound size={16} aria-hidden="true" />

                <h2 className="text-sm font-semibold">Cuenta a vincular</h2>
              </AppInline>

              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                Seleccione el cliente y el perfil que corresponden al secret
                existente.
              </p>
            </div>

            <AppGrid
              cols={{
                base: 1,
                lg: 2,
              }}
              gap="md"
            >
              <AppFormSingleSelect<PppoeAdopcionFormValues, number>
                name="clienteId"
                label="Cliente"
                placeholder="Buscar cliente..."
                options={clienteOptions}
                isLoading={clientesQuery.isLoading}
                isDisabled={isBusy}
                noOptionsText="No se encontraron clientes"
                loadingText="Cargando clientes..."
                isSearchable
                isClearable
                required
              />

              <AppFormSingleSelect<PppoeAdopcionFormValues, number>
                name="perfilHomologacionId"
                label="Perfil homologado"
                placeholder="Buscar perfil o router..."
                options={homologacionOptions}
                isLoading={homologacionesQuery.isLoading}
                isDisabled={isBusy}
                noOptionsText="No existen homologaciones disponibles"
                loadingText="Cargando homologaciones..."
                isSearchable
                isClearable
                required
              />
            </AppGrid>

            {selectedHomologacion ? (
              <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted)/0.25)] p-3">
                <AppGrid
                  cols={{
                    base: 2,
                    lg: 4,
                  }}
                  gap="sm"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Perfil
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

        {/* ======================================== */}
        {/* CREDENCIALES EXISTENTES                 */}
        {/* ======================================== */}

        <AppCard variant="outline" size="sm" radius="md" className="p-2">
          <AppStack gap="md">
            <div>
              <AppInline align="center" gap="xs">
                <KeyRound size={16} aria-hidden="true" />

                <h2 className="text-sm font-semibold">
                  Credenciales existentes
                </h2>
              </AppInline>

              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                Ingrese el usuario y la contraseña que ya están configurados en
                MikroTik.
              </p>
            </div>

            <AppGrid
              cols={{
                base: 1,
                md: 2,
              }}
              gap="md"
            >
              <AppFormInput<PppoeAdopcionFormValues>
                name="usuarioPppoe"
                label="Usuario PPPoE"
                placeholder="Ej. cliente-001"
                leftIcon={<Network size={14} aria-hidden="true" />}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isBusy}
                maxLength={128}
                required
              />

              <AppFormInput<PppoeAdopcionFormValues>
                name="passwordPppoe"
                label="Contraseña PPPoE"
                type="password"
                placeholder="Contraseña del secret"
                leftIcon={<KeyRound size={14} aria-hidden="true" />}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isBusy}
                maxLength={512}
                required
              />
            </AppGrid>
          </AppStack>
        </AppCard>

        {/* ======================================== */}
        {/* RESULTADO DE VERIFICACIÓN               */}
        {/* ======================================== */}

        {verification ? (
          <AppCard variant="outline" size="sm" radius="md" className="p-2">
            <AppStack gap="md">
              <div>
                <AppInline align="center" gap="xs" wrap>
                  <ShieldCheck size={16} aria-hidden="true" />

                  <h2 className="text-sm font-semibold">Verificación</h2>

                  <AppBadge
                    tone={verification.puedeAdoptar ? "success" : "danger"}
                    appearance="soft"
                    size="xs"
                    radius="full"
                  >
                    {verification.puedeAdoptar
                      ? "Lista para adoptar"
                      : "No válida"}
                  </AppBadge>
                </AppInline>
              </div>

              <AppGrid
                cols={{
                  base: 2,
                  md: 3,
                }}
                gap="sm"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Secret
                  </p>

                  <div className="mt-1">
                    <BooleanStatus
                      value={verification.encontrado}
                      yesLabel="Encontrado"
                      noLabel="No encontrado"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Contraseña
                  </p>

                  <div className="mt-1">
                    <BooleanStatus
                      value={verification.passwordCoincide}
                      yesLabel="Coincide"
                      noLabel="No coincide"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Perfil
                  </p>

                  <div className="mt-1">
                    <BooleanStatus
                      value={verification.perfilCoincide}
                      yesLabel="Coincide"
                      noLabel="No coincide"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Perfil remoto
                  </p>

                  <p className="mt-1 text-xs font-semibold">
                    {verification.perfilEncontrado ?? "Sin registrar"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Service
                  </p>

                  <p className="mt-1 text-xs font-semibold">
                    {verification.servicioEncontrado ?? "Sin registrar"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                    Estado remoto
                  </p>

                  {verification.estadoRemoto ? (
                    <div className="mt-1">
                      <AppBadge
                        tone={
                          verification.estadoRemoto === "ACTIVA"
                            ? "success"
                            : "warning"
                        }
                        appearance="soft"
                        size="xs"
                        radius="full"
                      >
                        {verification.estadoRemoto}
                      </AppBadge>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                      Sin confirmar
                    </p>
                  )}
                </div>
              </AppGrid>

              {verification.advertencias.map((advertencia) => (
                <AppAlert
                  key={advertencia}
                  tone="warning"
                  size="xs"
                  title="Advertencia"
                >
                  {advertencia}
                </AppAlert>
              ))}

              {verification.puedeAdoptar ? (
                <AppAlert tone="success" title="Cuenta verificada" size="xs">
                  Los datos coinciden con el secret existente en MikroTik.
                </AppAlert>
              ) : (
                <AppAlert tone="danger" title="No se puede adoptar" size="xs">
                  Revise los datos indicados antes de continuar.
                </AppAlert>
              )}
            </AppStack>
          </AppCard>
        ) : null}

        {/* ======================================== */}
        {/* ACCIONES                                */}
        {/* ======================================== */}

        <AppInline justify="end" gap="xs" wrap fullWidth>
          <AppFormSubmit<PppoeAdopcionFormValues>
            variant="outline"
            size="sm"
            loadingText="Verificando..."
            disableWhenInvalid
            disabled={
              isCatalogLoading ||
              Boolean(catalogError) ||
              adoptarMutation.isPending
            }
          >
            Verificar cuenta
          </AppFormSubmit>

          {verification?.puedeAdoptar ? (
            <AppButton
              type="button"
              size="sm"
              leftIcon={<CheckCircle2 size={14} aria-hidden="true" />}
              loading={adoptarMutation.isPending}
              loadingText="Adoptando..."
              disabled={isBusy || !verification.puedeAdoptar}
              onClick={() => {
                void form.handleSubmit(handleAdopt)();
              }}
            >
              Adoptar cuenta
            </AppButton>
          ) : null}
        </AppInline>
      </AppStack>
    </AppForm>
  );
}
