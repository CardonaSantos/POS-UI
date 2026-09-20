import { memo } from "react";
import { UsersRound } from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formatEnumValue } from "../tecnico-instalacion-detalle.utils";
import { DetalleSectionCard } from "./detalle-section-card";

type ParticipantesCardProps = {
  participantes: DetalleInstalacionTecnicaResponse["participantes"];
};

export const ParticipantesCard = memo(function ParticipantesCard({
  participantes,
}: ParticipantesCardProps) {
  return (
    <DetalleSectionCard
      id="participantes-instalacion"
      title="Técnicos"
      icon={UsersRound}
      trailing={
        <span className="text-xs text-muted-foreground">
          {participantes.length}
        </span>
      }
    >
      {participantes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin técnicos asignados.</p>
      ) : (
        <AppStack gap="xs">
          {participantes.map((participante) => (
            <article
              key={participante.asignacionId}
              className="rounded-md border border-border px-3 py-2"
            >
              <AppInline justify="between" align="center" gap="sm" fullWidth>
                <AppInline gap="sm" wrap={false}>
                  <ParticipantAvatar
                    name={participante.nombre}
                    avatarUrl={participante.avatarUrl}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {participante.nombre}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatEnumValue(participante.rol)}
                    </div>
                  </div>
                </AppInline>

                {participante.esResponsable ? (
                  <AppBadge tone="primary" size="xs">
                    Responsable
                  </AppBadge>
                ) : null}
              </AppInline>
            </article>
          ))}
        </AppStack>
      )}
    </DetalleSectionCard>
  );
});

const ParticipantAvatar = memo(function ParticipantAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-9 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
});

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("es-GT"))
    .join("");
}
