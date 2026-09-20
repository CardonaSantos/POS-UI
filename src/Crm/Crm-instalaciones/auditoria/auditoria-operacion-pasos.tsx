import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { PppoeOperacionPaso } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  formatPppoeDuration,
  getStepTitle,
  getStepTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

type Props = {
  pasos: PppoeOperacionPaso[];
};

export function AuditoriaOperacionPasos({ pasos }: Props) {
  if (pasos.length === 0) {
    return (
      <p className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
        La operación no registró pasos técnicos.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {pasos.map((step) => (
        <li key={step.id}>
          <AppCard variant="outline" size="xs" radius="md" className="p-2">
            <AppStack gap="xs">
              <AppInline
                justify="between"
                align="start"
                gap="xs"
                collapseBelow="sm"
                fullWidth
              >
                <AppInline align="start" gap="xs" wrap={false}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--app-muted))] text-[10px] font-semibold">
                    {step.orden}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">
                      {getStepTitle(step.tipo)}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                      {formatPppoeDuration(step.duracionMs)}
                    </p>
                  </div>
                </AppInline>

                <AppBadge
                  tone={getStepTone(step.estado)}
                  appearance="soft"
                  size="xs"
                  radius="full"
                >
                  {humanizePppoeEnum(step.estado)}
                </AppBadge>
              </AppInline>

              {step.comandoSanitizado ? (
                <div>
                  <p className="text-[10px] font-medium text-[hsl(var(--app-muted-foreground))]">
                    Comando sanitizado
                  </p>
                  <code className="mt-0.5 block break-all rounded bg-[hsl(var(--app-muted))] p-2 text-[10px]">
                    {step.comandoSanitizado}
                  </code>
                </div>
              ) : null}

              {step.respuestaSanitizada ? (
                <div>
                  <p className="text-[10px] font-medium text-[hsl(var(--app-muted-foreground))]">
                    Respuesta sanitizada
                  </p>
                  <p className="mt-0.5 break-words text-[11px]">
                    {step.respuestaSanitizada}
                  </p>
                </div>
              ) : null}

              {step.errorCodigo || step.errorMensaje ? (
                <AppAlert
                  tone="danger"
                  size="xs"
                  title={step.errorCodigo ?? "ERROR_TECNICO"}
                >
                  {step.errorMensaje ?? "Sin mensaje técnico."}
                </AppAlert>
              ) : null}
            </AppStack>
          </AppCard>
        </li>
      ))}
    </ol>
  );
}
