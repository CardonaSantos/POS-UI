import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Route,
  TicketCheck,
  Users,
  Wifi,
} from "lucide-react";

export function DashboardRuntimeBar({
  isRefreshing,
  rutasCount,
  morososCount,
  tecnicosEnLinea,
  ticketsEnProceso,
  usuariosEnCampo,
  onRefresh,
}: {
  isRefreshing: boolean;
  rutasCount: number;
  morososCount: number;
  tecnicosEnLinea: number;
  ticketsEnProceso: number;
  usuariosEnCampo: number;
  onRefresh: () => void;
}) {
  const restantes = Math.max(tecnicosEnLinea - ticketsEnProceso, 0);

  return (
    <AppCard variant="outline" size="xs" radius="lg">
      <AppInline gap="sm" align="center" justify="between" className="min-w-0">
        <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AppInline
            gap="xs"
            align="center"
            className="min-w-max"
            aria-live="polite"
          >
            <DashboardStatusChip
              icon={<Route className="h-3.5 w-3.5" />}
              label="Rutas"
              value={rutasCount}
              tone="primary"
            />

            <DashboardStatusChip
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              label="Morosos"
              value={morososCount}
              tone="danger"
            />

            <DashboardStatusChip
              icon={<Wifi className="h-3.5 w-3.5" />}
              label="En línea"
              value={tecnicosEnLinea}
              tone="success"
            />

            <DashboardStatusChip
              icon={<TicketCheck className="h-3.5 w-3.5" />}
              label="En proceso"
              value={ticketsEnProceso}
              tone="warning"
            />

            <DashboardStatusChip
              icon={<Users className="h-3.5 w-3.5" />}
              label="Restantes"
              value={restantes}
              tone="info"
            />

            <DashboardStatusChip
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              label="Campo"
              value={usuariosEnCampo}
              tone="neutral"
            />

            {isRefreshing ? (
              <AppBadge size="xs" tone="info" appearance="soft">
                Actualizando
              </AppBadge>
            ) : null}
          </AppInline>
        </div>

        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          width="auto"
          disabled={isRefreshing}
          loading={isRefreshing}
          loadingText="..."
          leftIcon={
            <RefreshCw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
            />
          }
          onClick={onRefresh}
          aria-label="Actualizar dashboard"
        >
          <span className="hidden sm:inline">Actualizar</span>
        </AppButton>
      </AppInline>
    </AppCard>
  );
}

function DashboardStatusChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <div
      className={[
        "inline-flex h-7 shrink-0 items-center gap-1.5",
        "rounded-[var(--app-radius-full)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-card-bg,var(--card))/0.72)]",
        "px-2 text-[11px]",
      ].join(" ")}
    >
      <AppBadge size="xs" tone={tone} appearance="soft">
        {icon}
      </AppBadge>

      <span className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {label}
      </span>

      <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </span>
    </div>
  );
}
