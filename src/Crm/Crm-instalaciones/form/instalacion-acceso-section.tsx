import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppFormSingleSelect } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import {
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
} from "@/Crm/features/instalaciones/enums";

import type { CrearInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/schema";
import type { PerfilHomologacionSelectMeta } from "@/Crm/features/pppoe-homologaciones/intefaces";

type InstalacionAccesoSectionProps = {
  tecnologiaOptions: AppSelectOption<TecnologiaAccesoInternet>[];

  metodoAutenticacionOptions: AppSelectOption<MetodoAutenticacionInternet>[];

  homologacionOptions: AppSelectOption<number, PerfilHomologacionSelectMeta>[];

  isLoadingHomologaciones?: boolean;
};

export function InstalacionAccesoSection({
  tecnologiaOptions,
  metodoAutenticacionOptions,
  homologacionOptions,
  isLoadingHomologaciones = false,
}: InstalacionAccesoSectionProps) {
  const { control, setValue, trigger } =
    useFormContext<CrearInstalacionFormValues>();

  const tecnologia = useWatch({
    control,
    name: "acceso.tecnologia",
  });

  const metodoAutenticacion = useWatch({
    control,
    name: "acceso.metodoAutenticacion",
  });

  const perfilHomologacionId = useWatch({
    control,
    name: "acceso.perfilHomologacionId",
  });

  const servicioInternetId = useWatch({
    control,
    name: "servicioInternetId",
  });

  const mikrotikRouterId = useWatch({
    control,
    name: "acceso.mikrotikRouterId",
  });

  const requiereHomologacion =
    tecnologia === TecnologiaAccesoInternet.FIBRA_GPON &&
    metodoAutenticacion === MetodoAutenticacionInternet.PPPOE;

  const homologacionSeleccionada = useMemo(
    () =>
      perfilHomologacionId === null
        ? undefined
        : homologacionOptions.find(
            (option) => option.value === perfilHomologacionId,
          ),
    [homologacionOptions, perfilHomologacionId],
  );

  useEffect(() => {
    let valoresModificados = false;

    const updateServicioInternetId = (value: number | null) => {
      setValue("servicioInternetId", value, {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });

      valoresModificados = true;
    };

    const updateMikrotikRouterId = (value: number | null) => {
      setValue("acceso.mikrotikRouterId", value, {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });

      valoresModificados = true;
    };

    const updatePerfilHomologacionId = (value: number | null) => {
      setValue("acceso.perfilHomologacionId", value, {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });

      valoresModificados = true;
    };

    if (!requiereHomologacion) {
      if (perfilHomologacionId !== null) {
        updatePerfilHomologacionId(null);
      }

      if (servicioInternetId !== null) {
        updateServicioInternetId(null);
      }

      if (mikrotikRouterId !== null) {
        updateMikrotikRouterId(null);
      }
    } else if (perfilHomologacionId === null) {
      if (servicioInternetId !== null) {
        updateServicioInternetId(null);
      }

      if (mikrotikRouterId !== null) {
        updateMikrotikRouterId(null);
      }
    } else if (homologacionSeleccionada?.meta) {
      const {
        servicioInternetId: servicioDerivadoId,
        mikrotikRouterId: routerDerivadoId,
      } = homologacionSeleccionada.meta;

      if (servicioInternetId !== servicioDerivadoId) {
        updateServicioInternetId(servicioDerivadoId);
      }

      if (mikrotikRouterId !== routerDerivadoId) {
        updateMikrotikRouterId(routerDerivadoId);
      }
    } else if (!isLoadingHomologaciones) {
      if (perfilHomologacionId !== null) {
        updatePerfilHomologacionId(null);
      }

      if (servicioInternetId !== null) {
        updateServicioInternetId(null);
      }

      if (mikrotikRouterId !== null) {
        updateMikrotikRouterId(null);
      }
    }

    if (valoresModificados) {
      void trigger("acceso.perfilHomologacionId");
    }
  }, [
    homologacionSeleccionada,
    isLoadingHomologaciones,
    mikrotikRouterId,
    perfilHomologacionId,
    requiereHomologacion,
    servicioInternetId,
    setValue,
    trigger,
  ]);

  return (
    <section aria-labelledby="instalacion-acceso-title">
      <AppStack gap="sm">
        <div>
          <h2 id="instalacion-acceso-title" className="text-base font-medium">
            Acceso de internet
          </h2>

          <p className="text-sm text-muted-foreground">
            Define la tecnología y el método de autenticación que usará el
            cliente.
          </p>
        </div>

        <AppGrid cols={{ base: 1, md: 2, xl: 3 }} gap="sm">
          <AppFormSingleSelect<
            CrearInstalacionFormValues,
            TecnologiaAccesoInternet
          >
            name="acceso.tecnologia"
            label="Tecnología"
            options={tecnologiaOptions}
            placeholder="Seleccione la tecnología"
            density="compact"
            required
          />

          <AppFormSingleSelect<
            CrearInstalacionFormValues,
            MetodoAutenticacionInternet
          >
            name="acceso.metodoAutenticacion"
            label="Método de autenticación"
            options={metodoAutenticacionOptions}
            placeholder="Seleccione el método"
            density="compact"
            required
          />

          {requiereHomologacion ? (
            <AppFormSingleSelect<CrearInstalacionFormValues, number>
              name="acceso.perfilHomologacionId"
              label="Homologación PPPoE"
              options={homologacionOptions}
              placeholder="Seleccione plan y router homologados"
              density="compact"
              isSearchable
              isLoading={isLoadingHomologaciones}
              required
            />
          ) : null}
        </AppGrid>
      </AppStack>
    </section>
  );
}
