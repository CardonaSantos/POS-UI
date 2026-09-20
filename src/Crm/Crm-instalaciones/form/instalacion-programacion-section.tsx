import { useFormContext } from "react-hook-form";
import { AppFormInput } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

type InstalacionProgramacionFormFields = {
  fechaProgramada: string | null;
  fechaInicio?: string | null;
};

type InstalacionProgramacionSectionProps = {
  showFechaInicio?: boolean;
};

export function InstalacionProgramacionSection({
  showFechaInicio = false,
}: InstalacionProgramacionSectionProps) {
  useFormContext<InstalacionProgramacionFormFields>();

  return (
    <section aria-labelledby="instalacion-programacion-title">
      <AppStack gap="sm">
        <div>
          <h2
            id="instalacion-programacion-title"
            className="text-base font-medium"
          >
            Programación
          </h2>

          <p className="text-sm">
            Defina la fecha programada para realizar la instalación.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: showFechaInicio ? 2 : 1,
          }}
          gap="sm"
        >
          <AppFormInput<InstalacionProgramacionFormFields>
            name="fechaProgramada"
            label="Fecha programada"
            type="datetime-local"
          />
        </AppGrid>
      </AppStack>
    </section>
  );
}
