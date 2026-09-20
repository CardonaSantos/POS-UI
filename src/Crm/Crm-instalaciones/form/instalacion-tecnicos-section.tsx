import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AppFormMultiSelect, AppFormSingleSelect } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

type InstalacionTecnicosFormFields = {
  tecnicoIds: number[];

  tecnicoResponsableId: number | null;

  asesorId: number | null;
};

type InstalacionTecnicosSectionProps = {
  tecnicoOptions: AppSelectOption<number>[];

  isLoadingTecnicos?: boolean;
};

export function InstalacionTecnicosSection({
  tecnicoOptions,
  isLoadingTecnicos = false,
}: InstalacionTecnicosSectionProps) {
  const form = useFormContext<InstalacionTecnicosFormFields>();

  const tecnicoIds =
    useWatch({
      control: form.control,
      name: "tecnicoIds",
    }) ?? [];

  const tecnicoResponsableId = useWatch({
    control: form.control,
    name: "tecnicoResponsableId",
  });

  const tecnicoResponsableOptions = useMemo(() => {
    const selectedIds = new Set(tecnicoIds);

    return tecnicoOptions.filter((option) => selectedIds.has(option.value));
  }, [tecnicoIds, tecnicoOptions]);

  useEffect(() => {
    if (
      tecnicoResponsableId !== null &&
      tecnicoResponsableId !== undefined &&
      !tecnicoIds.includes(tecnicoResponsableId)
    ) {
      form.setValue("tecnicoResponsableId", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, tecnicoIds, tecnicoResponsableId]);

  const hasTecnicos = tecnicoResponsableOptions.length > 0;

  return (
    <section aria-labelledby="instalacion-tecnicos-title">
      <AppStack gap="sm">
        <div>
          <h2 id="instalacion-tecnicos-title" className="text-base font-medium">
            Técnicos
          </h2>

          <p className="text-sm">
            Defina los técnicos asignados, el responsable y el asesor.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppFormMultiSelect<InstalacionTecnicosFormFields, number>
            name="tecnicoIds"
            label="Técnicos asignados"
            options={tecnicoOptions}
            placeholder="Seleccione técnicos"
            density="compact"
            isLoading={isLoadingTecnicos}
          />

          <AppFormSingleSelect<InstalacionTecnicosFormFields, number>
            name="tecnicoResponsableId"
            label="Técnico responsable"
            options={tecnicoResponsableOptions}
            placeholder={
              hasTecnicos
                ? "Seleccione un responsable"
                : "Primero asigne técnicos"
            }
            density="compact"
            isDisabled={!hasTecnicos}
            isClearable
          />

          <AppFormSingleSelect<InstalacionTecnicosFormFields, number>
            name="asesorId"
            label="Asesor responsable"
            options={tecnicoOptions}
            placeholder="Seleccione un asesor responsable"
            density="compact"
            isClearable
          />
        </AppGrid>
      </AppStack>
    </section>
  );
}
