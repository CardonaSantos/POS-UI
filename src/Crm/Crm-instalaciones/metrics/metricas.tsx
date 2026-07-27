import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
// import { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";

import type {
  ClienteInstalacionListItem,
  PaginationMeta,
} from "@/Crm/features/instalaciones/instalaciones.interfaces";

type InstalacionesMetricsProps = {
  items: ClienteInstalacionListItem[];
  meta: PaginationMeta;
};

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
};

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <AppCard size="xs" variant="default" className="p-2">
      <span className="block text-xs">{label}</span>

      <strong className="block text-xl tabular-nums">{value}</strong>

      <span className="block text-xs">{description}</span>
    </AppCard>
  );
}

export function InstalacionesMetrics({
  items,
  meta,
}: InstalacionesMetricsProps) {
  // const programadasVisible = items.filter(
  //   (item) => item.estado === EstadoInstalacionCliente.PROGRAMADA,
  // ).length;

  const conResponsableVisible = items.filter(
    (item) => item.tecnicoResponsable !== null,
  ).length;

  return (
    <AppGrid
      cols={{
        base: 2,
        lg: 4,
      }}
      gap="sm"
    >
      <MetricCard
        label="Total"
        value={meta.total}
        description="Registros encontrados"
      />

      <MetricCard
        label="Con responsable"
        value={conResponsableVisible}
        description="En esta página"
      />
    </AppGrid>
  );
}
