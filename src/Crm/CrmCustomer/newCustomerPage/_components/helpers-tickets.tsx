import {
  AlertCircle,
  CheckCircle,
  Clock,
  Clock3,
  Eye,
  HelpCircle,
} from "lucide-react";
import dayjs from "dayjs";

import { AppBadge } from "@/components/app/primitives/app-badge";

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export function formatTicketDate(value?: string | null, withTime = false) {
  if (!value) return "N/A";

  const parsed = dayjs(value);

  if (!parsed.isValid()) return "Fecha inválida";

  return parsed.format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY");
}

export function formatTicketLabel(value?: string | null) {
  if (!value) return "No especificado";

  return value.replace(/_/g, " ");
}

export function getTicketEstadoTone(estado?: string | null): BadgeTone {
  switch (estado) {
    case "CERRADO":
    case "CERRADA":
    case "COMPLETADO":
      return "success";

    case "EN_PROCESO":
    case "PENDIENTE_TECNICO":
    case "PENDIENTE_REVISION":
      return "warning";

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
      return "info";

    case "NUEVO":
    case "ABIERTA":
      return "primary";

    default:
      return "neutral";
  }
}

export function getTicketPrioridadTone(prioridad?: string | null): BadgeTone {
  switch (prioridad) {
    case "URGENTE":
      return "danger";

    case "ALTA":
      return "warning";

    case "MEDIA":
      return "info";

    case "BAJA":
      return "neutral";

    default:
      return "neutral";
  }
}

export function getTicketEstadoIcon(estado?: string | null) {
  switch (estado) {
    case "CERRADO":
    case "CERRADA":
    case "COMPLETADO":
      return <CheckCircle size={13} />;

    case "EN_PROCESO":
    case "PENDIENTE_TECNICO":
    case "PENDIENTE_REVISION":
      return <Clock3 size={13} />;

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
      return <Clock size={13} />;

    case "NUEVO":
    case "ABIERTA":
      return <AlertCircle size={13} />;

    default:
      return <HelpCircle size={13} />;
  }
}

export function TicketEstadoBadge({ estado }: { estado?: string | null }) {
  return (
    <AppBadge
      tone={getTicketEstadoTone(estado)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      <span className="inline-flex items-center gap-1">
        {getTicketEstadoIcon(estado)}
        {formatTicketLabel(estado)}
      </span>
    </AppBadge>
  );
}

export function TicketPrioridadBadge({
  prioridad,
}: {
  prioridad?: string | null;
}) {
  return (
    <AppBadge
      tone={getTicketPrioridadTone(prioridad)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {formatTicketLabel(prioridad)}
    </AppBadge>
  );
}

export function ViewTicketIcon() {
  return <Eye size={14} />;
}
