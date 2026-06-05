import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CustomersCampaingQuery,
  EstadoCliente,
  EstadoCobranzaCliente,
  Sector,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import {
  Departamentos,
  Municipios,
} from "@/Crm/features/locations-interfaces/municipios_departamentos.interfaces";
import { PhoneFilter } from "@/Types/whatsapp-campaing/types";
import { useMemo } from "react";
import ReactSelectComponent from "react-select";

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
  searchHint?: string;
};

export const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "30px",
    fontSize: "12px",
    borderColor: "hsl(var(--border))",
    boxShadow: "none",
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    minHeight: "30px",
  }),
  option: (base: any) => ({
    ...base,
    fontSize: "12px",
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "12px",
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: "12px",
  }),
  multiValue: (base: any) => ({
    ...base,
    fontSize: "11px",
  }),
};

type CampaignCustomerFiltersProps = {
  query: CustomersCampaingQuery;
  departamentos: Departamentos[];
  municipios: Municipios[];
  sectores: Sector[];
  phoneFilter: PhoneFilter;
  onQueryChange: (patch: Partial<CustomersCampaingQuery>) => void;
  onPhoneFilterChange: (value: PhoneFilter) => void;
};

function makeNumberOptions<T extends { id: number; nombre: string }>(
  data: T[],
): SelectOption<number>[] {
  return data.map((item) => ({
    value: item.id,
    label: item.nombre,
    searchHint: `${item.id} ${item.nombre}`.toLowerCase(),
  }));
}

function findOption<T extends string | number>(
  options: SelectOption<T>[],
  value?: T,
): SelectOption<T> | null {
  if (value === undefined || value === null) return null;
  return options.find((option) => option.value === value) ?? null;
}

export function CampaignCustomerFilters({
  query,
  departamentos,
  municipios,
  sectores,
  phoneFilter,
  onQueryChange,
  onPhoneFilterChange,
}: CampaignCustomerFiltersProps) {
  const estadoClienteOptions: SelectOption<EstadoCliente>[] = [
    { value: EstadoCliente.ACTIVO, label: "Activo" },
    { value: EstadoCliente.PENDIENTE_ACTIVO, label: "Pendiente activo" },
    { value: EstadoCliente.PAGO_PENDIENTE, label: "Pago pendiente" },
    { value: EstadoCliente.ATRASADO, label: "Atrasado" },
    { value: EstadoCliente.MOROSO, label: "Moroso" },
    { value: EstadoCliente.SUSPENDIDO, label: "Suspendido" },
    { value: EstadoCliente.DESINSTALADO, label: "Desinstalado" },
    { value: EstadoCliente.EN_INSTALACION, label: "En instalación" },
  ];

  const estadoCobranzaOptions: SelectOption<EstadoCobranzaCliente>[] = [
    { value: EstadoCobranzaCliente.AL_DIA, label: "Al día" },
    { value: EstadoCobranzaCliente.PAGO_PENDIENTE, label: "Pago pendiente" },
    { value: EstadoCobranzaCliente.ATRASADO, label: "Atrasado" },
    { value: EstadoCobranzaCliente.MOROSO, label: "Moroso" },
  ];

  const departamentoOptions = useMemo(
    () => makeNumberOptions(departamentos),
    [departamentos],
  );

  const municipioOptions = useMemo(
    () => makeNumberOptions(municipios),
    [municipios],
  );

  const sectorOptions = useMemo(() => makeNumberOptions(sectores), [sectores]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label htmlFor="campaign-customer-name" className="text-[11px]">
            Nombre
          </Label>

          <Input
            id="campaign-customer-name"
            value={query.nombre ?? ""}
            onChange={(event) => onQueryChange({ nombre: event.target.value })}
            placeholder="Buscar por nombre..."
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-invoices-count" className="text-[11px]">
            Facturas pendientes
          </Label>

          <Input
            id="campaign-invoices-count"
            type="number"
            min={0}
            value={query.numeroFact ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              onQueryChange({
                numeroFact: value === "" ? undefined : Number(value),
              });
            }}
            placeholder="Ej. 0, 1, 2..."
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-departamento" className="text-[11px]">
            Departamento
          </Label>

          <ReactSelectComponent
            inputId="campaign-departamento"
            isClearable
            options={departamentoOptions}
            value={findOption(departamentoOptions, query.departamento)}
            onChange={(option) =>
              onQueryChange({
                departamento:
                  (option as SelectOption<number> | null)?.value ?? undefined,
              })
            }
            placeholder="Departamento..."
            noOptionsMessage={() => "Sin departamentos"}
            className="text-black"
            styles={reactSelectStyles}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-municipio" className="text-[11px]">
            Municipio
          </Label>

          <ReactSelectComponent
            inputId="campaign-municipio"
            isClearable
            isDisabled={!query.departamento}
            options={municipioOptions}
            value={findOption(municipioOptions, query.municipio)}
            onChange={(option) =>
              onQueryChange({
                municipio:
                  (option as SelectOption<number> | null)?.value ?? undefined,
              })
            }
            placeholder={
              query.departamento ? "Municipio..." : "Primero departamento"
            }
            noOptionsMessage={() => "Sin municipios"}
            className="text-black"
            styles={reactSelectStyles}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-sector" className="text-[11px]">
            Sector
          </Label>

          <ReactSelectComponent
            inputId="campaign-sector"
            isClearable
            isDisabled={!query.municipio}
            options={sectorOptions}
            value={findOption(sectorOptions, query.sector)}
            onChange={(option) =>
              onQueryChange({
                sector:
                  (option as SelectOption<number> | null)?.value ?? undefined,
              })
            }
            placeholder={query.municipio ? "Sector..." : "Primero municipio"}
            noOptionsMessage={() => "Sin sectores"}
            className="text-black"
            styles={reactSelectStyles}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-estado-cliente" className="text-[11px]">
            Estado cliente
          </Label>

          <ReactSelectComponent
            inputId="campaign-estado-cliente"
            isClearable
            options={estadoClienteOptions}
            value={findOption(estadoClienteOptions, query.estado)}
            onChange={(option) =>
              onQueryChange({
                estado:
                  (option as SelectOption<EstadoCliente> | null)?.value ??
                  undefined,
              })
            }
            placeholder="Estado cliente..."
            noOptionsMessage={() => "Sin estados"}
            className="text-black"
            styles={reactSelectStyles}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="campaign-estado-cobranza" className="text-[11px]">
            Estado cobranza
          </Label>

          <ReactSelectComponent
            inputId="campaign-estado-cobranza"
            isClearable
            options={estadoCobranzaOptions}
            value={findOption(estadoCobranzaOptions, query.estadoCobranza)}
            onChange={(option) =>
              onQueryChange({
                estadoCobranza:
                  (option as SelectOption<EstadoCobranzaCliente> | null)
                    ?.value ?? undefined,
              })
            }
            placeholder="Estado cobranza..."
            noOptionsMessage={() => "Sin estados"}
            className="text-black"
            styles={reactSelectStyles}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px]">Teléfono</Label>

          <div className="flex h-8 items-center gap-1 rounded-md border px-1">
            {(["valid", "invalid", "all"] as PhoneFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => onPhoneFilterChange(filter)}
                className={`flex-1 rounded px-2 py-1 text-[11px] transition-colors ${
                  phoneFilter === filter
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter === "valid"
                  ? "Válidos"
                  : filter === "invalid"
                    ? "Inválidos"
                    : "Todos"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
