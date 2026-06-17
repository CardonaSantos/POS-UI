import { FileSpreadsheet } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppOption, FACTURA_ESTADO_OPTIONS } from "../customer-table.constants";

export type ReportDateRange = {
  start?: string | null;
  end?: string | null;
};

export type ReportCobranzaFiltersState = {
  paidRange: ReportDateRange;
  generatedRange: ReportDateRange;
  userId: string | null;
  estados: string[];
};

interface Props {
  open: boolean;
  filters: ReportCobranzaFiltersState;
  userOptions: AppOption[];
  isGenerating?: boolean;

  onOpenChange: (open: boolean) => void;
  onPaidRangeChange: (range: ReportDateRange) => void;
  onGeneratedRangeChange: (range: ReportDateRange) => void;
  onUserChange: (userId: string | null) => void;
  onEstadosChange: (estados: string[]) => void;
  onClear: () => void;
  onGenerate: () => Promise<void> | void;
}

export function CustomerReportsCobranzaDialog({
  open,
  filters,
  userOptions,
  isGenerating,
  onOpenChange,
  onPaidRangeChange,
  onGeneratedRangeChange,
  onUserChange,
  onEstadosChange,
  onClear,
  onGenerate,
}: Props) {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <AppButton
          type="button"
          variant="secondary"
          size="xs"
          leftIcon={<FileSpreadsheet size={14} />}
        >
          Reporte
        </AppButton>
      }
      preset="info"
      tone="info"
      title="Reporte de cobranzas"
      description="Filtra fechas, estados y cobrador antes de generar el Excel."
      confirmText="Generar"
      cancelText="Cancelar"
      loadingText="Generando..."
      isLoading={isGenerating}
      closeOnConfirm={false}
      onConfirm={onGenerate}
      size="lg"
      footerAlign="between"
      contentCard={false}
      preventClose={isGenerating}
    >
      <div className="w-full min-w-0 px-1">
        <AppStack gap="md">
          <div className="rounded-lg border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted)/0.25)] p-3">
            <AppStack gap="md">
              <AppField
                label="Rango de fecha pagada"
                description="Filtra por la fecha en la que se registró el pago."
              >
                <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                  <AppDatePicker
                    mode="single"
                    value={filters.paidRange.start ?? null}
                    onChange={(value) =>
                      onPaidRangeChange({
                        ...filters.paidRange,
                        start: value ?? null,
                      })
                    }
                    outputFormat="date"
                  />

                  <AppDatePicker
                    mode="single"
                    value={filters.paidRange.end ?? null}
                    onChange={(value) =>
                      onPaidRangeChange({
                        ...filters.paidRange,
                        end: value ?? null,
                      })
                    }
                    outputFormat="date"
                  />
                </AppGrid>
              </AppField>

              <AppField
                label="Rango de fecha generada"
                description="Filtra por la fecha de generación de la factura."
              >
                <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                  <AppDatePicker
                    mode="single"
                    value={filters.generatedRange.start ?? null}
                    onChange={(value) =>
                      onGeneratedRangeChange({
                        ...filters.generatedRange,
                        start: value ?? null,
                      })
                    }
                    outputFormat="date"
                  />

                  <AppDatePicker
                    mode="single"
                    value={filters.generatedRange.end ?? null}
                    onChange={(value) =>
                      onGeneratedRangeChange({
                        ...filters.generatedRange,
                        end: value ?? null,
                      })
                    }
                    outputFormat="date"
                  />
                </AppGrid>
              </AppField>

              <AppField label="Estado de factura">
                <AppMultiSelect<string>
                  value={filters.estados ?? []}
                  options={FACTURA_ESTADO_OPTIONS}
                  onChange={(values) => onEstadosChange(values ?? [])}
                  placeholder="Seleccionar estados..."
                  size="sm"
                  fieldWidth="full"
                />
              </AppField>

              <AppField label="Cobrador">
                <AppSingleSelect<string>
                  value={filters.userId ?? null}
                  options={userOptions}
                  onChange={(value) => onUserChange(value ?? null)}
                  placeholder="Seleccionar cobrador..."
                  size="sm"
                  fieldWidth="full"
                  isClearable
                />
              </AppField>

              <AppInline justify="end">
                <AppButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={onClear}
                  disabled={isGenerating}
                >
                  Limpiar filtros del reporte
                </AppButton>
              </AppInline>
            </AppStack>
          </div>
        </AppStack>
      </div>
    </AppConfirmDialog>
  );
}
