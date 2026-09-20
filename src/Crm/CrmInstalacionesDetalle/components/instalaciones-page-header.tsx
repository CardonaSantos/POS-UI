import { memo } from "react";
import { Wrench } from "lucide-react";
import { AppInline } from "@/components/app/primitives/app-inline";

type InstalacionesPageHeaderProps = {
  activeAssignments?: number;
};

export const InstalacionesPageHeader = memo(
  function InstalacionesPageHeader({
    activeAssignments,
  }: InstalacionesPageHeaderProps) {
    return (
      <AppInline justify="between" align="start" gap="sm" fullWidth>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Mis instalaciones
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {typeof activeAssignments === "number"
              ? `${activeAssignments} ${
                  activeAssignments === 1
                    ? "asignación activa"
                    : "asignaciones activas"
                }`
              : "Trabajo técnico asignado"}
          </p>
        </div>

        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Wrench className="size-5" />
        </span>
      </AppInline>
    );
  },
);
