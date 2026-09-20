import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { PppoeAuditoriaEvento } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  formatPppoeDate,
  getAuditTitle,
  getAuditTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

import { AuditoriaJsonDetails } from "./auditoria-json-details";

type Props = {
  auditorias: PppoeAuditoriaEvento[];
  compact?: boolean;
};

function AuditEvent({
  audit,
  compact,
}: {
  audit: PppoeAuditoriaEvento;
  compact?: boolean;
}) {
  const actor =
    audit.operador?.nombre ??
    audit.operadorNombreSnapshot ??
    "Sistema";

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className={compact ? "p-2" : "p-3"}
    >
      <AppStack gap="xs">
        <AppInline
          justify="between"
          align="start"
          gap="xs"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold">
              {getAuditTitle(audit.accion)}
            </p>
            <p className="mt-0.5 text-[11px] text-[hsl(var(--app-muted-foreground))]">
              {audit.descripcion}
            </p>
          </div>

          <AppBadge
            tone={getAuditTone(audit.accion)}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {humanizePppoeEnum(audit.origen)}
          </AppBadge>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="xs">
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Fecha
            </p>
            <p className="text-[11px] font-medium">
              {formatPppoeDate(audit.creadoEn)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Operador
            </p>
            <p className="truncate text-[11px] font-medium" title={actor}>
              {actor}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Transición
            </p>
            <p className="text-[11px] font-medium">
              {audit.estadoCuentaAnterior || audit.estadoCuentaNuevo
                ? `${humanizePppoeEnum(
                    audit.estadoCuentaAnterior,
                  )} → ${humanizePppoeEnum(audit.estadoCuentaNuevo)}`
                : "Sin transición"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              IP de origen
            </p>
            <p className="truncate text-[11px] font-medium">
              {audit.ipOrigen ?? "Sin registrar"}
            </p>
          </div>
        </AppGrid>

        {audit.userAgent ? (
          <p className="break-all text-[10px] text-[hsl(var(--app-muted-foreground))]">
            {audit.userAgent}
          </p>
        ) : null}

        <AuditoriaJsonDetails title="Ver datos del evento" value={audit.datos} />
      </AppStack>
    </AppCard>
  );
}

export function AuditoriaEventos({ auditorias, compact }: Props) {
  if (auditorias.length === 0) {
    return (
      <p className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
        Esta operación no tiene eventos asociados.
      </p>
    );
  }

  return (
    <AppStack gap="xs">
      {auditorias.map((audit) => (
        <AuditEvent key={audit.id} audit={audit} compact={compact} />
      ))}
    </AppStack>
  );
}
