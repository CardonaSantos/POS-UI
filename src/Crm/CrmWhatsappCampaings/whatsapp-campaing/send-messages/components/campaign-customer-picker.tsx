import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NormalizedCampaignCustomer } from "@/Crm/features/cliente-interfaces/cliente-types";
import { LayoutList, Table2 } from "lucide-react";
import { useMemo } from "react";
import ReactSelectComponent from "react-select";
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

  return (
    <Tabs
      value={selectionTab}
      onValueChange={(value) =>
        onSelectionTabChange(value as "select" | "table")
      }
    >
      <TabsList className="h-7 text-xs">
        <TabsTrigger value="select" className="text-xs h-6 gap-1">
          <LayoutList className="size-3" />
          Buscador
        </TabsTrigger>

        <TabsTrigger value="table" className="text-xs h-6 gap-1">
          <Table2 className="size-3" />
          Tabla
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="table" className="mt-2">
        {tableInvalidCount > 0 && (
          <p className="mb-1 text-[11px] text-muted-foreground">
            {tableInvalidCount} cliente(s) excluido(s) por teléfono inválido.
          </p>
        )}

        <div className="overflow-auto rounded-md border max-h-72">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 bg-muted/60">
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

            <tbody>
              {tableValidClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Sin clientes para mostrar.
                  </td>
                </tr>
              ) : (
                tableValidClients.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer border-t hover:bg-muted/30"
                    onClick={() => onToggleId(customer.id)}
                  >
                    <td className="p-2">
                      <Checkbox
                        checked={effectiveSelectedIds.has(customer.id)}
                        onCheckedChange={() => onToggleId(customer.id)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Seleccionar ${customer.fullName}`}
                      />
                    </td>

                    <td className="p-2">
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
                    </td>

                    <td className="p-2 font-mono">
                      {customer.normalizedPhone || "—"}
                    </td>

                    <td className="p-2 hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px] h-5">
                        {customer.estado}
                      </Badge>
                    </td>

                    <td className="p-2 hidden md:table-cell">
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {customer.estadoCobranza}
                      </Badge>
                    </td>

                    <td className="p-2 text-center font-mono">
                      {customer.facturasPendientes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
