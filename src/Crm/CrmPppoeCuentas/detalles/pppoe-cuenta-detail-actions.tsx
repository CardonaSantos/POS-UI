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

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { SuspenderPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/suspender-pppoe-dialog";

import { ReactivarPppoeDialog } from "@/Crm/Crm-instalaciones/pppoe-admin/reactivar-pppoe-dialog";

import { PppoeCuentaCredencialesDialog } from "./pppoe-cuenta-credenciales-dialog";

import {
  DarDeBajaPppoeDialog,
  RecuperarOperacionDialog,
  ReintentarOperacionDialog,
} from "./pppoe-cuenta-action-dialogs";

import { PppoeCuentaActivarDialog } from "./pppoe-cuenta-activar-dialog";

type Props = {
  cuenta: PppoeCuentaDetalle;

  onDataChanged?: () => void | Promise<void>;
};

export function PppoeCuentaDetailActions({ cuenta, onDataChanged }: Props) {
  const { can } = useAuthorization();

  const activarDialog = useAppDisclosure();

  const suspenderDialog = useAppDisclosure();

  const reactivarDialog = useAppDisclosure();

  const darDeBajaDialog = useAppDisclosure();

  const credencialesDialog = useAppDisclosure();

  const reintentarDialog = useAppDisclosure();

  const recuperarDialog = useAppDisclosure();

  const invalidateCuenta = useInvalidatePppoeCuenta(cuenta.cuentaPppoeId);

  const canActivar = can(CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL);

  const canSuspender = can(CRM_PERMISSION.PPPOE_SUSPENDER);

  const canReactivar = can(CRM_PERMISSION.PPPOE_REACTIVAR);

  const canRevealCredentials = can(CRM_PERMISSION.PPPOE_CREDENCIALES_REVELAR);

  const canManageOperations = can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR);

  /**
   * Conservamos por ahora la política existente
   * para baja definitiva.
   *
   * En una fase posterior podemos hacer que backend
   * exponga también acciones.darDeBaja.
   */
  const canDarDeBaja =
    can(CRM_PERMISSION.PPPOE_SUSPENDER) &&
    can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR);

  /**
   * A partir de aquí backend es la fuente de verdad
   * para Activar / Suspender / Reactivar.
   */
  const mostrarActivar = canActivar && cuenta.acciones.activar.habilitada;

  const mostrarSuspender = canSuspender && cuenta.acciones.suspender.habilitada;

  const mostrarReactivar = canReactivar && cuenta.acciones.reactivar.habilitada;

  const puedeDarDeBaja =
    cuenta.estadoCuenta === "ACTIVA" || cuenta.estadoCuenta === "SUSPENDIDA";

  const mostrarDarDeBaja = canDarDeBaja && puedeDarDeBaja;

  const retryOperationId = cuenta.acciones.reintentarOperacion.operacionId;

  const recoverOperationId = cuenta.acciones.recuperarOperacion.operacionId;

  const mostrarReintentar =
    canManageOperations &&
    cuenta.acciones.reintentarOperacion.habilitada &&
    Boolean(retryOperationId);

  const mostrarRecuperar =
    canManageOperations &&
    cuenta.acciones.recuperarOperacion.habilitada &&
    Boolean(recoverOperationId);

  /**
   * Revelar credenciales es una consulta auditada,
   * no una transición del ciclo de vida PPPoE.
   */
  const mostrarCredenciales = canRevealCredentials;

  const tieneAcciones =
    mostrarActivar ||
    mostrarSuspender ||
    mostrarReactivar ||
    mostrarDarDeBaja ||
    mostrarCredenciales ||
    mostrarReintentar ||
    mostrarRecuperar;

  if (!tieneAcciones) {
    return null;
  }

  const handleCompleted = async () => {
    activarDialog.close();

    suspenderDialog.close();

    reactivarDialog.close();

    darDeBajaDialog.close();

    reintentarDialog.close();

    recuperarDialog.close();

    /**
     * Tanto el flujo manual como el de instalación
     * pueden modificar:
     *
     * - estadoCuenta;
     * - estadoAcceso;
     * - operaciones;
     * - acciones disponibles.
     */
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
            {mostrarActivar ? (
              <AppButton
                type="button"
                size="sm"
                leftIcon={<Play size={14} aria-hidden="true" />}
                title="Activar cuenta PPPoE"
                onClick={activarDialog.open}
              >
                Activar PPPoE
              </AppButton>
            ) : null}

            {mostrarReactivar ? (
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Power size={14} aria-hidden="true" />}
                title="Reactivar servicio PPPoE"
                onClick={reactivarDialog.open}
              >
                Reactivar
              </AppButton>
            ) : null}

            {mostrarSuspender ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<PowerOff size={14} aria-hidden="true" />}
                title="Suspender servicio PPPoE"
                onClick={suspenderDialog.open}
              >
                Suspender
              </AppButton>
            ) : null}

            {mostrarDarDeBaja ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} aria-hidden="true" />}
                title="Dar de baja definitivamente"
                onClick={darDeBajaDialog.open}
              >
                Dar de baja
              </AppButton>
            ) : null}

            {mostrarCredenciales ? (
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

            {mostrarReintentar && retryOperationId ? (
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

            {mostrarRecuperar && recoverOperationId ? (
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

      {canActivar ? (
        <PppoeCuentaActivarDialog
          cuentaPppoeId={cuenta.cuentaPppoeId}
          usuario={cuenta.usuario}
          accion={cuenta.acciones.activar}
          open={activarDialog.isOpen}
          onOpenChange={activarDialog.setOpen}
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
