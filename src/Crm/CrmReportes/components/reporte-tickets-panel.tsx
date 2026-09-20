import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { Download, Eraser, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";

import {
  AppForm,
  AppFormDateRangePicker,
  AppFormMultiSelect,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useGetReporteTicketClientes,
  useGetReporteTicketEtiquetas,
  useGetReporteTicketTecnicos,
} from "@/Crm/CrmHooks/hooks/reports/reportes-catalogos-hook";

import { useGetReporteTicketsXlsx } from "@/Crm/CrmHooks/hooks/reports/reportes-hook";

import type { ReporteTicketsFiltersDto } from "@/Crm/features/reports/reportes.interfaces";

import {
  ReporteTicketAgrupacion,
  ReporteTicketEstado,
  ReporteTicketPrioridad,
} from "@/Crm/features/reports/reportes.interfaces";

import { toReporteSelectOptions } from "@/Crm/features/reports/utils";

import {
  REPORTE_TICKETS_DEFAULT_VALUES,
  reporteTicketsSchema,
  type ReporteTicketsFormValues,
} from "../schemas/reporte-tickets.schema";

import { toReporteTicketsFiltersDto } from "../common/reporte-tickets.payload";

import { downloadFile } from "@/Crm/CrmHooks/hooks/use-reports/use-reports";
import {
  REPORTE_TICKET_AGRUPACION_OPTIONS,
  REPORTE_TICKET_ESTADO_OPTIONS,
  REPORTE_TICKET_PRIORIDAD_OPTIONS,
} from "@/Crm/features/reports/reportes.options";

const EMPTY_TICKET_REPORT_FILTERS: ReporteTicketsFiltersDto = {};

export const ReporteTicketsPanel = memo(function ReporteTicketsPanel() {
  const form = useForm<ReporteTicketsFormValues>({
    resolver: zodResolver(reporteTicketsSchema),

    defaultValues: REPORTE_TICKETS_DEFAULT_VALUES,

    mode: "onChange",
  });

  // =================================================
  // CATÁLOGOS
  // =================================================

  const etiquetasQuery = useGetReporteTicketEtiquetas();

  const tecnicosQuery = useGetReporteTicketTecnicos();

  const clientesQuery = useGetReporteTicketClientes();

  // =================================================
  // OPCIONES DERIVADAS
  // =================================================

  const etiquetaOptions = useMemo(
    () => toReporteSelectOptions(etiquetasQuery.data),
    [etiquetasQuery.data],
  );

  const tecnicoOptions = useMemo(
    () => toReporteSelectOptions(tecnicosQuery.data),
    [tecnicosQuery.data],
  );

  const clienteOptions = useMemo(
    () => toReporteSelectOptions(clientesQuery.data),
    [clientesQuery.data],
  );

  // =================================================
  // EXPORTACIÓN
  // =================================================

  const [exportFilters, setExportFilters] =
    useState<ReporteTicketsFiltersDto | null>(null);

  const reportQuery = useGetReporteTicketsXlsx(
    exportFilters ?? EMPTY_TICKET_REPORT_FILTERS,
  );

  const runningExportRef = useRef<ReporteTicketsFiltersDto | null>(null);

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
          toast.error("No se pudo generar el reporte de tickets");

          return;
        }

        downloadFile(result.data, `Reporte_Tickets_${Date.now()}.xlsx`);

        toast.success("Reporte de tickets descargado");
      } catch {
        if (!cancelled) {
          toast.error("No se pudo generar el reporte de tickets");
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
    form.reset(REPORTE_TICKETS_DEFAULT_VALUES);
  }, [form]);

  const onSubmit: SubmitHandler<ReporteTicketsFormValues> = useCallback(
    (values) => {
      setExportFilters(toReporteTicketsFiltersDto(values));
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
              <h2 className="text-sm font-semibold">Reporte de tickets</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Filtra los tickets incluidos en el archivo.
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
            <div className="md:col-span-2">
              <AppFormDateRangePicker<ReporteTicketsFormValues>
                name="periodo"
                label="Período"
              />
            </div>

            <AppFormSingleSelect<
              ReporteTicketsFormValues,
              ReporteTicketAgrupacion
            >
              name="agrupacion"
              label="Agrupación"
              options={REPORTE_TICKET_AGRUPACION_OPTIONS}
              isClearable={false}
              isSearchable={false}
              density="compact"
            />

            <AppFormMultiSelect<ReporteTicketsFormValues, ReporteTicketEstado>
              name="estados"
              label="Estados"
              options={REPORTE_TICKET_ESTADO_OPTIONS}
              placeholder="Todos"
              density="compact"
            />

            <AppFormMultiSelect<
              ReporteTicketsFormValues,
              ReporteTicketPrioridad
            >
              name="prioridades"
              label="Prioridades"
              options={REPORTE_TICKET_PRIORIDAD_OPTIONS}
              placeholder="Todas"
              density="compact"
            />

            <AppFormMultiSelect<ReporteTicketsFormValues, number>
              name="etiquetaIds"
              label="Etiquetas"
              options={etiquetaOptions}
              placeholder="Todas"
              density="compact"
              isDisabled={etiquetasQuery.isLoading}
            />

            <AppFormMultiSelect<ReporteTicketsFormValues, number>
              name="tecnicoIds"
              label="Técnicos"
              options={tecnicoOptions}
              placeholder="Todos"
              density="compact"
              isDisabled={tecnicosQuery.isLoading}
            />

            <AppFormSingleSelect<ReporteTicketsFormValues, number>
              name="clienteId"
              label="Cliente"
              options={clienteOptions}
              placeholder="Todos"
              density="compact"
              isSearchable
              isClearable
              isLoading={clientesQuery.isLoading}
            />
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

            <AppFormSubmit<ReporteTicketsFormValues>
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
