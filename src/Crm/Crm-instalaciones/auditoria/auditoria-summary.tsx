import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeAuditoriaSummary } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  formatPppoeDate,
  getAccountTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

type Props = {
  summary: InstalacionPppoeAuditoriaSummary;
};

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <span className="block text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </span>
      <strong className="mt-1 block text-base font-semibold tabular-nums">
        {value}
      </strong>
      {detail ? (
        <span className="mt-1 block truncate text-[10px] text-[hsl(var(--app-muted-foreground))]">
          {detail}
        </span>
      ) : null}
    </AppCard>
  );
}

export function AuditoriaSummary({ summary }: Props) {
  const account = summary.cuentaPppoe;

  return (
    <AppStack gap="sm">
      <AppGrid cols={{ base: 2, md: 3, xl: 6 }} gap="xs">
        <Metric
          label="Eventos"
          value={summary.totalEventos}
          detail="Registros de auditoría"
        />
        <Metric
          label="Operaciones"
          value={summary.totalOperaciones}
          detail="Ejecuciones PPPoE"
        />
        <Metric
          label="Pasos"
          value={summary.totalPasos}
          detail="Pasos técnicos"
        />
        <Metric
          label="Exitosas"
          value={summary.operacionesExitosas}
          detail="Finalizadas correctamente"
        />
        <Metric
          label="Fallidas"
          value={summary.operacionesFallidas}
          detail="Requieren revisión"
        />
        <Metric
          label="Última actividad"
          value={formatPppoeDate(summary.ultimaActividadEn)}
          detail={`${summary.operacionesEnCurso} en curso`}
        />
      </AppGrid>

      <AppCard variant="outline" size="xs" radius="md" className="p-3">
        <AppInline
          justify="between"
          align="start"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold">Estado PPPoE actual</p>
            <p className="mt-0.5 text-[11px] text-[hsl(var(--app-muted-foreground))]">
              {summary.cantidadAccesosPppoe} acceso PPPoE asociado a esta
              instalación.
            </p>
          </div>

          {account ? (
            <AppInline align="center" gap="xs" wrap>
              <AppBadge
                tone={getAccountTone(account.estado)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizePppoeEnum(account.estado)}
              </AppBadge>
              <span className="text-xs font-semibold">
                Usuario {account.usuario}
              </span>
            </AppInline>
          ) : (
            <AppBadge
              tone="warning"
              appearance="soft"
              size="xs"
              radius="full"
            >
              Sin cuenta
            </AppBadge>
          )}
        </AppInline>

        {account ? (
          <AppGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="sm" className="mt-3">
            <div>
              <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Perfil
              </p>
              <p className="text-xs font-medium">
                {account.perfilHomologacion.codigoPerfil}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Router
              </p>
              <p className="truncate text-xs font-medium">
                {account.perfilHomologacion.router.nombre}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Activación
              </p>
              <p className="text-xs font-medium">
                {formatPppoeDate(account.activadoEn)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Última sincronización
              </p>
              <p className="text-xs font-medium">
                {formatPppoeDate(account.ultimaSincronizacionEn)}
              </p>
            </div>
          </AppGrid>
        ) : null}
      </AppCard>
    </AppStack>
  );
}
