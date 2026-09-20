import { ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";

interface TicketConformidadBackButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export function TicketConformidadBackButton({
  disabled = false,
  onClick,
}: TicketConformidadBackButtonProps) {
  return (
    <AppButton
      type="button"
      variant="ghost"
      size="sm"
      leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
      disabled={disabled}
      onClick={onClick}
    >
      Cambiar respuesta
    </AppButton>
  );
}
