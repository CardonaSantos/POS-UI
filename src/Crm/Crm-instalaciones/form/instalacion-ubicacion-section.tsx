import { useFormContext } from "react-hook-form";

import { AppFormInput } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

type InstalacionUbicacionFormFields = {
  direccionInstalacion: string;
  referenciaUbicacion: string;
  coordenadas: string;
};

export function InstalacionUbicacionSection() {
  useFormContext<InstalacionUbicacionFormFields>();

  return (
    <section aria-labelledby="instalacion-ubicacion-title">
      <AppStack gap="sm">
        <div>
          <h2
            id="instalacion-ubicacion-title"
            className="text-base font-medium"
          >
            Ubicación
          </h2>

          <p className="text-sm">
            Registre la dirección y pegue las coordenadas directamente desde
            Maps.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppFormInput<InstalacionUbicacionFormFields>
            name="direccionInstalacion"
            label="Dirección de instalación"
            placeholder="Ej. Barrio El Centro"
            clearable
          />

          <AppFormInput<InstalacionUbicacionFormFields>
            name="referenciaUbicacion"
            label="Referencia"
            placeholder="Ej. Casa de portón negro"
            clearable
          />
        </AppGrid>

        <AppFormInput<InstalacionUbicacionFormFields>
          name="coordenadas"
          label="Coordenadas"
          placeholder="Ej. 15.668, -91.735"
          description="Pegue las coordenadas copiadas desde Google Maps."
          clearable
        />
      </AppStack>
    </section>
  );
}
