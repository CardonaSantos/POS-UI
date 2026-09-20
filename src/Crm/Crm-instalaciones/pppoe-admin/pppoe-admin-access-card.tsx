import type { ReactNode } from "react";
import { Ban, KeyRound, PlayCircle, RefreshCcw, RotateCcw } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import type {
  PppoeAuditoriaAccesoAdministrableResumen,
  PppoeAuditoriaCuentaCompleta,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import type { PppoeAdminActionRequest } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";

import { resolvePppoeMainAction } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";

import {
  formatAuditDate,
  humanizeEnum,
} from "../details/instalacion-utils.utils";
import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";
import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";

type Props = {
  instalacionId: number;

  fechaActivacionServicio: string | null;

  access: PppoeAuditoriaAccesoAdministrableResumen;

  fullAccount: PppoeAuditoriaCuentaCompleta | null;

  onAction: (request: PppoeAdminActionRequest) => void;
};

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>

      <dd className="mt-0.5 break-words text-xs font-medium">{value}</dd>
    </div>
  );
}

export function PppoeAdminAccessCard({
  instalacionId,
  access,
  fullAccount,
  onAction,
  fechaActivacionServicio,
}: Props) {
  const { can } = useAuthorization();

  /*
   * Capacidades de acción.
   *
   * Ninguna modifica la lógica operacional existente.
   * Únicamente decide si el usuario puede disparar
   * la acción que resolvePppoeMainAction determine.
   */
  const canActivateInitial = can(CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL);

  const canSuspend = can(CRM_PERMISSION.PPPOE_SUSPENDER);

  const canReactivate = can(CRM_PERMISSION.PPPOE_REACTIVAR);

  const canRevealCredentials = can(CRM_PERMISSION.PPPOE_CREDENCIALES_REVELAR);

  const canRetryPrealta = can(CRM_PERMISSION.PPPOE_PREALTA_REINTENTAR);

  /*
   * Información técnica sensible.
   *
   * Oficina puede administrar el servicio, pero no
   * necesita conocer router, perfil interno,
   * sincronización o errores técnicos.
   */
  const canViewSensitive = can(CRM_PERMISSION.PPPOE_DIAGNOSTICO_SENSIBLE_VER);

  const account = access.cuentaPppoe;
  const accountState = account?.estado ?? null;

  const isFullAccount = fullAccount?.id === account?.id;

  /*
   * IMPORTANTE:
   *
   * Esta lógica queda exactamente igual.
   * Los permisos NO deciden qué acción corresponde.
   * Sólo deciden si el usuario puede ejecutarla.
   */
  const mainAction = account
    ? resolvePppoeMainAction({
        estadoCuenta: account.estado,

        cuentaActivadaEn: isFullAccount
          ? (fullAccount?.activadoEn ?? null)
          : null,

        accesoActivadoEn: access.activadoEn,

        instalacionActivadaEn: fechaActivacionServicio,
      })
    : "NINGUNA";

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline
          justify="between"
          align="start"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold">Acceso PPPoE #{access.id}</p>

            <p className="mt-0.5 text-xs text-[hsl(var(--app-muted-foreground))]">
              {access.servicioInternet?.nombre ?? "Sin servicio asignado"}
            </p>
          </div>

          <AppInline gap="xs" wrap>
            <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
              {humanizeEnum(access.estado)}
            </AppBadge>

            {accountState ? (
              <AppBadge
                tone={accountState === "ACTIVA" ? "success" : "warning"}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(accountState)}
              </AppBadge>
            ) : (
              <AppBadge tone="danger" appearance="soft" size="xs" radius="full">
                Sin cuenta
              </AppBadge>
            )}
          </AppInline>
        </AppInline>

        <AppSeparator size="xs" spacing="none" />

        {/* ================================================= */}
        {/* INFORMACIÓN OPERACIONAL */}
        {/* ================================================= */}

        <dl>
          <AppGrid
            cols={{
              base: 2,
              md: canViewSensitive ? 3 : 2,
            }}
            gap="sm"
          >
            <Detail
              label="Tecnología"
              value={humanizeEnum(access.tecnologia)}
            />

            <Detail
              label="Autenticación"
              value={humanizeEnum(access.metodoAutenticacion)}
            />

            {/* ============================================= */}
            {/* CONTEXTO TÉCNICO SENSIBLE */}
            {/* ============================================= */}

            {canViewSensitive ? (
              <>
                <Detail
                  label="Usuario PPPoE"
                  value={account?.usuario ?? "Sin generar"}
                />

                <Detail
                  label="Perfil RouterOS"
                  value={account?.codigoPerfil ?? "Sin homologación confirmada"}
                />

                <Detail
                  label="Router"
                  value={account?.routerNombre ?? "Sin router confirmado"}
                />

                <Detail
                  label="Última sincronización"
                  value={
                    isFullAccount
                      ? formatAuditDate(
                          fullAccount?.ultimaSincronizacionEn ?? null,
                        )
                      : "Sin información"
                  }
                />
              </>
            ) : null}
          </AppGrid>
        </dl>

        {/* ================================================= */}
        {/* ERROR TÉCNICO */}
        {/* ================================================= */}

        {canViewSensitive && isFullAccount && fullAccount?.ultimoError ? (
          <AppAlert tone="danger" title="Último error PPPoE" size="xs">
            {fullAccount.ultimoError}
          </AppAlert>
        ) : null}

        {/* ================================================= */}
        {/* ACCIONES */}
        {/* ================================================= */}

        <AppInline justify="end" gap="xs" wrap fullWidth>
          {/*
           * No existe cuenta:
           * la lógica original ofrece reintentar prealta.
           *
           * Ahora requiere además permiso.
           */}
          {!account && canRetryPrealta ? (
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onAction({
                  action: "reintentarPrealta",
                  instalacionId,
                  accesoInternetId: access.id,
                  servicioInternetId: access.servicioInternet?.id ?? null,
                })
              }
            >
              <RefreshCcw aria-hidden="true" />
              Reintentar prealta
            </AppButton>
          ) : null}

          {/*
           * Activación inicial.
           *
           * La condición mainAction sigue siendo
           * la misma que antes.
           */}
          {account && mainAction === "ACTIVAR_INICIAL" && canActivateInitial ? (
            <AppButton
              type="button"
              size="sm"
              onClick={() =>
                onAction({
                  action: "activarInicial",
                  instalacionId,
                })
              }
            >
              <PlayCircle aria-hidden="true" />
              Activar cuenta
            </AppButton>
          ) : null}

          {/*
           * Suspensión.
           */}
          {account && mainAction === "SUSPENDER" && canSuspend ? (
            <AppButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() =>
                onAction({
                  action: "suspender",
                  instalacionId,
                  cuentaPppoeId: account.id,
                })
              }
            >
              <Ban aria-hidden="true" />
              Suspender servicio
            </AppButton>
          ) : null}

          {/*
           * Reactivación.
           */}
          {account && mainAction === "REACTIVAR" && canReactivate ? (
            <AppButton
              type="button"
              size="sm"
              onClick={() =>
                onAction({
                  action: "reactivar",
                  instalacionId,
                  cuentaPppoeId: account.id,
                })
              }
            >
              <RotateCcw aria-hidden="true" />
              Reactivar servicio
            </AppButton>
          ) : null}

          {/*
           * Revelar credenciales es independiente
           * del estado principal de la cuenta.
           */}
          {account && canRevealCredentials ? (
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onAction({
                  action: "revelarCredenciales",
                  instalacionId,
                })
              }
            >
              <KeyRound aria-hidden="true" />
              Revelar credenciales
            </AppButton>
          ) : null}
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
