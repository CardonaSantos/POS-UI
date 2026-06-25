import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import { Settings, UsersRound, Wifi } from "lucide-react";

export function DashboardSupportMetrics({
  tecnicosEnLinea,
  ticketsEnProceso,
  restantes,
}: {
  tecnicosEnLinea: number;
  ticketsEnProceso: number;
  restantes: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <SupportMetric
        label="En línea"
        value={tecnicosEnLinea}
        tone="success"
        icon={<Wifi className="h-3.5 w-3.5" />}
      />

      <SupportMetric
        label="Proceso"
        value={ticketsEnProceso}
        tone="warning"
        icon={<Settings className="h-3.5 w-3.5" />}
      />

      <SupportMetric
        label="Libres"
        value={restantes}
        tone="info"
        icon={<UsersRound className="h-3.5 w-3.5" />}
      />
    </div>
  );
}

function SupportMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <div
      className={[
        "rounded-[var(--app-radius-md)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.16)]",
        "px-2 py-1.5",
      ].join(" ")}
    >
      <AppInline gap="xs" align="center" justify="between">
        <span className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>

        <AppBadge size="xs" tone={tone} appearance="soft">
          {icon}
        </AppBadge>
      </AppInline>

      <p className="mt-1 text-sm font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </p>
    </div>
  );
}
