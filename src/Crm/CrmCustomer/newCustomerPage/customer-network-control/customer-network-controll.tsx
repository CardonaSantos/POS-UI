"use client";

import * as React from "react";
import {
  Network,
  Power,
  PowerOff,
  Router,
  ShieldCheck,
  Signal,
} from "lucide-react";
import { toast } from "sonner";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import {
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
import { suspendCustomerDto } from "@/Crm/features/mikrotik-actions-interfaces/mikrotik-actions.dto";
import {
  useMikrotikActivar,
  useMikrotikSuspend,
} from "@/Crm/CrmHooks/hooks/mikrotik-actions/useMikrotikActions";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

interface CustomerNetworkControlProps {
  cliente: ClienteDetailsDto;
}

type NextAction = "SUSPENDER" | "ACTIVAR" | null;

function getEstadoTone(estado?: string | null) {
  switch (estado) {
    case "ACTIVO":
      return "success";
    case "SUSPENDIDO":
      return "danger";
    case "PENDIENTE_APLICAR":
      return "warning";
    case "ERROR":
      return "danger";
    case "SIN_MIKROTIK":
      return "neutral";
    default:
      return "neutral";
  }
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2">
      <AppInline gap="xs" align="center" className="mb-1">
        {icon ? (
          <span className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {icon}
          </span>
        ) : null}

        <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </AppInline>

      <div className="min-w-0 break-words text-xs font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value || (
          <span className="italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            No asignado
          </span>
        )}
      </div>
    </div>
  );
}

function getStatusIcon({
  hasMikrotik,
  isPendiente,
  isError,
  isActivo,
}: {
  hasMikrotik: boolean;
  isPendiente: boolean;
  isError: boolean;
  isActivo: boolean;
}) {
  if (!hasMikrotik) {
    return (
      <Router
        size={15}
        className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />
    );
  }

  if (isPendiente) {
    return (
      <Power
        size={15}
        className="animate-pulse text-[hsl(var(--app-warning))]"
      />
    );
  }

  if (isError) {
    return <PowerOff size={15} className="text-[hsl(var(--app-danger))]" />;
  }

  if (isActivo) {
    return <Power size={15} className="text-[hsl(var(--app-success))]" />;
  }

  return <PowerOff size={15} className="text-[hsl(var(--app-danger))]" />;
}

function getStatusLabel({
  isSinMk,
  isPendiente,
  isError,
  isActivo,
}: {
  isSinMk: boolean;
  isPendiente: boolean;
  isError: boolean;
  isActivo: boolean;
}) {
  if (isSinMk) return "Sin MikroTik asignado";
  if (isPendiente) return "Aplicando cambios";
  if (isError) return "Error de sincronización";
  if (isActivo) return "Servicio activo";
  return "Servicio suspendido";
}

function getNextAction({
  isActivo,
  isSuspendido,
  isPendiente,
}: {
  isActivo: boolean;
  isSuspendido: boolean;
  isPendiente: boolean;
}): NextAction {
  if (isActivo) return "SUSPENDER";
  if (isSuspendido) return "ACTIVAR";
  if (isPendiente) return "ACTIVAR";

  return null;
}

function CustomerNetworkControl({ cliente }: CustomerNetworkControlProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const confirmDialog = useAppDisclosure();

  const form = useAppStateHandlers({
    password: "",
  });

  const suspendCustomer = useMikrotikSuspend(cliente.id);
  const activateCustomer = useMikrotikActivar(cliente.id);

  const estadoMk = cliente.estadoServicioMikrotik;

  const hasMikrotik = Boolean(cliente.mikrotik);
  const hasIp = Boolean(cliente.IP?.direccion);

  const isActivo = estadoMk === "ACTIVO";
  const isSuspendido = estadoMk === "SUSPENDIDO";
  const isPendiente = estadoMk === "PENDIENTE_APLICAR";
  const isError = estadoMk === "ERROR";
  const isSinMk = estadoMk === "SIN_MIKROTIK";

  const isActionPending =
    suspendCustomer.isPending || activateCustomer.isPending;

  const nextAction = getNextAction({
    isActivo,
    isSuspendido,
    isPendiente,
  });

  const statusLabel = getStatusLabel({
    isSinMk,
    isPendiente,
    isError,
    isActivo,
  });

  const statusIcon = getStatusIcon({
    hasMikrotik,
    isPendiente,
    isError,
    isActivo,
  });

  const canToggle =
    hasMikrotik && hasIp && !isSinMk && Boolean(nextAction) && !isActionPending;

  const dialogTitle =
    nextAction === "SUSPENDER"
      ? "Suspensión de servicio"
      : nextAction === "ACTIVAR"
        ? "Activación de servicio"
        : "Acción no disponible";

  const dialogDescription =
    nextAction === "SUSPENDER"
      ? "¿Está seguro de suspender el servicio de este cliente?"
      : nextAction === "ACTIVAR"
        ? "¿Está seguro de activar el servicio de este cliente?"
        : "El estado actual no permite aplicar cambios en MikroTik.";

  const loadingText =
    nextAction === "SUSPENDER"
      ? "Suspendiendo servicio..."
      : "Activando servicio...";

  const confirmText =
    nextAction === "SUSPENDER" ? "Sí, suspender" : "Sí, activar";

  const handleToggleRequest = React.useCallback(() => {
    if (!canToggle) {
      toast.error("El estado actual no permite esta acción");
      return;
    }

    confirmDialog.open();
  }, [canToggle, confirmDialog]);

  const handleCancel = React.useCallback(() => {
    confirmDialog.close();
    form.reset();
  }, [confirmDialog, form]);

  const handleConfirmAction = React.useCallback(async () => {
    if (!nextAction) return;

    if (!form.state.password.trim()) {
      toast.warning("Ingrese su contraseña para continuar.");
      return;
    }

    const dto: suspendCustomerDto = {
      clienteId: cliente.id,
      password: form.state.password,
      userId,
      isPasswordRequired: true,
    };

    const action =
      nextAction === "SUSPENDER" ? suspendCustomer : activateCustomer;

    const successMessage =
      nextAction === "SUSPENDER"
        ? "Cliente suspendido exitosamente"
        : "Cliente activado exitosamente";

    await toast.promise(action.mutateAsync(dto), {
      loading: loadingText,
      success: () => {
        form.reset();
        confirmDialog.close();

        return successMessage;
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  }, [
    activateCustomer,
    cliente.id,
    confirmDialog,
    form,
    loadingText,
    nextAction,
    suspendCustomer,
    userId,
  ]);

  const handlePingCliente = React.useCallback(() => {
    if (!cliente.IP?.direccion) {
      toast.warning("El cliente no tiene IP asignada.");
      return;
    }

    toast.info(`Ping a IP del cliente: ${cliente.IP.direccion}`);
  }, [cliente.IP?.direccion]);

  const handlePingGateway = React.useCallback(() => {
    if (!cliente.IP?.gateway) {
      toast.warning("El cliente no tiene gateway asignado.");
      return;
    }

    toast.info(`Ping a gateway: ${cliente.IP.gateway}`);
  }, [cliente.IP?.gateway]);

  return (
    <>
      <AppStack gap="sm">
        <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
          <AppStack gap="sm">
            <AppCard variant="outline" size="sm" radius="md" className="p-2">
              <AppStack gap="sm">
                <AppInline justify="between" align="center" gap="sm">
                  <AppInline gap="xs" align="center" className="min-w-0">
                    {statusIcon}

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        Control de servicio
                      </h3>

                      <AppInline gap="xs" align="center" wrap>
                        <AppBadge
                          tone={getEstadoTone(estadoMk)}
                          appearance="soft"
                          size="xs"
                          radius="full"
                        >
                          {statusLabel}
                        </AppBadge>

                        {!hasIp ? (
                          <AppBadge
                            tone="warning"
                            appearance="soft"
                            size="xs"
                            radius="full"
                          >
                            Sin IP
                          </AppBadge>
                        ) : null}
                      </AppInline>
                    </div>
                  </AppInline>

                  <AppSwitch
                    checked={isActivo}
                    disabled={!canToggle}
                    onCheckedChange={handleToggleRequest}
                    aria-label="Cambiar estado del servicio"
                  />
                </AppInline>

                {!hasMikrotik || !hasIp ? (
                  <AppAlert tone="warning" size="sm" title="Acción bloqueada">
                    Para activar o suspender desde MikroTik, el cliente debe
                    tener MikroTik e IP asignados.
                  </AppAlert>
                ) : null}
              </AppStack>
            </AppCard>

            <AppCard variant="outline" size="sm" radius="md" className="p-2">
              <AppStack gap="sm">
                <div>
                  <h3 className="text-sm font-semibold">
                    Herramientas rápidas
                  </h3>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Diagnóstico básico de conectividad.
                  </p>
                </div>

                <AppInline gap="xs" align="center" wrap>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    width="auto"
                    leftIcon={<Signal size={14} />}
                    onClick={handlePingCliente}
                  >
                    Ping a IP
                  </AppButton>

                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    width="auto"
                    leftIcon={<Network size={14} />}
                    onClick={handlePingGateway}
                  >
                    Ping gateway
                  </AppButton>
                </AppInline>
              </AppStack>
            </AppCard>
          </AppStack>

          <AppStack gap="sm">
            <AppCard variant="outline" size="sm" radius="md" className="p-2">
              <AppStack gap="sm">
                <AppInline gap="xs" align="center">
                  <Router size={16} />
                  <h3 className="text-sm font-semibold">
                    Router / MikroTik asignado
                  </h3>
                </AppInline>

                <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                  <InfoBox
                    label="MikroTik"
                    value={cliente.mikrotik?.nombre}
                    icon={<Router size={14} />}
                  />

                  <InfoBox
                    label="IP cliente"
                    value={cliente.IP?.direccion}
                    icon={<Network size={14} />}
                  />

                  <InfoBox
                    label="Gateway"
                    value={cliente.IP?.gateway}
                    icon={<Network size={14} />}
                  />

                  <InfoBox
                    label="Máscara"
                    value={cliente.IP?.mascara}
                    icon={<Network size={14} />}
                  />
                </AppGrid>
              </AppStack>
            </AppCard>
          </AppStack>
        </AppGrid>
      </AppStack>

      <AppConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          confirmDialog.setOpen(open);

          if (!open) {
            form.reset();
          }
        }}
        preset={nextAction === "SUSPENDER" ? "warning" : "confirm"}
        tone={nextAction === "SUSPENDER" ? "warning" : "success"}
        title={dialogTitle}
        description={dialogDescription}
        confirmText={confirmText}
        cancelText="Cancelar"
        loadingText={loadingText}
        isLoading={isActionPending}
        preventClose={isActionPending}
        closeOnConfirm={false}
        onCancel={handleCancel}
        onConfirm={handleConfirmAction}
      >
        <AppStack gap="sm">
          <AppAlert
            tone="info"
            size="sm"
            icon={<ShieldCheck size={15} />}
            title="Confirmación requerida"
          >
            Por seguridad, ingrese su contraseña de usuario para continuar.
          </AppAlert>

          <AppField label="Contraseña" required>
            {(field) => (
              <AppInput
                id={field.id}
                type="password"
                value={form.state.password}
                onChange={(event) =>
                  form.setField("password", event.target.value)
                }
                placeholder="Contraseña de usuario"
                size="sm"
                fieldWidth="full"
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
              />
            )}
          </AppField>
        </AppStack>
      </AppConfirmDialog>
    </>
  );
}

export default CustomerNetworkControl;
