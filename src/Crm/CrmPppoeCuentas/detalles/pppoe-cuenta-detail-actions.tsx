import {
  KeyRound,
  Play,
  Power,
  PowerOff,
  RefreshCcw,
  RotateCcw,
  Router,
  Trash2,
} from "lucide-react";

import { useAppDisclosure } from "@/components/app/handlers";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";

import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";
import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";

import { useInvalidatePppoeCuenta } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import type {
  PppoeCuentaDetalle,
  PppoeCuentaDetalleAccion,
} from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { SuspenderPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/suspender-pppoe-dialog";
import { ReactivarPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/reactivar-pppoe-dialog";

import { PppoeCuentaCredencialesDialog } from "./pppoe-cuenta-credenciales-dialog";
import {
  DarDeBajaPppoeDialog,
  ProvisionarPppoeDialog,
  RecuperarOperacionDialog,
  ReintentarOperacionDialog,
} from "./pppoe-cuenta-action-dialogs";

type Props = {
  cuenta: PppoeCuentaDetalle;
  onDataChanged?: () => void | Promise<void>;
};

function getActionTitle(
  action: PppoeCuentaDetalleAccion,
  enabledTitle: string,
  disabledFallback: string,
) {
  return action.habilitada ? enabledTitle : (action.motivo ?? disabledFallback);
}

export function PppoeCuentaDetailActions({ cuenta, onDataChanged }: Props) {
  const { can } = useAuthorization();

  const provisionarDialog = useAppDisclosure();
  const suspenderDialog = useAppDisclosure();
  const reactivarDialog = useAppDisclosure();
  const darDeBajaDialog = useAppDisclosure();
  const credencialesDialog = useAppDisclosure();
  const reintentarDialog = useAppDisclosure();
  const recuperarDialog = useAppDisclosure();

  const invalidateCuenta = useInvalidatePppoeCuenta(cuenta.cuentaPppoeId);

  const esAdoptada = cuenta.origen === "EXTERNA_ADOPTADA";

  const canProvisionar =
    can(CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL) && !esAdoptada;

  const canSuspender = can(CRM_PERMISSION.PPPOE_SUSPENDER);

  const canReactivar = can(CRM_PERMISSION.PPPOE_REACTIVAR);

  const canRevealCredentials = can(CRM_PERMISSION.PPPOE_CREDENCIALES_REVELAR);

  const canManageOperations = can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR);

  const canDarDeBaja =
    can(CRM_PERMISSION.PPPOE_SUSPENDER) &&
    can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR);

  const puedeDarDeBaja =
    cuenta.estadoCuenta === "ACTIVA" || cuenta.estadoCuenta === "SUSPENDIDA";

  const retryOperationId = cuenta.acciones.reintentarOperacion.operacionId;

  const recoverOperationId = cuenta.acciones.recuperarOperacion.operacionId;

  const tieneAcciones =
    canProvisionar ||
    canSuspender ||
    canReactivar ||
    canDarDeBaja ||
    canRevealCredentials ||
    canManageOperations;

  if (!tieneAcciones) {
    return null;
  }

  const handleCompleted = async () => {
    provisionarDialog.close();
    suspenderDialog.close();
    reactivarDialog.close();
    darDeBajaDialog.close();
    reintentarDialog.close();
    recuperarDialog.close();

    invalidateCuenta();

    await onDataChanged?.();
  };

  const handleCredentialsRevealed = async () => {
    invalidateCuenta();
    await onDataChanged?.();
  };

  return (
    <>
      <AppCard variant="outline" size="xs" radius="md" className="p-3">
        <AppInline
          justify="between"
          align="center"
          collapseBelow="sm"
          gap="sm"
          fullWidth
        >
          <AppInline align="center" gap="xs" wrap>
            <Router size={16} aria-hidden="true" />
            <p className="text-sm font-semibold">Acciones PPPoE</p>
          </AppInline>

          <AppInline gap="xs" wrap>
            {canProvisionar ? (
              <AppButton
                type="button"
                size="sm"
                leftIcon={<Play size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.provisionar.habilitada}
                title={getActionTitle(
                  cuenta.acciones.provisionar,
                  "Provisionar cuenta PPPoE",
                  "La provisión no está disponible.",
                )}
                onClick={provisionarDialog.open}
              >
                Provisionar
              </AppButton>
            ) : null}

            {canReactivar ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Power size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.reactivar.habilitada}
                title={getActionTitle(
                  cuenta.acciones.reactivar,
                  "Reactivar servicio PPPoE",
                  "La reactivación no está disponible.",
                )}
                onClick={reactivarDialog.open}
              >
                Reactivar
              </AppButton>
            ) : null}

            {canSuspender ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<PowerOff size={14} aria-hidden="true" />}
                disabled={!cuenta.acciones.suspender.habilitada}
                title={getActionTitle(
                  cuenta.acciones.suspender,
                  "Suspender servicio PPPoE",
                  "La suspensión no está disponible.",
                )}
                onClick={suspenderDialog.open}
              >
                Suspender
              </AppButton>
            ) : null}

            {canDarDeBaja ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} aria-hidden="true" />}
                disabled={!puedeDarDeBaja}
                title={
                  puedeDarDeBaja
                    ? "Dar de baja definitivamente"
                    : "Disponible únicamente para cuentas activas o suspendidas."
                }
                onClick={darDeBajaDialog.open}
              >
                Dar de baja
              </AppButton>
            ) : null}

            {canRevealCredentials ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<KeyRound size={14} aria-hidden="true" />}
                title="Revelar credenciales PPPoE"
                onClick={credencialesDialog.open}
              >
                Revelar credenciales
              </AppButton>
            ) : null}

            {canManageOperations &&
            cuenta.acciones.reintentarOperacion.habilitada &&
            retryOperationId ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw size={14} aria-hidden="true" />}
                title={
                  cuenta.acciones.reintentarOperacion.motivo ??
                  `Reintentar operación #${retryOperationId}`
                }
                onClick={reintentarDialog.open}
              >
                Reintentar
              </AppButton>
            ) : null}

            {canManageOperations &&
            cuenta.acciones.recuperarOperacion.habilitada &&
            recoverOperationId ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RefreshCcw size={14} aria-hidden="true" />}
                title={
                  cuenta.acciones.recuperarOperacion.motivo ??
                  `Recuperar operación #${recoverOperationId}`
                }
                onClick={recuperarDialog.open}
              >
                Recuperar
              </AppButton>
            ) : null}
          </AppInline>
        </AppInline>
      </AppCard>

      {canProvisionar ? (
        <ProvisionarPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          usuario={cuenta.usuario}
          open={provisionarDialog.isOpen}
          onOpenChange={provisionarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canSuspender ? (
        <SuspenderPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          open={suspenderDialog.isOpen}
          onOpenChange={suspenderDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canReactivar ? (
        <ReactivarPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          open={reactivarDialog.isOpen}
          onOpenChange={reactivarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canDarDeBaja ? (
        <DarDeBajaPppoeDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          usuario={cuenta.usuario}
          open={darDeBajaDialog.isOpen}
          onOpenChange={darDeBajaDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canRevealCredentials ? (
        <PppoeCuentaCredencialesDialog
          cuenta={cuenta}
          open={credencialesDialog.isOpen}
          onOpenChange={credencialesDialog.setOpen}
          onDataChanged={handleCredentialsRevealed}
        />
      ) : null}

      {canManageOperations && retryOperationId ? (
        <ReintentarOperacionDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          operacionId={retryOperationId}
          open={reintentarDialog.isOpen}
          onOpenChange={reintentarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}

      {canManageOperations && recoverOperationId ? (
        <RecuperarOperacionDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          operacionId={recoverOperationId}
          open={recuperarDialog.isOpen}
          onOpenChange={recuperarDialog.setOpen}
          onCompleted={handleCompleted}
        />
      ) : null}
    </>
  );
}
