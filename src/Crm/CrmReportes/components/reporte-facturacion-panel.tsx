import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, type SubmitHandler } from "react-hook-form";

import { Download, Eraser, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";

import {
  AppForm,
  AppFormInput,
  AppFormMultiSelect,
  AppFormSingleSelect,
} from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useGetReporteFacturacionUsuarios,
  useGetReporteFacturacionZonas,
  useGetReporteTicketClientes,
} from "@/Crm/CrmHooks/hooks/reports/reportes-catalogos-hook";

import { useGetReporteFacturacionXlsx } from "@/Crm/CrmHooks/hooks/reports/reportes-hook";

import type { ReporteFacturacionFiltersDto } from "@/Crm/features/reports/reportes.interfaces";

import {
  ReporteFacturacionEstadoFactura,
  ReporteFacturacionMetodoPago,
  ReporteFacturacionOrigenPago,
} from "@/Crm/features/reports/reportes.interfaces";

import { toReporteSelectOptions } from "@/Crm/features/reports/utils";

import {
  REPORTE_FACTURACION_DEFAULT_VALUES,
  reporteFacturacionSchema,
  type ReporteFacturacionFormValues,
} from "../schemas/reporte-facturacion.schema";

import { toReporteFacturacionFiltersDto } from "../common/reporte-facturacion.payload";

import { ReporteFormMonthPicker } from "./reporte-form-month-picker";

import { downloadFile } from "@/Crm/CrmHooks/hooks/use-reports/use-reports";
import {
  REPORTE_FACTURACION_ESTADO_OPTIONS,
  REPORTE_FACTURACION_METODO_PAGO_OPTIONS,
  REPORTE_FACTURACION_ORIGEN_PAGO_OPTIONS,
} from "@/Crm/features/reports/reportes.options";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_FACTURACION_FILTERS: ReporteFacturacionFiltersDto = {};

// =====================================================
// COMPONENT
// =====================================================

export const ReporteFacturacionPanel = memo(function ReporteFacturacionPanel() {
  const form = useForm<ReporteFacturacionFormValues>({
    resolver: zodResolver(reporteFacturacionSchema),

    defaultValues: REPORTE_FACTURACION_DEFAULT_VALUES,

    mode: "onChange",
  });

  // ===============================================
  // CATÁLOGOS
  // ===============================================

  const zonasQuery = useGetReporteFacturacionZonas();

  const usuariosQuery = useGetReporteFacturacionUsuarios();

  const clientesQuery = useGetReporteTicketClientes();

  // ===============================================
  // OPCIONES
  // ===============================================

  const zonaOptions = useMemo(
    () => toReporteSelectOptions(zonasQuery.data),
    [zonasQuery.data],
  );

  const usuarioOptions = useMemo(
    () => toReporteSelectOptions(usuariosQuery.data),
    [usuariosQuery.data],
  );

  const clienteOptions = useMemo(
    () => toReporteSelectOptions(clientesQuery.data),
    [clientesQuery.data],
  );

  // ===============================================
  // EXPORTACIÓN
  // ===============================================

  const [exportFilters, setExportFilters] =
    useState<ReporteFacturacionFiltersDto | null>(null);

  const reportQuery = useGetReporteFacturacionXlsx(
    exportFilters ?? EMPTY_FACTURACION_FILTERS,
  );

  useEffect(() => {
    if (exportFilters === null) {
      return;
    }

    let active = true;

    const runExport = async () => {
      try {
        const result = await reportQuery.refetch();

        if (!active) {
          return;
        }

        if (result.error || !result.data) {
          toast.error("No se pudo generar el reporte de facturación");

          return;
        }

        downloadFile(result.data, `Reporte_Facturacion_${Date.now()}.xlsx`);

        toast.success("Reporte de facturación descargado");
      } catch {
        if (active) {
          toast.error("No se pudo generar el reporte de facturación");
        }
      } finally {
        if (active) {
          setExportFilters(null);
        }
      }
    };

    void runExport();

    return () => {
      active = false;
    };
  }, [exportFilters, reportQuery.refetch]);

  const isExporting = exportFilters !== null || reportQuery.isFetching;

  // ===============================================
  // ACTIONS
  // ===============================================

  const handleReset = useCallback(() => {
    form.reset(REPORTE_FACTURACION_DEFAULT_VALUES);
  }, [form]);

  const onSubmit: SubmitHandler<ReporteFacturacionFormValues> = useCallback(
    (values) => {
      setExportFilters(toReporteFacturacionFiltersDto(values));
    },
    [],
  );

  // ===============================================
  // RENDER
  // ===============================================

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
              <h2 className="text-sm font-semibold">Reporte de facturación</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Facturación, cartera, recaudación y proyección.
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
            <ReporteFormMonthPicker<ReporteFacturacionFormValues>
              name="periodoDesde"
              label="Período desde"
            />

            <ReporteFormMonthPicker<ReporteFacturacionFormValues>
              name="periodoHasta"
              label="Período hasta"
            />

            <AppFormInput<ReporteFacturacionFormValues>
              name="mesesProyeccion"
              label="Meses de proyección"
              type="number"
              min={0}
              max={24}
              step={1}
              inputMode="numeric"
            />

            <AppFormMultiSelect<
              ReporteFacturacionFormValues,
              ReporteFacturacionEstadoFactura
            >
              name="estadosFactura"
              label="Estados de factura"
              options={REPORTE_FACTURACION_ESTADO_OPTIONS}
              placeholder="Todos"
              density="compact"
            />

            <AppFormMultiSelect<ReporteFacturacionFormValues, number>
              name="zonaIds"
              label="Zonas"
              options={zonaOptions}
              placeholder="Todas"
              density="compact"
              isDisabled={zonasQuery.isLoading}
            />

            <AppFormMultiSelect<ReporteFacturacionFormValues, number>
              name="creadorIds"
              label="Creadores"
              options={usuarioOptions}
              placeholder="Todos"
              density="compact"
              isDisabled={usuariosQuery.isLoading}
            />

            <AppFormSingleSelect<ReporteFacturacionFormValues, number>
              name="clienteId"
              label="Cliente"
              options={clienteOptions}
              placeholder="Todos"
              density="compact"
              isSearchable
              isClearable
              isLoading={clientesQuery.isLoading}
            />

            <AppFormMultiSelect<
              ReporteFacturacionFormValues,
              ReporteFacturacionMetodoPago
            >
              name="metodosPago"
              label="Métodos de pago"
              options={REPORTE_FACTURACION_METODO_PAGO_OPTIONS}
              placeholder="Todos"
              density="compact"
            />

            <AppFormMultiSelect<
              ReporteFacturacionFormValues,
              ReporteFacturacionOrigenPago
            >
              name="origenesPago"
              label="Origen del pago"
              options={REPORTE_FACTURACION_ORIGEN_PAGO_OPTIONS}
              placeholder="Todos"
              density="compact"
            />

            <AppFormMultiSelect<ReporteFacturacionFormValues, number>
              name="cobradorIds"
              label="Cobradores"
              options={usuarioOptions}
              placeholder="Todos"
              density="compact"
              isDisabled={usuariosQuery.isLoading}
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

            <AppButton
              type="submit"
              size="sm"
              leftIcon={<Download aria-hidden="true" />}
              loading={isExporting}
              disabled={isExporting}
            >
              Descargar Excel
            </AppButton>
          </AppInline>
        </AppStack>
      </AppForm>
    </AppCard>
  );
});
