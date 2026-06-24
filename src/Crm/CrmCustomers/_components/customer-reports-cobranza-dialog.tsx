import { FileSpreadsheet, RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
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

function ReportRangeFields({
  title,
  description,
  range,
  onChange,
}: {
  title: string;
  description: string;
  range: ReportDateRange;
  onChange: (range: ReportDateRange) => void;
}) {
  return (
    <div className="rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.22] p-3">
      <AppStack gap="sm">
        <AppField label={title} description={description}>
          <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
            <AppDatePicker
              mode="single"
              value={range.start ?? null}
              onChange={(value) =>
                onChange({
                  ...range,
                  start: value ?? null,
                })
              }
              outputFormat="date"
              size="xs"
              fieldWidth="full"
              placeholder="Desde"
            />

            <AppDatePicker
              mode="single"
              value={range.end ?? null}
              onChange={(value) =>
                onChange({
                  ...range,
                  end: value ?? null,
                })
              }
              outputFormat="date"
              size="xs"
              fieldWidth="full"
              placeholder="Hasta"
            />
          </AppGrid>
        </AppField>
      </AppStack>
    </div>
  );
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
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isGenerating) return;
    onOpenChange(nextOpen);
  };

  return (
    <>
      <AppButton
        type="button"
        variant="secondary"
        size="xs"
        width="auto"
        leftIcon={<FileSpreadsheet size={14} />}
        onClick={() => onOpenChange(true)}
      >
        Reporte
      </AppButton>

      <AppDialog open={open} onOpenChange={handleOpenChange}>
        <AppDialogContent className="sm:max-w-[820px]">
          <AppDialogHeader>
            <AppDialogTitle>Reporte de cobranzas</AppDialogTitle>
            <AppDialogDescription>
              Filtra fechas, estados y cobrador antes de generar el Excel.
            </AppDialogDescription>
          </AppDialogHeader>

          <AppStack gap="md">
            <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
              <ReportRangeFields
                title="Fecha pagada"
                description="Filtra por la fecha en la que se registró el pago."
                range={filters.paidRange}
                onChange={onPaidRangeChange}
              />

              <ReportRangeFields
                title="Fecha generada"
                description="Filtra por la fecha de generación de la factura."
                range={filters.generatedRange}
                onChange={onGeneratedRangeChange}
              />
            </AppGrid>

            <div className="rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] p-3">
              <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
                <AppField
                  label="Estado de factura"
                  description="Puede seleccionar uno o varios estados."
                >
                  <AppMultiSelect<string>
                    value={filters.estados ?? []}
                    options={FACTURA_ESTADO_OPTIONS}
                    onChange={(values) => onEstadosChange(values ?? [])}
                    placeholder="Seleccionar estados..."
                    size="xs"
                    fieldWidth="full"
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                    isDisabled={isGenerating}
                  />
                </AppField>

                <AppField
                  label="Cobrador"
                  description="Opcional. Filtra por usuario cobrador."
                >
                  <AppSingleSelect<string>
                    value={filters.userId ?? null}
                    options={userOptions}
                    onChange={(value) => onUserChange(value ?? null)}
                    placeholder="Seleccionar cobrador..."
                    size="xs"
                    fieldWidth="full"
                    isClearable
                    portalToBody
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldScrollIntoView={false}
                    isDisabled={isGenerating}
                  />
                </AppField>
              </AppGrid>
            </div>

            <AppInline align="center" justify="between" gap="xs" wrap>
              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="auto"
                leftIcon={<RotateCcw size={13} />}
                onClick={onClear}
                disabled={isGenerating}
              >
                Limpiar filtros
              </AppButton>

              <AppInline align="center" justify="end" gap="xs">
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  onClick={() => onOpenChange(false)}
                  disabled={isGenerating}
                >
                  Cancelar
                </AppButton>

                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<FileSpreadsheet size={13} />}
                  loading={isGenerating}
                  loadingText="Generando..."
                  disabled={isGenerating}
                  onClick={() => void onGenerate()}
                >
                  Generar Excel
                </AppButton>
              </AppInline>
            </AppInline>
          </AppStack>
        </AppDialogContent>
      </AppDialog>
    </>
  );
}
