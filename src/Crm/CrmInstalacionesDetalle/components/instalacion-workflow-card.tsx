import { memo, useCallback } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Wifi,
} from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  formatDateTime,
  formatEnumValue,
  getPrimaryWorkflowAction,
  type InstalacionDetalleActionKey,
  type InstalacionDetalleActionRequest,
} from "../tecnico-instalacion-detalle.utils";
import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";
import { WorkflowButton } from "./instalacion-workflow-button";

type InstalacionWorkflowCardProps = {
  detalle: DetalleInstalacionTecnicaResponse;
  onAction?: (request: InstalacionDetalleActionRequest) => void;
};

const SECONDARY_ACTIONS: readonly InstalacionDetalleActionKey[] = [
  "subirEvidencia",
];

type BadgeTone =
  | "neutral"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

function getEstadoTone(
  estado: DetalleInstalacionTecnicaResponse["estado"],
): BadgeTone {
  switch (estado) {
    case "PROGRAMADA":
    case "REPROGRAMADA":
      return "info";

    case "EN_PROCESO":
      return "primary";

    case "COMPLETADA":
      return "success";

    case "CANCELADA":
      return "neutral";

    case "FALLIDA":
      return "danger";

    default:
      return "neutral";
  }
}

function getWorkflowDescription(detalle: DetalleInstalacionTecnicaResponse): {
  title: string;
  description: string;
} {
  switch (detalle.estado) {
    case "PROGRAMADA":
      return {
        title: "Instalación pendiente",
        description:
          "Inicie la instalación cuando comience el trabajo en sitio.",
      };

    case "REPROGRAMADA":
      return {
        title: "Instalación reprogramada",
        description: "La instalación tiene una nueva fecha programada.",
      };

    case "EN_PROCESO":
      return {
        title: "Instalación en proceso",
        description:
          "Finalice la instalación cuando el trabajo físico y el servicio hayan quedado entregados.",
      };

    case "COMPLETADA":
      return {
        title: "Instalación finalizada",
        description: "El trabajo de instalación ya fue completado.",
      };

    case "CANCELADA":
      return {
        title: "Instalación cancelada",
        description: "Esta instalación fue cancelada.",
      };

    case "FALLIDA":
      return {
        title: "Instalación fallida",
        description: "La instalación terminó sin poder completarse.",
      };

    default:
      return {
        title: formatEnumValue(detalle.estado),
        description: "Consulte el estado actual de la instalación.",
      };
  }
}

export const InstalacionWorkflowCard = memo(function InstalacionWorkflowCard({
  detalle,
  onAction,
}: InstalacionWorkflowCardProps) {
  const primaryAction = getPrimaryWorkflowAction(detalle);

  const workflow = getWorkflowDescription(detalle);

  const plan = detalle.servicioInternet
    ? detalle.servicioInternet.nombre
    : "Sin plan";

  const handleAction = useCallback(
    (action: InstalacionDetalleActionKey) => {
      onAction?.({
        action,
        instalacionId: detalle.id,
      });
    },
    [detalle.id, onAction],
  );

  return (
    <DetalleSectionCard
      id="flujo-instalacion"
      title="Flujo de instalación"
      icon={ClipboardList}
      trailing={
        <AppBadge
          tone={getEstadoTone(detalle.estado)}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {formatEnumValue(detalle.estado)}
        </AppBadge>
      }
    >
      <AppStack gap="sm">
        <AppGrid
          cols={{
            base: 1,
            sm: 2,
            lg: 3,
          }}
          gap="xs"
        >
          <DetailValueRow
            icon={CalendarClock}
            label="Programada"
            value={formatDateTime(detalle.agenda.programadaPara) ?? "Sin fecha"}
          />

          {detalle.agenda.inicioReal ? (
            <DetailValueRow
              icon={Clock3}
              label="Inicio"
              value={formatDateTime(detalle.agenda.inicioReal) ?? "Sin fecha"}
            />
          ) : (
            <DetailValueRow icon={Wifi} label="Plan" value={plan} />
          )}

          {detalle.agenda.inicioReal ? (
            <DetailValueRow icon={Wifi} label="Plan" value={plan} />
          ) : null}
        </AppGrid>

        <div
          className="
              rounded-[var(--app-radius-md)]
              border
              border-[hsl(var(--app-border,var(--border)))]
              bg-[hsl(var(--app-muted,var(--muted)))/0.24]
              px-3 py-3
            "
        >
          <AppStack gap="sm">
            <div>
              <p className="text-sm font-medium text-foreground">
                {workflow.title}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {workflow.description}
              </p>
            </div>

            {primaryAction ? (
              <WorkflowButton
                action={primaryAction}
                detalle={detalle}
                hasHandler={Boolean(onAction)}
                primary
                onAction={handleAction}
              />
            ) : detalle.estado === "COMPLETADA" ? (
              <AppInline align="center" gap="xs">
                <CheckCircle2
                  className="size-4 text-[hsl(var(--app-success))]"
                  aria-hidden="true"
                />

                <span className="text-xs font-medium text-foreground">
                  Trabajo finalizado
                </span>
              </AppInline>
            ) : null}
          </AppStack>
        </div>

        <AppInline gap="xs" wrap fullWidth>
          {SECONDARY_ACTIONS.map((action) => {
            const actionState = detalle.acciones[action];

            if (!actionState) {
              return null;
            }

            return (
              <WorkflowButton
                key={action}
                action={action}
                detalle={detalle}
                hasHandler={Boolean(onAction)}
                onAction={handleAction}
              />
            );
          })}
        </AppInline>
      </AppStack>
    </DetalleSectionCard>
  );
});
