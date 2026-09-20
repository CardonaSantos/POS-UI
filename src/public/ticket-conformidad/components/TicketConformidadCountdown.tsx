import { Clock3, TriangleAlert } from "lucide-react";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { useTicketConformidadCountdown } from "../hooks/tickets-conformidad/use-ticket-conformidad-countdown";

interface TicketConformidadCountdownProps {
  expiraEn: string;
  onExpired?: () => void;
}

function formatExpirationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function TicketConformidadCountdown({
  expiraEn,
}: TicketConformidadCountdownProps) {
  const countdown = useTicketConformidadCountdown(expiraEn);

  if (!countdown.validDate) {
    return (
      <AppAlert tone="danger" title="No se pudo validar la vigencia del enlace">
        Solicite un nuevo enlace al personal encargado.
      </AppAlert>
    );
  }

  if (countdown.expired) {
    return (
      <AppAlert
        tone="danger"
        title="Este enlace ha expirado"
        icon={<TriangleAlert size={18} />}
      >
        Solicite un nuevo enlace al personal encargado.
      </AppAlert>
    );
  }

  const isNearExpiration = countdown.remainingMs <= 5 * 60 * 1000;

  return (
    <AppAlert
      tone={isNearExpiration ? "warning" : "info"}
      title={
        isNearExpiration
          ? "El enlace vencerá pronto"
          : "Tiempo disponible para responder"
      }
      icon={<Clock3 size={18} />}
    >
      <div className="space-y-1">
        <p
          className="text-xs font-semibold tabular-nums"
          aria-label={`Tiempo restante: ${countdown.formatted}`}
        >
          {countdown.formatted}
        </p>

        <p className="text-xs opacity-80">
          Disponible hasta {formatExpirationDate(expiraEn)}
        </p>
      </div>
    </AppAlert>
  );
}
