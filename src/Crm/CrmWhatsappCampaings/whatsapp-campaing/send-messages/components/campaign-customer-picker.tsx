import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NormalizedCampaignCustomer } from "@/Crm/features/cliente-interfaces/cliente-types";
import { LayoutList, Table2 } from "lucide-react";
import { useMemo, useRef } from "react";
import ReactSelectComponent from "react-select";
import { useVirtualizer } from "@tanstack/react-virtual";
import { reactSelectStyles } from "./campaign-customer-filters";

type CampaignCustomerPickerProps = {
  customers: NormalizedCampaignCustomer[];
  selectedIds: Set<number>;
  effectiveSelectedIds: Set<number>;
  selectionTab: "select" | "table";
  tableInvalidCount: number;
  tableValidClients: NormalizedCampaignCustomer[];
  allVisibleSelected: boolean;
  onSelectionTabChange: (value: "select" | "table") => void;
  onSelectedIdsChange: (value: Set<number>) => void;
  onToggleId: (id: number) => void;
  onToggleAllVisible: (checked: boolean) => void;
};

export function CampaignCustomerPicker({
  customers,
  selectedIds,
  effectiveSelectedIds,
  selectionTab,
  tableInvalidCount,
  tableValidClients,
  allVisibleSelected,
  onSelectionTabChange,
  onSelectedIdsChange,
  onToggleId,
  onToggleAllVisible,
}: CampaignCustomerPickerProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const validCustomers = useMemo(
    () => customers.filter((customer) => customer.isValidPhone),
    [customers],
  );

  const selectOptions = useMemo(
    () =>
      validCustomers.map((customer) => ({
        value: customer.id,
        label: `${customer.fullName} · ${customer.normalizedPhone}`,
        searchHint: [
          customer.nombre,
          customer.telefono,
          customer.telefonoRef,
          customer.estado,
          customer.estadoCobranza,
          String(customer.facturasPendientes),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
        customer,
      })),
    [validCustomers],
  );

  const selectValue = useMemo(
    () => selectOptions.filter((option) => selectedIds.has(option.value)),
    [selectOptions, selectedIds],
  );

  const rowVirtualizer = useVirtualizer({
    count: tableValidClients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <Tabs
      value={selectionTab}
      onValueChange={(value) =>
        onSelectionTabChange(value as "select" | "table")
      }
    >
      <TabsList className="h-7 text-xs">
        <TabsTrigger value="table" className="text-xs h-6 gap-1">
          <Table2 className="size-3" />
          Tabla
        </TabsTrigger>

        <TabsTrigger value="select" className="text-xs h-6 gap-1">
          <LayoutList className="size-3" />
          Buscador
        </TabsTrigger>
      </TabsList>

      <TabsContent value="table" className="mt-2">
        {tableInvalidCount > 0 && (
          <p className="mb-1 text-[11px] text-muted-foreground">
            {tableInvalidCount} cliente(s) excluido(s) por teléfono inválido.
          </p>
        )}

        <div className="rounded-md border">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="w-8 p-2 text-left">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={(value) => onToggleAllVisible(!!value)}
                    aria-label="Seleccionar todos los clientes visibles"
                  />
                </th>

                <th className="p-2 text-left font-medium text-muted-foreground">
                  Cliente
                </th>

                <th className="p-2 text-left font-medium text-muted-foreground">
                  Teléfono
                </th>

                <th className="p-2 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Estado
                </th>

                <th className="p-2 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Cobranza
                </th>

                <th className="p-2 text-center font-medium text-muted-foreground">
                  Fact.
                </th>
              </tr>
            </thead>
          </table>

          {tableValidClients.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Sin clientes para mostrar.
            </div>
          ) : (
            <div ref={parentRef} className="max-h-72 overflow-auto border-t">
              <div
                style={{
                  height: `${totalSize}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const customer = tableValidClients[virtualRow.index];

                  if (!customer) return null;

                  return (
                    <div
                      key={customer.id}
                      className="grid cursor-pointer grid-cols-[40px_minmax(160px,1fr)_120px_120px_120px_70px] items-center border-b text-xs hover:bg-muted/30"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        minHeight: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onClick={() => onToggleId(customer.id)}
                    >
                      <div className="p-2">
                        <Checkbox
                          checked={effectiveSelectedIds.has(customer.id)}
                          onCheckedChange={() => onToggleId(customer.id)}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Seleccionar ${customer.fullName}`}
                        />
                      </div>

                      <div className="p-2">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {customer.fullName || "—"}
                          </span>

                          {customer.telefonoRef && (
                            <span className="text-[11px] text-muted-foreground">
                              Ref: {customer.telefonoRef}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 font-mono">
                        {customer.normalizedPhone || "—"}
                      </div>

                      <div className="hidden p-2 md:block">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {customer.estado}
                        </Badge>
                      </div>

                      <div className="hidden p-2 md:block">
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {customer.estadoCobranza}
                        </Badge>
                      </div>

                      <div className="p-2 text-center font-mono">
                        {customer.facturasPendientes}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="select" className="mt-2">
        <ReactSelectComponent
          isMulti
          options={selectOptions}
          value={selectValue}
          onChange={(selected) => {
            const selectedOptions = selected as typeof selectOptions;

            onSelectedIdsChange(
              new Set(selectedOptions.map((option) => option.value)),
            );
          }}
          filterOption={(option, inputValue) => {
            const search = inputValue.toLowerCase().trim();

            if (!search) return true;

            return option.data.searchHint.includes(search);
          }}
          formatOptionLabel={(option) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium">
                {option.customer.fullName}
              </span>

              <span className="text-[11px] text-muted-foreground">
                {option.customer.normalizedPhone || "Sin teléfono"} ·{" "}
                {option.customer.facturasPendientes} factura(s) pendiente(s)
              </span>
            </div>
          )}
          placeholder="Buscar y seleccionar clientes..."
          noOptionsMessage={() => "Sin clientes válidos"}
          className="text-black"
          styles={reactSelectStyles}
        />
      </TabsContent>
    </Tabs>
  );
}
