import { memo } from "react";
import type { InstalacionTecnicaAsignada } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppStack } from "@/components/app/primitives/app-stack";
import { InstalacionCard } from "./instalacion-card";

type InstalacionesListProps = {
  instalaciones: InstalacionTecnicaAsignada[];
  onOpen: (instalacionId: number) => void;
};

export const InstalacionesList = memo(function InstalacionesList({
  instalaciones,
  onOpen,
}: InstalacionesListProps) {
  return (
    <section aria-label="Instalaciones asignadas">
      <AppStack gap="sm">
        {instalaciones.map((instalacion) => (
          <InstalacionCard
            key={instalacion.id}
            instalacion={instalacion}
            onOpen={onOpen}
          />
        ))}
      </AppStack>
    </section>
  );
});
