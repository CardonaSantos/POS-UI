import type { ReactNode } from "react";

import {
  Activity,
  CircleAlert,
  Clock3,
  Network,
  RefreshCcw,
  Router,
  Terminal,
  UserRound,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppDataState } from "@/components/app/primitives/app-data-state";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetPppoeOperacionDetalle } from "@/Crm/CrmHooks/hooks/pppoe-operaciones/pppoe-operaciones-hook";

import type { PppoeOperacionDetalle } from "@/Crm/features/pppoe-operaciones/pppoe-operaciones.interfaces";

import type {
  EstadoOperacionPppoe,
  EstadoPasoPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import { formattFechaWithMinutes } from "@/utils/formattFechas";

type Props = {
  cuentaPppoeId: number;

  operacionId: number | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;
};

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

type DetailItemProps = {
  label: string;

  value: ReactNode;
};

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function EmptyValue({ label = "Sin registrar" }: { label?: string }) {
  return <span className={`text-xs italic ${mutedTextClass}`}>{label}</span>;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <dt className={`text-[11px] leading-tight ${mutedTextClass}`}>{label}</dt>

      <dd className="mt-0.5 break-words text-xs font-medium leading-snug">
        {value ?? <EmptyValue />}
      </dd>
    </div>
  );
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

function getStepTone(estado: EstadoPasoPppoe): AppBadgeTone {
  switch (estado) {
    case "EXITOSO":
      return "success";

    case "FALLIDO":
      return "danger";

    case "EJECUTANDO":
      return "primary";

    case "PENDIENTE":
      return "warning";

    case "OMITIDO":
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

function OperationSummary({ operation }: { operation: PppoeOperacionDetalle }) {
  return (
    <AppStack gap="sm">
      <AppGrid
        cols={{
          base: 2,
          md: 4,
        }}
        gap="sm"
      >
        <DetailItem label="Tipo" value={humanizeEnum(operation.tipo)} />

        <DetailItem
          label="Estado"
          value={
            <AppBadge
              tone={getOperationTone(operation.estado)}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {humanizeEnum(operation.estado)}
            </AppBadge>
          }
        />

        <DetailItem label="Intento" value={`#${operation.numeroIntento}`} />

        <DetailItem label="Canal" value={humanizeEnum(operation.canal)} />

        <DetailItem label="Origen" value={humanizeEnum(operation.origen)} />

        <DetailItem
          label="Usuario PPPoE"
          value={operation.usuarioPppoeSnapshot}
        />

        <DetailItem
          label="Perfil"
          value={operation.codigoPerfilSnapshot ?? <EmptyValue />}
        />

        <DetailItem
          label="Duración"
          value={formatDuration(operation.duracionMs)}
        />
      </AppGrid>

      <AppSeparator size="xs" spacing="xs" />

      <AppGrid
        cols={{
          base: 1,
          md: 3,
        }}
        gap="sm"
      >
        <DetailItem
          label="Creada"
          value={formattFechaWithMinutes(operation.creadoEn)}
        />

        <DetailItem
          label="Iniciada"
          value={
            operation.iniciadoEn ? (
              formattFechaWithMinutes(operation.iniciadoEn)
            ) : (
              <EmptyValue />
            )
          }
        />

        <DetailItem
          label="Finalizada"
          value={
            operation.finalizadoEn ? (
              formattFechaWithMinutes(operation.finalizadoEn)
            ) : (
              <EmptyValue />
            )
          }
        />
      </AppGrid>
    </AppStack>
  );
}

function OperationContext({ operation }: { operation: PppoeOperacionDetalle }) {
  const cliente = operation.cuentaPppoe.accesoInternet.cliente;

  const servicio = operation.cuentaPppoe.accesoInternet.servicioInternet;

  return (
    <AppGrid
      cols={{
        base: 1,
        lg: 3,
      }}
      gap="sm"
    >
      <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-3">
        <AppInline align="center" gap="xs">
          <UserRound size={14} aria-hidden="true" />

          <p className="text-xs font-semibold">Cliente</p>
        </AppInline>

        <AppStack gap="xs" className="mt-2">
          <p className="text-xs font-medium">
            {[cliente.nombre, cliente.apellidos].filter(Boolean).join(" ")}
          </p>

          <p className={`text-[11px] ${mutedTextClass}`}>
            #{cliente.id}
            {cliente.telefono ? ` · ${cliente.telefono}` : ""}
          </p>
        </AppStack>
      </div>

      <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-3">
        <AppInline align="center" gap="xs">
          <Router size={14} aria-hidden="true" />

          <p className="text-xs font-semibold">Router</p>
        </AppInline>

        <AppStack gap="xs" className="mt-2">
          <p className="text-xs font-medium">
            {operation.mikrotikRouter.nombre}
          </p>

          <p className={`text-[11px] ${mutedTextClass}`}>
            {operation.mikrotikRouter.host}:{operation.mikrotikRouter.sshPort}
          </p>
        </AppStack>
      </div>

      <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-3">
        <AppInline align="center" gap="xs">
          <Network size={14} aria-hidden="true" />

          <p className="text-xs font-semibold">Servicio</p>
        </AppInline>

        <AppStack gap="xs" className="mt-2">
          {servicio ? (
            <>
              <p className="text-xs font-medium">{servicio.nombre}</p>

              <p className={`text-[11px] ${mutedTextClass}`}>
                {servicio.velocidad || "Sin velocidad registrada"}
              </p>
            </>
          ) : (
            <EmptyValue label="Sin servicio relacionado" />
          )}
        </AppStack>
      </div>
    </AppGrid>
  );
}

function OperationSteps({ operation }: { operation: PppoeOperacionDetalle }) {
  if (operation.pasos.length === 0) {
    return (
      <EmptyValue label="La operación no contiene pasos técnicos registrados." />
    );
  }

  const orderedSteps = [...operation.pasos].sort((a, b) => a.orden - b.orden);

  return (
    <AppStack gap="xs">
      {orderedSteps.map((step) => (
        <article
          key={step.id}
          className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-3"
        >
          <AppStack gap="sm">
            <AppInline justify="between" align="start" gap="sm" fullWidth>
              <div className="min-w-0">
                <AppInline align="center" gap="xs" wrap>
                  <span
                    className={`text-[11px] tabular-nums ${mutedTextClass}`}
                  >
                    {step.orden}.
                  </span>

                  <p className="text-xs font-semibold">
                    {humanizeEnum(step.tipo)}
                  </p>
                </AppInline>

                <p className={`mt-1 text-[11px] ${mutedTextClass}`}>
                  {formatDuration(step.duracionMs)}
                </p>
              </div>

              <AppBadge
                tone={getStepTone(step.estado)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(step.estado)}
              </AppBadge>
            </AppInline>

            {step.comandoSanitizado ? (
              <div>
                <p
                  className={`mb-1 text-[10px] font-medium uppercase tracking-wide ${mutedTextClass}`}
                >
                  Comando sanitizado
                </p>

                <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-muted)/0.45)] p-2 text-[11px]">
                  {step.comandoSanitizado}
                </pre>
              </div>
            ) : null}

            {step.respuestaSanitizada ? (
              <div>
                <p
                  className={`mb-1 text-[10px] font-medium uppercase tracking-wide ${mutedTextClass}`}
                >
                  Respuesta sanitizada
                </p>

                <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-muted)/0.45)] p-2 text-[11px]">
                  {step.respuestaSanitizada}
                </pre>
              </div>
            ) : null}

            {step.errorMensaje ? (
              <AppAlert
                tone="danger"
                title={step.errorCodigo || "Error técnico"}
                size="xs"
              >
                {step.errorMensaje}
              </AppAlert>
            ) : null}
          </AppStack>
        </article>
      ))}
    </AppStack>
  );
}

function OperationRetries({ operation }: { operation: PppoeOperacionDetalle }) {
  if (operation.reintentos.length === 0) {
    return <EmptyValue label="Sin reintentos posteriores." />;
  }

  return (
    <AppStack gap="xs">
      {operation.reintentos.map((retry) => (
        <div
          key={retry.id}
          className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2"
        >
          <AppInline justify="between" align="center" gap="xs" fullWidth>
            <div className="min-w-0">
              <p className="text-xs font-semibold">Operación #{retry.id}</p>

              <p className={`text-[11px] ${mutedTextClass}`}>
                Intento #{retry.numeroIntento}
              </p>
            </div>

            <AppBadge
              tone={getOperationTone(retry.estado)}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {humanizeEnum(retry.estado)}
            </AppBadge>
          </AppInline>

          {retry.errorMensaje ? (
            <p className="mt-2 text-xs">{retry.errorMensaje}</p>
          ) : null}
        </div>
      ))}
    </AppStack>
  );
}

export function PppoeOperacionDetailDialog({
  cuentaPppoeId,
  operacionId,
  open,
  onOpenChange,
}: Props) {
  const query = useGetPppoeOperacionDetalle(
    cuentaPppoeId,

    operacionId ?? 0,

    open && operacionId !== null,
  );

  const operation = query.data;

  return (
    <AppDialog modal open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="2xl" className="max-h-[90vh]">
        <AppDialogHeader>
          <AppDialogTitle>
            {operation
              ? `Operación #${operation.id}`
              : "Detalle de operación PPPoE"}
          </AppDialogTitle>

          <AppDialogDescription>
            Diagnóstico técnico, ejecución y trazabilidad de la operación.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody className="max-h-[76vh] overflow-y-auto">
          <AppDataState
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            error={query.error}
            isEmpty={!operation}
            onRetry={() => query.refetch()}
            loadingVariant="skeleton-grid"
            emptyTitle="Operación no disponible"
            emptyDescription="No fue posible obtener el detalle de esta operación."
            variant="plain"
            size="sm"
            minHeight="md"
          >
            {operation ? (
              <AppStack gap="md">
                <OperationSummary operation={operation} />

                {operation.errorMensaje ? (
                  <AppAlert
                    tone="danger"
                    title={operation.errorCodigo || "Error de operación"}
                    size="xs"
                  >
                    {operation.errorMensaje}
                  </AppAlert>
                ) : null}

                {operation.motivo ? (
                  <div>
                    <AppInline align="center" gap="xs">
                      <CircleAlert size={13} aria-hidden="true" />

                      <p className="text-xs font-semibold">Motivo</p>
                    </AppInline>

                    <p className="mt-1 whitespace-pre-wrap text-xs">
                      {operation.motivo}
                    </p>
                  </div>
                ) : null}

                <AppSeparator />

                <section>
                  <AppInline align="center" gap="xs" className="mb-2">
                    <Activity size={14} aria-hidden="true" />

                    <h3 className="text-sm font-semibold">Contexto</h3>
                  </AppInline>

                  <OperationContext operation={operation} />
                </section>

                <AppSeparator />

                <section>
                  <AppInline
                    justify="between"
                    align="center"
                    gap="sm"
                    className="mb-2"
                    fullWidth
                  >
                    <AppInline align="center" gap="xs">
                      <Terminal size={14} aria-hidden="true" />

                      <h3 className="text-sm font-semibold">Pasos técnicos</h3>
                    </AppInline>

                    <AppBadge
                      tone="neutral"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {operation.pasos.length} pasos
                    </AppBadge>
                  </AppInline>

                  <OperationSteps operation={operation} />
                </section>

                <AppSeparator />

                <section>
                  <AppInline
                    justify="between"
                    align="center"
                    gap="sm"
                    className="mb-2"
                    fullWidth
                  >
                    <AppInline align="center" gap="xs">
                      <RefreshCcw size={14} aria-hidden="true" />

                      <h3 className="text-sm font-semibold">Reintentos</h3>
                    </AppInline>

                    <AppBadge
                      tone="neutral"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {operation.reintentos.length}
                    </AppBadge>
                  </AppInline>

                  <OperationRetries operation={operation} />
                </section>

                {operation.resultado ? (
                  <>
                    <AppSeparator />

                    <section>
                      <AppInline align="center" gap="xs" className="mb-2">
                        <Clock3 size={14} aria-hidden="true" />

                        <h3 className="text-sm font-semibold">
                          Resultado técnico
                        </h3>
                      </AppInline>

                      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-muted)/0.45)] p-3 text-[11px]">
                        {JSON.stringify(operation.resultado, null, 2)}
                      </pre>
                    </section>
                  </>
                ) : null}
              </AppStack>
            ) : null}
          </AppDataState>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
