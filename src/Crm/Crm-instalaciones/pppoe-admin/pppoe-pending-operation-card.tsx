import { ShieldCheck } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { InstalacionPppoeOperacionTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import type { PppoeAdminActionRequest } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";
import {
  formatAuditDate,
  humanizeEnum,
} from "../details/instalacion-utils.utils";

type Props = {
  empresaId: number;
  instalacionId: number;
  item: InstalacionPppoeOperacionTimelineItem;
  onAction: (request: PppoeAdminActionRequest) => void;
};

export function PppoePendingOperationCard({
  empresaId,
  instalacionId,
  item,
  onAction,
}: Props) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline justify="between" align="start" gap="sm" fullWidth>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              Operación pendiente de autorización
            </p>
            <p className="mt-0.5 text-xs text-[hsl(var(--app-muted-foreground))]">
              #{item.operacion.id} · {humanizeEnum(item.operacion.tipo)} ·
              intento {item.operacion.numeroIntento}
            </p>
          </div>

          <AppBadge tone="warning" appearance="soft" size="xs" radius="full">
            {humanizeEnum(item.operacion.estado)}
          </AppBadge>
        </AppInline>

        <p className="text-xs">
          {item.operacion.motivo ??
            "La operación requiere reautenticación administrativa."}
        </p>

        <AppInline
          justify="between"
          align="center"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <span className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
            Creada {formatAuditDate(item.operacion.creadoEn)}
          </span>

          <AppButton
            type="button"
            size="sm"
            onClick={() =>
              onAction({
                action: "autorizarOperacion",
                instalacionId,
                operacionId: item.operacion.id,
                empresaId,
              })
            }
          >
            <ShieldCheck aria-hidden="true" />
            Autorizar operación
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
