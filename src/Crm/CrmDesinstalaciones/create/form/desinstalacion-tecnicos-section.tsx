import { useEffect, useMemo } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { AppFormMultiSelect, AppFormSingleSelect } from "@/components/app/form";

import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import { CrearDesinstalacionFormValues } from "../../schemas/crear-desinstalacion.schema";

type DesinstalacionTecnicosSectionProps = {
  tecnicoOptions: AppSelectOption<number>[];

  isLoadingTecnicos?: boolean;
};

export function DesinstalacionTecnicosSection({
  tecnicoOptions,

  isLoadingTecnicos = false,
}: DesinstalacionTecnicosSectionProps) {
  const form = useFormContext<CrearDesinstalacionFormValues>();

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

    return tecnicoOptions.filter((option) =>
      selectedIds.has(Number(option.value)),
    );
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
    <section aria-labelledby="desinstalacion-tecnicos-title">
      <AppStack gap="sm">
        <div>
          <h2
            id="desinstalacion-tecnicos-title"
            className="text-base font-medium"
          >
            Técnicos
          </h2>

          <p className="text-sm text-muted-foreground">
            Defina el personal asignado al retiro físico y, si corresponde, el
            técnico responsable.
          </p>
        </div>

        <AppGrid
          cols={{
            base: 1,
            md: 2,
          }}
          gap="sm"
        >
          <AppFormMultiSelect<CrearDesinstalacionFormValues, number>
            name="tecnicoIds"
            label="Técnicos asignados"
            options={tecnicoOptions}
            placeholder="Seleccione técnicos"
            density="compact"
            isLoading={isLoadingTecnicos}
          />

          <AppFormSingleSelect<CrearDesinstalacionFormValues, number>
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
        </AppGrid>
      </AppStack>
    </section>
  );
}
