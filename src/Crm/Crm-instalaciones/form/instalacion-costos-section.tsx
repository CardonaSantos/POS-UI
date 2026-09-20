import { useFormContext } from "react-hook-form";

import { AppFormInput, AppFormTextarea } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

type InstalacionCostosFormFields = {
  costos: {
    costoInstalacion: string;
    costoMateriales: string;
    costoManoObra: string;
    costoOtros: string;

    montoCobradoCliente?: string;

    notas: string;
  };
};

type Props = {
  showMontoCobradoCliente?: boolean;
};

export function InstalacionCostosSection(
  {
    // showMontoCobradoCliente = false,
  }: Props,
) {
  useFormContext<InstalacionCostosFormFields>();

  return (
    <section aria-labelledby="instalacion-costos-title">
      <AppStack gap="sm">
        <div>
          <h2 id="instalacion-costos-title" className="text-base font-medium">
            Costos
          </h2>

          <p className="text-sm">
            Registre los costos relacionados con la instalación.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            sm: 2,
            xl: 3,
          }}
          gap="sm"
        >
          <AppFormInput<InstalacionCostosFormFields>
            name="costos.costoInstalacion"
            label="Costo de instalación"
            placeholder="0.00"
            inputMode="decimal"
          />

          <AppFormInput<InstalacionCostosFormFields>
            name="costos.costoMateriales"
            label="Costo de materiales"
            placeholder="0.00"
            inputMode="decimal"
          />

          <AppFormInput<InstalacionCostosFormFields>
            name="costos.costoManoObra"
            label="Costo de mano de obra"
            placeholder="0.00"
            inputMode="decimal"
          />

          <AppFormInput<InstalacionCostosFormFields>
            name="costos.costoOtros"
            label="Otros costos"
            placeholder="0.00"
            inputMode="decimal"
          />
        </AppGrid>

        <AppFormTextarea<InstalacionCostosFormFields>
          name="costos.notas"
          label="Notas de costos"
          placeholder="Observaciones sobre materiales, cobros o gastos"
          rows={3}
          resizeMode="vertical"
        />
      </AppStack>
    </section>
  );
}
