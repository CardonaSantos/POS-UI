import { useEffect, useMemo, useRef } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { AppFormSingleSelect } from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import type { ContextoCreacionDesinstalacionResponse } from "@/Crm/features/desinstalaciones/contexto-creacion.interfaces";

import { ReplaceUnderlines } from "@/utils/replaceUnderlines";
import { CrearDesinstalacionFormValues } from "../../schemas/crear-desinstalacion.schema";

type DesinstalacionClienteAccesoSectionProps = {
  contexto?: ContextoCreacionDesinstalacionResponse;

  clienteOptions: AppSelectOption<number>[];

  accesoOptions: AppSelectOption<number>[];

  ticketOptions: AppSelectOption<number>[];

  isLoadingClientes?: boolean;

  isLoadingContexto?: boolean;

  isErrorContexto?: boolean;

  onRetryContexto?: () => void;
};

const monedaFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",

  currency: "GTQ",

  minimumFractionDigits: 2,
});

export function DesinstalacionClienteAccesoSection({
  contexto,

  clienteOptions,
  accesoOptions,
  ticketOptions,

  isLoadingClientes = false,
  isLoadingContexto = false,
  isErrorContexto = false,

  onRetryContexto,
}: DesinstalacionClienteAccesoSectionProps) {
  const form = useFormContext<CrearDesinstalacionFormValues>();

  const clienteId = useWatch({
    control: form.control,

    name: "clienteId",
  });

  const accesoInternetId = useWatch({
    control: form.control,

    name: "accesoInternetId",
  });

  const ticketId = useWatch({
    control: form.control,

    name: "ticketId",
  });

  /**
   * Conservamos el cliente anterior únicamente para detectar
   * un cambio real realizado por el usuario.
   */
  const previousClienteId = useRef<number | null>(clienteId);

  /**
   * ============================================================
   * LIMPIEZA DE DEPENDENCIAS
   * ============================================================
   */

  useEffect(() => {
    const previous = previousClienteId.current;

    if (previous === clienteId) {
      return;
    }

    previousClienteId.current = clienteId;

    form.setValue("accesoInternetId", null, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });

    form.setValue("ticketId", null, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });

    form.clearErrors("accesoInternetId");
  }, [clienteId, form]);

  /**
   * ============================================================
   * NORMALIZACIÓN CUANDO LLEGA EL CONTEXTO
   * ============================================================
   */

  useEffect(() => {
    if (clienteId === null || !contexto || contexto.cliente.id !== clienteId) {
      return;
    }

    /**
     * ACCESS
     */

    const accesoActualExiste =
      accesoInternetId !== null &&
      contexto.accesos.some((acceso) => acceso.id === accesoInternetId);

    if (contexto.accesos.length === 0) {
      if (accesoInternetId !== null) {
        form.setValue("accesoInternetId", null, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
    } else if (contexto.accesos.length === 1) {
      const unicoAccesoId = contexto.accesos[0].id;

      if (accesoInternetId !== unicoAccesoId) {
        form.setValue("accesoInternetId", unicoAccesoId, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: true,
        });
      }
    } else if (accesoInternetId !== null && !accesoActualExiste) {
      form.setValue("accesoInternetId", null, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }

    /**
     * TICKET
     */

    if (ticketId !== null) {
      const ticketExiste = contexto.tickets.some(
        (ticket) => ticket.id === ticketId,
      );

      if (!ticketExiste) {
        form.setValue("ticketId", null, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    }
  }, [accesoInternetId, clienteId, contexto, form, ticketId]);

  /**
   * ============================================================
   * ACCESS SELECCIONADO
   * ============================================================
   */

  const accesoSeleccionado = useMemo(() => {
    if (!contexto || accesoInternetId === null) {
      return null;
    }

    return (
      contexto.accesos.find((acceso) => acceso.id === accesoInternetId) ?? null
    );
  }, [accesoInternetId, contexto]);

  const clienteSeleccionado = clienteId !== null;

  const contextoDisponible = contexto?.cliente.id === clienteId;

  const sinAccesos = contextoDisponible && contexto.accesos.length === 0;

  return (
    <section aria-labelledby="desinstalacion-cliente-title">
      <AppStack gap="sm">
        <div>
          <h2
            id="desinstalacion-cliente-title"
            className="text-base font-medium"
          >
            Cliente y servicio
          </h2>

          <p className="text-sm text-muted-foreground">
            Seleccione el cliente y el acceso de internet que será dado de baja.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppFormSingleSelect<CrearDesinstalacionFormValues, number>
            name="clienteId"
            label="Cliente"
            options={clienteOptions}
            placeholder="Seleccione un cliente"
            density="compact"
            isSearchable
            isLoading={isLoadingClientes}
            required
          />

          <AppFormSingleSelect<CrearDesinstalacionFormValues, number>
            name="accesoInternetId"
            label="Servicio a desinstalar"
            options={accesoOptions}
            placeholder={
              !clienteSeleccionado
                ? "Primero seleccione un cliente"
                : isLoadingContexto
                  ? "Cargando servicios..."
                  : sinAccesos
                    ? "Sin servicios disponibles"
                    : "Seleccione el servicio"
            }
            density="compact"
            isSearchable
            isLoading={isLoadingContexto}
            isDisabled={
              !clienteSeleccionado ||
              isLoadingContexto ||
              isErrorContexto ||
              sinAccesos
            }
            required
          />

          <AppFormSingleSelect<CrearDesinstalacionFormValues, number>
            name="ticketId"
            label="Ticket relacionado"
            options={ticketOptions}
            placeholder={
              !clienteSeleccionado
                ? "Primero seleccione un cliente"
                : ticketOptions.length === 0
                  ? "Sin tickets disponibles"
                  : "Sin ticket relacionado"
            }
            density="compact"
            isSearchable
            isClearable
            isLoading={isLoadingContexto}
            isDisabled={
              !clienteSeleccionado ||
              isLoadingContexto ||
              isErrorContexto ||
              ticketOptions.length === 0
            }
          />
        </AppGrid>

        {clienteSeleccionado && isErrorContexto ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 p-3"
          >
            <AppStack gap="sm">
              <div>
                <p className="text-sm font-medium text-destructive">
                  No fue posible cargar los servicios del cliente.
                </p>

                <p className="text-sm text-muted-foreground">
                  Vuelva a intentar antes de registrar la desinstalación.
                </p>
              </div>

              {onRetryContexto ? (
                <div>
                  <AppButton
                    type="button"
                    variant="secondary"
                    onClick={onRetryContexto}
                  >
                    Reintentar
                  </AppButton>
                </div>
              ) : null}
            </AppStack>
          </div>
        ) : null}

        {sinAccesos ? (
          <div
            role="status"
            className="rounded-md border border-border bg-muted/30 p-3"
          >
            <p className="text-sm font-medium">
              El cliente no tiene servicios disponibles para desinstalar.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No es posible registrar la operación hasta que exista un acceso
              válido asociado al cliente.
            </p>
          </div>
        ) : null}

        {contextoDisponible && contexto ? (
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <AppGrid
              cols={{
                base: 1,
                sm: 2,
                lg: 4,
              }}
              gap="sm"
            >
              <InfoItem
                label="Cliente"
                value={[contexto.cliente.nombre, contexto.cliente.apellidos]
                  .filter(Boolean)
                  .join(" ")}
              />

              <InfoItem
                label="Teléfono"
                value={contexto.cliente.telefono || "No registrado"}
              />

              <InfoItem
                label="Dirección"
                value={contexto.cliente.direccion || "No registrada"}
              />

              <InfoItem
                label="Accesos disponibles"
                value={String(contexto.accesos.length)}
              />
            </AppGrid>
          </div>
        ) : null}

        {accesoSeleccionado ? (
          <div className="rounded-md border border-border p-3">
            <AppStack gap="sm">
              <div>
                <p className="text-sm font-medium">Servicio seleccionado</p>

                <p className="text-xs text-muted-foreground">
                  Información actual del acceso. Estos datos son únicamente
                  informativos y no pueden modificarse desde esta operación.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  sm: 2,
                  lg: 4,
                }}
                gap="sm"
              >
                <InfoItem
                  label="Plan"
                  value={
                    accesoSeleccionado.servicioInternet?.nombre ?? "Sin plan"
                  }
                />

                <InfoItem
                  label="Precio"
                  value={
                    accesoSeleccionado.servicioInternet
                      ? monedaFormatter.format(
                          accesoSeleccionado.servicioInternet.precio,
                        )
                      : "No disponible"
                  }
                />

                <InfoItem
                  label="Tecnología"
                  value={ReplaceUnderlines(accesoSeleccionado.tecnologia)}
                />

                <InfoItem
                  label="Autenticación"
                  value={ReplaceUnderlines(
                    accesoSeleccionado.metodoAutenticacion,
                  )}
                />

                <InfoItem
                  label="Usuario PPPoE"
                  value={
                    accesoSeleccionado.cuentaPppoe?.usuario ??
                    "Sin cuenta PPPoE"
                  }
                />

                <InfoItem
                  label="Estado del acceso"
                  value={ReplaceUnderlines(accesoSeleccionado.estado)}
                />

                <InfoItem
                  label="Estado PPPoE"
                  value={
                    accesoSeleccionado.cuentaPppoe?.estado
                      ? ReplaceUnderlines(accesoSeleccionado.cuentaPppoe.estado)
                      : "Sin cuenta PPPoE"
                  }
                />

                <InfoItem label="Acceso" value={`#${accesoSeleccionado.id}`} />
              </AppGrid>

              {accesoSeleccionado.cuentaPppoe?.estado === "ERROR" ? (
                <div
                  role="status"
                  className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3"
                >
                  <p className="text-sm font-medium">
                    La cuenta PPPoE se encuentra en estado ERROR.
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    La solicitud puede registrarse, pero el estado deberá
                    considerarse durante la autorización y baja definitiva.
                  </p>
                </div>
              ) : null}
            </AppStack>
          </div>
        ) : null}
      </AppStack>
    </section>
  );
}

type InfoItemProps = {
  label: string;

  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="break-words text-sm font-medium">{value}</p>
    </div>
  );
}
