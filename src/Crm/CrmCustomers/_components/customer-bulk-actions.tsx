import { AppTableBulkActions } from "@/components/app/table/app-table-bulk-actions";

interface Props {
  selectedCount: number;
  isLoading?: boolean;
  onExportPagos: () => void;
  onExportInfo: () => void;
  onClearSelection: () => void;
}

export function CustomerBulkActions({
  selectedCount,
  isLoading,
  onExportPagos,
  onExportInfo,
  onClearSelection,
}: Props) {
  if (selectedCount <= 0) return null;

  return (
    <AppTableBulkActions
      selectedCount={selectedCount}
      actions={[
        {
          label: "Exportar historial pagos",
          onClick: onExportPagos,
          disabled: isLoading,
        },
        {
          label: "Exportar info. completa",
          onClick: onExportInfo,
          disabled: isLoading,
        },
        {
          label: "Limpiar selección",
          onClick: onClearSelection,
          disabled: isLoading,
        },
      ]}
    />
  );
}
