import { memo, useCallback } from "react";
import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Images,
  MapPin,
  PackageCheck,
  Phone,
  UsersRound,
  Wifi,
} from "lucide-react";
import type { InstalacionTecnicaAsignada } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formattMonedaGT } from "../../Utils/formattMonedaGT";
import {
  formatTipo,
  getAgendaDisplay,
  getEstadoVisual,
  getInitialInstallationTotal,
} from "../tecnico-instalaciones.utils";

type InstalacionCardProps = {
  instalacion: InstalacionTecnicaAsignada;
  onOpen: (instalacionId: number) => void;
};

export const InstalacionCard = memo(function InstalacionCard({
  instalacion,
  onOpen,
}: InstalacionCardProps) {
  const handleOpen = useCallback(() => {
    onOpen(instalacion.id);
  }, [instalacion.id, onOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  return (
    <AppCard
      size="sm"
      interactive
      role="link"
      tabIndex={0}
      aria-label={`Abrir instalación ${instalacion.id} de ${instalacion.cliente.nombreCompleto}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="px-1.5 py-1 sm:px-2 sm:py-1.5">
        <AppStack gap="sm">
          <InstalacionCardHeader instalacion={instalacion} />
          <InstalacionCardDetails instalacion={instalacion} />
          <InstalacionCardFooter instalacion={instalacion} />
        </AppStack>
      </div>
    </AppCard>
  );
});

const InstalacionCardHeader = memo(function InstalacionCardHeader({
  instalacion,
}: {
  instalacion: InstalacionTecnicaAsignada;
}) {
  const estado = getEstadoVisual(instalacion.estado);

  return (
    <AppInline
      justify="between"
      align="start"
      gap="sm"
      wrap={false}
      fullWidth
    >
      <div className="min-w-0">
        <AppInline gap="xs" wrap>
          <AppBadge tone={estado.tone} size="xs" dot>
            {estado.label}
          </AppBadge>
          <span className="text-xs font-medium text-muted-foreground">
            #{instalacion.id}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTipo(instalacion.tipo)}
          </span>
        </AppInline>

        <h3 className="mt-2 truncate text-base font-semibold text-foreground">
          {instalacion.cliente.nombreCompleto}
        </h3>
      </div>

      <ChevronRight
        className="mt-1 size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </AppInline>
  );
});

const InstalacionCardDetails = memo(function InstalacionCardDetails({
  instalacion,
}: {
  instalacion: InstalacionTecnicaAsignada;
}) {
  const agenda = getAgendaDisplay(instalacion);
  const direccion =
    instalacion.ubicacion.direccion ??
    instalacion.cliente.direccion ??
    "Dirección pendiente";
  const totalInicial = getInitialInstallationTotal(instalacion);

  const planText = instalacion.servicioInternet
    ? [
        instalacion.servicioInternet.nombre,
        instalacion.servicioInternet.velocidad,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Plan pendiente";

  return (
    <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
      <CompactInfo
        icon={CalendarClock}
        text={agenda.text}
        emphasize={agenda.emphasize}
      />
      <CompactInfo icon={MapPin} text={direccion} />
      <CompactInfo icon={Wifi} text={planText} />
      <CompactInfo
        icon={CircleDollarSign}
        text={`Total inicial ${formattMonedaGT(totalInicial)}`}
      />
    </AppGrid>
  );
});

const InstalacionCardFooter = memo(function InstalacionCardFooter({
  instalacion,
}: {
  instalacion: InstalacionTecnicaAsignada;
}) {
  return (
    <AppInline
      justify="between"
      gap="sm"
      fullWidth
      className="border-t border-border/60 pt-2"
    >
      <AppInline gap="sm" wrap={false}>
        <MiniCount
          icon={UsersRound}
          value={instalacion.conteos.tecnicos}
          label="técnicos"
        />
        <MiniCount
          icon={Images}
          value={instalacion.conteos.evidencias}
          label="evidencias"
        />
        <MiniCount
          icon={PackageCheck}
          value={instalacion.conteos.equipos}
          label="equipos"
        />
      </AppInline>

      {instalacion.cliente.telefono ? (
        <AppButton
          asChild
          size="iconSm"
          variant="ghost"
          aria-label={`Llamar a ${instalacion.cliente.nombreCompleto}`}
        >
          <a
            href={`tel:${instalacion.cliente.telefono}`}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Phone aria-hidden="true" />
          </a>
        </AppButton>
      ) : null}
    </AppInline>
  );
});

type CompactInfoProps = {
  icon: LucideIcon;
  text: string;
  emphasize?: boolean;
};

const CompactInfo = memo(function CompactInfo({
  icon: Icon,
  text,
  emphasize = false,
}: CompactInfoProps) {
  return (
    <AppInline gap="xs" wrap={false} align="start" className="min-w-0">
      <Icon
        className={
          emphasize
            ? "mt-0.5 size-4 shrink-0 text-warning-foreground"
            : "mt-0.5 size-4 shrink-0 text-muted-foreground"
        }
        aria-hidden="true"
      />
      <span
        className={
          emphasize
            ? "line-clamp-2 min-w-0 text-sm font-medium text-warning-foreground"
            : "line-clamp-2 min-w-0 text-sm text-muted-foreground"
        }
      >
        {text}
      </span>
    </AppInline>
  );
});

type MiniCountProps = {
  icon: LucideIcon;
  value: number;
  label: string;
};

const MiniCount = memo(function MiniCount({
  icon: Icon,
  value,
  label,
}: MiniCountProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-muted-foreground"
      title={`${value} ${label}`}
      aria-label={`${value} ${label}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {value}
    </span>
  );
});
