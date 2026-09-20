import type { ReactNode } from "react";
import { Activity, ChevronDown, CircleUserRound, Router } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeOperacionTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import {
  formatPppoeDate,
  formatPppoeDuration,
  getAccountTone,
  getOperationTitle,
  getOperationTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

import { AuditoriaEventos } from "./auditoria-eventos";
import { AuditoriaJsonDetails } from "./auditoria-json-details";
import { AuditoriaOperacionPasos } from "./auditoria-operacion-pasos";
import { AuditoriaReintentarOperacionButton } from "./auditoria-reintentar-button";

type Props = {
  item: InstalacionPppoeOperacionTimelineItem;

  /**
   * La operación admite reintento y el usuario
   * tiene autorización para ejecutarlo.
   */
  canRetry: boolean;

  /**
   * Permite mostrar infraestructura, diagnóstico,
   * trazabilidad y datos técnicos internos.
   */
  canViewSensitive: boolean;

  onRetrySuccess?: () => void;
};

function ContextItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
        {label}
      </p>

      <div className="mt-0.5 text-[11px] font-medium">{value}</div>
    </div>
  );
}

export function AuditoriaOperacionCard({
  item,
  canRetry,
  canViewSensitive,
  onRetrySuccess,
}: Props) {
  const { operacion, contexto, actores } = item;

  const actor =
    actores.iniciadoPor?.nombre ??
    actores.reautenticadoPor?.nombre ??
    "Sistema";

  const hasError = Boolean(operacion.errorCodigo || operacion.errorMensaje);

  const operationMetadata = canViewSensitive
    ? `${formatPppoeDate(item.fecha)} · ${operacion.canal} · Intento ${
        operacion.numeroIntento
      } · ${formatPppoeDuration(operacion.duracionMs)}`
    : `${formatPppoeDate(item.fecha)} · Intento ${
        operacion.numeroIntento
      } · ${formatPppoeDuration(operacion.duracionMs)}`;

  return (
    <AppCard>
      <details className="group">
        <summary className="cursor-pointer list-none px-3 py-3">
          <AppStack gap="sm">
            <AppInline justify="between" align="start" gap="sm" wrap={false}>
              <AppInline align="start" gap="sm" wrap={false}>
                <Activity
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <AppInline align="center" gap="xs" wrap>
                    <p className="text-sm font-semibold">
                      {getOperationTitle(operacion.tipo)}
                    </p>

                    <AppBadge
                      tone={getOperationTone(operacion.estado)}
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {humanizePppoeEnum(operacion.estado)}
                    </AppBadge>
                  </AppInline>

                  <p className="mt-1 text-[11px] text-[hsl(var(--app-muted-foreground))]">
                    {operationMetadata}
                  </p>
                </div>
              </AppInline>

              <AppInline align="center" gap="xs" wrap={false}>
                <span className="hidden text-[11px] text-[hsl(var(--app-muted-foreground))] sm:inline">
                  {canViewSensitive ? "Ver trazabilidad" : "Ver detalles"}
                </span>

                <ChevronDown
                  className="size-4 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </AppInline>
            </AppInline>

            {/* ================================================= */}
            {/* RESUMEN OPERACIONAL */}
            {/* ================================================= */}

            <AppGrid
              cols={{
                base: 1,
                sm: 2,
                lg: canViewSensitive ? 4 : 2,
              }}
              gap="xs"
            >
              <ContextItem
                label="Operador"
                value={
                  <AppInline align="center" gap="xs" wrap={false}>
                    <CircleUserRound
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="truncate">{actor}</span>
                  </AppInline>
                }
              />

              <ContextItem
                label="Estado de cuenta"
                value={
                  <AppBadge
                    tone={getAccountTone(contexto.cuentaPppoe.estado)}
                    appearance="soft"
                    size="xs"
                    radius="full"
                  >
                    {humanizePppoeEnum(contexto.cuentaPppoe.estado)}
                  </AppBadge>
                }
              />

              {/* =============================================== */}
              {/* CONTEXTO SENSIBLE */}
              {/* =============================================== */}

              {canViewSensitive ? (
                <>
                  <ContextItem
                    label="Cuenta PPPoE"
                    value={
                      <span className="truncate">
                        {contexto.cuentaPppoe.usuario}
                      </span>
                    }
                  />

                  <ContextItem
                    label="Router"
                    value={
                      <AppInline align="center" gap="xs" wrap={false}>
                        <Router
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />

                        <span className="truncate">
                          {contexto.router.nombre}
                        </span>
                      </AppInline>
                    }
                  />
                </>
              ) : null}
            </AppGrid>
          </AppStack>
        </summary>

        <div className="px-3 pb-3">
          <AppSeparator size="xs" spacing="sm" />

          <AppStack gap="sm">
            {/* =============================================== */}
            {/* CONTEXTO GENERAL */}
            {/* =============================================== */}

            <AppGrid
              cols={{
                base: 1,
                sm: 2,
                lg: canViewSensitive ? 4 : 1,
              }}
              gap="sm"
            >
              <ContextItem
                label="Plan"
                value={
                  contexto.perfilHomologacion?.servicioInternet.nombre ??
                  contexto.accesoInternet.servicioInternet?.nombre ??
                  "Sin plan"
                }
              />

              {/* ============================================= */}
              {/* INFRAESTRUCTURA INTERNA */}
              {/* ============================================= */}

              {canViewSensitive ? (
                <>
                  <ContextItem label="Operación" value={`#${operacion.id}`} />

                  <ContextItem
                    label="Idempotencia"
                    value={
                      <code className="break-all text-[10px]">
                        {operacion.claveIdempotencia}
                      </code>
                    }
                  />

                  <ContextItem
                    label="Host SSH"
                    value={`${contexto.router.host}:${contexto.router.sshPort}`}
                  />
                </>
              ) : null}
            </AppGrid>

            {/* =============================================== */}
            {/* MOTIVO OPERACIONAL */}
            {/* =============================================== */}

            {operacion.motivo ? (
              <div>
                <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                  Motivo
                </p>

                <p className="mt-0.5 text-xs">{operacion.motivo}</p>
              </div>
            ) : null}

            {/* =============================================== */}
            {/* ERROR */}
            {/* =============================================== */}

            {hasError ? (
              canViewSensitive ? (
                <AppAlert
                  tone="danger"
                  size="xs"
                  title={operacion.errorCodigo ?? "OPERACION_FALLIDA"}
                >
                  {operacion.errorMensaje ?? "Sin mensaje de error."}
                </AppAlert>
              ) : (
                <AppAlert
                  tone="danger"
                  size="xs"
                  title="La operación no pudo completarse"
                >
                  La operación presentó un inconveniente técnico. Puedes
                  reintentarlo si tu cuenta tiene autorización para hacerlo.
                </AppAlert>
              )
            ) : null}

            {/* =============================================== */}
            {/* ACCIÓN OPERACIONAL INDEPENDIENTE */}
            {/* =============================================== */}

            {canRetry ? (
              <AuditoriaReintentarOperacionButton
                item={item}
                onSuccess={onRetrySuccess}
              />
            ) : null}

            {/* =============================================== */}
            {/* DIAGNÓSTICO TÉCNICO SENSIBLE */}
            {/* =============================================== */}

            {canViewSensitive ? (
              <>
                <AuditoriaJsonDetails
                  title="Ver resultado técnico"
                  value={operacion.resultado}
                />

                <details>
                  <summary className="cursor-pointer text-xs font-semibold text-[hsl(var(--app-primary))]">
                    Pasos técnicos ({item.pasos.length})
                  </summary>

                  <div className="mt-2">
                    <AuditoriaOperacionPasos pasos={item.pasos} />
                  </div>
                </details>

                <details>
                  <summary className="cursor-pointer text-xs font-semibold text-[hsl(var(--app-primary))]">
                    Eventos de auditoría ({item.auditorias.length})
                  </summary>

                  <div className="mt-2">
                    <AuditoriaEventos auditorias={item.auditorias} compact />
                  </div>
                </details>
              </>
            ) : null}
          </AppStack>
        </div>
      </details>
    </AppCard>
  );
}
