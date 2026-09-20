import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { InstalacionPppoeOperacionTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import { usePostReintentarPppoeOperacion } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import { buildReintentarPppoeOperacionPayload } from "../utils/pppoe-operacion-retry.utils";

type Props = {
  item: InstalacionPppoeOperacionTimelineItem;

  onSuccess?: () => void;
};

export function AuditoriaReintentarOperacionButton({ item, onSuccess }: Props) {
  const operacionId = item.operacion.id;

  const mutation = usePostReintentarPppoeOperacion(operacionId);

  const handleRetry = () => {
    const payload = buildReintentarPppoeOperacionPayload(item);

    mutation.mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <AppInline justify="end" align="center">
      <AppButton
        type="button"
        variant="secondary"
        size="sm"
        disabled={mutation.isPending}
        onClick={handleRetry}
      >
        <RotateCcw
          className={mutation.isPending ? "size-4 animate-spin" : "size-4"}
          aria-hidden="true"
        />

        {mutation.isPending ? "Reintentando..." : "Reintentar operación"}
      </AppButton>
    </AppInline>
  );
}
