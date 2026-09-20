import { memo } from "react";
import { ArrowLeft, CalendarClock, Hash, Wrench } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  formatDateTime,
  formatTipo,
  getEstadoVisual,
} from "../tecnico-instalacion-detalle.utils";

type InstalacionDetalleHeaderProps = {
  detalle: DetalleInstalacionTecnicaResponse;
  onBack: () => void;
};

export const InstalacionDetalleHeader = memo(
  function InstalacionDetalleHeader({
    detalle,
    onBack,
  }: InstalacionDetalleHeaderProps) {
    const estado = getEstadoVisual(detalle.estado);
    const scheduledAt = formatDateTime(detalle.agenda.programadaPara);

    return (
      <header>
        <AppStack gap="sm">
          <AppInline justify="between" align="start" gap="sm" fullWidth>
            <AppButton
              size="iconSm"
              variant="ghost"
              aria-label="Volver a instalaciones"
              onClick={onBack}
            >
              <ArrowLeft aria-hidden="true" />
            </AppButton>

            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Wrench className="size-5" />
            </span>
          </AppInline>

          <div className="min-w-0">
            <AppInline gap="xs" wrap>
              <AppBadge tone={estado.tone} size="xs" dot>
                {estado.label}
              </AppBadge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="size-3.5" aria-hidden="true" />
                {detalle.id}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTipo(detalle.tipo)}
              </span>
            </AppInline>

            <h1 id="instalacion-detalle-title" className="mt-2 break-words text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {detalle.cliente.nombreCompleto}
            </h1>

            {scheduledAt ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
                {scheduledAt}
              </p>
            ) : null}
          </div>
        </AppStack>
      </header>
    );
  },
);
