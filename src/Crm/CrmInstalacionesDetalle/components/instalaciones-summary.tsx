import { memo } from "react";
import {
  CheckCircle2,
  Clock3,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { InstalacionesSummaryData } from "../tecnico-instalaciones.utils";

type InstalacionesSummaryProps = {
  summary: InstalacionesSummaryData;
  visibleCount: number;
};

const METRICS = [
  { key: "overdue", label: "Atrasadas", icon: TriangleAlert },
  { key: "pendingStart", label: "Por iniciar", icon: Clock3 },
  { key: "inProgress", label: "En proceso", icon: Wrench },
  { key: "completed", label: "Completadas", icon: CheckCircle2 },
] as const;

export const InstalacionesSummary = memo(function InstalacionesSummary({
  summary,
  visibleCount,
}: InstalacionesSummaryProps) {
  return (
    <section aria-labelledby="metricas-instalaciones-title">
      <AppStack gap="xs">
        <AppInline justify="between" fullWidth>
          <h2
            id="metricas-instalaciones-title"
            className="text-sm font-medium text-foreground"
          >
            Resumen de esta página
          </h2>
          <span className="text-xs text-muted-foreground">
            {visibleCount} visibles
          </span>
        </AppInline>

        <AppGrid cols={{ base: 2, md: 4 }} gap="xs">
          {METRICS.map(({ key, label, icon: Icon }) => (
            <AppCard key={key} size="xs" variant="muted">
              <div className="px-1 py-0.5">
                <AppInline gap="xs" wrap={false}>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground"
                    aria-hidden="true"
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold leading-none text-foreground">
                      {summary[key]}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {label}
                    </div>
                  </div>
                </AppInline>
              </div>
            </AppCard>
          ))}
        </AppGrid>
      </AppStack>
    </section>
  );
});
