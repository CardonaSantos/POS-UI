import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import { AppBadgeTone } from "@/Crm/CrmServices/_components/crm-service.helpers";
import {
  EstadoTicketSoporte,
  TicketAsignadoTecnico,
} from "@/Crm/features/dashboard/dashboard-tickets";
import { cn } from "@/lib/utils";
import { copyToClipBoard } from "@/utils/clipBoard";
import {
  CalendarClock,
  ClipboardCopy,
  FileText,
  ImageIcon,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  RouteIcon,
  StickyNote,
  User,
} from "lucide-react";
import { toast } from "sonner";

export type TicketStats = {
  total: number;
  urgentes: number;
  nuevos: number;
  enProceso: number;
  conUbicacion: number;
};

export function getTicketStats(tickets: TicketAsignadoTecnico[]): TicketStats {
  return tickets.reduce<TicketStats>(
    (acc, ticket) => {
      acc.total += 1;

      if (ticket.prioridad === "URGENTE") {
        acc.urgentes += 1;
      }

      if (ticket.estado === "NUEVO" || ticket.estado === "ABIERTA") {
        acc.nuevos += 1;
      }

      if (ticket.estado === "EN_PROCESO") {
        acc.enProceso += 1;
      }

      if (ticket.ubicacionMaps) {
        acc.conUbicacion += 1;
      }

      return acc;
    },
    {
      total: 0,
      urgentes: 0,
      nuevos: 0,
      enProceso: 0,
      conUbicacion: 0,
    },
  );
}

export function sortTicketsForTechnician(
  a: TicketAsignadoTecnico,
  b: TicketAsignadoTecnico,
) {
  const priorityDiff =
    getPriorityScore(b.prioridad) - getPriorityScore(a.prioridad);

  if (priorityDiff !== 0) return priorityDiff;

  const stateDiff = getStateScore(b.estado) - getStateScore(a.estado);

  if (stateDiff !== 0) return stateDiff;

  return new Date(b.abiertoEn).getTime() - new Date(a.abiertoEn).getTime();
}

export function getPriorityScore(priority: TicketAsignadoTecnico["prioridad"]) {
  switch (priority) {
    case "URGENTE":
      return 4;
    case "ALTA":
      return 3;
    case "MEDIA":
      return 2;
    case "BAJA":
      return 1;
    default:
      return 0;
  }
}

export function getStateScore(state: EstadoTicketSoporte) {
  switch (state) {
    case "EN_PROCESO":
      return 5;
    case "NUEVO":
    case "ABIERTA":
      return 4;
    case "PENDIENTE_TECNICO":
      return 3;
    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
      return 2;
    case "PENDIENTE_REVISION":
      return 1;
    default:
      return 0;
  }
}

// OTROS HELPERS

export function getEstadoTicketMeta(estado: EstadoTicketSoporte): {
  label: string;
  tone: AppBadgeTone;
} {
  switch (estado) {
    case "EN_PROCESO":
      return {
        label: "En proceso",
        tone: "warning",
      };

    case "PENDIENTE_REVISION":
      return {
        label: "En revisión",
        tone: "info",
      };

    case "NUEVO":
    case "ABIERTA":
      return {
        label: "Nuevo",
        tone: "success",
      };

    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
      return {
        label: formatEnumLabel(estado),
        tone: "primary",
      };

    case "RESUELTA":
    case "CERRADO":
      return {
        label: formatEnumLabel(estado),
        tone: "neutral",
      };

    case "CANCELADA":
    case "ARCHIVADA":
      return {
        label: formatEnumLabel(estado),
        tone: "danger",
      };

    default:
      return {
        label: formatEnumLabel(estado),
        tone: "neutral",
      };
  }
}

export function getPrioridadTicketMeta(
  prioridad: TicketAsignadoTecnico["prioridad"],
): {
  label: string;
  tone: AppBadgeTone;
} {
  switch (prioridad) {
    case "URGENTE":
      return {
        label: "Urgente",
        tone: "danger",
      };

    case "ALTA":
      return {
        label: "Alta",
        tone: "warning",
      };

    case "MEDIA":
      return {
        label: "Media",
        tone: "info",
      };

    case "BAJA":
      return {
        label: "Baja",
        tone: "neutral",
      };

    default:
      return {
        label: String(prioridad),
        tone: "neutral",
      };
  }
}
type TicketLifecycleAction = "start" | "review";
export function getLifecycleAction(
  estado: EstadoTicketSoporte,
): TicketLifecycleAction | null {
  if (estado === "EN_PROCESO") return "review";

  if (
    estado === "NUEVO" ||
    estado === "ABIERTA" ||
    estado === "PENDIENTE" ||
    estado === "PENDIENTE_CLIENTE" ||
    estado === "PENDIENTE_TECNICO"
  ) {
    return "start";
  }

  return null;
}

export function getBlockedActionLabel(estado: EstadoTicketSoporte) {
  if (estado === "PENDIENTE_REVISION") return "Pendiente de revisión";
  if (estado === "RESUELTA" || estado === "CERRADO") return "Finalizado";
  if (estado === "CANCELADA") return "Cancelado";
  if (estado === "ARCHIVADA") return "Archivado";

  return "Sin acción disponible";
}

export function getTicketAccentClass(tone: AppBadgeTone) {
  switch (tone) {
    case "danger":
      return "border-l-[hsl(var(--app-danger,var(--destructive)))]";

    case "warning":
      return "border-l-[hsl(var(--app-warning))]";

    case "success":
      return "border-l-[hsl(var(--app-success))]";

    case "info":
      return "border-l-[hsl(var(--app-info))]";

    case "primary":
      return "border-l-[hsl(var(--app-primary,var(--primary)))]";

    default:
      return "border-l-[hsl(var(--app-border,var(--border)))]";
  }
}

export function formatEnumLabel(value: string) {
  return value
    .replace("_", " ")
    .toLowerCase()
    .replace(/^\w|\s\w/g, (match) => match.toUpperCase());
}

export function formatTicketDate(fechaIso?: string | null) {
  if (!fechaIso) return "Sin fecha";

  const date = new Date(fechaIso);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Guatemala",
  }).format(date);
}

export function getDireccionText(
  direccion: TicketAsignadoTecnico["direccion"] | string | null | undefined,
) {
  if (!direccion) return "";

  if (typeof direccion === "string") return direccion.trim();

  return [direccion.direccion, direccion.sector, direccion.municipio]
    .filter(Boolean)
    .join(", ")
    .trim();
}

// OTROS HELPERS

export function TicketHero({ ticket }: { ticket: TicketAsignadoTecnico }) {
  const estadoMeta = getEstadoTicketMeta(ticket.estado);
  const prioridadMeta = getPrioridadTicketMeta(ticket.prioridad);
  const mediasCount = Array.isArray(ticket.medias) ? ticket.medias.length : 0;

  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="lg"
      className={cn(
        "border-l-[3px] p-2",
        getTicketAccentClass(prioridadMeta.tone),
      )}
    >
      <AppStack gap="xs">
        <AppInline gap="xs" align="center" justify="between">
          <AppInline gap="xs" align="center" wrap className="min-w-0">
            <AppBadge size="xs" tone={estadoMeta.tone} appearance="soft">
              {estadoMeta.label}
            </AppBadge>

            <AppBadge size="xs" tone={prioridadMeta.tone} appearance="soft">
              {prioridadMeta.label}
            </AppBadge>

            {mediasCount > 0 ? (
              <AppBadge size="xs" tone="info" appearance="soft">
                <ImageIcon className="h-3 w-3" />
                {mediasCount}
              </AppBadge>
            ) : null}
          </AppInline>

          <AppInline
            gap="xs"
            align="center"
            className="shrink-0 text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{formatTicketDate(ticket.abiertoEn)}</span>
          </AppInline>
        </AppInline>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
            {ticket.titulo || "Ticket sin título"}
          </h1>

          <p className="mt-1 line-clamp-3 text-sm leading-snug text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {ticket.descripcion || "Sin descripción registrada."}
          </p>
        </div>
      </AppStack>
    </AppCard>
  );
}

export function TicketContactSection({
  ticket,
}: {
  ticket: TicketAsignadoTecnico;
}) {
  return (
    <AppCard
      title={
        <AppInline gap="xs" align="center">
          <User className="h-4 w-4" />
          <span>Cliente</span>
        </AppInline>
      }
      description={`Cliente #${ticket.clientId}`}
      variant="outline"
      size="sm"
      radius="lg"
    >
      <AppStack gap="sm">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Nombre
          </p>

          <p className="text-base font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
            {ticket.clienteNombre || "Cliente sin nombre"}
          </p>
        </div>

        <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
          <PhoneActionBlock
            label="Contacto principal"
            phone={ticket.clienteTel}
          />

          <PhoneActionBlock
            label="Referencia"
            phone={ticket.referenciaContacto}
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}

function PhoneActionBlock({
  label,
  phone,
}: {
  label: string;
  phone?: string | null;
}) {
  const hasPhone = Boolean(phone);

  const openWhatsapp = () => {
    if (!phone) return;
    window.open(handleOpenWhatsapp(phone), "_blank", "noopener,noreferrer");
  };

  const callPhone = () => {
    if (!phone) return;
    window.location.href = handleCall(phone);
  };

  const copyPhone = () => {
    if (!phone) return;
    copyToClipBoard(phone);
    toast.success("Número copiado");
  };

  return (
    <div
      className={[
        "rounded-[var(--app-radius-md)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
        "px-2 py-2",
      ].join(" ")}
    >
      <AppInline gap="xs" align="center" justify="between" className="mb-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </p>

          <p className="truncate text-sm font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
            {phone || "No registrado"}
          </p>
        </div>

        {hasPhone ? (
          <AppBadge size="xs" tone="success" appearance="soft">
            Activo
          </AppBadge>
        ) : null}
      </AppInline>

      <AppGrid cols={3} gap="xs">
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          width="full"
          disabled={!hasPhone}
          leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
          onClick={openWhatsapp}
          className="h-8"
        >
          WA
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="ghost"
          width="full"
          disabled={!hasPhone}
          leftIcon={<Phone className="h-3.5 w-3.5" />}
          onClick={callPhone}
          className="h-8"
        >
          Llamar
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="ghost"
          width="full"
          disabled={!hasPhone}
          leftIcon={<ClipboardCopy className="h-3.5 w-3.5" />}
          onClick={copyPhone}
          className="h-8"
        >
          Copiar
        </AppButton>
      </AppGrid>
    </div>
  );
}

export function TicketLocationSection({
  ticket,
}: {
  ticket: TicketAsignadoTecnico;
}) {
  const hasLocation = Boolean(ticket.ubicacionMaps);
  const direccionText = getDireccionText(ticket.direccion);

  const openMaps = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const startRoute = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyCoords = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    copyToClipBoard(`${lat}, ${lng}`);
    toast.success("Coordenadas copiadas");
  };

  return (
    <AppCard
      title={
        <AppInline gap="xs" align="center">
          <MapPin className="h-4 w-4" />
          <span>Ubicación</span>
        </AppInline>
      }
      action={
        hasLocation ? (
          <AppBadge size="xs" tone="success" appearance="soft">
            GPS activo
          </AppBadge>
        ) : (
          <AppBadge size="xs" tone="warning" appearance="soft">
            Sin GPS
          </AppBadge>
        )
      }
      variant="outline"
      size="sm"
      radius="lg"
    >
      <AppStack gap="sm">
        <AppGrid cols={2} gap="xs">
          <InfoTile label="Municipio" value={ticket.direccion?.municipio} />
          <InfoTile label="Sector" value={ticket.direccion?.sector} />
        </AppGrid>

        <InfoTile
          label="Dirección exacta"
          value={direccionText || "Sin dirección registrada"}
          multiline
        />

        {ticket.observaciones ? (
          <div
            className={[
              "rounded-[var(--app-radius-md)]",
              "border border-[hsl(var(--app-warning)/0.35)]",
              "bg-[hsl(var(--app-warning)/0.08)]",
              "px-2 py-2",
            ].join(" ")}
          >
            <AppInline gap="xs" align="start">
              <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-warning))]" />

              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  Observaciones
                </p>

                <p className="whitespace-pre-line text-sm leading-snug text-[hsl(var(--app-foreground,var(--foreground)))]">
                  {ticket.observaciones}
                </p>
              </div>
            </AppInline>
          </div>
        ) : null}

        <AppSeparator spacing="none" />

        {hasLocation ? (
          <AppGrid cols={3} gap="xs">
            <AppButton
              type="button"
              size="sm"
              variant="primary"
              width="full"
              leftIcon={<RouteIcon className="h-4 w-4" />}
              onClick={startRoute}
              className="h-9"
            >
              Ruta
            </AppButton>

            <AppButton
              type="button"
              size="sm"
              variant="secondary"
              width="full"
              leftIcon={<Map className="h-4 w-4" />}
              onClick={openMaps}
              className="h-9"
            >
              Mapa
            </AppButton>

            <AppButton
              type="button"
              size="sm"
              variant="ghost"
              width="full"
              leftIcon={<ClipboardCopy className="h-4 w-4" />}
              onClick={copyCoords}
              className="h-9"
            >
              GPS
            </AppButton>
          </AppGrid>
        ) : (
          <p className="text-xs leading-snug text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Este ticket no tiene coordenadas GPS registradas.
          </p>
        )}
      </AppStack>
    </AppCard>
  );
}

export function TicketDescriptionSection({
  ticket,
}: {
  ticket: TicketAsignadoTecnico;
}) {
  return (
    <AppCard
      title={
        <AppInline gap="xs" align="center">
          <FileText className="h-4 w-4" />
          <span>Detalle del reporte</span>
        </AppInline>
      }
      variant="outline"
      size="sm"
      radius="lg"
    >
      <p className="whitespace-pre-line text-sm leading-relaxed text-[hsl(var(--app-foreground,var(--foreground)))]">
        {ticket.descripcion || "Sin descripción detallada."}
      </p>
    </AppCard>
  );
}

function InfoTile({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[var(--app-radius-md)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
        "px-2 py-2",
      ].join(" ")}
    >
      <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {label}
      </p>

      <p
        className={cn(
          "mt-0.5 text-sm font-medium leading-snug text-[hsl(var(--app-foreground,var(--foreground)))]",
          multiline ? "whitespace-pre-line" : "truncate",
        )}
      >
        {value || "—"}
      </p>
    </div>
  );
}
