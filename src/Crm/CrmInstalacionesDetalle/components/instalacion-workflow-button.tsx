import { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import {
  getActionDisabledReason,
  InstalacionDetalleActionKey,
} from "../tecnico-instalacion-detalle.utils";
import { memo } from "react";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  Play,
} from "lucide-react";

type WorkflowButtonProps = {
  action: InstalacionDetalleActionKey;

  detalle: DetalleInstalacionTecnicaResponse;

  hasHandler: boolean;

  primary?: boolean;

  onAction: (action: InstalacionDetalleActionKey) => void;
};

export const WorkflowButton = memo(function WorkflowButton({
  action,
  detalle,
  hasHandler,
  primary = false,
  onAction,
}: WorkflowButtonProps) {
  const disabledReason = getActionDisabledReason(detalle, action, hasHandler);

  const Icon = getActionIcon(action);

  const label = getActionLabel(action);
  return (
    <AppButton
      type="button"
      size={primary ? "sm" : "xs"}
      width={primary ? "full" : undefined}
      variant={
        primary ? "primary" : action === "cancelar" ? "danger" : "outline"
      }
      disabled={Boolean(disabledReason)}
      title={disabledReason ?? undefined}
      aria-label={label}
      onClick={() => onAction(action)}
    >
      <Icon aria-hidden="true" />

      {label}
    </AppButton>
  );
});

function getActionIcon(action: InstalacionDetalleActionKey) {
  switch (action) {
    case "iniciar":
      return Play;

    case "completar":
      return CheckCircle2;

    case "reprogramar":
      return CalendarClock;

    case "subirEvidencia":
      return ImagePlus;

    case "cancelar":
      return Ban;

    default:
      return ClipboardList;
  }
}
function getActionLabel(action: InstalacionDetalleActionKey): string {
  switch (action) {
    case "iniciar":
      return "Iniciar instalación";

    case "completar":
      return "Finalizar instalación";

    case "reprogramar":
      return "Reprogramar";

    case "subirEvidencia":
      return "Subir evidencias";

    case "cancelar":
      return "Cancelar instalación";

    default:
      return "Acción";
  }
}
