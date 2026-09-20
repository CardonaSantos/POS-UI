import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Download, Eraser, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";

import {
  AppForm,
  AppFormDateRangePicker,
  AppFormSearchInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormSwitch,
} from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetReporteClientesXlsx } from "@/Crm/CrmHooks/hooks/reports/reportes-hook";

import {
  useGetReporteDepartamentos,
  useGetReporteMunicipios,
  useGetReporteSectores,
  useGetReporteServicios,
} from "@/Crm/CrmHooks/hooks/reports/reportes-catalogos-hook";

import {
  toReporteSelectOptions,
  toReporteServicioOptions,
} from "@/Crm/features/reports/utils";

import type {
  ReporteClienteEstado,
  ReporteClienteEstadoCobranza,
  ReporteClientesFiltersDto,
} from "@/Crm/features/reports/reportes.interfaces";

import {
  REPORTE_CLIENTES_DEFAULT_VALUES,
  reporteClientesSchema,
  type ReporteClientesFormValues,
} from "../schemas/reporte-clientes.schema";

import { toReporteClientesFiltersDto } from "../common/reporte-clientes.payload";

import { downloadFile } from "@/Crm/CrmHooks/hooks/use-reports/use-reports";
import {
  REPORTE_CLIENTE_COBRANZA_OPTIONS,
  REPORTE_CLIENTE_ESTADO_OPTIONS,
} from "@/Crm/features/reports/reportes.options";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_CLIENT_REPORT_FILTERS: ReporteClientesFiltersDto = {};

// =====================================================
// COMPONENT
// =====================================================

export const ReporteClientesPanel = memo(function ReporteClientesPanel() {
  const form = useForm<ReporteClientesFormValues>({
    resolver: zodResolver(reporteClientesSchema),

    defaultValues: REPORTE_CLIENTES_DEFAULT_VALUES,

    mode: "onChange",
  });

  // =================================================
  // CAMPOS DEPENDIENTES
  // =================================================

  const departamentoId = useWatch({
    control: form.control,
    name: "departamentoId",
  });

  const municipioId = useWatch({
    control: form.control,
    name: "municipioId",
  });

  const previousDepartamento = useRef<number | null>(departamentoId);

  const previousMunicipio = useRef<number | null>(municipioId);

  // =================================================
  // CATÁLOGOS
  // =================================================

  const serviciosQuery = useGetReporteServicios();

  const departamentosQuery = useGetReporteDepartamentos();

  const municipiosQuery = useGetReporteMunicipios(departamentoId);

  const sectoresQuery = useGetReporteSectores();

  // =================================================
  // OPCIONES
  // =================================================

  const servicioOptions = useMemo(
    () => toReporteServicioOptions(serviciosQuery.data),
    [serviciosQuery.data],
  );

  const departamentoOptions = useMemo(
    () => toReporteSelectOptions(departamentosQuery.data),
    [departamentosQuery.data],
  );

  const municipioOptions = useMemo(
    () => toReporteSelectOptions(municipiosQuery.data),
    [municipiosQuery.data],
  );

  const sectorOptions = useMemo(() => {
    if (municipioId === null || !sectoresQuery.data) {
      return [];
    }

    return toReporteSelectOptions(
      sectoresQuery.data.filter((sector) => sector.municipioId === municipioId),
    );
  }, [municipioId, sectoresQuery.data]);

  // =================================================
  // DEPENDENCIAS GEOGRÁFICAS
  // =================================================

  useEffect(() => {
    if (previousDepartamento.current === departamentoId) {
      return;
    }

    previousDepartamento.current = departamentoId;

    form.setValue("municipioId", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    form.setValue("sectorId", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [departamentoId, form]);

  useEffect(() => {
    if (previousMunicipio.current === municipioId) {
      return;
    }

    previousMunicipio.current = municipioId;

    form.setValue("sectorId", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [municipioId, form]);

  // =================================================
  // EXPORTACIÓN
  // =================================================

  /**
   * El hook XLSX necesita filtros durante render
   * porque es una query.
   *
   * Este estado cambia únicamente al pulsar
   * "Descargar Excel". No sigue los cambios
   * del formulario.
   */
  const [exportFilters, setExportFilters] =
    useState<ReporteClientesFiltersDto | null>(null);

  const reportQuery = useGetReporteClientesXlsx(
    exportFilters ?? EMPTY_CLIENT_REPORT_FILTERS,
  );

  /**
   * Evita ejecutar dos veces la misma solicitud
   * si el componente vuelve a renderizar mientras
   * refetch está trabajando.
   */
  const runningExportRef = useRef<ReporteClientesFiltersDto | null>(null);

  useEffect(() => {
    if (exportFilters === null || runningExportRef.current === exportFilters) {
      return;
    }

    runningExportRef.current = exportFilters;

    let cancelled = false;

    const runExport = async () => {
      try {
        const result = await reportQuery.refetch();

        if (cancelled) {
          return;
        }

        if (result.error || !result.data) {
          toast.error("No se pudo generar el reporte de clientes");

          return;
        }

        downloadFile(result.data, `Reporte_Clientes_${Date.now()}.xlsx`);

        toast.success("Reporte de clientes descargado");
      } catch {
        if (!cancelled) {
          toast.error("No se pudo generar el reporte de clientes");
        }
      } finally {
        runningExportRef.current = null;

        if (!cancelled) {
          setExportFilters(null);
        }
      }
    };

    void runExport();

    return () => {
      cancelled = true;
    };
  }, [exportFilters, reportQuery.refetch]);

  const isExporting = exportFilters !== null || reportQuery.isFetching;

  // =================================================
  // ACTIONS
  // =================================================

  const handleReset = useCallback(() => {
    form.reset(REPORTE_CLIENTES_DEFAULT_VALUES);
  }, [form]);

  const onSubmit: SubmitHandler<ReporteClientesFormValues> = useCallback(
    (values) => {
      const payload = toReporteClientesFiltersDto(values);

      setExportFilters(payload);
    },
    [],
  );

  // =================================================
  // RENDER
  // =================================================

  return (
    <AppCard variant="outline" size="sm" radius="md" className="p-2">
      <AppForm form={form} onSubmit={onSubmit}>
        <AppStack gap="md">
          <AppInline align="start" gap="sm" wrap={false} fullWidth>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileSpreadsheet
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Reporte de clientes</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Filtra los clientes incluidos en el archivo.
              </p>
            </div>
          </AppInline>

          <AppGrid
            cols={{
              base: 1,
              md: 2,
              xl: 3,
            }}
            gap="sm"
          >
            <AppFormSearchInput<ReporteClientesFormValues>
              name="search"
              label="Buscar"
              placeholder="Nombre, teléfono, DPI..."
              clearable
            />

            <AppFormSingleSelect<
              ReporteClientesFormValues,
              ReporteClienteEstado
            >
              name="estado"
              label="Estado operativo"
              options={REPORTE_CLIENTE_ESTADO_OPTIONS}
              placeholder="Todos"
              isClearable
              isSearchable={false}
              density="compact"
            />

            <AppFormSingleSelect<
              ReporteClientesFormValues,
              ReporteClienteEstadoCobranza
            >
              name="estadoCobranza"
              label="Cobranza"
              options={REPORTE_CLIENTE_COBRANZA_OPTIONS}
              placeholder="Todos"
              isClearable
              isSearchable={false}
              density="compact"
            />

            <AppFormSingleSelect<ReporteClientesFormValues, number>
              name="servicioInternetId"
              label="Servicio"
              options={servicioOptions}
              placeholder="Todos"
              isClearable
              isSearchable
              isLoading={serviciosQuery.isLoading}
              density="compact"
            />

            <AppFormSingleSelect<ReporteClientesFormValues, number>
              name="departamentoId"
              label="Departamento"
              options={departamentoOptions}
              placeholder="Todos"
              isClearable
              isSearchable
              isLoading={departamentosQuery.isLoading}
              density="compact"
            />

            <AppFormSingleSelect<ReporteClientesFormValues, number>
              name="municipioId"
              label="Municipio"
              options={municipioOptions}
              placeholder={departamentoId ? "Todos" : "Seleccione departamento"}
              isClearable
              isSearchable
              isLoading={municipiosQuery.isLoading}
              isDisabled={departamentoId === null}
              density="compact"
            />

            <AppFormSingleSelect<ReporteClientesFormValues, number>
              name="sectorId"
              label="Sector"
              options={sectorOptions}
              placeholder={municipioId ? "Todos" : "Seleccione municipio"}
              isClearable
              isSearchable
              isLoading={sectoresQuery.isLoading}
              isDisabled={municipioId === null}
              density="compact"
            />

            <div className="md:col-span-2">
              <AppFormDateRangePicker<ReporteClientesFormValues>
                name="creadoRange"
                label="Fecha de registro"
              />
            </div>

            <div className="flex items-end">
              <AppFormSwitch<ReporteClientesFormValues>
                name="incluirEliminados"
                label="Incluir eliminados"
              />
            </div>
          </AppGrid>

          <AppInline justify="end" gap="xs" collapseBelow="sm" fullWidth>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Eraser aria-hidden="true" />}
              disabled={isExporting}
              onClick={handleReset}
            >
              Limpiar
            </AppButton>

            <AppFormSubmit<ReporteClientesFormValues>
              size="sm"
              leftIcon={<Download aria-hidden="true" />}
              loading={isExporting}
              loadingText="Generando..."
              disabled={isExporting}
              disableWhenInvalid
            >
              Descargar Excel
            </AppFormSubmit>
          </AppInline>
        </AppStack>
      </AppForm>
    </AppCard>
  );
});
