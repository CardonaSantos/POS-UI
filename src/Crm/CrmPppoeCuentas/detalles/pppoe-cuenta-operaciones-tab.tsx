import { useMemo, useState } from "react";

import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  RefreshCcw,
  RotateCcw,
  Terminal,
  UserRound,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";

import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";

import { useGetPppoeOperacionesCuenta } from "@/Crm/CrmHooks/hooks/pppoe-operaciones/pppoe-operaciones-hook";

import type { PppoeOperacionListItem } from "@/Crm/features/pppoe-operaciones/pppoe-operaciones.interfaces";

import type { EstadoOperacionPppoe } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import { formattFechaWithMinutes } from "@/utils/formattFechas";

import { PppoeOperacionDetailDialog } from "./pppoe-operacion-detail-dialog";

type Props = {
  cuentaPppoeId: number;

  enabled?: boolean;
};

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const PAGE_SIZE = 4;

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function getOperationTone(estado: EstadoOperacionPppoe): AppBadgeTone {
  switch (estado) {
    case "EXITOSA":
      return "success";

    case "FALLIDA":
      return "danger";

    case "PARCIAL":
      return "warning";

    case "EJECUTANDO":
      return "primary";

    case "AUTORIZADA":
      return "info";

    case "PENDIENTE":
      return "warning";

    case "CANCELADA":
    default:
      return "neutral";
  }
}

function formatDuration(value: number | null): string {
  if (value == null) {
    return "Sin duración";
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(value / 1000).toFixed(2)} s`;
}

function OperationCard({
  item,
  onView,
}: {
  item: PppoeOperacionListItem;

  onView: (operationId: number) => void;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline
          justify="between"
          align="start"
          collapseBelow="sm"
          gap="sm"
          fullWidth
        >
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap>
              <Terminal size={15} aria-hidden="true" />

              <p className="text-sm font-semibold">{humanizeEnum(item.tipo)}</p>

              <AppBadge
                tone={getOperationTone(item.estado)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(item.estado)}
              </AppBadge>

              <AppBadge
                tone="neutral"
                appearance="soft"
                size="xs"
                radius="full"
              >
                #{item.id}
              </AppBadge>
            </AppInline>

            <p className={`mt-1 text-xs ${mutedTextClass}`}>
              Intento #{item.numeroIntento}
              {" · "}
              {humanizeEnum(item.origen)}
              {" · "}
              {humanizeEnum(item.canal)}
            </p>
          </div>

          <AppButton
            type="button"
            variant="outline"
            size="xs"
            leftIcon={<Eye size={13} aria-hidden="true" />}
            onClick={() => onView(item.id)}
          >
            Ver detalle
          </AppButton>
        </AppInline>

        <AppGrid
          cols={{
            base: 2,
            md: 4,
          }}
          gap="sm"
        >
          <div>
            <p
              className={`text-[10px] uppercase tracking-wide ${mutedTextClass}`}
            >
              Fecha
            </p>

            <p className="mt-0.5 text-xs font-medium">
              {formattFechaWithMinutes(item.creadoEn)}
            </p>
          </div>

          <div>
            <p
              className={`text-[10px] uppercase tracking-wide ${mutedTextClass}`}
            >
              Duración
            </p>

            <p className="mt-0.5 text-xs font-medium">
              {formatDuration(item.duracionMs)}
            </p>
          </div>

          <div>
            <p
              className={`text-[10px] uppercase tracking-wide ${mutedTextClass}`}
            >
              Operador
            </p>

            <AppInline align="center" gap="xs" className="mt-0.5">
              <UserRound
                size={12}
                aria-hidden="true"
                className={mutedTextClass}
              />

              <p className="truncate text-xs font-medium">
                {item.iniciadoPor?.nombre ?? "Sistema"}
              </p>
            </AppInline>
          </div>

          <div>
            <p
              className={`text-[10px] uppercase tracking-wide ${mutedTextClass}`}
            >
              Pasos
            </p>

            <p className="mt-0.5 text-xs font-medium tabular-nums">
              {item.conteos.pasos}
            </p>
          </div>
        </AppGrid>

        {item.motivo ? (
          <div className="rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-muted)/0.35)] p-2">
            <p
              className={`text-[10px] font-medium uppercase tracking-wide ${mutedTextClass}`}
            >
              Motivo
            </p>

            <p className="mt-1 line-clamp-2 text-xs">{item.motivo}</p>
          </div>
        ) : null}

        {item.errorMensaje ? (
          <AppAlert
            tone="danger"
            title={item.errorCodigo || "Error de operación"}
            size="xs"
          >
            {item.errorMensaje}
          </AppAlert>
        ) : null}

        {item.reintentoDeId ? (
          <AppInline align="center" gap="xs">
            <RotateCcw
              size={12}
              aria-hidden="true"
              className={mutedTextClass}
            />

            <p className={`text-[11px] ${mutedTextClass}`}>
              Reintento de operación #{item.reintentoDeId}
            </p>
          </AppInline>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

export function PppoeCuentaOperacionesTab({
  cuentaPppoeId,
  enabled = true,
}: Props) {
  const { can } = useAuthorization();

  const canViewOperations = can(CRM_PERMISSION.PPPOE_OPERACIONES_VER);

  const [page, setPage] = useState(1);

  const [selectedOperationId, setSelectedOperationId] = useState<number | null>(
    null,
  );

  const params = useMemo(
    () => ({
      page,

      limit: PAGE_SIZE,

      ordenPor: "creadoEn" as const,

      ordenDireccion: "desc" as const,
    }),
    [page],
  );

  const query = useGetPppoeOperacionesCuenta(
    cuentaPppoeId,

    params,

    enabled && canViewOperations,
  );

  if (!canViewOperations) {
    return null;
  }

  const items = query.data?.data ?? [];

  const meta = query.data?.meta ?? {
    total: 0,

    page,

    limit: PAGE_SIZE,

    totalPages: 0,
  };

  const handleOpenOperation = (operationId: number) => {
    setSelectedOperationId(operationId);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedOperationId(null);
    }
  };

  const canGoPrevious = page > 1;

  const canGoNext = page < meta.totalPages;

  return (
    <>
      <AppStack gap="sm">
        <AppCard variant="outline" size="xs" radius="md" className="p-3">
          <AppInline
            justify="between"
            align="start"
            collapseBelow="sm"
            gap="sm"
            fullWidth
          >
            <div className="min-w-0">
              <AppInline align="center" gap="xs" wrap>
                <Activity size={16} aria-hidden="true" />

                <p className="text-sm font-semibold">Historial técnico</p>

                <AppBadge
                  tone="neutral"
                  appearance="soft"
                  size="xs"
                  radius="full"
                >
                  {meta.total} operaciones
                </AppBadge>
              </AppInline>

              <p className={`mt-1 text-xs ${mutedTextClass}`}>
                Ejecuciones PPPoE registradas para esta cuenta, ordenadas de la
                más reciente a la más antigua.
              </p>
            </div>

            <AppButton
              type="button"
              variant="outline"
              size="sm"
              disabled={query.isFetching}
              leftIcon={<RefreshCcw size={14} aria-hidden="true" />}
              onClick={() => query.refetch()}
            >
              Actualizar
            </AppButton>
          </AppInline>
        </AppCard>

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          isEmpty={Boolean(query.data) && items.length === 0}
          onRetry={() => query.refetch()}
          loadingVariant="skeleton-grid"
          emptyTitle="Sin operaciones PPPoE"
          emptyDescription="Esta cuenta todavía no tiene operaciones técnicas registradas."
          variant="plain"
          size="sm"
          minHeight="md"
        >
          {items.length > 0 ? (
            <AppStack gap="sm">
              {items.map((item) => (
                <OperationCard
                  key={item.id}
                  item={item}
                  onView={handleOpenOperation}
                />
              ))}

              <AppCard variant="outline" size="xs" radius="md" className="p-2">
                <AppInline
                  justify="between"
                  align="center"
                  collapseBelow="sm"
                  gap="sm"
                  fullWidth
                >
                  <p className={`text-xs ${mutedTextClass}`}>
                    Página{" "}
                    <span className="font-medium text-[hsl(var(--app-foreground))]">
                      {meta.page}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium text-[hsl(var(--app-foreground))]">
                      {Math.max(meta.totalPages, 1)}
                    </span>
                    {" · "}
                    {meta.total} registros
                  </p>

                  <AppInline gap="xs">
                    <AppButton
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={!canGoPrevious || query.isFetching}
                      leftIcon={<ChevronLeft size={13} aria-hidden="true" />}
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                    >
                      Anterior
                    </AppButton>

                    <AppButton
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={!canGoNext || query.isFetching}
                      rightIcon={<ChevronRight size={13} aria-hidden="true" />}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Siguiente
                    </AppButton>
                  </AppInline>
                </AppInline>
              </AppCard>
            </AppStack>
          ) : (
            <AppEmptyState
              title="Sin operaciones PPPoE"
              description="Esta cuenta todavía no registra actividad técnica."
            />
          )}
        </AppDataState>
      </AppStack>

      <PppoeOperacionDetailDialog
        cuentaPppoeId={cuentaPppoeId}
        operacionId={selectedOperationId}
        open={selectedOperationId !== null}
        onOpenChange={handleDialogChange}
      />
    </>
  );
}
