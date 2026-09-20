import type { ReactNode } from "react";
import { History, Network, UserRound } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeAuditoriaTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import {
  formatPppoeDate,
  getAuditTitle,
  getAuditTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

import { AuditoriaJsonDetails } from "./auditoria-json-details";

type Props = {
  item: InstalacionPppoeAuditoriaTimelineItem;

  /**
   * Permite visualizar información técnica/interna
   * de la auditoría PPPoE.
   */
  canViewSensitive: boolean;
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

export function AuditoriaIndependienteCard({ item, canViewSensitive }: Props) {
  const { auditoria, contexto } = item;

  const actor =
    auditoria.operador?.nombre ?? auditoria.operadorNombreSnapshot ?? "Sistema";

  const hasTransition = Boolean(
    auditoria.estadoCuentaAnterior || auditoria.estadoCuentaNuevo,
  );

  const transitionLabel = hasTransition
    ? `${humanizePppoeEnum(
        auditoria.estadoCuentaAnterior,
      )} → ${humanizePppoeEnum(auditoria.estadoCuentaNuevo)}`
    : "Sin transición";

  const hasClientContext = Boolean(auditoria.ipOrigen || auditoria.userAgent);

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        {/* =============================================== */}
        {/* RESUMEN DEL EVENTO */}
        {/* =============================================== */}

        <AppInline
          justify="between"
          align="start"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap>
              <History className="size-4" aria-hidden="true" />

              <h3 className="text-sm font-semibold">
                {getAuditTitle(auditoria.accion)}
              </h3>

              {canViewSensitive ? (
                <AppBadge
                  tone={getAuditTone(auditoria.accion)}
                  appearance="soft"
                  size="xs"
                  radius="full"
                >
                  {humanizePppoeEnum(auditoria.origen)}
                </AppBadge>
              ) : null}
            </AppInline>

            {canViewSensitive && auditoria.descripcion ? (
              <p className="mt-1 text-xs">{auditoria.descripcion}</p>
            ) : (
              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                Evento registrado durante la gestión del servicio.
              </p>
            )}
          </div>

          <span className="shrink-0 text-[11px] text-[hsl(var(--app-muted-foreground))]">
            {formatPppoeDate(item.fecha)}
          </span>
        </AppInline>

        {/* =============================================== */}
        {/* INFORMACIÓN OPERACIONAL */}
        {/* =============================================== */}

        <AppGrid
          cols={{
            base: 1,
            sm: 2,
            lg: canViewSensitive ? 4 : 2,
          }}
          gap="sm"
        >
          <ContextItem
            label="Operador"
            value={
              <AppInline align="center" gap="xs" wrap={false}>
                <UserRound className="size-3.5 shrink-0" aria-hidden="true" />

                <span className="truncate">{actor}</span>
              </AppInline>
            }
          />

          <ContextItem label="Transición" value={transitionLabel} />

          {/* ============================================= */}
          {/* CONTEXTO PPPoE SENSIBLE */}
          {/* ============================================= */}

          {canViewSensitive ? (
            <>
              <ContextItem
                label="Usuario PPPoE"
                value={
                  auditoria.usuarioPppoeSnapshot ??
                  contexto.cuentaPppoe?.usuario ??
                  "Sin registrar"
                }
              />

              <ContextItem
                label="Perfil RouterOS"
                value={
                  <AppInline align="center" gap="xs" wrap={false}>
                    <Network className="size-3.5 shrink-0" aria-hidden="true" />

                    <span className="truncate">
                      {auditoria.perfilCodigoSnapshot ??
                        contexto.perfilHomologacion?.codigoPerfil ??
                        "Sin registrar"}
                    </span>
                  </AppInline>
                }
              />
            </>
          ) : null}
        </AppGrid>

        {/* =============================================== */}
        {/* ORIGEN / DISPOSITIVO / RED */}
        {/* =============================================== */}

        {canViewSensitive && hasClientContext ? (
          <div className="rounded bg-[hsl(var(--app-muted)/0.55)] p-2">
            <AppStack gap="xs">
              <div>
                <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                  IP de origen
                </p>

                <p className="text-[10px] font-medium">
                  {auditoria.ipOrigen ?? "Sin registrar"}
                </p>
              </div>

              {auditoria.userAgent ? (
                <div>
                  <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                    User-Agent
                  </p>

                  <p className="break-all text-[10px]">{auditoria.userAgent}</p>
                </div>
              ) : null}
            </AppStack>
          </div>
        ) : null}

        {/* =============================================== */}
        {/* PAYLOAD TÉCNICO */}
        {/* =============================================== */}

        {canViewSensitive ? (
          <AuditoriaJsonDetails
            title="Ver datos del evento"
            value={auditoria.datos}
          />
        ) : null}
      </AppStack>
    </AppCard>
  );
}
